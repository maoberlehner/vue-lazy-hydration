const DEFAULT_OPTIONS = {
  hydrationSwitch: Promise.resolve(false),
  firstRenderTimeout: 1000,
};
const NAMESPACE = `_lazyHydration`;

export function loadSsrOnly(componentFactory) {
  if (process.server) return componentFactory;

  let resolver;
  const resolverPromise = new Promise((resolve) => {
    resolver = resolve;
  });
  const promise = new Promise((resolve) => {
    resolverPromise.then(() => resolve(componentFactory()));
  });

  const factory = () => {
    factory[NAMESPACE].resolve = undefined;
    return promise;
  };

  Object.defineProperty(factory, NAMESPACE, {
    value: {
      resolve: resolver,
    },
  });

  return factory;
}

export const VueLazyHydration = {
  install(Vue, customOptions) {
    const options = {
      ...DEFAULT_OPTIONS,
      ...customOptions,
    };

    let preventHydration = true;

    options.hydrationSwitch.then((status) => {
      preventHydration = !status;
    });

    setTimeout(() => {
      preventHydration = false;
    }, options.firstRenderTimeout);

    const hydrate = (component) => {
      if (component[NAMESPACE] && component[NAMESPACE].resolve) {
        component[NAMESPACE].resolve();
      }
    };
    const hydrateComponents = (components) => {
      Object.keys(components)
        .map(x => components[x])
        .map(hydrate);
    };

    Vue.mixin({
      beforeCreate() {
        if (process.server || preventHydration) return;
        hydrateComponents(this.$options.components);
      },
      beforeUpdate() {
        if (process.server || preventHydration) return;
        hydrateComponents(this.$options.components);
      },
    });
  },
};
