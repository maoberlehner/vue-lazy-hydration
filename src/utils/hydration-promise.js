export function makeHydrationPromise() {
  let hydrate = () => {};
  const hydrationPromise = new Promise((resolve) => {
    hydrate = resolve;
  });

  return {
    hydrate,
    hydrationPromise,
  };
}
