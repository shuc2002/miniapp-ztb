<template>
  <view>
    <web-view :src="address" />
  </view>
</template>
<script>
  export default {
    name: 'outLinkPage',
    data() {
      return {
        address: '',
      };
    },
    onLoad(options) {
      const url = options.url;
      const uniPlatform = uni.getSystemInfoSync().uniPlatform;
      this.address =
        url.indexOf('?') > -1 ? `${url}&platform=${uniPlatform}` : `${url}?platform=${uniPlatform}`;
    },
  };
</script>
