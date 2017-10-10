import { withParams } from 'vuelidate'
import {
  required,
  minLength,
  maxLength,
  email,
  alpha,
  alphaNum,
  numeric,
  url } from 'vuelidate/lib/validators'
import jexl from 'Jexl'

// might be useful https://stackoverflow.com/a/6491621/1366166
export const getPath = (obj, path) => {
  let curr = obj
  for (let i = 0, ln = path.length; i < ln; i++) {
    let k = path[i]
    if (k in curr)
      curr = curr[k]
    else
      return
  }
  return curr
}

export const setPath = (obj, path, value) => {
  let curr = obj
  for (let i = 0, ln = path.length; i < ln; i++) {
    let k = path[i]
    if (i < (ln - 1)) {
      if (k in curr)
        curr = curr[k]
      else {
        let obj = {}
        curr[k] = obj
        curr = obj
      }
    } else
      curr[k] = value
  }
  return curr
}

export const initReactiveModel = (model, path, schema) => {
  if (Array.isArray(schema))
    return schema.map(initReactiveModel.bind({}, model, path))

  if (schema.type == 'fieldset') {
    let newPath = path
    if (schema.field_name)
      newPath = path.concat([schema.field_name])
    return initReactiveModel(model, newPath, schema.children)
  }

  if (schema.type == 'repeating')
    return setPath(model, path.concat([schema.field_name]), [])

  if (schema.field_name)
    setPath(model, path.concat([schema.field_name]), null)
}

const getFieldValidation = (rawFieldValidation) => {
  let fieldValidation = {}

  if (rawFieldValidation.required === true)
    fieldValidation.required = required

  if (rawFieldValidation.max_length)
    fieldValidation.maxLength = maxLength(rawFieldValidation.max_length)

  if (rawFieldValidation.min_length)
    fieldValidation.minLength = minLength(rawFieldValidation.min_length)

  if (rawFieldValidation.alpha === true)
    fieldValidation.alpha = alpha

  if (rawFieldValidation.alpha_numeric === true)
    fieldValidation.alphaNum = alphaNum

  if (rawFieldValidation.numeric === true)
    fieldValidation.numeric = numeric

  if (rawFieldValidation.email === true)
    fieldValidation.email = email

  if (rawFieldValidation.url === true)
    fieldValidation.url = url

  // TODO: not disposable email?
  // TODO: regex?
  // TODO: custom error message?
  // TODO: requiredIf - needs jexl
  // TODO: requiredUnless - needs jexl
  // TODO: between ?
  // TODO: sameAs - needs jexl or pointer?
  // TODO: or ?
  // TODO: and ?

  return fieldValidation
}

export const initValidation = (validations, path, schema) => {
  if (Array.isArray(schema))
    return schema.map(initValidation.bind({}, validations, path))

  if (schema.type == 'fieldset') {
    let newPath = path
    if (schema.field_name)
      newPath = path.concat([schema.field_name])
    return initValidation(validations, newPath, schema.children)
  }

  if (schema.type == 'repeating') {
    let collectionValidation = getFieldValidation(schema.validation) // TODO: only certain validators support arrays
    let repeatingItemValidation = {}
    initValidation(repeatingItemValidation, [], schema.repeating)
    collectionValidation.$each = repeatingItemValidation
    setPath(validations, path.concat([schema.field_name]), collectionValidation)
    return 
  }

  if (schema.validation) {
    let fieldValidation = getFieldValidation(schema.validation)

    setPath(validations, path.concat([schema.field_name]), fieldValidation)
  }
}

const renderField = (vm, model, path, validationPath, createElement, schema) => {
  console.log('renderField')
  // if (schema.visible) {
  //   console.log(model.$data)
  //   let cxt = {requested_facility: 'Other'}
  //   jexl.eval(schema.visible, model).then((result) => {
  //     console.log(schema.visible)
  //                                     .log(result)
  //   })
  // }
  const fieldPath = path.concat([schema.field_name])
  const fieldValidationPath = validationPath.concat([schema.field_name])
  const $v = getPath(vm.$v, fieldValidationPath)
  const props = {
    name: schema.field_name,
    fieldPath: fieldValidationPath,
    label: schema.label,
    type: schema.input_type || 'text',
    required: (schema.validation && schema.validation.required) || false,
    value: getPath(model, fieldPath),
    hasError: ($v && $v.$error) || false,
    errorMessageLabel: schema.error_message_label
  }
  const on = {
    input (value) {
      // TODO: trim?
      if (value == '')
        value = null
      setPath(model, fieldPath, value)
      console.log(model)
    }
  }

  if ($v)
    on.blur = () => {
      $v.$touch()
      console.log(getPath(vm, ["model", "things", 0, "a_thing"]))
      console.log($v)
      console.log(vm.$v)
      console.log(vm.model)
    }

  if (schema.type == 'text') {
    return createElement('phila-text-field', {
      props,
      on
    })
  }

  if (schema.type == 'radios') {
    props.items = schema.items
    return createElement('phila-radio', {
      props,
      on
    })
  }

  if (schema.type == 'select') {
    props.items = schema.items
    return createElement('phila-select', {
      props,
      on
    })
  }
}

export const renderForm = (vm, model, path, validationPath, createElement, schema) => {
  if (Array.isArray(schema))
    return schema.map(renderForm.bind({}, vm, model, path, validationPath, createElement))

  if (schema.type == 'markdown')
    return createElement('vue-markdown', {
      props: {
        source: schema.text
      }
    })

  if (schema.type == 'fieldset') {
    let newPath = path
    if (schema.field_name)
      newPath = path.concat([schema.field_name])
    return createElement('fieldset', [
        createElement('legend', schema.legend),
        ...renderForm(vm, model, newPath, validationPath, createElement, schema.children)
      ])
  }

  if (schema.type == 'repeating') {
    let collection = getPath(model, path.concat([schema.field_name]))
    if (!collection) {
      setPath(model, path.concat([schema.field_name]), [])
      collection = getPath(model, path.concat([schema.field_name]))
    }

    // TODO: how to not send this empty one?
    if (collection.length === 0)
      collection.push({})

    let nodes = []
    for (let i = 0, ln = collection.length; i < ln; i++) {
      let item = collection[i]
      let itemValidationPath = validationPath.concat([schema.field_name, '$each', i])
      nodes.push(
        createElement('div', { attrs: { class: 'row' } }, [
          createElement(
            'div',
            {
              attrs: {
                class: 'columns medium-20'
              }
            },
            renderForm(vm, item, [], itemValidationPath, createElement, schema.repeating)),
          createElement(
            'div',
            {
              attrs: {
                class: 'columns medium-4'
              }
            },
            [
              createElement('phila-button', {
                  props: {
                    fullWidth: false
                  },
                  on: {
                    click () {
                      let index = collection.indexOf(item)
                      collection.splice(index, 1)
                    }
                  }
                }, schema.remove_label || 'Remove')
            ])
        ])
      )
    }

    return createElement('fieldset', [
      createElement('legend', schema.legend),
      ...nodes,
      createElement('phila-button', {
        props: {
          fullWidth: false
        },
        on: {
          click () {
            collection.push({})
          }
        }
      }, schema.add_label || 'Add')
    ])
  }

  return renderField(vm, model, path, validationPath, createElement, schema) 
}
