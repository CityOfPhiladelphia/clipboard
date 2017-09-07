import Vue from 'vue';

import PhilaForm from './components/form.vue';

import App from './App.vue';

Vue.component('phila-form', PhilaForm)

new Vue({
  el: '#app',
  render: h => h(App)
});
