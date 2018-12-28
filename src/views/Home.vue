<template>
  <div class="h-screen bg-grey-lighter">
    <h1 class="pt-10 pb-4 text-center text-5xl text-black">
      Visual Timer
    </h1>
    <h2 class="pb-4 text-center text-xl font-normal text-grey-darker">
      Is there a timer running? - {{ isTimerRunning }}
    </h2>
    <h2 class="pb-6 text-center text-xl font-normal text-grey-darker">
      The start time of the timer is - {{ displayTime }}
    </h2>
    <div class="text-center">
      <button
        v-show="!isTimerRunning"
        class="px-4 py-2 bg-purple text-white rounded hover:bg-purple-dark"
        type="button"
        @click="handleStartTime">
        Start
      </button>
      <button
        v-show="isTimerRunning"
        class="px-4 py-2 bg-red text-white rounded hover:bg-red-dark"
        type="button"
        @click="handleStopTime">
        Stop
      </button>
    </div>
  </div>
</template>

<script>
import format from 'date-fns/format';

export default {
  name: 'Home',
  data() {
    return {
      isTimerRunning: false,
      startTime: null,
    };
  },
  computed: {
    displayTime() {
      return format(this.startTime, 'h:mm:ss a');
    },
  },
  methods: {
    handleStartTime() {
      this.startTime = new Date();
      this.isTimerRunning = true;
    },
    handleStopTime() {
      this.startTime = null;
      this.isTimerRunning = false;
    },
  },
};
</script>
