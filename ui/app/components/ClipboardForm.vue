<script>
  import { validationMixin } from 'vuelidate'
  import VueMarkdown from 'vue-markdown'

  import PhilaTextField from './phila/PhilaTextField.vue'
  import PhilaRadio from './phila/PhilaRadio.vue'
  import PhilaSelect from './phila/PhilaSelect.vue'
  import PhilaButton from './phila/PhilaButton.vue'

  import { initValidation, initReactiveModel, renderForm } from '../clipboard'

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
        renderForm(this, this.model, [], ['model'], createElement, this.schema))
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
