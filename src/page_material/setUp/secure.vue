<!--
* @desc 账号与安全
* @author lwx
* @date 2023年05月20日
-->
<template>
  <view class="common-bg">
    <view class="set-item-box">
      <view class="set-item-bottom-line"></view>
      <view class="set-item-number">
        <!-- 用户昵称 -->
        <view class="set-mobile">
          <view class="set-mobile-number" v-show="token">{{ nickName }}</view>
          <view class="set-mobile-extra">
            <view class="secure-logo iconfont icon-secure"></view>
            <view class="secure-text">智能保障您的账号安全</view>
          </view>
        </view>
        <!-- 用户头像 -->
        <image
          :src="token ? avatar : '../../static/img/mine/default-Avatar.png'"
          mode="aspectFill"
          class="img-user"
        />
      </view>
      <view class="set-item-bottom-line"></view>
      <view class="set-item" @tap="commonFun.routeTo(`/home/login/forgetPasswordStepOne`)">
        <p>修改密码</p>
        <view class="icon-more_large iconfont set-icon" />
      </view>
      <view class="set-item-bottom-line"></view>
    </view>

    <!-- <view class="set-item" @tap="commonFun.routeTo(`/page_material/login/privacyAgreement`)">
        <p>隐私协议</p>
        <view class="t-icon t-icon-chevron-right set-icon" />
      </view> -->
    <!-- <view class="change-btn-box" @tap="commonFun.routeTo(`/page_material/setUp/logoff`)">
      <p>注销账号</p>
      <view class="icon-more_large iconfont set-icon" />
    </view> -->
    <!-- <button class="cancel-btn " @tap="handleCancel()">注销账号</button> -->
  </view>
</template>
<script>
  import { getSetup, setModify } from '@/api/modules/user/index';
  import { bottomNavTo } from '@/utils/common.js';
  export default {
    name: 'secure',
    data() {
      return {
        check: false,
      };
    },
    computed: {
      token() {
        return this.$store.getters.getToken;
      },
      nickName() {
        return this.$store.getters.getNickName;
      },
      avatar() {
        return this.$store.getters.getAvatar;
      },
      uid() {
        return this.$store.getters.getUid;
      },
      tenantId() {
        return this.$store.getters.getTenantId;
      },
    },
    onLoad() {
      // this.getSetup();
    },
    methods: {
      // 获取配置信息
      async getSetup() {
        const res = await getSetup();
        if (res.body) {
          this.check = res.body;
        }
      },
      // 点击按钮开关
      async handleSwitch() {
        const res = await setModify();
        if (res.body) {
          this.check = !this.check;
          if (this.check) {
            uni.showToast({
              title: '设置成功，我会按时提醒你的',
              icon: 'none',
            });
          } else {
            uni.showToast({
              title: '已关闭消息提醒，我会等你回来的',
              icon: 'none',
            });
          }
        }
      },
      // 退出登录
      handleCancel() {
        this.$store.commit('setToken', '');
        // uni.reLaunch({
        //   url: '/pages/home/index',
        // });
        bottomNavTo('/pages/realHome/index', 2);
      },
      // 转发页面
      async onShareAppMessage() {
        return {
          path: '/page_material/setUp/secure',
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
    .set-item-number {
      // height: 234rpx;
      margin: 0 30rpx;
      // padding: 0 24rpx;
      background-color: #ffffff;
      display: flex;
      justify-content: space-between;
      .set-mobile {
        .set-mobile-number {
          margin-top: 64rpx;
          // height: 68rpx;
          // line-height: 68rpx;
          width: 380rpx;
          white-space: normal;
          word-break: break-all;
          color: #333333ff;
          font-size: 48rpx;
          font-weight: 600;
          font-family: 'PingFang SC';
        }
        .set-mobile-extra {
          margin-top: 4rpx;
          height: 34rpx;
          margin-bottom: 64rpx;
          display: flex;
          .secure-logo {
            color: #2bc048ff;
          }
          .secure-text {
            color: #9fa1a4ff;
            font-size: 24rpx;
            font-weight: 500;
            font-family: 'PingFang SC';
            margin-left: 8rpx;
            line-height: 34rpx;
          }
        }
      }
      .img-user {
        width: 100rpx;
        height: 100rpx;
        margin-top: 67rpx;
      }
    }
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
  .change-btn-box {
    width: 750rpx;
    height: 112rpx;
    line-height: 112rpx;
    text-align: left;
    margin-top: 66rpx;
    // border-radius: 24rpx;
    background-color: #ffffff;
    color: #333333ff;
    font-size: 28rpx;
    font-weight: 600;
    padding-left: 30rpx;
    display: flex;
    justify-content: space-between;
    .set-icon {
      line-height: 112rpx;
      font-size: 28rpx;
      color: #bebebeff;
      padding-right: 30rpx;
    }
  }
  //   .cancel-btn {
  //     width: 750rpx;
  //     height: 112rpx;
  //     line-height: 112rpx;
  //     text-align: left;
  //     margin-top: 66rpx;
  //     // border-radius: 24rpx;
  //     background-color: #ffffff;
  //     color: #333333ff;
  //     font-size: 28rpx;
  //     font-weight: 600;
  //     padding-left: 30rpx;
  //     // position: absolute;
  //     // bottom: 200rpx;
  //     // left: 0;
  //     // right: 0;
  //     .set-icon {
  //         // width: 36rpx;
  //         // height: 36rpx;
  //         line-height: 112rpx;
  //         font-size: 28rpx;
  //         color: #bebebeff;
  //       }
  //   }
</style>
