<template>
  <div id="app">
    <template
      v-for="n in 20"
    >
      <Markdown :key="`${n}-1`"/>
    </template>

    <template
      v-for="n in 20"
    >
      <DeeplyNested :key="`${n}-2`"/>
    </template>

    <template
      v-for="n in 20"
    >
      <LongList :key="`${n}-3`"/>
    </template>
  </div>
</template>

<script>
import DeeplyNested from './DeeplyNested.vue';
import LongList from './LongList.vue';
import Markdown from './Markdown.vue';

export default {
  name: `Reference`,
  components: {
    DeeplyNested,
    LongList,
    Markdown,
  },
};
</script>
