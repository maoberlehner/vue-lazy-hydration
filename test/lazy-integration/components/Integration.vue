<template>
  <div id="app">
    Lazy Imports
    <div>
    <LazyHydrate when-idle :import="() => import('../../integration/components/DummyIdle.vue')">
      <DummyIdle/>
    </LazyHydrate>
    </div>
    <div>
    <LazyHydrate on-interaction :import="() => import('../../integration/components/DummyInteraction.vue')">
      <DummyInteraction/>
    </LazyHydrate>
    </div>
    <div>
    <LazyHydrate ssr-only :import="() => import('../../integration/components/DummySsr.vue')">
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
    <LazyHydrate when-visible :import="() => import('../../integration/components/DummyVisible.vue')">
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
