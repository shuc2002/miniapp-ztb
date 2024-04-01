<template>
  <view class="integral-content" v-if="showModal" @tap.stop="cancel()">
    <view class="integral-get">
      <p class="text-size-4xl common-text-700 common-price exchange-box">{{ '+' + num }}</p>
      <p class="text-size-xl common-text-700 common-text">{{ name }}</p>
      <p class="text-size-xl common-text-700 common-text">任务完成</p>
      <p class="text-size-main common-text-400 common-text exchange-item"
        >恭喜获得<span class="integral-item">{{ num }}</span
        >积分</p
      >
    </view>
  </view>
</template>
<script>
  export default {
    name: 'getIntegral',
    props: {
      num: {
        type: Number,
        default: 0,
      },
      name: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        showModal: false,
      };
    },
    methods: {
      // 关闭弹窗
      cancel() {
        this.showModal = false;
      },
    },
  };
</script>
<style lang="scss" scoped>
  .integral-content {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99;
    .integral-get {
      width: 622rpx;
      height: 680rpx;
      background-image: url(https://app.static.wangxiao.cn/ztb/jifeng.png);
      background-size: 100% 92%;
      text-align: center;
      background-repeat: no-repeat;
      margin-top: -240rpx;
      .exchange-box {
        margin-top: 316rpx;
        margin-bottom: 16rpx;
      }
      .exchange-item {
        margin-top: 32rpx;
        .integral-item {
          color: #f0522f;
          margin: 0 16rpx;
        }
      }
    }
  }
</style>
