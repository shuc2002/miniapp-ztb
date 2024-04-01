<template>
  <view class="flex-center">
    <!-- 图片集合 -->
    <view class="flex-start">
      <image
        v-for="(item, idx) in photoList"
        :key="idx"
        class="photo-img"
        :src="item"
        mode="scaleToFill"
      />
    </view>
    <!-- 文字说明 -->
    <view class="text-size-xxs common-message common-text-400">
      <span class="common-price">{{ manNumber }}</span>
      <span>人已打卡</span>
    </view>
  </view>
</template>

<script>
  export default {
    props: {
      manNumber: { type: Number, default: () => 0 },
      photoList: { type: Array, default: () => [] },
    },
  };
</script>

<style lang="scss" scoped>
  .flex-center {
    margin-top: 24rpx;
  }
  .flex-start {
    margin-right: 10rpx;
  }
  .photo-img {
    border: 2rpx solid #ffffff;
    width: 32rpx;
    height: 32rpx;
    border-radius: 50%;
    margin-left: -12rpx;
    &:first-child {
      margin: 0;
    }
  }
</style>
