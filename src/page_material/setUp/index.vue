<!--
* @desc 设置
* @author 江玉龙
* @date 2022年08月03日
-->
<template>
  <view class="common-bg">
    <!-- <p class="title-set">消息管理</p> -->
    <view class="set-item-box">
      <view class="set-item" @tap="commonFun.routeTo(`/page_material/setUp/secure`)">
        <p>账号与安全</p>
        <view class="icon-more_large iconfont set-icon" />
      </view>
      <view class="set-item-bottom-line"></view>
      <!-- <p class="title-set mb-16">可配置学习计划，做题报告，资讯，排行榜等消息</p> -->
      <!-- <p class="title-set">更多</p> -->
      <!-- <view class="set-item">
        <p>清除缓存</p>
        <view class="icon-more_large iconfont set-icon" />
      </view>
      <view class="set-item-bottom-line"></view> -->
      <view class="set-item" @tap="commonFun.routeTo(`/page_material/setUp/about`)">
        <!-- <p>关于{{ title }}</p> -->
        <p>关于{{ appName }}</p>
        <view class="icon-more_large iconfont set-icon" />
      </view>
    </view>

    <!-- <view class="set-item" @tap="commonFun.routeTo(`/page_material/login/privacyAgreement`)">
      <p>隐私协议</p>
      <view class="t-icon t-icon-chevron-right set-icon" />
    </view> -->

    <button class="cancel-btn flex-center" @tap="handleChange()">退出登录</button>
  </view>
</template>
<script>
  // import { getSetup} from '@/api/modules/user/index';
  import { getChannelMsg } from '@/api/modules/user/index.ts';
  import baseInfo from '@/build/index';
  import { TitleByEnum } from '@/enums/msgEnum';
  export default {
    name: 'setUp',
    data() {
      return {
        check: false,
        title: '',
        appName: '',
      };
    },

    onLoad() {
      this.title = TitleByEnum[baseInfo.CHANNEL];
      // this.getSetup();
    },
    // 更新渠道信息
    async onLoad() {
      console.log('我即将进入getChannel----');
      const { body } = await getChannelMsg();
      this.appName = body.appName;
    },
    methods: {
      // 切换账号
      handleChange() {
        this.$store.commit('setToken', '');
        this.$store.commit('setPageTabList', {
          tabList: [],
          style: {},
        });
        uni.setStorageSync('pageTabList', {
          tabList: [],
          style: {},
        });
        this.$store.commit('setCurrentTab', 0);
        this.$store.commit('setProjectId', '');
        let homeURL = '/home/login/login';
        /* #ifdef H5 */
        homeURL = '/home/login/passwordLogin';
        /* #endif */
        uni.reLaunch({
          url: homeURL,
        });
      },
      // 转发页面
      async onShareAppMessage() {
        return {
          path: '/page_material/setUp/index',
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
  .mb-16 {
    margin-bottom: 96rpx;
  }
  .set-item-box {
    background-color: #ffffff;
    .set-item {
      margin: 0 30rpx;
      // padding: 0 24rpx;
      background-color: #ffffff;
      height: 112rpx;
      // border-radius: 24rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      p {
        font-size: 28rpx;
        font-weight: 600;
        color: #333333ff;
      }
      .set-icon {
        // width: 36rpx;
        // height: 36rpx;
        line-height: 112rpx;
        font-size: 28rpx;
        color: #bebebeff;
      }
    }
    .set-item-bottom-line {
      height: 2rpx;
      margin: 0 30rpx;
      background: #f6f6f6;
    }
  }

  .cancel-btn {
    width: 750rpx;
    height: 112rpx;
    line-height: 112rpx;
    text-align: center;
    margin-top: 66rpx;
    // border-radius: 24rpx;
    background-color: #ffffff;
    color: #e51600ff;
    font-size: 28rpx;
    font-weight: 600;
    // position: absolute;
    // bottom: 200rpx;
    // left: 0;
    // right: 0;
  }
</style>
