<!--
* @desc 支付组件
* @author 江玉龙
* @date 2022年04月21日
-->
<template>
  <view>
    <view class="pay-item" v-if="data.isExpired">
      <view class="expired-Btn flex-center">已过期</view></view
    >
    <view class="pay-item" v-else>
      <button class="button-integral" @tap="payIntegral()" v-if="data.status == 0">积分兑换</button>
      <view class="shelf-btn flex-center" v-if="data.status == 1">已售罄</view>
    </view>
    <view class="order-content" v-if="showModal" @tap.stop="cancel()">
      <view class="order-box" @tap.stop v-if="data.integral - integral <= 0 && !showIntegral">
        <view class="text-size-main common-text-700 text-item"
          >确定消耗{{ data.integral }}积分进行兑换吗？</view
        >
        <view class="text-size-main common-text-700 text-item">您当前有{{ integral }}积分</view>
        <view class="nav-btn">
          <button class="cancel-btn" @tap.stop="cancel()">取消</button>
          <button class="success-btn" @tap.stop="handleSuccess()">确定</button>
        </view>
      </view>
      <view class="order-box" @tap.stop v-if="data.integral - integral > 0 && !showIntegral">
        <view class="text-size-main common-text-700 text-item-second"
          >当前您的积分不足，去赚取积分吧</view
        >
        <view class="nav-btn">
          <button class="cancel-btn" @tap.stop="cancel()">取消</button>
          <button class="success-btn" @tap.stop="handleGet">赚取积分</button>
        </view>
      </view>
      <view class="integral-box" v-show="showIntegral">
        <p class="text-size-xl common-text-700 common-text exchange-box">兑换成功</p>
        <p class="text-size-main common-text-400 common-text exchange-item"
          >成功使用<span class="integral-item">{{ data.integral }}</span
          >积分兑换</p
        >
        <p class="text-size-xxs common-text-400 common-tip"
          >当前剩余{{
            ((integral * 100 - data.integral * 100) / 100).toFixed(0)
          }}积分，可完成任务赚取积分</p
        >
      </view>
    </view>
  </view>
</template>
<script>
  import { throttle } from '@/page_commodity/courseList/util';
  import { integralPay } from '@/api/modules/order/index';
  export default {
    name: 'IntegralPay',
    components: {},
    data() {
      return {
        showModal: false,
        showIntegral: false,
      };
    },
    computed: {
      system() {
        return this.$store.getters.getSystem;
      },
    },
    props: {
      data: {
        type: Object,
      },
      integral: {
        type: Number,
        default: 0,
      },
    },
    methods: {
      // 积分兑换按钮
      payIntegral() {
        this.showModal = true;
      },
      // 关闭弹窗
      cancel() {
        this.showModal = false;
        this.showIntegral = false;
      },
      // 确认积分支付
      handleSuccess: throttle(async function() {
        if (this.data.type == 3) {
          this.cancel();
          uni.navigateTo({
            url: `/page_commodity/order/pages/integralBuyOrder?commodityId=${this.data.id}`,
          });
        } else {
          const res = await integralPay({ commodityId: this.data.id, addressId: '' });
          if (res.code === 1000) {
            this.showIntegral = true;
            setTimeout(() => {
              uni.navigateTo({
                url: '/page_commodity/order/pages/orderIntegral',
              });
              this.cancel();
            }, 2000);
          }
        }
      }, 300),
      // 获取积分
      handleGet() {
        uni.navigateTo({
          url: '/business/integral/index',
        });
        this.cancel();
      },
    },
  };
</script>
<style lang="scss" scoped>
  .pay-item {
    width: 750rpx;
    height: 180rpx;
    background-color: white;
    position: fixed;
    bottom: 0;
    display: flex;
    flex-wrap: nowrap;
    flex-flow: row-reverse;
  }
  .button-integral {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 686rpx;
    height: 96rpx;
    border-radius: 80rpx;
    font-size: 32rpx;
    font-weight: 700;
    color: #ffffff;
    background: linear-gradient(140.2deg, #ff8058 0%, #ff6969 100%);
    margin: 16rpx 32rpx;
  }
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
      width: 602rpx;
      height: 300rpx;
      border-radius: 24rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 60rpx;
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
    }
  }
  .text-item-second {
    margin-top: 60rpx;
    margin-bottom: 24rpx;
    color: #2c364e;
  }
  .integral-box {
    width: 622rpx;
    height: 680rpx;
    background-image: url(https://app.static.wangxiao.cn/ztb/jifeng.png);
    background-size: 100% 92%;
    text-align: center;
    background-repeat: no-repeat;
    margin-top: -400rpx;
    .exchange-box {
      margin-top: 348rpx;
    }
    .exchange-item {
      margin-top: 60rpx;
      margin-bottom: 24rpx;
      .integral-item {
        color: #f0522f;
        margin: 0 16rpx;
      }
    }
  }
  .shelf-btn {
    width: 686rpx;
    height: 96rpx;
    font-size: 32rpx;
    font-weight: 700;
    color: #ffffff;
    background-color: #989ead;
    border-radius: 80rpx;
    margin: 16rpx 32rpx;
  }
  .expired-Btn {
    width: calc(100% - 64rpx);
    font-size: 32rpx;
    height: 96rpx;
    border-radius: 80rpx;
    font-weight: 700;
    color: #fff;
    margin: auto;
    background-color: #989ead;
  }
</style>
