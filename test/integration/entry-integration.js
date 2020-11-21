import Vue from 'vue';

import IntegrationAsync from './components/IntegrationAsync.vue';
import IntegrationSync from './components/IntegrationSync.vue';

export const AppAsync = new Vue({
  render: h => h(IntegrationAsync),
}).$mount(`#app-async`);

export const AppSync = new Vue({
  render: h => h(IntegrationSync),
}).$mount(`#app-sync`);
