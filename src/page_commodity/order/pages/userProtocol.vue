<template>
  <view>
    <web-view :src="address" />
  </view>
</template>
<script>
  // import { ChannelOSSApi } from '@/enums/envEnum';
  import { selectUrl } from '@/api/config/index';
  export default {
    name: 'userProtocol',
    data() {
      return {
        address: '',
      };
    },
    onLoad(options) {
      // this.address = PrivacyUser[baseInfo.CHANNEL];
      this.address = selectUrl + 'protocol/' + options.channelId + '/provision.html';
      console.log('address', this.address);
    },
  };
</script>
