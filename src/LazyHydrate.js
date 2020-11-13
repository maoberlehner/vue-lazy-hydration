import { makeHydrationBlocker } from './utils/hydration-blocker';

export function hydrateWhenIdle(componentOrFactory, { timeout = 2000 } = {}) {
  return makeHydrationBlocker(componentOrFactory, {
    beforeCreate() {
      this.whenIdle = true;
      this.idleTimeout = timeout;
    },
  });
}

export function hydrateWhenVisible(componentOrFactory, { observerOptions = undefined } = {}) {
  return makeHydrationBlocker(componentOrFactory, {
    beforeCreate() {
      this.whenVisible = observerOptions || true;
    },
  });
}

export function hydrateNever(componentOrFactory) {
  return makeHydrationBlocker(componentOrFactory, {
    beforeCreate() {
      this.never = true;
    },
  });
}

export function hydrateOnInteraction(componentOrFactory, { event = `focus` } = {}) {
  const events = Array.isArray(event) ? event : [event];

  return makeHydrationBlocker(componentOrFactory, {
    beforeCreate() {
      this.interactionEvents = events;
    },
  });
}

const Placeholder = {
  render() {
    return this.$slots.default;
  },
};

export default makeHydrationBlocker(Placeholder, {
  props: {
    idleTimeout: {
      default: 2000,
      type: Number,
    },
    never: {
      type: Boolean,
    },
    onInteraction: {
      type: [Array, Boolean, String],
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
  computed: {
    interactionEvents() {
      if (!this.onInteraction) return [];
      if (this.onInteraction === true) return [`focus`];

      return Array.isArray(this.onInteraction)
        ? this.onInteraction
        : [this.onInteraction];
    },
  },
  watch: {
    triggerHydration: {
      immediate: true,
      handler(isTriggered) {
        if (isTriggered) this.hydrate();
      },
    },
  },
});
