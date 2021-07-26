import { h, ref } from 'vue';
import { makeHydrationObserver } from './hydration-observer';
import { makeHydrationPromise } from './hydration-promise';
import { makeNonce } from './nonce';

export function makeHydrationBlocker(component, options) {
  return Object.assign({
    render() {
      console.log('renderFn');
      return h(this.Nonce, {
        // attrs: this.$attrs,
        // on: this.$listeners,
        // scopedSlots: this.$scopedSlots,
      }, this.$slots.default);
    },
    mixins: [{
      beforeCreate() {
        console.log('beforeCreate');
        this.cleanupHandlers = [];
        const { hydrate, hydrationPromise } = makeHydrationPromise();
        this.Nonce = makeNonce({ component, hydrationPromise });
        this.hydrate = hydrate;
        this.hydrationPromise = hydrationPromise;
      },
      beforeUnmount() {
        this.cleanup();
      },
      mounted() {
        const targetNode = this.$el.nextSibling;
        console.log('mounted', this.$el.nextSibling, this);
        if (this.$el.nodeType === Node.COMMENT_NODE && !targetNode) {
          console.log('no-ssr link found', this.$el);
          // No SSR rendered content, hydrate immediately.
          this.hydrate();
          return;
        }

        if (this.never) return;

        if (targetNode && this.whenVisible) {
          const observerOptions = this.whenVisible !== true ? this.whenVisible : undefined;
          const observer = makeHydrationObserver(observerOptions);

          // If Intersection Observer API is not supported, hydrate immediately.
          if (!observer) {
            this.hydrate();
            return;
          }

          targetNode.hydrate = this.hydrate;
          const cleanup = () => observer.unobserve(targetNode);
          this.cleanupHandlers.push(cleanup);
          this.hydrationPromise.then(cleanup);
          observer.observe(targetNode);
          return;
        }

        if (targetNode && this.whenIdle) {
          // If `requestIdleCallback()` or `requestAnimationFrame()`
          // is not supported, hydrate immediately.
          if (!(`requestIdleCallback` in window) || !(`requestAnimationFrame` in window)) {
            this.hydrate();
            return;
          }

          // @ts-ignore
          const id = requestIdleCallback(() => {
            requestAnimationFrame(this.hydrate);
          }, { timeout: this.idleTimeout });
          // @ts-ignore
          const cleanup = () => cancelIdleCallback(id);
          this.cleanupHandlers.push(cleanup);
          this.hydrationPromise.then(cleanup);
        }

        console.log('interactionEvents', this.interactionEvents);


        const interactionEvents = ['click'] //this.interactionEvents;
        if (interactionEvents && interactionEvents.length) {
          console.log('interactionEvents', interactionEvents);
          const eventListenerOptions = {
            capture: true,
            once: true,
            passive: true,
          };

          interactionEvents.forEach((eventName) => {
            targetNode.addEventListener(eventName, this.hydrate, eventListenerOptions);
            const cleanup = () => {
              targetNode.removeEventListener(eventName, this.hydrate, eventListenerOptions);
            };
            this.cleanupHandlers.push(cleanup);
          });
        }
      },
      methods: {
        cleanup() {
          this.cleanupHandlers.forEach(handler => handler());
        },
      }
    }],
  }, options);
}
