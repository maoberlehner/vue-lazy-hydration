<template>
  <section class="SingleDummy">
    <div
      v-if="more"
      class="more"
    >
      Just more.
    </div>
  </section>
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
