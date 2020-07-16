import {
  createObserver,
  loadingComponentFactory,
  resolvableComponentFactory,
} from './utils';

const isServer = typeof window === `undefined`;

export function hydrateWhenIdle(component, { ignoredProps } = {}) {
  if (isServer) return component;

  const resolvableComponent = resolvableComponentFactory(component);
  const loading = loadingComponentFactory(resolvableComponent, {
    props: ignoredProps,
    mounted() {
      // If `requestIdleCallback()` or `requestAnimationFrame()`
      // is not supported, hydrate immediately.
      if (!(`requestIdleCallback` in window) || !(`requestAnimationFrame` in window)) {
        // eslint-disable-next-line no-underscore-dangle
        resolvableComponent._resolve();
        return;
      }

      const id = requestIdleCallback(() => {
        // eslint-disable-next-line no-underscore-dangle
        requestAnimationFrame(resolvableComponent._resolve);
      }, { timeout: this.idleTimeout });
      const cleanup = () => cancelIdleCallback(id);
      resolvableComponent.then(cleanup);
    },
  });

  return () => ({
    component: resolvableComponent,
    delay: 0,
    loading,
  });
}

export function hydrateWhenVisible(component, { ignoredProps, observerOptions } = {}) {
  if (isServer) return component;

  const resolvableComponent = resolvableComponentFactory(component);
  const observer = createObserver(observerOptions);

  const loading = loadingComponentFactory(resolvableComponent, {
    props: ignoredProps,
    mounted() {
      // If Intersection Observer API is not supported, hydrate immediately.
      if (!observer) {
        // eslint-disable-next-line no-underscore-dangle
        resolvableComponent._resolve();
        return;
      }

      // eslint-disable-next-line no-underscore-dangle
      this.$el.hydrate = resolvableComponent._resolve;
      const cleanup = () => observer.unobserve(this.$el);
      resolvableComponent.then(cleanup);
      observer.observe(this.$el);
    },
  });

  return () => ({
    component: resolvableComponent,
    delay: 0,
    loading,
  });
}

export function hydrateSsrOnly(component) {
  if (isServer) return component;

  const resolvableComponent = resolvableComponentFactory(component);
  const loading = loadingComponentFactory(resolvableComponent);

  return () => ({
    component: resolvableComponent,
    delay: 0,
    loading,
  });
}

export function hydrateOnInteraction(component, { event = `focus`, ignoredProps } = {}) {
  if (isServer) return component;

  const resolvableComponent = resolvableComponentFactory(component);
  const events = Array.isArray(event) ? event : [event];

  const loading = loadingComponentFactory(resolvableComponent, {
    props: ignoredProps,
    mounted() {
      events.forEach((eventName) => {
        // eslint-disable-next-line no-underscore-dangle
        this.$el.addEventListener(eventName, resolvableComponent._resolve, {
          capture: true,
          once: true,
          passive: true,
        });
      });
    },
  });

  return () => ({
    component: resolvableComponent,
    delay: 0,
    loading,
  });
}

export default {
  props: {
    idleTimeout: {
      default: 2000,
      type: Number,
    },
    onInteraction: {
      type: [Array, Boolean, String],
    },
    ssrOnly: {
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
      hydrated: isServer,
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

    if (this.ssrOnly) return;

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
      this.hydrated = true;
      this.cleanup();
    },
  },
  render(h) {
    if (!this.$scopedSlots.default && !this.$slots.default) return null;

    const child = this.$scopedSlots.default
      ? this.$scopedSlots.default({ hydrated: this.hydrated })
      : this.$slots.default[0];

    if (this.hydrated) return child;

    const tag = this.$el ? this.$el.tagName : `div`;
    const vnode = h(tag);
    // Special thanks to Rahul Kadyan for the following lines of code.
    // https://github.com/znck
    vnode.asyncFactory = {};
    vnode.isComment = true;

    return vnode;
  },
};
