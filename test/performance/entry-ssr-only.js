import Vue from 'vue';

import SsrOnly from './components/SsrOnly.vue';

export const App = new Vue({
  render: h => h(SsrOnly),
}).$mount(`#app`);
