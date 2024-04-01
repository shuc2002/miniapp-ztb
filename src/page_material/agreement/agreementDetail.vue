<!--
* @desc 未签署协议与已签署协议的h5容器
* @author lwx
* @date 2022年06月22日
-->
<template>
  <web-view :src="address" @message="onMessage" @onPostMessage="onMessage"></web-view>
</template>
<script>
  import { baseUrl } from '@/api/config/index';
  export default {
    name: 'agreementDetail',
    onLoad(options) {
      let clientOrigin = '';
      /* #ifdef H5 */
      clientOrigin = window.location.origin;
      /* #endif */
      if (options?.goodsId) {
        this.address = `${baseUrl}/h5/#/agreementDetail?fileUrl=${options.fileUrl}&isSigned=${
          options.isSigned
        }&isOrder=${options.isOrder}&recordId=${options.recordId}&goodsId=${
          options.goodsId
        }&clientOrigin=${clientOrigin}&platform=${uni.getSystemInfoSync().uniPlatform}`;
      } else {
        this.address = `${baseUrl}/h5/#/agreementDetail?fileUrl=${options.fileUrl}&isSigned=${
          options.isSigned
        }&isOrder=${options.isOrder}&recordId=${
          options.recordId
        }&clientOrigin=${clientOrigin}&platform=${uni.getSystemInfoSync().uniPlatform}`;
      }
      // this.address = `http://localhost:3002/#/agreementDetail?fileUrl=${options.fileUrl}&isSigned=${options.isSigned}&recordId=${options.recordId}&isOrder=${options.isOrder}`;
      console.log(this.address, 'this.address');
    },
    data() {
      return {
        address: '',
        pdf: '',
        lastPoint: '',
        timeD: 'null',
      };
    },
    methods: {
      onMessage(e) {
        console.log(e, 'eeeeeee');
        // console.log('收到的消息', e.detail);
        if (e) {
          // uni.navigateBack();
          console.log('lail');
        }
      },
    },
  };
</script>
