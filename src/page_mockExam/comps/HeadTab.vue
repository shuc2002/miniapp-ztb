<!--
* @desc 模拟考试顶部组件
* @author 江玉龙
* @date 2022年06月11日
-->
<template>
  <view>
    <view class="question-box">
      <!-- 题目信息 start  -->
      <p class="text-size-xxs">
        <text class="text-size-xl common-blue common-text-700">{{ questionNum }}</text>
        <text class="text-size-sn common-text-400">/</text>{{ sumNumber }}
      </p>
      <!-- 题目信息 end  -->
      <!-- 倒计时 start  -->
      <view class="flex-center" @tap="isStop ? start() : pause()" v-show="!showAnalysis">
        <view class="t-icon-shijian t-icon" />
        <view class="common-text common-text-400 text-size-sn flex-center">
          <view>{{ fillWithZero(timeData.hour + timeData.day * 24, 2) }}</view>
          <view>:</view>
          <view>{{ fillWithZero(timeData.minute, 2) }}</view>
          <view>:</view>
          <view>{{ fillWithZero(timeData.second, 2) }}</view></view
        >
      </view>
      <!-- 倒计时 end  -->
    </view>
    <PopupWindow ref="stop" title="休息一下" :canClose="false" @confirm="startDo()">
      <view class="text-size-main"
        >共{{ sumNumber }} 题，还剩
        <text class="common-blue">{{ sumNumber - questionNum }}</text> 题未做</view
      >
    </PopupWindow>
  </view>
</template>
<script>
  import PopupWindow from '@/components/PopupComp/PopupWindow.vue';
  import { toStart, toPause } from '@/api/modules/question/exam.ts';

  export default {
    name: 'headTab',
    props: {
      sumNumber: {
        type: Number,
      },
      questionNum: {
        type: Number,
        default: 0,
      },
      time: {
        type: Number,
        default: 0,
      },
      // 是否自动
      autoStart: {
        type: Boolean,
        default: true,
      },
    },
    components: { PopupWindow },
    data() {
      return {
        timer: null,
        isStop: false,
        timeData: {
          remain: 0,
          day: 0,
          hour: 0,
          minute: 0,
          second: 0,
        },
      };
    },
    computed: {
      code() {
        return this.$store.getters.getExamCode;
      },
      showAnalysis() {
        return this.$store.getters.getShowType == 1;
      },
    },
    watch: {
      time() {
        this.reset();
      },
    },
    methods: {
      // 设置timeData
      updateTimeData() {
        let t = this.timeData.remain;
        this.timeData.day = Math.floor(t / 1000 / 60 / 60 / 24);
        this.timeData.hour = Math.floor((t / 1000 / 60 / 60) % 24);
        this.timeData.minute = Math.floor((t / 1000 / 60) % 60);
        this.timeData.second = Math.floor((t / 1000) % 60);
      },

      // 开启倒计时
      startTimer() {
        if (this.timer) {
          clearInterval(this.timer);
        }
        if (this.timeData.remain < 1000) {
          return;
        }
        this.timer = setInterval(() => {
          this.timeData.remain -= 1000;
          this.updateTimeData();
          if (this.timeData.remain < 1000) {
            this.$emit('finish');
            clearInterval(this.timer);
            this.timer = null;
            this.isStop = true;
          }
        }, 1000);
      },

      // 重置倒计时
      reset() {
        this.timeData.remain = this.time;
        this.updateTimeData();
        if (this.autoStart) {
          this.start();
        }
      },

      // 暂停倒计时
      async pause() {
        if (this.timer) {
          await toPause(this.code);
          clearInterval(this.timer);
          this.timer = null;
          this.isStop = true;
          this.$refs.stop.showModal = true;
        }
      },
      async startDo() {
        await toStart(this.code);
        this.start();
      },
      // 开始倒计时
      async start() {
        if (this.timer) {
          return;
        }
        this.isStop = false;
        this.startTimer();
      },
      fillWithZero(num, n) {
        var len = num.toString().length;
        while (len < n) {
          num = '0' + num;
          len++;
        }
        return num;
      },
    },
    created() {
      this.reset();
    },
    // beforeDestroy() {
    //   this.pause();
    // },
  };
</script>
<style lang="scss" scoped>
  .question-box {
    padding: 48rpx 32rpx;
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 4rpx solid #f5f6fa;
  }
</style>
