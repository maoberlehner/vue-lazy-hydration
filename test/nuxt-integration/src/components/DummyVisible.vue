<template>
  <div class="DummyVisible">
    Look at me for more!
    <br>
    <div
      v-if="more"
      class="more"
    >
      Just more.
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      more: false,
    };
  },
  mounted() {
    console.log('MOUNTED');
    this.more = true;
  },
};
</script>
<style scoped>
  .blue {
    color:blue;
  }
</style>
