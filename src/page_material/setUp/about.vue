<!--
* @desc 关于准题库
* @author 刘伟兴
* @date 2023年05月20日
-->
<template>
  <view class="common-bg" v-if="isDataLoaded">
    <!-- <view class="zhuntiku-logo"> </view> -->
    <img class="zhuntiku-logo" :src="appLogo" />
    <!-- <img src="https://acc.wangxiao.cn/image/aboutLogo.png" class="qy-logo" /> -->
    <view class="version-text">当前版本：<span>5.1.12</span></view>
    <!-- <view class="detail-text">
      <view>客服电话:4000-18-8000(免费)</view>
      <view>(周一至周五8:30-22:00，周六日8点30-17:30)</view>
      #ifndef MP-TOUTIAO
      <view>QQ交流群:800001886</view>
      #endif
      <view>网页版：http://www.zhuantiku.com</view>
    </view> -->
    <view class="detail-text">{{ explain }}</view>
    <view class="bottom-accord-box">
      <view class="accord-btn" @tap="privacyAgreement">隐私协议</view>
      <view class="accord-btn-line">|</view>
      <view class="accord-btn" @tap="userAgreement">注册协议 </view>
      <view class="accord-btn-line">|</view>
      <view class="accord-btn" @tap="toBusinessLicense">营业执照</view>
    </view>
  </view>
</template>
<script>
  import { getH5ChannelId, getChannelMsg } from '@/api/modules/user/index.ts';
  export default {
    name: 'about',
    data() {
      return {
        isDataLoaded: false,
        check: false,
        h5ChannelId: '',
        appLogo: '',
        appName: '',
        telephone: '',
        companyName: '',
        explain: '',
        appIcon: [],
      };
    },
    computed: {
      channelId() {
        return this.$store.getters.getChannelId;
      },
    },
    // 更新渠道信息
    async onLoad() {
      console.log('我即将进入getChannel----');
      const { body } = await getChannelMsg();
      console.log(body);
      /* #ifdef H5 */
      const res = await getH5ChannelId();
      this.h5ChannelId = res.body;
      /* #endif */
      this.appLogo = body.appLogo;
      this.appName = body.appName;
      this.telephone = body.telephone;
      this.companyName = body.companyName;
      this.explain = body.explain;
      this.appIcon = body.appIcon ? body.appIcon : [];
      uni.setNavigationBarTitle({
        title: this.appName ? '关于' + this.appName : '',
      });
      this.isDataLoaded = true;
    },
    methods: {
      userAgreement() {
        uni.navigateTo({
          url: `/page_material/login/userAgreement?channelId=${
            this.channelId ? this.channelId : this.h5ChannelId
          }`,
        });
      },
      privacyAgreement() {
        uni.navigateTo({
          url: `/page_material/login/privacyAgreement?channelId=${
            this.channelId ? this.channelId : this.h5ChannelId
          }`,
        });
      },
      // 去往营业执照页面
      toBusinessLicense() {
        // uni.navigateTo({
        //   url: '/page_material/setUp/businessLicense',
        // });
        uni.navigateTo({
          url: `/page_material/setUp/businessLicense?appIcon=${JSON.stringify(this.appIcon)}`,
        });
      },
      // 转发页面
      async onShareAppMessage() {
        return {
          path: '/page_material/setUp/about',
          // imageUrl: 'https://app.static.wangxiao.cn/ykmf/images/zuduishuati.png',
        };
      },
    },
  };
</script>
<style lang="scss" scoped>
  // .common-bg {
  //   // padding-top: 32rpx;
  //   // position: relative;
  // }
  .common-bg {
    // position: relative;
    background: #f6f6f6ff;
    // position: relative;
    // top: 0rpx;
    // margin-top: 0rpx;
    .zhuntiku-logo {
      width: 120rpx;
      height: 120rpx;
      // position: absolute;
      // top: 102rpx;
      // left: 315rpx;
      margin: 102rpx 315rpx;
      // background: url('../static/logo_1.png') no-repeat;
      // background-size: 100% 100%;
    }
    // .qy-logo {
    //   width: 196rpx;
    //   height: 128rpx;
    //   position: absolute;
    //   top: 102rpx;
    //   left: 278rpx;
    // }
    .version-text {
      color: #333333ff;
      font-size: 28rpx;
      font-weight: 500;
      font-family: 'PingFang SC';
      position: absolute;
      top: 254rpx;
      left: 284rpx;
    }
    .detail-text {
      // position: absolute;
      // top: 414rpx;
      // left: 124rpx;
      margin: 50rpx auto;
      color: #333333ff;
      font-size: 24rpx;
      font-weight: 400;
      font-family: 'PingFang SC';
      text-align: center;
    }
    .bottom-accord-box {
      position: absolute;
      bottom: 108rpx;
      left: 142rpx;
      height: 40rpx;
      display: flex;
      .accord-btn {
        color: #4b538aff;
        font-size: 28rpx;
        font-weight: 600;
        font-family: 'PingFang SC';
        padding: 0 27rpx;
      }
      .accord-btn-line {
        height: 36rpx;
        line-height: 36rpx;
        width: 2rpx;
        color: #dddddd;
        // background: #f6f6f6;
        // margin: 2rpx 27rpx;
      }
    }
  }
</style>
