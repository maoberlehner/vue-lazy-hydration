<template>
  <div id="app">
    <template
      v-for="n in 20"
    >
      <LazyHydrate
        :key="`${n}-1`"
        never
      >
        <Markdown/>
      </LazyHydrate>
    </template>

    <template
      v-for="n in 20"
    >
      <LazyHydrate
        :key="`${n}-2`"
        never
      >
        <DeeplyNested/>
      </LazyHydrate>
    </template>

    <template
      v-for="n in 20"
    >
      <LazyHydrate
        :key="`${n}-3`"
        never
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
  name: `HydrateNever`,
  components: {
    DeeplyNested,
    LazyHydrate,
    LongList,
    Markdown,
  },
};
</script>
