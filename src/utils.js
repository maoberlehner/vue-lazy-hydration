const observers = new Map();

export function createObserver(options) {
  if (typeof IntersectionObserver === `undefined`) return null;

  const optionKey = JSON.stringify(options);
  if (observers.has(optionKey)) return observers.get(optionKey);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // Use `intersectionRatio` because of Edge 15's
      // lack of support for `isIntersecting`.
      // See: https://github.com/w3c/IntersectionObserver/issues/211
      const isIntersecting = entry.isIntersecting || entry.intersectionRatio > 0;
      if (!isIntersecting || !entry.target.hydrate) return;
      entry.target.hydrate();
    });
  }, options);
  observers.set(optionKey, observer);

  return observer;
}

export function loadingComponentFactory(resolvableComponent, options) {
  return {
    render(h) {
      const tag = this.$el ? this.$el.tagName : `div`;

      // eslint-disable-next-line no-underscore-dangle
      if (!this.$el) resolvableComponent._resolve();

      return h(tag);
    },
    ...options,
  };
}

export function resolvableComponentFactory(component) {
  let resolve;
  const promise = new Promise((newResolve) => {
    resolve = newResolve;
  });
  // eslint-disable-next-line no-underscore-dangle
  promise._resolve = () => {
    resolve(typeof component === `function` ? component() : component);
  };

  return promise;
}
