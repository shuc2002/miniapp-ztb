<template>
  <view>
    <view
      class="common-text-400 text-size-xxs common-price discount-box"
      v-if="item.type == 0 && item.requirement > 0"
      >{{ '满' + item.requirement + '减' + item.discount }}</view
    >
    <view
      class="common-text-400 text-size-xxs common-price discount-box"
      v-if="item.type == 1 && item.requirement > 0"
      >{{ '满' + item.requirement + '元' + item.discount + '折' }}</view
    >
    <view
      class="common-text-400 text-size-xxs common-price discount-box"
      v-if="item.type == 0 && item.requirement == 0"
      >{{ '无门槛减' + item.discount }}</view
    >
    <view
      class="common-text-400 text-size-xxs common-price discount-box"
      v-if="item.type == 1 && item.requirement == 0"
      >{{ '无门槛' + item.discount + '折' }}</view
    >
  </view>
</template>
<script>
  export default {
    name: 'couponName',
    props: {
      item: {
        type: Object,
      },
    },
  };
</script>
<style lang="scss" scoped>
  .discount-box {
    padding: 20rpx 10rpx;
    border: 2rpx solid #f0522f;
    border-radius: 10rpx;
    margin-right: 24rpx;
  }
</style>
