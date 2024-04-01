<!-- 没有回放的空白页面 -->
<template>
  <view class="page-bg-1">
    <view class="no-replay-box">
      <image class="no-replay-img" src="@/static/img/empty/course.svg" />
      <view class="no-replay-text">视频正在转码中,请稍等</view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'noReplay',
    //   components: {
    //     PopupWindow,
    //   },
    data() {
      return {
        list: [],
        day: 0,
      };
    },
  };
</script>

<style lang="scss" scoped>
  .page-bg-1 {
    height: 100vh;
    width: 100vw;
    background-color: #f1f3f7;
    .no-replay-box {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -80%);
      .no-replay-img {
        height: 344rpx;
        width: 344rpx;
      }
      .no-replay-text {
        color: #9fa1a4;
        font-size: 28rpx;
        font-weight: 400;
        font-family: 'PingFang SC';
        text-align: center;
        line-height: 28rpx;
      }
    }
  }
</style>
