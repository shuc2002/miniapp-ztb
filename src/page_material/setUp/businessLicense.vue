<template>
  <view class="black-bg">
    <!-- <view class="topic-img"></view> -->
    <img v-for="(item, index) in appIconArray" :key="index" :src="item" class="topic-img" />
    <!-- <img src="../static/business-license.jpg" class="topic-img" /> -->
    <!-- <img src="https://acc.wangxiao.cn/image/picture.jpg"  class="topic-img"/> -->
  </view>
</template>
<script>
  export default {
    name: 'businessLicense',
    data() {
      return {
        check: false,
        appIconObject: {},
        appIconArray: [],
      };
    },
    computed: {
      channelId() {
        return this.$store.getters.getChannelId;
      },
    },
    onLoad() {
      // this.getSetup();
    },
    onLoad(options) {
      // console.log('11111-', options);
      // this.appIcon = options.appIcon;
      const appIconObject = JSON.parse(options.appIcon);
      // 获取数组形式
      this.appIconArray = Object.values(appIconObject);
      console.log('22222', this.appIconArray);
    },
    methods: {
      userAgreement() {
        uni.navigateTo({
          url: `/page_material/login/userAgreement?channelId=${this.channelId}`,
        });
      },
      privacyAgreement() {
        uni.navigateTo({
          url: `/page_material/login/privacyAgreement?channelId=${this.channelId}`,
        });
      },
    },
  };
</script>
<style lang="scss" scoped>
  // .common-bg {
  //   // padding-top: 32rpx;
  //   // position: relative;
  // }
  .black-bg {
    // position: relative;
    //   background: black;
    height: 100vh;
    width: 100vh;
    .topic-img {
      //  background: url('../static/business-license.jpg') no-repeat;
      //  background-size: 100% 100%;
      height: 472rpx;
      width: 672rpx;
      // width: 100%;
      z-index: 99999;
      // margin: 250rpx 30rpx;
      margin: 80rpx 30rpx;
    }
  }
</style>
