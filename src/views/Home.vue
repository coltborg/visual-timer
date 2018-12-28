<template>
  <div class="min-h-screen bg-grey-lighter">
    <h1 class="pt-10 pb-4 text-center text-5xl text-black">
      Visual Timer
    </h1>
    <div class="text-center">
      <ProgressBar
        :percentage="timeRemainingPercentage"
        class="w-64 h-64" />
    </div>
    <h2 class="pb-4 text-center text-xl font-normal text-grey-darker">
      The time now - {{ now | formatToTime }}
    </h2>
    <h2 class="pb-4 text-center text-xl font-normal text-grey-darker">
      Is there a timer running? - {{ isTimerRunning }}
    </h2>
    <h2 class="pb-6 text-center text-xl font-normal text-grey-darker">
      The start time of the timer is - {{ startTime | formatToTime }}
    </h2>
    <h2 class="pb-6 text-center text-xl font-normal text-grey-darker">
      The end time of the timer is - {{ finishTime | formatToTime }}
    </h2>
    <h2 class="pb-6 text-red text-center text-xl font-normal text-grey-darker">
      Time remaining - {{ displayTimeRemaining }}
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
    },
    handleStopTime() {
      this.startTime = null;
      this.finishTime = null;
      this.isTimerRunning = false;
    },
  },
};
</script>
