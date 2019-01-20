const isServer = typeof window === `undefined`;
const isBrowser = !isServer;
let blockRenderHydration = true;
let observer = null;

if (typeof IntersectionObserver !== `undefined`) {
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // Use `intersectionRatio` because of Edge 15's
      // lack of support for `isIntersecting`.
      // See: https://github.com/w3c/IntersectionObserver/issues/211
      const isIntersecting = entry.isIntersecting || entry.intersectionRatio > 0;
      if (!isIntersecting || !entry.target.parentElement.hydrate) return;

      entry.target.parentElement.hydrate();
    });
  });
}

export default {
  props: {
    idleTimeout: {
      default: 2000,
      type: Number,
    },
    initialRenderTimeout: {
      default: 800,
      type: Number,
    },
    onInteraction: {
      type: [Boolean, String],
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
      type: Boolean,
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
    interactionEvent() {
      return this.onInteraction === true ? `focus` : this.onInteraction;
    },
  },
  mounted() {
    if (this.$el.childElementCount === 0) {
      // No SSR rendered content, hydrate immediately.
      this.hydrate();
      return;
    }

    setTimeout(() => {
      blockRenderHydration = false;
    }, this.initialRenderTimeout);

    if (this.ssrOnly) return;

    if (this.interactionEvent) {
      this.$el.addEventListener(this.interactionEvent, this.hydrate, {
        capture: true,
        once: true,
      });
      this.interaction = () =>
        this.$el.removeEventListener(this.interactionEvent, this.hydrate);
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
      // If Intersection Observer API is not supported, hydrate immediately.
      if (!observer) {
        this.hydrate();
        return;
      }

      this.$el.hydrate = this.hydrate;
      observer.observe(this.$el.children[0]);

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
    // Hydrate the component if it is going to be re-rendered after
    // the initial render. A re-render is triggered if a property of
    // the child component changes for example.
    if (!blockRenderHydration) {
      this.hydrate();
      blockRenderHydration = true;
    }

    const children = this.$slots.default.length > 1
      ? h(`div`, { staticStyle: `display: contents` }, this.$slots.default)
      : this.$slots.default[0];
    const vnode = this.hydrated
      ? children
      : h(`div`);

    // Special thanks to Rahul Kadyan for the following lines of code.
    // https://github.com/znck
    if (isBrowser) {
      vnode.asyncFactory = this.hydrated ? { resolved: true } : {};
      vnode.isAsyncPlaceholder = !this.hydrated;
    }

    return vnode;
  },
};
