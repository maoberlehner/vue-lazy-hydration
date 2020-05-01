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

function unwrapClass(classes) {
  if (!classes) return [];

  const result = [];
  if (Array.isArray(classes)) {
    classes.forEach((cl) => {
      result.push(...unwrapClass(cl));
    });
    return result;
  } if (typeof classes === `object`) {
    Object.keys(classes).forEach((key) => {
      if (classes[key]) result.push(...unwrapClass(classes[key]));
    });
    return result;
  }
  // string
  return classes.split(` `);
}

function getMissingClasses(vnodeClasses, elementClasses) {
  const vnodes = unwrapClass(vnodeClasses);
  const elements = unwrapClass(elementClasses);

  // return all classes which are not in the vnode, but in the elements
  return elements.filter(x => !vnodes.includes(x));
}

export function loadingComponentFactory(resolvableComponent, options) {
  return {
    render(h) {
      const tag = this.$el ? this.$el.tagName : `div`;

      // eslint-disable-next-line no-underscore-dangle
      if (!this.$el) resolvableComponent._resolve();

      return h(tag, {
        class: getMissingClasses(
          [
            this.$vnode && this.$vnode.data && this.$vnode.data.class,
            this.$vnode && this.$vnode.data && this.$vnode.data.staticClass,
          ],
          this.$el && this.$el.getAttribute(`class`),
        ),
      });
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
