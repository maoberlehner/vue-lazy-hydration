import Vue from 'vue';

import Integration from './components/Integration.vue';

export const App = new Vue({
  render: h => h(Integration),
}).$mount(`#app`);
