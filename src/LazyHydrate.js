const isServer = typeof window === `undefined`;
const isBrowser = !isServer;
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
      });
    });
    if (this.interactionEvents.length) {
      this.interaction = () => {
        this.interactionEvents.forEach(eventName =>
          this.$el.removeEventListener(eventName, this.hydrate));
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
    const children = this.$scopedSlots.default
      ? this.$scopedSlots.default({ hydrated: this.hydrated })
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
