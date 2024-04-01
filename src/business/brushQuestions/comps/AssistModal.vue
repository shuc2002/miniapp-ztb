<!--
* @desc 打卡记录弹窗组件
* @author 江玉龙
* @date 2022年05月31日
-->
<template>
  <view>
    <view class="order-content" v-if="showModal" @tap.stop="cancel()">
      <view class="order-box-repair" @tap.stop v-if="!ifHelp" style="height: 416rpx">
        <p class="text-size-xl common-text-700 common-text text-item">补卡</p>
        <p class="text-size-main common-text-400 common-text text-item-2"
          >确定消耗10积分进行打卡吗？</p
        >
        <view class="text-size-main common-text-400 common-text text-item-2"
          >您当前有{{ integral }}积分</view
        >
        <view class="nav-btn">
          <button class="cancel-btn flex-center" @tap.stop="cancel()">取消</button>
          <button class="success-btn flex-center" @tap.stop="handleSuccess()">确定</button>
        </view>
      </view>
      <view class="order-box" @tap.stop v-if="ifHelp" style="height: 460rpx">
        <view class="text-size-xl common-text-700 common-text text-item">帮助</view>
        <view class="help-box">
          <p class="text-size-main common-text-400 common-text">1、补卡：每次补卡消耗10积分。 </p>
          <p class="text-size-main common-text-400 common-text"
            >2、坚持做题天数越多获得的积分奖励越多。</p
          >
        </view>
        <button class="help-btn flex-center" @tap.stop="cancel()">我知道了</button>
      </view>
    </view>
  </view>
</template>
<script>
  export default {
    name: 'assistModal',
    components: {},
    data() {
      return {
        showModal: false,
      };
    },
    props: {
      data: {
        type: Object,
      },
      ifHelp: {
        type: Boolean,
        default: false,
      },
      integral: {
        type: Number,
        default: 0,
      },
    },
    methods: {
      // 关闭弹窗
      cancel() {
        this.showModal = false;
      },
      // 确认积分支付
      handleSuccess() {
        this.$emit('handlePay');
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
    .order-box-repair {
      width: 602rpx;
      border-radius: 24rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 64rpx;
      margin-bottom: 60rpx;
      // background: linear-gradient(-0.2deg, #ffffff 0%, #f7fafe 81%, #ebf1fd 100%);
      background: #ffffffff;
      .text-item {
        margin-bottom: 16rpx;
        color: #2c364e;
      }
      .text-item-2 {
        color: #2c364e;
      }
      .nav-btn {
        display: flex;
        margin-top: 48rpx;
        .cancel-btn {
          width: 245rpx;
          height: 96rpx;
          // border-radius: 24rpx;
          border-radius: 72rpx;
          border: 2rpx solid #ecedf1ff;
          // background: #ecedf1;
          background: #ffffffff;
          // color: #5b648d;
          color: #333333ff;
          font-size: 32rpx;
          font-weight: 600;
          margin-right: 16rpx;
          &:active {
            opacity: 0.8;
          }
        }
        .success-btn {
          width: 245rpx;
          height: 96rpx;
          border-radius: 72rpx;
          background: #e51600ff;
          color: #ffffff;
          font-size: 32rpx;
          font-weight: 600;
          &:active {
            opacity: 0.8;
          }
        }
      }
      .help-btn {
        width: 506rpx;
        height: 96rpx;
        // border-radius: 24rpx;
        // background: #475ffd;
        border-radius: 72rpx;
        background: #E51600;
        color: #ffffff;
        font-size: 32rpx;
        font-weight: 600;
        margin-top: 48rpx;
        margin-bottom: 56rpx;
        &:active {
          opacity: 0.8;
        }
      }
    }
    .order-box {
      width: 602rpx;
      border-radius: 24rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 60rpx;
      margin-bottom: 60rpx;
      background: linear-gradient(-0.2deg, #ffffff 0%, #f7fafe 81%, #ebf1fd 100%);
      .text-item {
        margin-bottom: 16rpx;
        color: #2c364e;
      }
      .nav-btn {
        display: flex;
        margin-top: 48rpx;
        .cancel-btn {
          width: 244rpx;
          height: 88rpx;
          border-radius: 24rpx;
          background: #ecedf1;
          color: #5b648d;
          font-size: 32rpx;
          font-weight: 700;
          margin-right: 18rpx;
          &:active {
            opacity: 0.8;
          }
        }
        .success-btn {
          width: 244rpx;
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
      .help-btn {
        width: 506rpx;
        height: 96rpx;
        // border-radius: 24rpx;
        // background: #475ffd;
        border-radius: 72rpx;
        background: #E51600;
        color: #ffffff;
        font-size: 32rpx;
        font-weight: 600;
        margin-top: 48rpx;
        margin-bottom: 56rpx;
        &:active {
          opacity: 0.8;
        }
      }
    }
  }
  .help-box {
    margin-left: 48rpx;
    margin-right: 48rpx;
    // p {
    //   // margin-bottom: 16rpx;
    // }
  }
</style>
