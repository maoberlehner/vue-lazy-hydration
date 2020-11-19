const isServer = typeof window === `undefined`;

export function makeNonce({ component, hydrate, hydrationPromise }) {
  return () => new Promise((resolve) => {
    if (isServer) hydrate();

    hydrationPromise.then(() => resolve(component));
  });
}
