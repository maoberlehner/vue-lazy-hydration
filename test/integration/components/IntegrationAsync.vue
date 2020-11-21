<template>
  <div id="app-async">
    <LazyHydrate when-idle>
      <DummyIdle/>
    </LazyHydrate>
    <DummyIdleWrapper class="wrapper"/>
    <LazyHydrate on-interaction>
      <DummyInteraction @some-event="event1Triggered = true">
        <div class="default-slot">
          <div
            v-if="event1Triggered"
            class="show-when-event"
          />
        </div>
        <div
          slot="named"
          class="named-slot"
        />
      </DummyInteraction>
    </LazyHydrate>
    <DummyInteractionWrapper
      class="wrapper"
      @some-event="event2Triggered = true"
    >
      <div class="default-slot">
        <div
          v-if="event2Triggered"
          class="show-when-event"
        />
      </div>
      <div
        slot="named"
        class="named-slot"
      />
    </DummyInteractionWrapper>
    <LazyHydrate never>
      <DummySsr/>
    </LazyHydrate>
    <DummySsrWrapper class="wrapper"/>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <LazyHydrate when-visible>
      <DummyVisible/>
    </LazyHydrate>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <DummyVisibleWrapper class="wrapper"/>
  </div>
</template>

<script>
import LazyHydrate, {
  hydrateNever,
  hydrateOnInteraction,
  hydrateWhenIdle,
  hydrateWhenVisible,
} from '../../../src/LazyHydrate';

const DummyIdle = () => import('./DummyIdle.vue');
const DummyInteraction = () => import('./DummyInteraction.vue');
const DummySsr = () => import('./DummySsr.vue');
const DummyVisible = () => import('./DummyVisible.vue');

export default {
  name: `Integration`,
  components: {
    DummyIdle,
    DummyIdleWrapper: hydrateWhenIdle(DummyIdle),
    DummyInteraction,
    DummyInteractionWrapper: hydrateOnInteraction(DummyInteraction),
    DummySsr,
    DummySsrWrapper: hydrateNever(DummySsr),
    DummyVisible,
    DummyVisibleWrapper: hydrateWhenVisible(DummyVisible),
    LazyHydrate,
  },
  data() {
    return {
      event1Triggered: false,
      event2Triggered: false,
    };
  },
};
</script>
