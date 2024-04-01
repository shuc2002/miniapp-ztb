<template>
  <web-view
    :src="url"
    ref="webRef"
    :fullscreen="false"
    :style="{ height: '200rpx', width: '750rpx' }"
    @message="getH5Message"
    @onPostMessage="getH5Message"
  ></web-view>
</template>
<script>
  import { Base64 } from 'js-base64';

  export default {
    name: 'ccVideo',
    data() {
      return {
        currentWebview: '123',
        url: '',
      };
    },
    props: {
      vc: {
        type: String,
      },
      ccstyle: {},
      videoId: {
        type: String,
      },
    },
    onLoad(options) {
      console.log('options11---', options);
      const {
        unitId,
        productId,
        material,
        code,
        videoId,
        url,
        lastPoint,
        commodityId,
        handouts,
        downloadable,
      } = options;
      const vc = Base64.toBase64(
        JSON.stringify({ token: uni.getStorageSync('token'), unit: unitId, product: productId })
      );
      this.url = this.setObjToUrlParams(url, {
        vid: videoId,
        vc,
        token: uni.getStorageSync('token'),
        code,
        lastPoint,
        pdf: material,
        commodity: commodityId,
        handouts,
        downloadable,
      });
      console.log('this.url--', this.url);
      // this.url =
    },
    mounted() {
      const self = this;
      self.currentWebview = self.$scope.$getAppWebview().children()[0];
      self.currentWebview.setStyle(this.ccstyle);
      const str = JSON.stringify({ vc: this.vc, videoId: this.videoId });
      self.currentWebview.evalJS(`uniEvent(${str})`);
    },

    methods: {
      setObjToUrlParams(baseUrl, obj) {
        let parameters = '';
        for (const key in obj) {
          parameters += key + '=' + obj[key] + '&';
        }
        parameters = parameters.replace(/&$/, '');
        return baseUrl + '?' + parameters;
      },
      getH5Message(e) {
        console.log(e.detail);
      },
    },
  };
</script>
