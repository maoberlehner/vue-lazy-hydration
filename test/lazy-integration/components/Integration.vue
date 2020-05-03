<template>
  <div id="app">
    Lazy Imports
    <div>
    <LazyHydrate when-idle :import="() => import('./DummyIdle.vue')">
      <DummyIdle/>
    </LazyHydrate>
    </div>
    <div>
    <LazyHydrate on-interaction :import="() => import('./DummyInteraction.vue')">
      <DummyInteraction/>
    </LazyHydrate>
    </div>
    <div>
    <LazyHydrate ssr-only :import="() => import('./DummySsr.vue')">
      <DummySsr/>
    </LazyHydrate>
    </div>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <div>
    <LazyHydrate when-visible :import="() => import('./DummyVisible.vue')">
      <DummyVisible/>
    </LazyHydrate>
    </div>
  </div>
</template>

<script>
  import LazyHydrate from '../../../src/LazyHydrate';

  export default {
    name: `Integration`,
    components: {
      LazyHydrate,
    },
  };
</script>
