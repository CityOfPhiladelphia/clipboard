<script>
  //import Vue from 'vue'
  import { validationMixin } from 'vuelidate'
  import {
    required,
    minLength,
    maxLength,
    email,
    alpha,
    alphaNum,
    numeric,
    url } from 'vuelidate/lib/validators'
  import VueMarkdown from 'vue-markdown'
  import jexl from 'Jexl'

  import PhilaTextField from './phila/PhilaTextField.vue'
  import PhilaRadio from './phila/PhilaRadio.vue'
  import PhilaSelect from './phila/PhilaSelect.vue'
  import PhilaButton from './phila/PhilaButton.vue'

  // might be useful https://stackoverflow.com/a/6491621/1366166
  const getValue = (obj, path) => {
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

  const setValue = (obj, path, value) => {
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
        //Vue.set(curr, k, value)
    }
    return curr
  }

  const initReactiveModel = (model, path, schema) => {
    if (Array.isArray(schema))
      return schema.map(initReactiveModel.bind({}, model, path))

    if (schema.type == 'fieldset') {
      let newPath = path
      if (schema.field_name)
        newPath = path.concat([schema.field_name])
      return initReactiveModel(model, newPath, schema.children)
    }

    if (schema.type == 'repeating')
      return setValue(model, path.concat([schema.field_name]), [])

    // getValue ??
    if (schema.field_name)
      setValue(model, path.concat([schema.field_name]), null)
  }

  const initValidation = (validations, path, schema) => {
    if (Array.isArray(schema))
      return schema.map(initValidation.bind({}, validations, path))

    if (schema.type == 'fieldset') {
      let newPath = path
      if (schema.field_name)
        newPath = path.concat([schema.field_name])
      return initValidation(validations, newPath, schema.children)
    }

    if (schema.type == 'repeating')
      return ////

    if (schema.validation) {
      let fieldValidation = {}

      if (schema.validation.required === true)
        fieldValidation.required = required

      if (schema.validation.maxLength)
        fieldValidation.maxLength = maxLength(schema.validation.maxLength)

      if (schema.validation.minLength)
        fieldValidation.minLength = minLength(schema.validation.minLength)

      if (schema.validation.alpha === true)
        fieldValidation.alpha = alpha

      if (schema.validation.alpha_numeric === true)
        fieldValidation.alpha_numeric = alphaNum

      if (schema.validation.numeric === true)
        fieldValidation.numeric = numeric

      if (schema.validation.email === true)
        fieldValidation.email = email

      if (schema.validation.url === true)
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

      console.log(fieldValidation)

      setValue(validations, path.concat([schema.field_name]), fieldValidation)
    }
  }

  const renderForm = (vm, model, path, createElement, schema) => {
    if (Array.isArray(schema))
      return schema.map(renderForm.bind({}, vm, model, path, createElement))

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
          ...renderForm(vm, model, newPath, createElement, schema.children)
        ])
    }

    if (schema.type == 'repeating') {
      let collection = getValue(model, path.concat([schema.field_name]))
      if (!collection) {
        setValue(model, path.concat([schema.field_name]), [])
        collection = getValue(model, path.concat([schema.field_name]))
      }

      // TODO: how to not send this empty one?
      if (collection.length === 0)
        collection.push({})

      let nodes = collection.map((item) => {
        return createElement('div', { attrs: { class: 'row' } }, [
          createElement(
            'div',
            {
              attrs: {
                class: 'columns medium-20'
              }
            },
            renderForm(vm, item, [], createElement, schema.items)),
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
                      console.log(item)
                      console.log(index)
                      collection.splice(index, 1)
                    }
                  }
                }, schema.remove_label || 'Remove')
            ])
        ])
      })

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

    // if (schema.visible) {
    //   console.log(model.$data)
    //   let cxt = {requested_facility: 'Other'}
    //   jexl.eval(schema.visible, model).then((result) => {
    //     console.log(schema.visible)
    //     console.log(result)
    //   })
    // }

    const fieldPath = path.concat([schema.field_name])
    const validationPath = ['model'].concat(fieldPath)
    const $v = getValue(vm.$v, validationPath)
    const props = {
      name: schema.field_name,
      fieldPath: validationPath,
      label: schema.label,
      type: schema.input_type || 'text',
      required: (schema.validation && schema.validation.required) || false,
      value: getValue(model, fieldPath),
      hasError: ($v && $v.$error) || false,
      errorMessageLabel: schema.error_message_label
    }
    const on = {
      input (value) {
        setValue(model, fieldPath, value)
        console.log(model)
      }
    }

    if ($v)
      on.blur = () => {
        $v.$touch()
        console.log($v)
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

  export default {
    name: 'clipboard-form',

    mixins: [validationMixin],

    components: {
      PhilaTextField,
      PhilaRadio,
      PhilaSelect,
      PhilaButton,
      'vue-markdown': VueMarkdown
    },

    props: {
      schema: {
        type: [Object, Array],
        required: true
      },
      data: {
        type: Object
      }
    },

    beforeCreate () {
      let validations = {}
      initValidation(validations, [], this.$options.propsData.schema)
      console.log(validations)
      this.$options.validations = { model: validations }
      validationMixin.beforeCreate.call(this)
    },

    data () {
      // if (this.model)
      //   return this.model
      let model = {}
      initReactiveModel(model, [], this.schema)
      return {
        model: model
      }
    },

    render (createElement) {
      return createElement(
        'div',
        {
          attrs: {
            class: 'phila-form'
          }
        },
        renderForm(this, this.model, [], createElement, this.schema))
    }
  }
</script>

<style lang="css">
  .phila-form {
    margin: 20px;
  }

  .phila-form h1, h2 {
    text-align: center;
  }

  .phila-form legend {
    font-family: 'Montserrat', 'Tahoma', sans-serif;
    font-weight: 400;
    font-size: 1.4em;
    width: 100%;
    text-align: center;
    border-top: 2px solid #444444;
    padding-top: 5px;
  }
</style>
