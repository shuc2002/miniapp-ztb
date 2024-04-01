<template>
  <view>
    <web-view :src="address" />
  </view>
</template>
<script>
  // import baseInfo from '@/build/index';
  // import { PrivacyUser } from '@/enums/msgEnum';
  // import { ChannelOSSApi } from '@/enums/envEnum';
  import { selectUrl } from '@/api/config/index';
  export default {
    name: 'userAgreement',
    data() {
      return {
        address: '',
      };
    },
    onLoad(options) {
      // this.address = PrivacyUser[baseInfo.CHANNEL];
      const timer = new Date().getTime();
      this.address = selectUrl + 'protocol/' + options.channelId + '/registerProtocol.html' + '?' + timer;
    },
  };
</script>
