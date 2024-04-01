<!--
* @desc  选项文本组件
* @author 江玉龙
* @date 2021年1月21日
-->
<template>
  <view class="option-boxs">
    <!-- 富文本 -->
    <view v-if="optionType == 4" :class="textSize" class="text-style">
      <rich-text :nodes="optionValue"></rich-text>
    </view>

    <!-- 文本 -->
    <view v-if="optionType == 3" :class="textSize" class="text-style">
      {{ optionValue }}
    </view>
    <!-- 公式 -->
    <view v-if="optionType == 2">
      <image :src="optionValue" mode="aspectFit" class="img-style" />
    </view>
    <!-- 图片 -->
    <view v-if="optionType == 1">
      <image :src="optionValue" mode="aspectFit" class="img-style" />
    </view>
  </view>
</template>

<script>
  export default {
    props: {
      optionType: {
        type: Number,
        default: 0,
      },
      optionValue: {
        type: String,
        default: '',
      },
    },
    data() {
      return {};
    },
    computed: {
      textSize() {
        return this.$store.getters.getTextSize;
      },
    },
    onLoad() {},
    methods: {},
  };
</script>
<style lang="scss" scoped>
  .img-style {
    width: 156rpx;
    height: 156rpx;
    border-radius: 8rpx;
  }
  .option-boxs {
    padding-top: 4rpx;
    line-height: 1.5;
  }
  .text-style {
    margin-top: 10rpx;
  }
</style>
