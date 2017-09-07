<template>
  <div>
    {{ fromLabel }}
    <field-time v-model="value" :schema="fromSchema" :disabled="false" :formOptions='formOptions'></field-time>
    {{ toLabel }}
    <field-time v-model="value" :schema="toSchema" :disabled="false" :formOptions='formOptions'></field-time>
  </div>
</template>

<script>
  import { abstractField } from 'vue-form-generator';
  import fieldTime from './fieldTime.vue';

  // TODO: validation - from should not less than to

  export default {
    mixins: [ abstractField ],
    components: {
      'field-time': fieldTime
    },
    computed: {
      fromLabel () {
        return this.schema.fromLabel || 'From'
      },
      toLabel () {
        return this.schema.toLabel || 'To'
      },
      fromSchema () {
        return {
          model: this.schema.fromModel || this.schema.model + '_from'
        }
      },
      toSchema () {
        return {
          model:  this.schema.toModel || this.schema.model + '_to'
        }
      }
    },
    data () {
      return {
        from: null,
        to: null,
        formOptions: {}
      }
    }
  }
</script>
