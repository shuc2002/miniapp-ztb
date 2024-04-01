<!-- 首页订单弹窗 -->
<template>
  <view>
    <view class="popup-mask" v-if="showModal" @tap.stop="cancel()">
      <view class="popup-box" @tap.stop>
        <image :src="avatar" mode="scaleToFill" class="avatar" />
        <p class="text-size-main common-text-700 common-text text-item">{{ nickName }}</p>
        <p class="common-text-400 text-size-sn common-text"
          >你有{{ order.number }}笔订单还未支付，请尽快支付</p
        >
        <image :src="order.thumbnail" mode="aspectFit" class="order-img" />
        <view class="common-text-400 text-size-sn common-text time-text"
          >订单将在
          <NewCountdown
            backgroundColor="#323949"
            textColor="#ffffff"
            :remain="order.timeRemaining ? order.timeRemaining : 0"
            :showBox="true"
          />关闭
        </view>
        <!-- 底部按钮 -->
        <view class="nav-btn">
          <button class="cancel-btn flex-center" @tap.stop="cancel()">放弃</button>
          <button class="success-btn flex-center" @tap.stop="toPay(order.orderId)">继续支付</button>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
  import NewCountdown from '@/components/Countdown/NewCountdown.vue';
  import { getOrderDetail } from '@/api/modules/order/index.ts';
  export default {
    name: 'OrderModel',
    components: { NewCountdown },
    data() {
      return {
        showModal: false,
      };
    },
    props: {
      order: {
        type: Object,
      },
    },
    computed: {
      nickName() {
        return this.$store.getters.getNickName;
      },
      avatar() {
        return this.$store.getters.getAvatar;
      },
    },
    methods: {
      // 关闭弹窗
      cancel() {
        this.showModal = false;
        this.$emit('cancel');
      },
      //去支付
      async toPay(id) {
        const data = await getOrderDetail({ id });
        if (data.body.commodities[0].type == 3) {
          uni.navigateTo({
            url: `/page_commodity/order/pages/entityDetail?id=${id}`,
          });
        } else {
          uni.navigateTo({
            url: `/page_commodity/order/pages/orderDetails?id=${id}`,
          });
        }
        this.showModal = false;
      },
    },
  };
</script>
<style lang="scss" scoped>
  .popup-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999999999999;
    .popup-box {
      position: relative;
      width: calc(100vw - 150rpx);
      border-radius: 24rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: linear-gradient(-0.2deg, #ffffff 0%, #f7fafe 81%, #ebf1fd 100%);
      padding-bottom: 30rpx;
      .text-item {
        margin-top: 96rpx;
        margin-bottom: 16rpx;
        color: #2c364e;
      }
      .time-text {
        display: flex;
      }
      .order-img {
        margin: 32rpx 50rpx;
        max-width: 200rpx;
        height: 200rpx;
        object-fit: cover;
      }
      .nav-btn {
        display: flex;
        margin-top: 48rpx;
        .cancel-btn {
          width: 244rpx;
          height: 88rpx;
          line-height: 88rpx;
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
          line-height: 88rpx;
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
        border-radius: 24rpx;
        background: #475ffd;
        color: #ffffff;
        font-size: 32rpx;
        font-weight: 700;
        margin-top: 48rpx;
        &:active {
          opacity: 0.8;
        }
      }
    }
  }
  .avatar {
    width: 144rpx;
    height: 144rpx;
    border-radius: 50%;
    position: absolute;
    top: -72rpx;
    right: calc(50% - 72rpx);
  }
</style>
