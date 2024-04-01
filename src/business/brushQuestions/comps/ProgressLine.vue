<!--
* @desc 做题进度条
* @author daisitin
* @date 2022年04月24日
-->
<template>
  <view class="progress-line">
    <view :style="{ width: lineWidth + '%' }" class="line" />
  </view>
</template>
<script>
  export default {
    name: 'progressLine',
    props: {
      //当前做题进度
      lineWidth: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {};
    },
    methods: {},
  };
</script>
<style lang="scss" scoped>
  .progress-line {
    background-color: #f5f6fa;
    height: 8rpx;
    .line {
      background-color: #475ffd;
      height: 8rpx;
    }
  }
</style>
