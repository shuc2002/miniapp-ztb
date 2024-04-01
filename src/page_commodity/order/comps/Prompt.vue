<template>
  <view class="top-item">
    <!-- 状态显示 -->
    <view class="flex refund-box" v-if="status == 3 || status == 0">
      <view>
        <image
          src="@/page_commodity/static/order/refund.png"
          v-show="status == 3"
          class="img-style"
        />
        <image
          src="@/page_commodity/static/order/pending.png"
          v-show="status == 0"
          class="img-style"
        />
      </view>
      <view class="icon-item-box">
        <view class="common-text-700 w-full text-size-main"
          >{{ status == 3 ? '售后中' : '待支付' }}
        </view>
        <view class="common-text-400 common-tip text-size-sn">
          {{ status == 3 ? '已提交申请，帮您处理中' : '30分钟后未支付，订单自动关闭' }}
        </view>
      </view>
    </view>
    <!-- 退款 -->
    <view class="flex refund-box" v-if="status == 2 || status == 4">
      <view>
        <image src="@/page_commodity/static/order/close.png" class="img-style" />
      </view>
      <view class="icon-item-box">
        <view class="common-text-700 w-full text-size-main">已关闭</view>
        <view class="common-text-400 common-tip text-size-sn"> 订单已经关闭 </view>
      </view>
    </view>
    <!-- 付款成功显示 -->
    <view class="flex refund-box" v-if="showSuccess && status == 1 && expressStatus < 0">
      <view>
        <image src="@/page_commodity/static/order/pay.png" class="img-style" />
      </view>
      <view class="icon-item-box">
        <view class="common-text-700 w-full text-size-main">付款成功</view>
        <view class="common-text-400 common-tip text-size-sn"> 您已成功购买，快开始学习吧~ </view>
      </view>
    </view>
    <!-- 付款成功显示 -->
    <view
      class="flex refund-box"
      v-if="(status == 1 && expressStatus == 1) || (status == 1 && expressStatus == 0)"
    >
      <view>
        <image src="@/page_commodity/static/order/receipt.png" class="img-style" />
      </view>
      <view class="icon-item-box">
        <view class="common-text-700 w-full text-size-main">{{
          expressStatus == 1 ? '待收货' : '待发货'
        }}</view>
        <view class="common-text-400 common-tip text-size-sn">已购买成功，请耐心等待到货</view>
      </view>
    </view>
  </view>
</template>
<script>
  export default {
    name: 'prompt',
    props: {
      status: {
        type: Number,
        default: 0,
      },
      expressStatus: {
        type: Number,
        default: -1,
      },
      showSuccess: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>
<style lang="scss" scoped>
  .top-item {
    padding-top: 64rpx;
  }
  .refund-box {
    margin: 0 60rpx 20rpx 60rpx;
  }
  .icon-item-box {
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
    padding: 12rpx 12rpx;
  }
  .img-style {
    width: 112rpx;
    height: 112rpx;
    margin-right: 22rpx;
  }
  .text-cancel {
    font-size: 36rpx;
    line-height: 90rpx;
  }
</style>
