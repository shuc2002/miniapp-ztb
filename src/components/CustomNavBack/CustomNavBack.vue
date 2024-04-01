<template>
  <!-- #ifndef MP-BAIDU -->
  <view class="header-custom">
    <text v-if="title && title != ''" :style="{ color: titleColor }" class="custom-title">{{
      title
    }}</text>
    <view
      class="iconfont icon-return goBack"
      :style="{ color: backColor }"
      @tap="navigateBack"
    ></view>
  </view>
  <!-- #endif -->
</template>
<script>
  export default {
    name: 'customNavBack',
    data() {
      return {};
    },
    props: {
      title: {
        type: String,
        default: '',
      },
      backColor: {
        type: String,
        default: '',
      },
      titleColor: {
        type: String,
        default: '',
      },
    },
    methods: {
      navigateBack() {
        this.$emit('customBack');
      },
    },
  };
</script>
<style lang="scss" scoped>
  .header-custom {
    width: 100%;
    height: 148rpx;
    /* #ifdef H5 */
    height: 88rpx;
    /* #endif */
    z-index: 99999;
    .custom-title {
      position: absolute;
      line-height: 32rpx;
      font-weight: 700;
      font-size: 32rpx;
      top: 108rpx;
      /* #ifdef H5 */
      top: 28rpx;
      /* #endif */
      width: 400rpx;
      left: 50%;
      margin-left: -200rpx;
      z-index: 9999;
      text-align: center;
    }
    .goBack {
      position: absolute;
      top: 108rpx;
      /* #ifdef H5 */
      top: 28rpx;
      /* #endif */
      left: 34rpx;
      z-index: 9999;
    }
  }
</style>
