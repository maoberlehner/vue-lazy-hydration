<template>
  <div v-html="markdown"/>
</template>

<script>
import marked from 'marked';

export default {
  computed: {
    markdown() {
      return marked(`
# Hello World

Lorem **Ipsum** dolir *sit*
      `);
    },
  },
};
</script>
