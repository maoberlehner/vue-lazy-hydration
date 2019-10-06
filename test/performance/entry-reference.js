import Vue from 'vue';

import Reference from './components/Reference.vue';

export const App = new Vue({
  render: h => h(Reference),
}).$mount(`#app`);
