<template>
  <view class="integral-content" v-if="showModal" @tap.stop="cancel()">
    <view class="integral-get">
      <p class="common-text-600 exchange-box">温馨提示</p>
      <view class="text-box">
        <p class="text-size-main common-text-400 ">尊敬的学员:</p>
        <p class="text-size-main common-text-400 "
          >为保障您的消费权益，请实名签署<br />《产品协议》，否则无法学习哦~</p
        >
      </view>

      <view class="nav-btn">
        <view class="cancel-btn flex-center" @tap.stop="cancel()">关闭</view>
        <view class="success-btn flex-center" @tap.stop="confirm()">签署协议</view>
      </view>
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
      confirm() {
        this.showModal = false;
        this.$emit('confirm');
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
    z-index: 1000;
    .integral-get {
      width: 622rpx;
      height: 688rpx;
      background-image: url(https://acc.wangxiao.cn/image/app/xieyi2.png);
      background-size: 100% 92%;
      text-align: center;
      background-repeat: no-repeat;
      margin-top: -200rpx;
      padding: 0 48rpx;
      .text-box {
        text-align: left;
        line-height: 56rpx;
        color: #333333;
      }
      .exchange-box {
        margin-top: 200rpx;
        margin-bottom: 16rpx;
        color: #8c513e;
        font-size: 44rpx;
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
  .nav-btn {
    display: flex;
    justify-content: space-between;
    margin-top: 48rpx;
    .cancel-btn {
      width: 244rpx;
      height: 96rpx;
      line-height: 96rpx;
      border-radius: 72rpx;
      background: #ffffff;
      color: #4e5969;
      font-size: 32rpx;
      font-weight: 600;
      border: 2rpx solid #ecedf1;
      padding: 0 !important;
      &:active {
        opacity: 0.8;
      }
    }
    .success-btn {
      width: 244rpx;
      height: 96rpx;
      line-height: 96rpx;
      border-radius: 72rpx;
      background: #e51600;
      color: #ffffff;
      font-size: 32rpx;
      font-weight: 600;
      padding: 0 !important;
      &:active {
        opacity: 0.8;
      }
    }
  }
</style>
