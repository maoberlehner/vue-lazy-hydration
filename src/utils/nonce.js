const isServer = typeof window === `undefined`;

function isAsyncComponentFactory(componentOrFactory) {
  return typeof componentOrFactory === `function`;
}

function resolveComponent(componentOrFactory) {
  if (isAsyncComponentFactory(componentOrFactory)) {
    return componentOrFactory().then(componentModule => componentModule.default);
  }
  return componentOrFactory;
}

export function makeNonce({ component, hydrate, hydrationPromise }) {
  return () => new Promise((resolve) => {
    if (isServer) hydrate();

    hydrationPromise.then(() => resolve(resolveComponent(component)));
  });
}
