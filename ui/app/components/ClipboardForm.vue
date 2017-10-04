<script>
  import VueMarkdown from 'vue-markdown'
  import jexl from 'Jexl'

  import PhilaTextField from './phila/PhilaTextField.vue'
  import PhilaRadio from './phila/PhilaRadio.vue'
  import PhilaSelect from './phila/PhilaSelect.vue'

  // might be useful https://stackoverflow.com/a/6491621/1366166
  const getModelValue = (model, path) => {
    let curModel = model
    for (let i = 0, ln = path.length; i < ln; i++) {
      let k = path[i]
      if (k in curModel)
        curModel = curModel[k]
      else
        return
    }
    return curModel
  }

  const setModelValue = (model, path, value) => {
    let curr = model
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

  const renderForm = (vm, path, createElement, schema) => {
    if (Array.isArray(schema))
      return schema.map(renderForm.bind({}, vm, path, createElement))

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
          ...renderForm(vm, newPath, createElement, schema.children)
        ])
    }

    // if (schema.visible) {
    //   console.log(vm.$data)
    //   let cxt = {requested_facility: 'Other'}
    //   jexl.eval(schema.visible, vm.model).then((result) => {
    //     console.log(schema.visible)
    //     console.log(result)
    //   })
    // }

    if (schema.type == 'text') {
      const props = {
        name: schema.field_name,
        label: schema.label,
        type: schema.input_type || 'text',
        required: schema.required || false,
        value: getModelValue(vm.model, path.concat([schema.field_name])),
        // style: {
        //   display () {
        //     console.log('being run')
        //     return 'none'
        //   }
        // }
        // TODO: validation
      }

      return createElement('phila-text-field', {
        props,
        on: {
          input (value) {
            setModelValue(vm.model, path.concat([schema.field_name]), value)
            console.log(vm.model)
          }
        }
      })
    }

    if (schema.type == 'radios')
      return createElement('phila-radio', {
        props: {
          name: schema.field_name,
          label: schema.label,
          required: schema.required || false,
          value: getModelValue(vm.model, path.concat([schema.field_name])),
          items: schema.items
        },
        on: {
          input (value) {
            setModelValue(vm.model, path.concat([schema.field_name]), value)
            console.log(vm.model)
          }
        }
      })

    if (schema.type == 'select')
      return createElement('phila-select', {
        props: {
          name: schema.field_name,
          label: schema.label,
          required: schema.required || false,
          value: getModelValue(vm.model, path.concat([schema.field_name])),
          items: schema.items
        },
        on: {
          input (value) {
            setModelValue(vm.model, path.concat([schema.field_name]), value)
            console.log(vm.model)
          }
        }
      })
  }

  export default {
    name: 'clipboard-form',

    components: {
      PhilaTextField,
      PhilaRadio,
      PhilaSelect,
      'vue-markdown': VueMarkdown
    },

    props: {
      schema: {
        type: [Object, Array]
      },
      model: {
        type: Object
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
        renderForm(this, [], createElement, this.schema))
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

  .phila-form select {
    background-color: #f0f0f0;
  }
</style>
