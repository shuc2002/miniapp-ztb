<template>
  <web-view
    src="https://www.wangxiao.cn/index/2756578.html"
    ref="webRef"
    :fullscreen="false"
    :style="{ height: '200rpx', width: '750rpx' }"
    @message="getH5Message"
    @onPostMessage="getH5Message"
  ></web-view>
</template>
<script>
  export default {
    name: 'ccVideo',
    data() {
      return {
        currentWebview: '123',
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
    mounted() {
      console.log('vc', this.vc);
      const self = this;
      self.currentWebview = self.$scope.$getAppWebview().children()[0];
      self.currentWebview.setStyle(this.ccstyle);
      const str = JSON.stringify({ vc: this.vc, videoId: this.videoId });
      self.currentWebview.evalJS(`uniEvent(${str})`);
    },

    // var currentWebview = this.$scope.$getAppWebview();
    // let wv = currentWebview.children()[0];
    // wv.setStyle(this.ccstyle);
    // const str = JSON.stringify({ vc: this.vc, videoId: this.videoId });
    // wv.currentWebview.evalJS(`uniEvent(${str})`);

    methods: {
      getH5Message(e) {
        console.log(e.detail);
      },
    },
  };
</script>
