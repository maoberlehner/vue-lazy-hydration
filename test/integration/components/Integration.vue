<template>
  <div id="app">
    <LazyHydrate when-idle>
      <DummyIdle/>
    </LazyHydrate>
    <LazyHydrate on-interaction>
      <DummyInteraction />
    </LazyHydrate>
    <DummyInteractionFct id="DummyInteractionFct" class="additional" style="color: red"/>
    <LazyHydrate ssr-only>
      <DummySsr/>
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
    <LazyHydrate when-visible>
      <DummyVisible/>
    </LazyHydrate>
  </div>
</template>

<script>
import DummyIdle from './DummyIdle.vue';
import DummyInteraction from './DummyInteraction.vue';
import DummySsr from './DummySsr.vue';
import DummyVisible from './DummyVisible.vue';
import DummyInteractionFct from './DummyInteractionFct.vue';

import LazyHydrate, {hydrateOnInteraction} from '../../../src/LazyHydrate';

export default {
  name: `Integration`,
  components: {
    DummyIdle,
    DummyInteraction,
    DummySsr,
    DummyVisible,
    LazyHydrate,
    DummyInteractionFct: hydrateOnInteraction(async () => DummyInteractionFct)
  },
};
</script>
