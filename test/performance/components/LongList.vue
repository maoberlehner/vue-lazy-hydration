<template>
  <ul>
    <template v-for="n in 50">
      <li :key="`${n}-x`">
        Lorem Ipsum dolor {{ n }}
      </li>
      <li :key="`${n}-y`">
        <Markdown/>
      </li>
    </template>
  </ul>
</template>

<script>
import Markdown from './Markdown.vue';

export default {
  components: {
    Markdown,
  },
};
</script>
