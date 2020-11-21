<template>
  <div class="DummyInteraction">
    Click for more!
    <br>
    <button
      class="button"
      @click="more = true"
    >
      Click me
    </button>
    <button
      class="button-some-event"
      @click="$emit(`some-event`)"
    >
      Fire some event
    </button>
    <br>
    <div
      v-if="more"
      class="more"
    >
      Just more.
    </div>
    <slot/>
    <slot name="named"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      more: false,
    };
  },
};
</script>
