<template>
  <div id="app">
    <template
      v-for="n in 20"
    >
      <LazyHydrate
        :key="`${n}-1`"
        ssr-only
      >
        <Markdown/>
      </LazyHydrate>
    </template>

    <template
      v-for="n in 20"
    >
      <LazyHydrate
        :key="`${n}-2`"
        ssr-only
      >
        <DeeplyNested/>
      </LazyHydrate>
    </template>

    <template
      v-for="n in 20"
    >
      <LazyHydrate
        :key="`${n}-3`"
        ssr-only
      >
        <LongList/>
      </LazyHydrate>
    </template>
  </div>
</template>

<script>
import LazyHydrate from '../../../dist/LazyHydrate.esm.min';

import DeeplyNested from './DeeplyNested.vue';
import LongList from './LongList.vue';
import Markdown from './Markdown.vue';

export default {
  name: `SsrOnly`,
  components: {
    DeeplyNested,
    LazyHydrate,
    LongList,
    Markdown,
  },
};
</script>
