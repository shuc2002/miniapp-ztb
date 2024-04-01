<!--
* @desc 圆型进度条
* @author daisitin
* @date 2022年04月25日
-->
<template>
  <view class="progress-box">
    <!-- 圆形进度条 start -->
    <view class="pie">
      <view class="circle" />
      <view class="left">
        <view class="left-deg" :style="{ transform: 'rotate(' + leftDeg + 'deg)' }" />
      </view>
      <view class="right">
        <view class="right-deg" :style="{ transform: 'rotate(' + rightDeg + 'deg)' }" />
      </view>
    </view>
    <!-- 圆形进度条 end -->
    <view v-if="hasText" class="progress-text">
      <p class="common-text-700 text-size-main">正确率：{{ proportion + '%' }}</p>
    </view>
  </view>
</template>
<script>
  export default {
    name: 'progressLine',
    props: {
      hasText: {
        type: Boolean,
        default: true,
      },
      proportion: {
        type: Number,
        default: 0,
      },
    },
    computed: {
      leftDeg() {
        return this.proportion >= 50 ? 36 * this.proportion - 360 : '-180';
      },
      rightDeg() {
        return this.proportion >= 50 ? 0 : 36 * this.proportion - 180;
      },
    },
    data() {
      return {};
    },
    methods: {},
  };
</script>
<style lang="scss" scoped>
  .progress-box {
    margin: 48rpx auto;
    align-items: center;
    display: flex;
    justify-content: center;
    .progress-text {
      margin-left: 16rpx;
    }
  }
  // 圆形进度条 start
  .pie {
    width: 48rpx;
    height: 48rpx;
    border-radius: 50%;
    background: #dae2ff;
    position: relative;
  }
  .circle {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 100;
    transform: translate(-50%, -50%);
    width: 24rpx;
    height: 24rpx;
    background: white;
    border-radius: 50%;
  }
  .left,
  .right {
    width: 24rpx;
    height: 48rpx;
    float: left;
    overflow: hidden;
  }
  .left {
    border-radius: 48rpx 0 0 48rpx;
  }
  .right {
    border-radius: 0 48rpx 48rpx 0;
  }
  .left-deg,
  .right-deg {
    width: 24rpx;
    height: 48rpx;
    background: #475ffd;
  }
  .left-deg {
    transform-origin: right center;
    transform: rotate(-180deg);
  }
  .right-deg {
    transform-origin: left center;
    transform: rotate(0deg);
  }
  // 圆形进度条 end
</style>
