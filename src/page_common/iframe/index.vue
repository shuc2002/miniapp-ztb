<template>
  <web-view :src="uri" @message="onMessage"></web-view>
</template>

<script>
  export default {
    name: 'IframeCommon',
    data() {
      return {
        uri: '',
      };
    },
    onLoad(options) {
      const { uri = '' } = options;
      this.uri = uri ? decodeURIComponent(uri) : '';
    },
    watch: {
      uri: {
        handler(val) {
          console.log(val);
          if (val.includes('previewCert')) {
            uni.setNavigationBarTitle({
              title: '证书详情',
            });
          }
        },
        immediate: true,
        deep: true,
      },
    },
  };
</script>
