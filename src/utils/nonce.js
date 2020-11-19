const isServer = typeof window === `undefined`;

export function makeNonce({ component, hydrationPromise }) {
  if (isServer) return component;

  return () => hydrationPromise.then(() => component);
}
