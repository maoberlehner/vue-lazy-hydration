// eslint-disable-next-line
import { VueLazyHydration } from 'vue-lazy-hydration';
// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue';

let skipFirstRouteChange = true;
let resolveHydrationSwitch;
const hydrationSwitch = new Promise((resolve) => {
  resolveHydrationSwitch = resolve;
});

Vue.use(VueLazyHydration, {
  hydrationSwitch,
});

export default ({ app }) => {
  if (!process.browser) return;

  app.router.beforeEach((to, from, next) => {
    if (skipFirstRouteChange) {
      skipFirstRouteChange = false;
      next();
      return;
    }
    resolveHydrationSwitch(true);
    next();
  });
};
