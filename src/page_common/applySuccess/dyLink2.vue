<!-- 独立页面点击抢课来到该页面显示报名成功 -->
<!-- 社会工作师 -->
<template>
  <view class="container">
    <image :src="imageUrl" show-menu-by-longpress="true" style="width: 100%; height: 100%;"></image>
  </view>
</template>
<script>
  export default {
    data() {
      return {
        imageUrl: `https://app.static.wangxiao.cn/douyin/images/add_wechat2.png?a=${new Date().getTime()}`,
        timestamp: new Date().getTime(), // 获取当前时间戳
      };
    },
    computed: {
      // 在计算属性中拼接带时间戳的图片URL
      imageUrlWithTimestamp() {
        return `${this.imageUrl}?timestamp=${this.timestamp}`;
      },
    },
    mounted() {
      // 在控制台打印图片地址
      console.log('Image URL:', this.imageUrlWithTimestamp);
    },
  };
</script>

<style lang="scss" scoped>
  .container {
    height: 664px;
  }
</style>
