<template>
  <svg
    width="36"
    height="36"
    class="flip rounded-full"
    viewBox="0 0 36 36">
    <path
      class="background"
      :d="circlePath" />
    <path
      class="bar"
      :d="circlePath"
      :stroke-dasharray="dashArrayValue" />
  </svg>
</template>

<style scoped>
.flip {
  transform: scale(-1, 1);
}

.background {
  fill: none;
  stroke: hsl(212, 33%, 89%);
  stroke-width: 32;
}
.bar {
  fill: none;
  stroke: hsl(268, 82%, 60%);
  stroke-width: 32;
  transition: stroke 1s;
}
</style>

<script>
export default {
  name: 'ProgressBar',
  props: {
    percentage: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      circlePath:
        'M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831',
    };
  },
  computed: {
    dashArrayValue() {
      return `${this.percentage}, 100`;
    },
  },
};
</script>
