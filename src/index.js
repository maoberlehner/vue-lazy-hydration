const DEFAULT_OPTIONS = {
  hydrationSwitch: Promise.resolve(false),
  firstRenderTimeout: 1000,
};
const NAMESPACE = `_lazyHydration`;

function resolvableFactory(componentFactory) {
  let resolver;
  const resolverPromise = new Promise((resolve) => {
    resolver = resolve;
  });
  const promise = new Promise((resolve) => {
    resolverPromise.then(() => resolve(componentFactory()));
  });

  const resolvable = () => {
    promise.then(() => {
      resolvable[NAMESPACE].resolve = undefined;
    });

    return promise;
  };

  Object.defineProperty(resolvable, NAMESPACE, {
    value: {
      resolve: resolver,
    },
  });

  return resolvable;
}

export function loadSsrOnly(componentFactory) {
  if (!process.browser) return componentFactory;

  const resolvable = resolvableFactory(componentFactory);

  return resolvable;
}

export function loadWhenVisible(componentFactory, { selector }) {
  if (!process.browser || !(`IntersectionObserver` in window)) {
    return componentFactory;
  }

  const resolvable = resolvableFactory(componentFactory);
  const elements = Array.from(document.querySelectorAll(selector));
  const observer = new IntersectionObserver((entries) => {
    if (!resolvable[NAMESPACE].resolve) return;
    // Use `intersectionRatio` because of Edge 15's
    // lack of support for `isIntersecting`.
    // See: https://github.com/w3c/IntersectionObserver/issues/211
    const isIntersecting = !!entries.find(x => x.intersectionRatio > 0);
    if (!isIntersecting) return;

    elements.forEach(x => observer.unobserve(x));
    resolvable[NAMESPACE].resolve();
  });
  elements.forEach(x => observer.observe(x));

  return resolvable;
}

export const VueLazyHydration = {
  install(Vue, customOptions) {
    if (!process.browser) return;

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
        if (preventHydration) return;
        hydrateComponents(this.$options.components);
      },
    });
  },
};
