<!--
* @desc 继续做题弹窗组件
* @author 江玉龙
* @date 2022年05月10日
-->
<template>
  <view>
    <view class="order-content" v-if="showModal" @tap.stop="cancel()">
      <view class="order-box" @tap.stop v-if="!showReset">
        <view class="common-text-700 text-size-xl text-item">做题记录</view>
        <view class="text-size-main common-text-400 text-item"
          >您上次做到了第 {{ problemNum }} 题</view
        >
        <view class="text-size-main common-text-400">请问是否继续？</view>
        <view class="flex nav-btn">
          <button class="cancel-btn" @tap.stop="noProceed()">重新练习</button>
          <button class="success-btn" @tap.stop="cancel()">继续做题</button>
        </view>
      </view>
      <view class="order-box" @tap.stop v-if="showReset">
        <view class="common-text-700 text-size-xl text-item">做题记录</view>
        <view class="text-size-main common-text-400 text-item">
          如果确定将会清除原做题数，请再次
        </view>
        <view class="text-size-main common-text-400">确定是否从第一题开始重新练习</view>
        <view class="flex nav-btn">
          <button class="cancel-btn" @tap.stop="cancel()">保留记录</button>
          <button class="success-btn" @tap.stop="cancel()">重新练习</button>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
  export default {
    name: 'proceedModal',
    components: {},
    props: {
      problemNum: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        showModal: false,
        showReset: false,
      };
    },
    methods: {
      cancel() {
        this.showModal = false;
        this.showReset = false;
      },
      noProceed() {
        this.showReset = true;
      },
    },
  };
</script>
<style lang="scss" scoped>
  .order-content {
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
    .order-box {
      width: 600rpx;
      height: 360rpx;
      border-radius: 24rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 60rpx;
      background: linear-gradient(-0.2deg, #ffffff 0%, #f7fafe 81%, #ebf1fd 100%);
      .text-item {
        margin-bottom: 16rpx;
      }
      .nav-btn {
        margin-top: 48rpx;
        .cancel-btn {
          width: 256rpx;
          height: 88rpx;
          border-radius: 24rpx;
          background: #ecedf1;
          color: #5b648d;
          font-size: 32rpx;
          font-weight: 700;
          margin-right: 16rpx;
          &:active {
            opacity: 0.8;
          }
        }
        .success-btn {
          width: 256rpx;
          height: 88rpx;
          border-radius: 24rpx;
          background: #475ffd;
          color: #ffffff;
          font-size: 32rpx;
          font-weight: 700;
          &:active {
            opacity: 0.8;
          }
        }
      }
    }
  }
</style>
