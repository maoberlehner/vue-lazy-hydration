<template>
  <div id="app">
    <LazyHydrate when-idle>
      <DummyIdle/>
    </LazyHydrate>
    <DummyIdleWrapper class="wrapper"/>
    <LazyHydrate on-interaction>
      <DummyInteraction/>
    </LazyHydrate>
    <DummyInteractionWrapper class="wrapper"/>
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
};
</script>
