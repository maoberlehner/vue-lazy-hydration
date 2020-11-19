const isServer = typeof window === `undefined`;

export function makeNonce({ component, hydrationPromise }) {
  if (isServer) return component;

  return () => new Promise((resolve) => {
    hydrationPromise.then(() => resolve(component));
  });
}
