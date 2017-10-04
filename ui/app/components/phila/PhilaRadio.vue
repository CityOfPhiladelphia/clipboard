<template>
  <div class="radio-field">
    <label>{{ label }}<span v-if="required" aria-hidden="true"> *</span></label>
    <template v-for="(item, index) in normalizedItems">
      <br v-if="index > 0">
      <input
        type="radio"
        :id="getInputId(name, item.value)"
        :name="name"
        :value="item.value"
        :disabled="disabled"
        :required="required"
        :aria-required="required"
        :aria-invalid="hasError"
        :tabindex='tabindex'
        v-model="inputValue"
        ref="input">
      <label :for="getInputId(name, item.value)">{{ item.label }}</label>
    </template>
    <div class="input-error">
      <phila-form-error-message
        v-if="hasError"
        role="alert"
        :field="name"
        :label="errorMessageLabel || label"
        :validationMessages="validationMessages"></phila-form-error-message>
    </div>
  </div>
</template>

<script>
  import Input from './mixins/input'
  import PhilaFormErrorMessage from './PhilaFormErrorMessage.vue'

  export default {
    name: 'phila-radio',

    mixins: [Input],

    components: {
      PhilaFormErrorMessage
    },

    inheritAttrs: false,

    props: {
      name: {
        type: String
      },
      label: {
        type: String
      },
      items: {
        type: Array,
        required: true
      },
      errorMessageLabel: {
        type: String
      },
      validationMessages: {
        type: Object
      },
      hasError: {
        type: Boolean,
        default: false
      },
      errorMessage: {
        type: String
      }
    },

    computed: {
      normalizedItems () {
        return this.items.map((iterValue) => {
          if (typeof iterValue == 'object')
            return iterValue
          else
            return {
              label: iterValue,
              value: iterValue
            }
        })
      },
      inputValue: {
        get () {
          return this.lazyValue
        },
        set (val) {
          this.$emit('input', val)
          this.lazyValue = val
        }
      },
      isDirty () {
        return this.lazyValue !== null &&
          typeof this.lazyValue !== 'undefined' &&
          this.lazyValue.toString().length > 0
      }
    },

    watch: {
      focused (val) {
        !val && this.$emit('change', this.lazyValue)
      }
    },

    methods: {
      getInputId (name, value) {
        return name + '_' + value.toString().substring(0, 50).toLowerCase().replace(' ', '_')
      }
    }
  }
</script>
