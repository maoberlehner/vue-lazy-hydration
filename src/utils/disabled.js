const isServer = typeof window === `undefined`;
let isPageLodaded = false;

if (!isServer) {
  // load event fires, when document with all scripts is loaded,
  // so after hydration process is finished
  window.addEventListener(`load`, () => {
    isPageLodaded = true;
  });
}

export function isHydrationDisabled() {
  // Hydration may be disabled because we are in SSR context
  // or page was fully loaded & hydrated, so it's not needed anymore
  return isServer || isPageLodaded;
}
