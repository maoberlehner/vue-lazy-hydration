const DEFAULT_OPTIONS = {
  hydrationSwitch: Promise.resolve(false),
  firstRenderTimeout: 1000,
};

export function ssrOnly(componentFactory) {
  if (process.server) return componentFactory;

  let resolver;
  const resolverPromise = new Promise((resolve) => {
    resolver = resolve;
  });
  const promise = new Promise((resolve) => {
    resolverPromise.then(() => resolve(componentFactory()));
  });

  const factory = () => promise;

  Object.defineProperty(factory, `_lazyHydrationResolve`, {
    value: resolver,
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
      // eslint-disable-next-line no-underscore-dangle
      if (component._lazyHydrationResolve) {
        // eslint-disable-next-line no-underscore-dangle
        component._lazyHydrationResolve();
      }
    };
    const hydrateComponents = (components) => {
      Object.keys(components)
        .map(x => components[x])
        .map(hydrate);
    };

    Vue.mixin({
      beforeCreate() {
        // TODO exceptions?
        if (process.server || preventHydration) return;
        hydrateComponents(this.$options.components);
      },
      beforeUpdate() {
        // TODO exceptions?
        if (process.server || preventHydration) return;
        hydrateComponents(this.$options.components);
      },
    });
  },
};
