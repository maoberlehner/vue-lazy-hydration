import {
  createObserver,
  makeHydrationPromise,
} from './utils';

const isServer = typeof window === `undefined`;

function isAsyncComponentFactory(componentOrFactory) {
  return typeof componentOrFactory === `function`;
}

function normalizeComponent(componentOrFactory) {
  if (isAsyncComponentFactory) return componentOrFactory;

  return () => componentOrFactory;
}

function resolveComponentFactory(componentFactory) {
  return componentFactory().then(component => component.default || component);
}

function makeNonce({ componentFactory, hydrate, hydrationPromise }) {
  return () => new Promise((resolve) => {
    if (isServer) hydrate();

    hydrationPromise.then(() => resolve(resolveComponentFactory(componentFactory)));
  });
}

export function hydrateWhenIdle(componentOrFactory, { timeout = 2000 } = {}) {
  const { hydrate, hydrationPromise } = makeHydrationPromise();
  const componentFactory = normalizeComponent(componentOrFactory);
  const Nonce = makeNonce({ componentFactory, hydrate, hydrationPromise });

  return {
    mounted() {
      // If `requestIdleCallback()` or `requestAnimationFrame()`
      // is not supported, hydrate immediately.
      if (!(`requestIdleCallback` in window) || !(`requestAnimationFrame` in window)) {
        // eslint-disable-next-line no-underscore-dangle
        hydrate();
        return;
      }

      // @ts-ignore
      const id = requestIdleCallback(() => {
        // eslint-disable-next-line no-underscore-dangle
        requestAnimationFrame(hydrate);
      }, { timeout });
      // @ts-ignore
      const cleanup = () => cancelIdleCallback(id);
      hydrationPromise.then(cleanup);
    },
    render(h) {
      return h(Nonce, { props: this.$attrs }, this.$slots.default);
    },
  };
}

export function hydrateWhenVisible(componentOrFactory, { observerOptions = undefined } = {}) {
  const { hydrate, hydrationPromise } = makeHydrationPromise();
  const componentFactory = normalizeComponent(componentOrFactory);
  const Nonce = makeNonce({ componentFactory, hydrate, hydrationPromise });
  const observer = createObserver(observerOptions);

  return {
    mounted() {
      if (!observer) {
        hydrate();
        return;
      }

      this.$el.hydrate = hydrate;
      const cleanup = () => observer.unobserve(this.$el);
      hydrationPromise.then(cleanup);
      observer.observe(this.$el);
    },
    render(h) {
      return h(Nonce, { props: this.$attrs }, this.$slots.default);
    },
  };
}

export function hydrateNever(componentOrFactory) {
  const { hydrate, hydrationPromise } = makeHydrationPromise();
  const componentFactory = normalizeComponent(componentOrFactory);
  const Nonce = makeNonce({ componentFactory, hydrate, hydrationPromise });

  return {
    render(h) {
      return h(Nonce, { props: this.$attrs }, this.$slots.default);
    },
  };
}

export function hydrateOnInteraction(componentOrFactory, { event = `focus` } = {}) {
  const { hydrate, hydrationPromise } = makeHydrationPromise();
  const componentFactory = normalizeComponent(componentOrFactory);
  const Nonce = makeNonce({ componentFactory, hydrate, hydrationPromise });
  const events = Array.isArray(event) ? event : [event];

  return {
    mounted() {
      events.forEach((eventName) => {
        // eslint-disable-next-line no-underscore-dangle
        this.$el.addEventListener(eventName, hydrate, {
          capture: true,
          once: true,
          passive: true,
        });
      });
    },
    render(h) {
      return h(Nonce, { props: this.$attrs }, this.$slots.default);
    },
  };
}

const Nonce = () => new Promise(() => {});

const LazyHydrateBlocker = {
  functional: true,
  render: (h, context) => (context.props.isHydrated ? context.props.content : h(Nonce)),
};

export default {
  props: {
    idleTimeout: {
      default: 2000,
      type: Number,
    },
    onInteraction: {
      type: [Array, Boolean, String],
    },
    never: {
      type: Boolean,
    },
    triggerHydration: {
      default: false,
      type: Boolean,
    },
    whenIdle: {
      type: Boolean,
    },
    whenVisible: {
      type: [Boolean, Object],
    },
  },
  data() {
    return {
      isHydrated: isServer,
    };
  },
  watch: {
    triggerHydration: {
      immediate: true,
      handler(hydrate) {
        if (hydrate) this.hydrate();
      },
    },
  },
  computed: {
    interactionEvents() {
      if (!this.onInteraction) return [];
      if (this.onInteraction === true) return [`focus`];

      return Array.isArray(this.onInteraction)
        ? this.onInteraction
        : [this.onInteraction];
    },
  },
  mounted() {
    if (this.$el.childElementCount === 0) {
      // No SSR rendered content, hydrate immediately.
      this.hydrate();
      return;
    }

    if (this.never) return;

    this.interactionEvents.forEach((eventName) => {
      this.$el.addEventListener(eventName, this.hydrate, {
        capture: true,
        once: true,
        passive: true,
      });
    });
    if (this.interactionEvents.length) {
      this.interaction = () => {
        this.interactionEvents.forEach(
          eventName => this.$el.removeEventListener(eventName, this.hydrate),
        );
      };
    }

    if (this.whenIdle) {
      // If `requestIdleCallback()` or `requestAnimationFrame()`
      // is not supported, hydrate immediately.
      if (!(`requestIdleCallback` in window) || !(`requestAnimationFrame` in window)) {
        this.hydrate();
        return;
      }

      const id = requestIdleCallback(() => {
        requestAnimationFrame(() => {
          this.hydrate();
        });
      }, { timeout: this.idleTimeout });
      this.idle = () => cancelIdleCallback(id);
    }

    if (this.whenVisible) {
      const options = this.whenVisible === true ? {} : this.whenVisible;
      const observer = createObserver(options);

      // If Intersection Observer API is not supported, hydrate immediately.
      if (!observer) {
        this.hydrate();
        return;
      }

      this.$el.hydrate = this.hydrate;
      observer.observe(this.$el);

      this.visible = () => {
        observer.unobserve(this.$el);
        delete this.$el.hydrate;
      };
    }
  },
  beforeDestroy() {
    this.cleanup();
  },
  methods: {
    cleanup() {
      const handlers = [`idle`, `interaction`, `visible`];

      handlers.forEach((handler) => {
        if (handler in this) {
          this[handler]();
          delete this[handler];
        }
      });
    },
    hydrate() {
      this.isHydrated = true;
      this.cleanup();
    },
  },
  render(h) {
    return h(LazyHydrateBlocker, {
      props: {
        content: this.$slots.default,
        isHydrated: this.isHydrated,
      },
    });
  },
};
