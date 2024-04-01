<!--
* @desc 新的倒计时组件
* @author 江玉龙
* @date 2022年07月21日
-->
<template>
  <view>
    <view
      :style="{ color: textColor, fontSize: textSize, fontWeight: textWeight }"
      v-if="!showBox"
      >{{ timeData.hour + hourUnit + timeData.minute + minuteUnit + timeData.second }}</view
    >
    <view
      class="time-item"
      :style="{
        '--text-color': textColor,
        '--color': backgroundColor,
        '--fg-color': fgColor,
        fontSize: textSize,
        fontWeight: textWeight,
      }"
      v-if="showBox"
    >
      <span class="time-clock">{{ timeData.hour }}时</span
      ><span class="time-clock">{{ timeData.minute }}分</span
      ><span class="time-clock">{{ timeData.second }}秒</span
      ><span v-if="showMs"
        >:<span class="time-clock">{{ timeData.msecond }}</span></span
      >
    </view>
  </view>
</template>

<script>
  export default {
    props: {
      backgroundColor: {
        type: String,
        default: '#fff',
      },
      textColor: {
        type: String,
        default: '#E51600',
      },
      //冒号的颜色
      fgColor: {
        type: String,
        default: '#323949',
      },
      remain: {
        type: Number,
        default: 0,
      },
      showBox: {
        type: Boolean,
        default: true,
      },
      showMs: {
        type: Boolean,
        default: false,
      },
      textSize: {
        type: String,
        default: '24rpx',
      },
      textWeight: {
        type: Number,
        default: 500,
      },
      hourUnit: {
        type: String,
        default: ':',
      },
      minuteUnit: {
        type: String,
        default: ':',
      },
    },
    data() {
      return {
        timer: null,
        timeData: {
          hour: 0,
          minute: 0,
          second: 0,
          msecond: 0,
        },
      };
    },
    methods: {
      // 时间补全 0
      checkTime(i) {
        if (i < 10) {
          i = '0' + i;
        }
        return i;
      },

      // 拿到时分秒
      updateTimeData(t) {
        let hour = Math.floor(t / 1000 / 60 / 60);
        let minute = Math.floor((t / 1000 / 60) % 60);
        let second = Math.floor((t / 1000) % 60);
        let msecond = Math.floor(t % 1000);

        this.timeData.hour = this.checkTime(hour);
        this.timeData.minute = this.checkTime(minute);
        this.timeData.second = this.checkTime(second);
        this.timeData.msecond = msecond;
      },

      // 开启倒计时
      startTimer() {
        if (this.timer) {
          clearInterval(this.timer);
        }
        if (this.remain < 1000) {
          return;
        }
        let timeDown = this.remain;
        this.timer = setInterval(() => {
          timeDown -= 1000;
          this.updateTimeData(timeDown);
          if (timeDown < 1000) {
            clearInterval(this.timer);
            this.$emit('endTime');
          }
        }, 1000);
      },

      // 重置倒计时
      reset() {
        this.updateTimeData(this.remain);
        this.start();
      },

      // 暂停倒计时
      pause() {
        if (this.timer) {
          clearInterval(this.timer);
          this.timer = null;
        }
      },

      // 开始倒计时
      start() {
        if (this.timer) {
          return;
        }
        this.startTimer();
      },
    },
    // 页面加载时开始
    mounted() {
      this.reset();
    },
    // 页面销毁时结束
    beforeDestroy() {
      this.pause();
    },
  };
</script>
<style lang="scss" scoped>
  $color: var(--color);
  $textColor: var(--text-color);
  $fgColor: var(--fg-color);
  .time-item {
    text-align: center;
    color: $fgColor;
  }
  .time-clock {
    border-radius: 8rpx;
    background: $color;
    color: $textColor;
    //   margin-left: 10rpx;
    //   margin-right: 10rpx;
    // padding: 2rpx 6rpx;
  }
</style>
