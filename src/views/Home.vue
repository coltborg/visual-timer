<template>
  <div class="min-h-screen">
    <h1 class="pt-6 pb-10 text-center font-semibold text-5xl sm:text-6xl">
      Visual Timer
    </h1>
    <div class="pb-10 text-center">
      <ProgressBar
        :percentage="timeRemainingPercentage"
        class="w-4/5 sm:w-3/5 md:w-2/5 max-w-sm h-full" />
    </div>
    <h2
      v-if="isTimerRunning"
      class="pb-8 flex justify-center">
      <div class="">
        <div class="pb-1 text-xs font-semibold uppercase tracking-wide text-grey-darker">
          Time remaining
        </div>
        <div class="text-3xl sm:text-5xl text-purple">
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
        <div class="pb-1 text-xs font-semibold uppercase tracking-wide text-grey-darker">
          Interval
        </div>
        <input
          ref="interval"
          v-model="interval"
          class="mb-8 py-2 px-4 w-24 bg-grey-lighter appearance-none rounded text-xl focus:outline-none focus:shadow-outline"
          type="number"
          min="1"
          max="120">
      </label>
      <button
        ref="start"
        class="py-2 px-4 text-xl tracking-wide font-light rounded shadow text-white bg-purple active:shadow-md focus:outline-none focus:shadow-outline"
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
        class="py-2 px-4 text-xl tracking-wide font-light rounded shadow text-grey-dark bg-transparent border border-grey-dark active:shadow-md focus:outline-none focus:shadow-outline"
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
    displayTimeRemaining() {
      if (this.isTimerRunning) {
        return datefns.distanceInWords(
          this.finishTime,
          this.now,
        );
      }
      return `${this.interval} ${this.interval > 1 ? 'minutes' : 'minute'}`;
    },
    timeRemaining() {
      if (this.isTimerRunning) {
        return datefns.differenceInSeconds(this.finishTime, this.now);
      }
      return 0;
    },
    timeRemainingPercentage() {
      return (this.timeRemaining / (this.interval * 60)) * 100;
    },
  },
  watch: {
    timeRemaining(newValue) {
      if (this.isTimerRunning && newValue <= 0) {
        this.handleStopTime();
        this.notifyTimerComplete();
      }
    },
  },
  mounted() {
    this.applyLocal();
    this.setNow();
    this.initializeNotify();
  },
  beforeDestroy() {
    this.clearNow();
  },
  methods: {
    applyLocal() {
      if (localStorage.startTime) {
        this.startTime = datefns.parse(localStorage.startTime);
      }
      if (localStorage.finishTime) {
        this.finishTime = datefns.parse(localStorage.finishTime);
      }
      if (localStorage.isTimerRunning) {
        this.isTimerRunning = Boolean(localStorage.isTimerRunning);
      }
      if (localStorage.interval) {
        this.interval = Number(localStorage.interval);
      }
    },
    clearLocal() {
      localStorage.removeItem('startTime');
      localStorage.removeItem('finishTime');
      localStorage.removeItem('isTimerRunning');
      localStorage.removeItem('interval');
    },
    clearNow() {
      clearInterval(this.nowInterval);
    },
    handleStartTime() {
      this.startTime = this.now;
      this.finishTime = datefns.addMinutes(this.now, this.interval);
      this.isTimerRunning = true;
      this.setLocal();
      this.$nextTick(() => this.$refs.stop.focus());
    },
    handleStopTime() {
      this.startTime = null;
      this.finishTime = null;
      this.isTimerRunning = false;
      this.clearLocal();
      this.$nextTick(() => this.$refs.interval.focus());
    },
    initializeNotify() {
      // Check if the feature exists
      if (window.Notification && Notification.permission !== 'denied') {
        // Only ask for permission for now
        Notification.requestPermission();
      }
    },
    notifyTimerComplete() {
      // Check if the feature exists
      if (window.Notification && Notification.permission !== 'denied') {
        // Process to do when given permission
        const process = (permission) => {
          if (permission === 'granted') {
            // ok we can show the permission
            const n = new Notification('⏰ Timer is complete');
            // autoclose notification
            setTimeout(n.close(), 4000);
          }
        };

        // Ask for permission and then do a process
        Notification.requestPermission((permission) => {
          process(permission);
        }).then((permission) => {
          process(permission);
        });
      }
    },
    setLocal() {
      localStorage.startTime = this.startTime;
      localStorage.finishTime = this.finishTime;
      localStorage.isTimerRunning = this.isTimerRunning;
      localStorage.interval = this.interval;
    },
    setNow() {
      this.nowFunc = () => this.now = new Date();
      this.nowInterval = setInterval(this.nowFunc, 1000);
    },
  },
};
</script>
