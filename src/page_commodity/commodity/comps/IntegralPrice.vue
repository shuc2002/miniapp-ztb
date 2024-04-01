<!--
* @desc 积分价格组件
* @author 江玉龙
* @date 2022年05月27日
-->
<template>
  <view>
    <!-- 价格 -->
    <view class="price-item">
      <image src="@/home/static/img/shop/integral.png" />
      <view class="text-size-xl common-text common-text-700">{{ data.integral }}</view>
    </view>
  </view>
</template>
<script>
  export default {
    name: 'integralPrice',
    props: {
      data: {
        type: Object,
      },
      timeData: {
        type: Number,
        default: 0,
      },
    },
  };
</script>
<style lang="scss" scoped>
  .price-item {
    height: 88rpx;
    padding: 0 24rpx;
    display: flex;
    align-items: center;
    image {
      width: 40rpx;
      height: 40rpx;
      margin-right: 8rpx;
    }
  }
</style>
