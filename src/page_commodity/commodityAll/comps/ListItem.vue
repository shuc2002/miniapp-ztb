<template>
  <view class="type-list-one">
    <img class="list-img" :src="imgUrl" mode="aspectFit" />
    <view class="list-right">
      <view class="list-title truncate-two ">{{ title }}</view>
      <view class="list-bottom">
        <view class="list-price">￥{{ price }}</view>
      </view>
    </view>
  </view>
</template>
<script>
  export default {
    name: 'ListItem',
    props: {
      title: {
        type: String,
        default: '',
      },
      imgUrl: {
        type: String,
        default: '',
      },
      price: {
        type: String,
        default: '',
      },
    },
  };
</script>
<style lang="scss" scoped>
  .type-list-one {
    display: flex;
    width: 690rpx;
    height: 192rpx;
    border-radius: 24rpx;
    margin-bottom: 32rpx;
    margin-left: 30rpx;
    background: var(--white, #fff);
  }
  .list-img {
    width: 256rpx;
    height: 144rpx;
    border-radius: 16rpx;
    margin-left: 24rpx;
    margin-top: 24rpx;
  }
  .list-right {
    margin-top: 24rpx;
    margin-left: 32rpx;
    width: 354rpx;
    height: 144rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .list-title {
    width: 354rpx;
    font-size: 32rpx;
  }
  .list-bottom {
    // background:red;
    display: flex;
    justify-content: space-between;
  }
  .list-price {
    color: #e51600;
    font-size: 28rpx;
    line-height: 30rpx;
  }
</style>
