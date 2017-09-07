<template>
  <div class="phila-form">
    <form>
      <vue-form-generator :schema="schema" :model="model" :options="formOptions"></vue-form-generator>
      <button href="#" class="button full-width">
        <div class="valign">
          <div class="button-label valign-cell">Submit</div>
        </div>
      </button>
    </form>
  </div>
</template>

<script>
  import VueFormGenerator from 'vue-form-generator';

  import fieldMarkdown from './fieldMarkdown.vue';
  import fieldTime from './fieldTime.vue';
  import fieldTimeRange from './fieldTimeRange.vue';
  import fieldSignature from './fieldSignature.vue';

  const VueFormGeneratorComponent = VueFormGenerator.component;

  VueFormGeneratorComponent.components['field-markdown'] = fieldMarkdown;
  VueFormGeneratorComponent.components['field-time'] = fieldTime;
  VueFormGeneratorComponent.components['field-time-range'] = fieldTimeRange;
  VueFormGeneratorComponent.components['field-signature'] = fieldSignature;

  // TODO: date picker - use some JS date picker on desktop. Native on mobile
  // TODO: wizard with pages? maybe create a steps: [] structure
  // TODO: spreadsheet component - for "worksheet" like form sections - mobile?

  export default {
    name: 'phila-form',
    components: {
      'vue-form-generator': VueFormGeneratorComponent
    },
    props: ['schema', 'model','formOptions']
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

  .phila-form input[type=radio], .phila-form input[type=checkbox] {
    display: inline;
  }

  .phila-form select {
    background-color: #f0f0f0;
  }

  .phila-form .errors.help-block {
    margin-top: -16px;
    margin-bottom: 10px;
  }

  .phila-form .form-group.error input {
    border: 2px solid #fed0d0;
  }
</style>
