<!-- 短信验证码登录以及重置密碼 的验证码验证页面 -->

<template>
  <view class="login-bg">
    <p class="message-login-title">输入验证码</p>
    <p class="message-login-subTitle"
      >已将验证码发送至 <span style="color: #333333ff ;"> +86 {{ phone }}</span></p
    >

    <view class="message-code-input">
      <!-- #ifdef H5 -->
      <!-- 兼容系统键盘无法快捷输入验证码的bug -->
      <u-message-input
        :maxlength="6"
        width="84rpx"
        active-color="#333333ff"
        inactive-color="#fffffff"
        :breathe="false"
        v-model="messageCode"
        :disabled-keyboard="true"
        @finish="toCheck"
      ></u-message-input>
      <u-keyboard
        mode="number"
        v-model="show"
        :tooltip="false"
        @change="onChange"
        @backspace="onBackspace"
        :mask-close-able="false"
        :mask="false"
      ></u-keyboard>
      <!-- #endif -->
      <!-- #ifndef H5 -->
      <u-message-input
        :maxlength="6"
        width="84rpx"
        active-color="#333333ff"
        inactive-color="#fffffff"
        :breathe="false"
        v-model="messageCode"
        @finish="toCheck"
      ></u-message-input>
      <!-- #endif -->
    </view>
    <view class="time-send">
      <!-- <p
        class="text-size-sn common-text-400"
        :class="ifCount ? 'common-tip' : 'resend-text'"
        @tap="ifCount ? '2' : getMessageCode()"
        >{{ ifCount ? second + '秒后可重新获取' : '重发短信验证码' }}</p
      > -->
      <p
        class="text-size-sn common-text-400"
        :class="ifCount ? 'common-tip' : 'resend-text'"
        @tap="ifCount ? '2' : getMessageCode()"
        v-show="ifCount"
      >
        <span style="color: #333333ff;margin-right: 20rpx;">{{ second }} </span>秒后可重新获取 </p
      ><p
        class="text-size-sn common-text-400"
        :class="ifCount ? 'common-tip' : 'resend-text'"
        @tap="ifCount ? '2' : getMessageCode()"
        v-show="!ifCount"
        >重发短信验证码</p
      >
    </view>
  </view>
</template>

<script>
  import { checkMessageCode, getCode } from '@/api/modules/register/index.ts';
  import { getConfigure } from '@/api/modules/user/index.ts';
  import { goCodeLogin, getUserInfo } from '@/api/modules/register/index.ts';
  import baseInfo from '@/build/index';
  import {
    ChannelAppId,
    DouyinAppId,
    WeixinAppId,
    BaiduChannelId,
    DouyinChannelId,
    WeixinChannelId,
    H5ChannelId,
  } from '@/enums/msgEnum';
  import { bottomNavTo } from '@/utils/common.js';
  export default {
    name: 'checkMessageCode',
    data() {
      return {
        phone: '', // 手机号
        type: '', //验证验证码的用处
        timer: null, // 倒计时定时器
        second: 60,
        ifCount: false,
        reg: /^1[3-9]\d{9}$/, // 正则验证手机号
        code: /^\d{6}$/, // 正则验证验证码
        sessionKey: '',
        thirdAppId: '',
        channelId: '',
        messageCode: '', // 输入的验证码
        accessToken: '',
        show: true,
      };
    },
    watch: {
      projectId() {
        return this.$store.getters.getProjectId;
      },
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
    onLoad(options) {
      console.log(options, '333');
      this.type = options.type;
      this.phone = options.phone;
      this.sessionKey = options.sessionKey;
      this.ifCount = true;
      this.startTimer();
      /* #ifdef H5 */
      this.channelId = H5ChannelId[baseInfo.CHANNEL];
      /* #endif */
      /* #ifdef MP-TOUTIAO */
      this.thirdAppId = DouyinAppId[baseInfo.CHANNEL];
      this.channelId = DouyinChannelId[baseInfo.CHANNEL];
      /* #endif */
      /* #ifdef MP-BAIDU */
      this.thirdAppId = ChannelAppId[baseInfo.CHANNEL];
      this.channelId = BaiduChannelId[baseInfo.CHANNEL];
      /* #endif */
      /* #ifdef MP-WEIXIN */
      this.thirdAppId = WeixinAppId[baseInfo.CHANNEL];
      this.channelId = WeixinChannelId[baseInfo.CHANNEL];
      /* #endif */
    },
    methods: {
      // 自定义键盘
      showBoard() {
        console.log('点击了');
        this.show = true;
      },
      onChange(val) {
        console.log(val);
        if (this.messageCode.length < 6) {
          this.messageCode += val;
        }
        if (this.messageCode.length >= 6) {
          this.toCheck(this.messageCode);
        }
      },
      onBackspace(val) {
        console.log(val);
        if (this.messageCode.length > 0) {
          this.messageCode = this.messageCode.substring(0, this.messageCode.length - 1);
        }
      },

      //验证验证码
      async toCheck(e) {
        // 需区分短信验证码登录 重置密码
        if (this.type == 'resetPassword') {
          console.log(e);
          const res = await checkMessageCode({
            sessionKey: this.sessionKey,
            code: e,
            channelId: this.thirdAppId,
          });
          if (res.code == 1000) {
            //验证成功 跳转页面
            uni.navigateTo({
              url: `/home/login/resetPassword?phone=${this.phone}&uid=${res.body}`,
            });
          } else if (res.code == 2005) {
            uni.showToast({
              title: '您输入验证码不正确',
              icon: 'none',
            });
          } else if (res.code == 2004) {
            uni.showToast({
              title: '验证码已过期，请重试',
              icon: 'none',
            });
          }
        }
        if (this.type == 'messageCodeLogin') {
          console.log(e);
          const that = this;
          // uni.navigateTo({
          //   url: '/home/login/resetPassword',
          // });
          if (this.code.test(e)) {
            uni.getSystemInfo({
              complete: async function(res) {
                const { deviceId = '', deviceModel = '', deviceBrand: deviceName = '' } = res;
                const result = await goCodeLogin({
                  sessionKey: that.sessionKey,
                  code: e,
                  channelId: that.thirdAppId,
                  deviceId,
                  deviceModel,
                  deviceName,
                });
                if (result.body) {
                  that.accessToken = result.body.accessToken;
                  that.userLogin();
                } else {
                  uni.showToast({
                    title: '验证码不正确',
                    icon: 'none',
                  });
                }
              },
            });
          }
        }
      },

      // 重新获取验证码
      async getMessageCode() {
        const res = await getCode({ mobile: this.phone });
        if (res.body) {
          this.sessionKey = res.body.sessionKey;
          this.ifCount = true;
          this.startTimer();
        } else if (res.code == 2003) {
          uni.showToast({
            title: '您的操作太频繁，请1分钟后再试。',
            icon: 'none',
          });
        }
      },
      toModeTime() {
        this.startTimer();
      },
      // // 开启倒计时
      startTimer() {
        if (this.timer) {
          clearInterval(this.timer);
        }
        let timeDown = 60000;
        this.timer = setInterval(() => {
          timeDown -= 1000;
          this.second = Math.floor(timeDown / 1000);
          if (timeDown < 1000) {
            clearInterval(this.timer);
            this.timer = null;
            this.endTime();
          }
        }, 1000);
      },
      // 结束倒计时
      endTime() {
        this.ifCount = false;
        this.second = 60;
      },
      // 页面销毁时结束
      beforeDestroy() {
        if (this.timer) {
          clearInterval(this.timer);
          this.timer = null;
        }
      },

      async userLogin() {
        this.$store.commit('setToken', this.accessToken);
        const res = await getUserInfo();
        this.$store.commit('setNickName', res.body.nickname);
        this.$store.commit('setAvatar', res.body.avatar);
        this.$store.commit('setUid', res.body.uid);
        this.$store.commit('setOrg', res.body.org);
        this.$store.commit('setTenantId', res.body.tenantId);
        this.$store.commit('setChannelId', this.channelId);
        const data = await getConfigure({ channelId: this.channelId });
        if (data.body.first) {
          uni.reLaunch({ url: '/business/selectExam/index' });
        } else {
          this.$store.commit('setProjectId', data.body.project.k);
          this.$store.commit('setProjectName', data.body.project.v);
          // uni.reLaunch({ url: '/pages/home/index' });
          // bottomNavTo('/pages/home/index', 2);
          //eslint-disable-next-line no-undef
          let pages = getCurrentPages();
          /* #ifdef H5 */
          if (pages?.length > 0) {
            if (pages?.[0].route == 'home/login/passwordLogin') {
              bottomNavTo('/pages/home/index', 2);
            } else {
              uni.navigateBack({ delta: pages.length });
            }
          } else {
            bottomNavTo('/pages/home/index', 2);
          }
          /* #endif */
        }
      },
      // 转发页面
      async onShareAppMessage() {
        return {
          path: '/home/login/checkMessageCode',
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
    .message-login-subTitle {
      margin-left: 80rpx;
      margin-top: 16rpx;
      color: #9fa1a4ff;
      font-size: 28rpx;
      font-weight: 400;
      font-family: 'PingFang SC';
      text-align: left;
    }
    .message-code-input {
      margin: 112rpx auto 48rpx;
    }
    .time-send {
      text-align: center;
      .resend-text {
        color: #e51600ff;
        font-size: 28rpx;
        font-weight: 400;
        font-family: 'PingFang SC';
      }
    }
  }
</style>
