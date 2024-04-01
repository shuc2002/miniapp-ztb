<!-- 密码重置 页面 -->

<template>
  <view class="login-bg">
    <p class="message-login-title">设置新密码</p>
    <view class="phone-box">
      <!-- <input
        placeholder="请输入新密码"
        placeholder-style="color:#c9cdd4ff;font-weight:400;"
        maxlength="20"
        v-model="password"
        :type="showPassword ? '' : 'password'"
        class="input-box"
      /> -->
      <input
        placeholder="密码"
        placeholder-style="color:#c9cdd4ff;font-weight:400;"
        maxlength="20"
        type="text"
        v-model="password"
        class="input-box"
        v-if="showPassword"
      />
      <input
        placeholder="密码"
        placeholder-style="color:#c9cdd4ff;font-weight:400;"
        maxlength="20"
        type="password"
        password
        v-model="password"
        class="input-box"
        v-else
      />
      <view
        :class="
          showPassword ? 'password-logo iconfont icon-hide' : 'password-logo iconfont icon-show'
        "
        @tap="changeInputType"
      ></view>
    </view>
    <view class="input-bottom-line" />
    <view
      :class="
        password.length >= 8 && password.length <= 20
          ? 'get-message-btn active-btn'
          : 'get-message-btn no-active-btn'
      "
      @tap="updatePassword"
      >确认修改</view
    >
  </view>
</template>

<script>
  import { resetPassword } from '@/api/modules/register/index.ts';
  import { bottomNavTo } from '@/utils/common.js';
  export default {
    name: 'forgetPasswordStepOne',
    data() {
      return {
        phone: '', // 手机号
        uid: '', // uid
        password: '', // 新密码
        // code: /^\d{8}$/, // 正则验证密码 控制按钮是否变色
        req: /^(?=.*[0-9])((?=.*[a-z])|(?=.*[A-Z])).{8,19}$/, // 正则效验新密码 是否需要发请求
        // sessionKey: '',
        // thirdAppId: '',
        // channelId: '',
        showPassword: false, //密码是否明文
      };
    },
    computed: {
      token() {
        return this.$store.getters.getToken;
      },
    },

    onLoad(options) {
      this.phone = options.phone;
      this.uid = options.uid;
      // /* #ifdef H5 */
      // this.thirdAppId = WeixinAppId[baseInfo.CHANNEL];
      // this.channelId = WeixinChannelId[baseInfo.CHANNEL];
      // /* #endif */
      // /* #ifdef MP-TOUTIAO */
      // this.thirdAppId = DouyinAppId[baseInfo.CHANNEL];
      // this.channelId = DouyinChannelId[baseInfo.CHANNEL];
      // /* #endif */
      // /* #ifdef MP-BAIDU */
      // this.thirdAppId = ChannelAppId[baseInfo.CHANNEL];
      // this.channelId = BaiduChannelId[baseInfo.CHANNEL];
      // /* #endif */
      // /* #ifdef MP-WEIXIN */
      // this.thirdAppId = WeixinAppId[baseInfo.CHANNEL];
      // this.channelId = WeixinChannelId[baseInfo.CHANNEL];
      /* #endif */
    },
    methods: {
      changeInputType() {
        console.log(this.showPassword);
        this.showPassword = !this.showPassword;
      },
      //确认修改密码
      async updatePassword() {
        if (this.password.length >= 8 && this.password.length <= 20) {
          //验证密码
          if (this.req.test(this.password)) {
            const res = await resetPassword({
              password: this.password,
              mobile: this.phone,
              uid: this.uid,
            });
            console.log(res);
            if (res.code == 1000) {
              uni.showToast({
                title: '设置成功',
                icon: 'none',
              });
              // 需要区分 是否登录 登录跳上一页 未登录跳登录页
              if (this.token) {
                // uni.reLaunch({ url: '/pages/mine/index' });
                bottomNavTo('/pages/mine/index',2);
              } else {
                uni.navigateTo({
                  url: '/home/login/passwordLogin',
                });
              }
            }
          } else {
            uni.showToast({
              title: '密码需包含数字、字母',
              icon: 'none',
            });
          }
        }
      },
      // 转发页面
      async onShareAppMessage() {
        return {
          path: '/home/login/resetPassword',
          // imageUrl: 'https://app.static.wangxiao.cn/ykmf/images/zuduishuati.png',
        };
      },
    },
  };
</script>

<style lang="scss" scoped>
  .login-bg {
    background-size: 100% 100%;
    background-color: #ffffff;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    background-color: #ffffff;
    .message-login-title {
      margin-left: 80rpx;
      margin-top: 200rpx;
      color: #333333ff;
      font-size: 56rpx;
      font-weight: 600;
      font-family: 'PingFang SC';
      text-align: left;
    }
    .phone-box {
      display: flex;
      align-items: center;
      margin-left: 86rpx;
      margin-top: 128rpx;
      position: relative;
      p {
        white-space: nowrap;
        margin-right: 80rpx;
        color: #333333ff;
        font-size: 32rpx;
        font-weight: 600;
        font-family: 'PingFang SC';
        text-align: left;
      }
      .input-box {
        font-weight: 400;
        font-size: 32rpx;
        color: #323949;
      }
      .password-logo {
        position: absolute;
        height: 40rpx;
        width: 40rpx;
        // background-color: red;
        right: 86rpx;
        bottom: -7rpx;
        z-index: 99;
      }
    }
    .input-bottom-line {
      width: 580rpx;
      height: 2rpx;
      border-radius: 6rpx;
      opacity: 1;
      background: #ddddddff;
      margin: 18rpx auto 40rpx;
    }
    .get-message-btn {
      width: 580rpx;
      height: 96rpx;
      border-radius: 72rpx;
      //   background: #f7b2aaff;
      text-align: center;
      line-height: 96rpx;
      color: #ffffffff;
      font-size: 32rpx;
      font-weight: 600;
      font-family: 'PingFang SC';
      margin: 128rpx auto;
    }
    .active-btn {
      background: #e51600ff;
    }
    .no-active-btn {
      background: #f7b2aaff;
    }
  }
</style>
