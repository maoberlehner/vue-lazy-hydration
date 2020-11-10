import Vue from 'vue';

import HydrateNever from './components/HydrateNever.vue';

export const App = new Vue({
  render: h => h(HydrateNever),
}).$mount(`#app`);
