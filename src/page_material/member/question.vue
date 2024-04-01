<template>
  <view>
    <web-view :src="url" />
  </view>
</template>
<script>
  export default {
    name: 'member',
    data() {
      return {
        url: 'https://embryon-develop.wangxiao.cn/h5-question/',
      };
    },
  };
</script>
