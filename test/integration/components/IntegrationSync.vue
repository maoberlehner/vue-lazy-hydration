<template>
  <div id="app-sync">
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
        <template
          #named
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
      <template
        #named
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
import DummyIdle from './DummyIdle.vue';
import DummyInteraction from './DummyInteraction.vue';
import DummySsr from './DummySsr.vue';
import DummyVisible from './DummyVisible.vue';

import LazyHydrate, {
  hydrateNever,
  hydrateOnInteraction,
  hydrateWhenIdle,
  hydrateWhenVisible,
} from '../../../src/LazyHydrate';

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
