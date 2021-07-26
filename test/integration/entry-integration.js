import { createSSRApp, createApp } from 'vue';

import IntegrationAsync from './components/IntegrationAsync.vue';
import IntegrationSync from './components/IntegrationSync.vue';

const isBrowser = typeof document !== `undefined`;
const newApp = isBrowser ? createSSRApp : createApp;


export const AppAsync = newApp(IntegrationAsync);

export const AppSync = newApp(IntegrationSync);

if (isBrowser) {
  AppAsync.mount(`#app-async`);
  AppSync.mount(`#app-sync`);
}
