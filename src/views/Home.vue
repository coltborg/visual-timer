<template>
  <div class="min-h-screen bg-grey-lightest">
    <h1 class="pt-12 pb-8 text-center text-4xl sm:text-5xl text-black">
      Visual Timer
    </h1>
    <div class="pb-12 text-center">
      <ProgressBar
        :percentage="timeRemainingPercentage"
        class="w-4/5 sm:w-3/5 md:w-2/5 lg:w-1/3 h-full" />
    </div>
    <h2
      v-if="isTimerRunning"
      class="pb-8 flex justify-center">
      <div class="">
        <div class="text-grey-dark text-xs font-semibold uppercase tracking-wide">
          Time remaining
        </div>
        <div class="text-purple text-5xl font-light">
          {{ displayTimeRemaining }}
        </div>
      </div>
    </h2>
    <form
      v-if="!isTimerRunning"
      action=""
      class="flex flex-col items-center justify-center"
      @submit.prevent="handleStartTime">
      <label>
        <div class="text-grey-dark text-xs font-semibold uppercase tracking-wide">
          Interval
        </div>
        <input
          ref="interval"
          v-model="interval"
          class="mb-8 py-2 px-4 w-24 bg-grey-lighter appearance-none border-2 border-solid border-grey rounded text-grey-darker text-xl focus:outline-none focus:border-purple"
          type="number"
          min="1"
          max="120">
      </label>
      <button
        ref="start"
        class="py-2 px-4 text-lg rounded shadow text-purple-lightest bg-purple hover:bg-purple-dark focus:bg-purple-dark"
        type="submit">
        Start
      </button>
    </form>
    <form
      v-show="isTimerRunning"
      action=""
      class="text-center"
      @submit.prevent="handleStopTime">
      <button
        ref="stop"
        class="py-2 px-4 text-lg rounded shadow text-grey-dark bg-transparent border border-grey-dark hover:border-grey-darkest hover:text-grey-darkest focus:border-grey-darkest focus:text-grey-darkest"
        type="submit">
        Stop
      </button>
    </form>
  </div>
</template>

<script>
import datefns from 'date-fns';
import { ProgressBar } from '@/components';

export default {
  name: 'Home',
  components: {
    ProgressBar,
  },
  filters: {
    formatToTime(value) {
      return datefns.format(value, 'h:mm:ssa');
    },
  },
  data() {
    return {
      finishTime: null,
      interval: 25,
      isTimerRunning: false,
      now: new Date(),
      startTime: null,
    };
  },
  computed: {
    timeRemaining() {
      if (this.isTimerRunning) {
        return datefns.differenceInSeconds(this.finishTime, this.now);
      }
      return 0;
    },
    displayTimeRemaining() {
      if (this.isTimerRunning) {
        return datefns.distanceInWords(
          this.finishTime,
          this.now,
        );
      }
      return `${this.interval} ${this.interval > 1 ? 'minutes' : 'minute'}`;
    },
    timeRemainingPercentage() {
      return (this.timeRemaining / (this.interval * 60)) * 100;
    },
  },
  watch: {
    timeRemaining(newValue) {
      if (newValue <= 0) {
        this.handleStopTime();
      }
    },
  },
  created() {
    this.nowFunc = () => this.now = new Date();
    this.nowInterval = setInterval(this.nowFunc, 1000);
  },
  beforeDestroy() {
    clearInterval(this.nowInterval);
  },
  methods: {
    handleStartTime() {
      this.startTime = this.now;
      // This controls the timer amount
      this.finishTime = datefns.addMinutes(this.now, this.interval);
      this.isTimerRunning = true;
      this.$nextTick(() => this.$refs.stop.focus());
    },
    handleStopTime() {
      this.startTime = null;
      this.finishTime = null;
      this.isTimerRunning = false;
      this.$nextTick(() => this.$refs.interval.focus());
    },
  },
};
</script>
