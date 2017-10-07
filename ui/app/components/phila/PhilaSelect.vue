<template>
  <div class="radio-field">
    <label :for="name">{{ label }}<span v-if="required" aria-hidden="true"> *</span></label>
    <select
      :id="name"
      :name="name"
      :class="{ 'input-error': hasError }"
      v-model="inputValue"
      :disabled="disabled"
      :required="required"
      :autofocus="autofocus"
      :aria-required="required"
      :aria-invalid="hasError"
      :tabindex='tabindex'
      @blur="blur"
      @focus="focus"
      ref="select">
      <option v-for="item in normalizedItems" :value="item.value">{{ item.label }}</option>
    </select>
    <div class="input-error">
      <phila-form-error-message
        v-if="hasError"
        role="alert"
        :field="name"
        :label="errorMessageLabel || label"
        :validation-messages="validationMessages"
        :field-path="fieldPath"></phila-form-error-message>
    </div>
  </div>
</template>

<script>
  import Input from './mixins/input'
  import PhilaFormErrorMessage from './PhilaFormErrorMessage.vue'

  export default {
    name: 'phila-select',

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
      autofocus: {
        type: Boolean
      },
      hasError: {
        type: Boolean,
        default: false
      },
      errorMessage: {
        type: String
      },
      fieldPath: {
        type: [Array, String]
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
      },
      blur (e) {
        this.$nextTick(() => {
          this.focused = false
        })
        this.$emit('blur', e)
      },
      focus (e) {
        this.focused = true
        this.$refs.select.focus()
        this.$emit('focus', e)
      }
    }
  }
</script>
