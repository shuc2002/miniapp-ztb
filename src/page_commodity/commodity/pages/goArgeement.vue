<!--
* @desc 跳转h5
* @author 江玉龙
* @date 2022年06月22日
-->
<template>
  <view>
    <web-view :src="address" bindmessage="onmessage" />
  </view>
</template>
<script>
  export default {
    name: 'skipTo',
    onLoad(options) {
      console.log('url-------', options.url);
      if (options.url) {
        this.address = 'https://embryon-develop.wangxiao.cn/h5-goods/?pdfUrl=' + options.url;
      }
    },
    computed: {
      token() {
        return this.$store.getters.getToken;
      },
    },
    data() {
      return {
        address: '',
        pdf: '',
        lastPoint: '',
      };
    },
    methods: {
      onmessage(e) {
        console.log('收到的消息', e.detail);
      },
    },
  };
</script>
