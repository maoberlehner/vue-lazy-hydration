const DEFAULT_OPTIONS = {
  hydrationSwitch: Promise.resolve(false),
  firstRenderTimeout: 1000,
};
const NAMESPACE = `lazyHydration`;

export function resolvableFactory() {
  let resolve;
  const promise = new Promise((newResolve) => {
    resolve = newResolve;
  });

  return {
    promise,
    resolve: value => resolve(value),
  };
}

export function resolvableComponentFactory(componentFactory) {
  const {
    promise,
    resolve,
  } = resolvableFactory();

  const resolvableComponent = () => {
    promise.then(() => {
      resolvableComponent[NAMESPACE].resolve = undefined;
    });

    return promise;
  };

  Object.defineProperty(resolvableComponent, NAMESPACE, {
    value: {
      resolve: () => resolve(componentFactory()),
    },
  });

  return resolvableComponent;
}

export function loadSsrOnly(componentFactory) {
  if (!process.browser) return componentFactory;

  return resolvableComponentFactory(componentFactory);
}

export function loadWhenVisible(componentFactory, { selector }) {
  if (!process.browser || !(`IntersectionObserver` in window)) {
    return componentFactory;
  }

  const resolvableComponent = resolvableComponentFactory(componentFactory);
  const elements = Array.from(document.querySelectorAll(selector));
  const observer = new IntersectionObserver((entries) => {
    if (!resolvableComponent[NAMESPACE].resolve) return;
    // Use `intersectionRatio` because of Edge 15's
    // lack of support for `isIntersecting`.
    // See: https://github.com/w3c/IntersectionObserver/issues/211
    const isIntersecting = !!entries.find(x => x.intersectionRatio > 0);
    if (!isIntersecting) return;

    elements.forEach(x => observer.unobserve(x));
    resolvableComponent[NAMESPACE].resolve();
  });
  elements.forEach(x => observer.observe(x));

  return resolvableComponent;
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
