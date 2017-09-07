<template>
  <vue-markdown :source="schema.text"></vue-markdown>
</template>

<script>
  import { abstractField } from 'vue-form-generator';
  import VueMarkdown from 'vue-markdown';

  export default {
    mixins: [ abstractField ],
    components: {
      'vue-markdown': VueMarkdown
    }
  }
</script>
