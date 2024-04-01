<!--
* @desc 商品介绍组件
* @author 江玉龙
* @date 2022年04月20日
-->
<template>
  <view class="commodity-box">
    <view class="location">
      <view class="if-pay" v-if="data.isBought">已购买</view>
      <view class="image-pay" v-if="data.price">立省{{ data.price }}元</view>
      <image class="img-style" :src="data.thumbnail" mode="aspectFit" />
    </view>
    <view class="text-position">
      <view class="text-size-sn common-text-400 common-text truncate">{{ data.name }}</view>
      <view class="text-size-xxs common-text-400 common-tip">已兑{{ data.salesVolume }}件</view>
      <view class="integral">
        <image src="@/home/static/img/shop/integral.png" class="money-img" />
        <p class="text-size-sn common-text common-text-700">{{ data.integral }}</p>
      </view>
    </view>
  </view>
</template>
<script>
  export default {
    name: 'shopData',
    props: {
      data: {
        type: Object,
      },
    },
  };
</script>
<style lang="scss" scoped>
  .commodity-box {
    width: 344rpx;
    height: 524rpx;
    border-radius: 16rpx;
    background-color: white;
    margin: 12rpx;
  }
  .text-position {
    margin-left: 24rpx;
    .truncate {
      width: 300rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .image-pay {
    position: absolute;
    background-color: #f0522f;
    color: #ffffff;
    font-weight: 700;
    font-size: 20rpx;
    padding: 8rpx;
    bottom: 32rpx;
    border-top-right-radius: 16rpx;
    border-bottom-left-radius: 16rpx;
    z-index: 10;
  }
  .if-pay {
    position: absolute;
    background-color: #fff1be;
    color: #ff9f10;
    font-size: 24rpx;
    padding: 6rpx;
    border-bottom-right-radius: 12rpx;
  }
  .img-style {
    width: 344rpx;
    height: 344rpx;
    border-radius: 16rpx;
    margin-bottom: 24rpx;
    object-fit: cover;
  }
  .integral {
    display: flex;
    margin-top: 16rpx;
    image {
      width: 32rpx;
      height: 32rpx;
      margin-top: 4rpx;
      margin-right: 8rpx;
    }
    p {
      color: #f0522f;
    }
  }
  .location {
    position: relative;
  }
</style>
