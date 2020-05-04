<template>
  <div id="app">
    <LazyHydrate when-idle>
      <DummyIdle class="outer"/>
    </LazyHydrate>
    <LazyHydrate on-interaction>
      <DummyInteraction/>
    </LazyHydrate>
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

import LazyHydrate from '../../../src/LazyHydrate';

export default {
  name: `Integration`,
  components: {
    DummyIdle,
    DummyInteraction,
    DummySsr,
    DummyVisible,
    LazyHydrate,
  },
};
</script>

<style scoped>
.outer {
  background-color: green;
}
</style>
