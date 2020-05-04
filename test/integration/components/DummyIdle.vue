<template>
  <div class="DummyIdle inner">
    Mount me for more!
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
    this.more = true;
  },
};
</script>
