<!--
* @desc 打卡记录
* @author 江玉龙
* @date 2022年05月30日
-->
<template>
  <view class="common-bg">
    <!-- 日历组件 -->
    <view class="punch-bg">
      <PunchCalendar
        @handleHelp="handleHelp()"
        @handleRepair="handleRepair()"
        :signeddates="calenderData.records"
      />
    </view>
    <!-- 加入天数和坚持天数 -->
    <view class="flex">
      <view class="day-box">
        <view class="text-size-xxs common-text-400 common-text">总共加入天数</view>
        <view class="day-item">
          <view>
            <span class="day-num">{{ calenderData.since }}</span>
            <span class="text-size-xxs common-text-400 common-text">天</span>
          </view>
          <!-- <view class="img-style t-icon t-icon-jiarutianshu" /> -->
          <view class="img-style iconfont icon-jiarutianshu" />
        </view>
      </view>
      <view class="day-box">
        <view class="text-size-xxs common-text-400 common-text">已经坚持天数</view>
        <view class="day-item">
          <view>
            <span class="day-num">{{ calenderData.total }}</span>
            <span class="text-size-xxs common-text-400 common-text">天</span>
          </view>
          <view class="img-style iconfont icon-jianchitianshu" />
        </view>
      </view>
    </view>
    <!-- 补签和帮组弹窗 -->
    <AssistModal ref="repair" :ifHelp="ifHelp" :integral="integral" @handlePay="handlePay()" />
  </view>
</template>
<script>
  import PunchCalendar from './comps/PunchCalendar.vue';
  import AssistModal from './comps/AssistModal.vue';
  import { getCalendar, replaceCard } from '@/api/modules/question/exercise.ts';
  import { getIntegralNum } from '@/api/modules/order/index';
  export default {
    name: 'punchIn',
    components: { PunchCalendar, AssistModal },
    onLoad() {
      this.getCalendar();
      this.getIntegralNum();
    },
    data() {
      return {
        ifHelp: false, // 判断是否是帮助弹窗
        calenderData: {}, // 日历
        integral: 0,
        day: 0,
      };
    },
    methods: {
      // 获取我的积分
      async getIntegralNum() {
        const data = await getIntegralNum();
        this.integral = data.body;
      },
      // 日历数据
      async getCalendar() {
        const res = await getCalendar();
        this.calenderData = res.body;
      },
      // 帮助图片点击
      handleHelp() {
        this.ifHelp = true;
        this.$refs.repair.showModal = true;
      },
      // 补卡点击
      handleRepair(e) {
        // 暂时去除补卡
        console.log(e);
        // let now = new Date();
        // // console.log(e.date);
        // // console.log('--');
        // // console.log(now.getDate() - this.calenderData.since);
        // if (now.getDate() - this.calenderData.since < e.date) {
        //   this.day = e.date;
        //   this.ifHelp = false;
        //   this.$refs.repair.showModal = true;
        // };
      },
      // 确认积分支付
      async handlePay() {
        const code = await replaceCard({ day: this.day });
        this.$refs.repair.showModal = false;
        this.$store.commit('setDailyCode', code.body);
        uni.navigateTo({
          url: `/business/brushQuestions/index?code=${code.body}`,
        });
        this.getCalendar();
        this.getIntegralNum();
      },
    },
  };
</script>
<style lang="scss" scoped>
  .punch-bg {
    background-color: #ffffff;
    border-bottom-left-radius: 40rpx;
    border-bottom-right-radius: 40rpx;
  }
  .day-box {
    // width: 260rpx;
    // height: 132rpx;
    width: 316rpx;
    height: 214rpx;
    border-radius: 24rpx;
    padding: 32rpx;
    background-color: #ffffff;
    margin-left: 38rpx;
    margin-top: 48rpx;
    .day-item {
      margin-top: 28rpx;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      .day-num {
        font-size: 64rpx;
        font-weight: 700;
        color: #323949;
        margin-right: 16rpx;
      }
      .img-style {
        width: 64rpx;
        height: 64rpx;
        font-size: 64rpx;
        color: red;
        margin-bottom: 12rpx;
      }
    }
  }
</style>
