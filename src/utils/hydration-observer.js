const observers = new Map();

export function makeHydrationObserver(options) {
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
