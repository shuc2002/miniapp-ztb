<!--
* @desc 价格栏组件
* @author 江玉龙
* @date 2022年04月20日
-->
<template>
  <view>
    <view class="price-box" v-if="data.type == 3">
      <!-- 原价，优惠价及销售数量 -->
      <view class="price-item" v-if="!system">
        <span class="common-main">￥</span>
        <view>
          <span class="common-main text-size-xxl">{{
            data.activityType == 3 || data.activityType == 2
              ? activity.amount
                ? activity.amount
                : data.price
              : data.price
          }}</span>
          <span class="common-main across-line text-opacity text-size-xxs"
            >￥{{ data.linePrice }}</span
          >
        </view>
        <span class="unclocked-box" v-if="data.salesVolume > 50"
          >已售 {{ data.salesVolume }}件</span
        >
      </view>
      <!-- 题库商品倒计时 v-if="data.activityType == 3 && activity.amount"-->
      <view class="countdown" v-if="data.activityType == 3">
        <span class="t-icon t-icon-a-1 icon-item"></span>
        <span class="text-size-xxs common-text-700">限时秒杀</span>
        <NewCountdown
          backgroundColor="#323949"
          textColor="#ffffff"
          :remain="timeData"
          :showBox="true"
          class="w-full"
        />
      </view>
      <!-- 课程商品图片 -->
      <view
        class="t-icon t-icon-shangpin exist-img"
        v-if="data.activityType != 3 || !activity.amount"
      />
      <view class="opacity-text" v-if="data.activityType != 3 || !activity.amount">通关必备</view>
    </view>
  </view>
</template>
<script>
  import NewCountdown from '@/components/Countdown/NewCountdown.vue';
  export default {
    name: 'Price',

    props: {
      data: {
        type: Object,
      },
      activity: {
        type: Object,
      },
      timeData: {
        type: Number,
        default: 0,
      },
    },
    components: {
      NewCountdown,
    },
    computed: {
      system() {
        return this.$store.getters.getSystem;
      },
    },
  };
</script>
<style lang="scss" scoped>
  .price-box {
    display: flex;
    height: 108rpx;
    align-items: center;
    padding-left: 24rpx;
    background: linear-gradient(140.2deg, #ff4c34 0%, #ff4a4a 100%);
    justify-content: space-between;
    position: relative;
  }
  .price-item {
    display: flex;
    height: 108rpx;
    align-items: center;
  }
  .unclocked-box {
    padding: 5rpx 10rpx;
    text-align: center;
    border-radius: 56rpx;
    background: #ffee83;
    color: #8c513e;
    font-size: 20rpx;
    margin-left: 20rpx;
  }

  .text-opacity {
    opacity: 0.7;
  }

  .countdown {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    width: 256rpx;
    height: 108rpx;
    border-top-left-radius: 38px;
    float: right;
    background: linear-gradient(270deg, #ffe3db 0%, #fff0eb 100%);
    position: absolute;
    right: 0;
    z-index: 100;
  }

  .exist-img {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    float: right;
    width: 166rpx;
    height: 108rpx;
    margin-right: 20rpx;
    opacity: 0.1;
  }
  .opacity-text {
    position: absolute;
    right: 47rpx;
    color: #ffffff;
    font-size: 28rpx;
  }
  .icon-item {
    margin-right: 6rpx;
    margin-top: 4rpx;
  }
</style>
