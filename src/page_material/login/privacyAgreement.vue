<template>
  <view>
    <web-view :src="address" />
  </view>
</template>
<script>
  // import baseInfo from '@/build/index';
  // import { PrivacyAgreement } from '@/enums/msgEnum';
  // import { ChannelOSSApi } from '@/enums/envEnum';
  import { selectUrl } from '@/api/config/index';
  export default {
    name: 'privacyAgreement',
    data() {
      return {
        address: '',
      };
    },
    onLoad(options) {
      // console.log(options);
      // console.log(PrivacyAgreement[baseInfo.CHANNEL]);
      // console.log(ChannelOSSApi.DEV);
      // console.log(ChannelOSSApi.DEV + 'protocol/' + options.channelId + '/privacyAgreement.html');
      const timer = new Date().getTime();
      this.address = selectUrl + 'protocol/' + options.channelId + '/privacyAgreement.html' + '?' + timer;
      // return;
      // this.address = ChannelOSSApi.DEV + 'protocol/'
      // this.address = PrivacyAgreement[baseInfo.CHANNEL];
    },
  };
</script>
