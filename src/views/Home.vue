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
        <div class="font-normal text-3xl sm:text-5xl text-purple">
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
    <a
      aria-label="View source on GitHub"
      class="github-corner"
      href="https://github.com/coltborg/visual-timer"
      rel="noopener noreferrer"
      target="_blank">
      <svg
        aria-hidden="true"
        height="80"
        style="fill: hsl(268, 82%, 60%); color:hsl(210, 36%, 96%); position: absolute; top: 0; border: 0; right: 0;"
        viewBox="0 0 250 250"
        width="80">
        <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
        <path
          class="octo-arm"
          d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
          fill="currentColor"
          style="transform-origin: 130px 106px;" />
        <path
          class="octo-body"
          d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
          fill="currentColor" />
      </svg>
    </a>
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
    timeRemainingPercentage(newValue) {
      if (newValue > 0 && newValue <= 25) {
        this.changeFavicon('/favicon-quarter.ico');
      } else if (newValue > 25 && newValue <= 50) {
        this.changeFavicon('/favicon-half.ico');
      } else if (newValue > 50 && newValue <= 75) {
        this.changeFavicon('/favicon-three-quarters.ico');
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
    changeFavicon(newPath) {
      const favicon = document.querySelector('link[rel="icon"]');
      const currentPath = favicon.getAttribute('href');

      // If no update is required, abort
      if (newPath === currentPath) {
        return;
      }

      favicon.setAttribute('href', newPath);
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
      this.changeFavicon('/favicon-full.ico');
      this.$nextTick(() => this.$refs.stop.focus());
    },
    handleStopTime() {
      this.startTime = null;
      this.finishTime = null;
      this.isTimerRunning = false;
      this.clearLocal();
      this.changeFavicon('/favicon-empty.ico');
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
