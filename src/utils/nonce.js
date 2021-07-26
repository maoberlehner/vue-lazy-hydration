import { defineAsyncComponent, h } from 'vue';

const isServer = typeof window === `undefined`;

function isAsyncComponentFactory(componentOrFactory) {
  console.log({componentOrFactory});
  return typeof componentOrFactory === `function`;
}

function resolveComponent(componentOrFactory) {
  if (isAsyncComponentFactory(componentOrFactory)) {
    return componentOrFactory().then(componentModule => componentModule.default);
  }
  return componentOrFactory;
}

export function makeNonce({ component, hydrationPromise }) {
  if (isServer) return component;
  

  return defineAsyncComponent(async function() {
    await hydrationPromise;
    return await resolveComponent(component);
  })
}
