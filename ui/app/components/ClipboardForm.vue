<script>
  //import Vue from 'vue'
  import VueMarkdown from 'vue-markdown'
  import jexl from 'Jexl'

  import PhilaTextField from './phila/PhilaTextField.vue'
  import PhilaRadio from './phila/PhilaRadio.vue'
  import PhilaSelect from './phila/PhilaSelect.vue'
  import PhilaButton from './phila/PhilaButton.vue'

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
      return setModelValue(model, path.concat([schema.field_name]), [])

    // getModelValue ??
    if (schema.field_name)
      setModelValue(model, path.concat([schema.field_name]), null)
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
      let collection = getModelValue(model, path.concat([schema.field_name]))
      if (!collection) {
        setModelValue(model, path.concat([schema.field_name]), [])
        collection = getModelValue(model, path.concat([schema.field_name]))
      }

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

    if (schema.type == 'text') {
      const props = {
        name: schema.field_name,
        label: schema.label,
        type: schema.input_type || 'text',
        required: schema.required || false,
        value: getModelValue(model, path.concat([schema.field_name])),
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
            setModelValue(model, path.concat([schema.field_name]), value)
            console.log(model)
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
          value: getModelValue(model, path.concat([schema.field_name])),
          items: schema.items
        },
        on: {
          input (value) {
            setModelValue(model, path.concat([schema.field_name]), value)
            console.log(model)
          }
        }
      })

    if (schema.type == 'select')
      return createElement('phila-select', {
        props: {
          name: schema.field_name,
          label: schema.label,
          required: schema.required || false,
          value: getModelValue(model, path.concat([schema.field_name])),
          items: schema.items
        },
        on: {
          input (value) {
            setModelValue(model, path.concat([schema.field_name]), value)
            console.log(model)
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

    watch: {
      model () {
        console.log(this)
      }
    },

    data () {
      // if (this.model)
      //   return this.model
      let model = {}
      initReactiveModel(model, [], this.schema)
      console.log(model)
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
