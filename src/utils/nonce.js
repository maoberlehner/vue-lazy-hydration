function isAsyncComponentFactory(componentOrFactory) {
  return typeof componentOrFactory === `function`;
}

function resolveComponent(componentOrFactory) {
  if (isAsyncComponentFactory(componentOrFactory)) {
    return componentOrFactory().then(componentModule => componentModule.default);
  }
  return componentOrFactory;
}

export function makeNonce({ component, hydrationPromise }) {
  return () => hydrationPromise.then(() => resolveComponent(component));
}
