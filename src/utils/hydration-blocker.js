import { makeHydrationObserver } from './hydration-observer';
import { makeHydrationPromise } from './hydration-promise';
import { makeNonce } from './nonce';

export function makeHydrationBlocker(component, options) {
  return {
    ...options,
    mixins: [{
      beforeCreate() {
        this.cleanupHandlers = [];
        const { hydrate, hydrationPromise } = makeHydrationPromise();
        this.Nonce = makeNonce({ component, hydrate, hydrationPromise });
        this.hydrate = hydrate;
        this.hydrationPromise = hydrationPromise;
      },
      beforeDestroy() {
        this.cleanup();
      },
      mounted() {
        if (this.$el.nodeType === Node.COMMENT_NODE) {
          // No SSR rendered content, hydrate immediately.
          this.hydrate();
          return;
        }

        if (this.never) return;

        if (this.whenVisible) {
          const observerOptions = this.whenVisible !== true ? this.whenVisible : undefined;
          const observer = makeHydrationObserver(observerOptions);

          if (!observer) {
            this.hydrate();
            return;
          }

          this.$el.hydrate = this.hydrate;
          const cleanup = () => observer.unobserve(this.$el);
          this.hydrationPromise.then(cleanup);
          observer.observe(this.$el);
          return;
        }

        if (this.whenIdle) {
          // If `requestIdleCallback()` or `requestAnimationFrame()`
          // is not supported, hydrate immediately.
          if (!(`requestIdleCallback` in window) || !(`requestAnimationFrame` in window)) {
            // eslint-disable-next-line no-underscore-dangle
            this.hydrate();
            return;
          }

          // @ts-ignore
          const id = requestIdleCallback(() => {
            // eslint-disable-next-line no-underscore-dangle
            requestAnimationFrame(this.hydrate);
          }, { timeout: this.idleTimeout });
          // @ts-ignore
          const cleanup = () => cancelIdleCallback(id);
          this.hydrationPromise.then(cleanup);
        }

        if (this.interactionEvents.length) {
          const eventListenerOptions = {
            capture: true,
            once: true,
            passive: true,
          };

          this.interactionEvents.forEach((eventName) => {
            const eventListenerParams = [eventName, this.hydrate, eventListenerOptions];
            this.$el.addEventListener(...eventListenerParams);
            this.cleanupHandlers.push(() => this.$el.removeEventListener(...eventListenerParams));
          });
        }
      },
      methods: {
        cleanup() {
          this.cleanupHandlers.forEach(handler => handler());
        },
      },
      render(h) {
        return h(this.Nonce, { props: this.$attrs }, this.$slots.default);
      },
    }],
  };
}
