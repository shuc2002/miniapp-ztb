<!-- 短信验证码登录 获取验证码 页面 -->

<template>
  <view class="login-bg">
    <p class="message-login-title">短信验证码登录</p>
    <p class="message-login-subTitle">未注册手机验证后自动登录</p>
    <view class="phone-box">
      <p class="text-size-sn common-text-400 common-text">+86</p>
      <input
        placeholder="请输入手机号码"
        placeholder-style="color:#c9cdd4ff;font-weight:400;"
        maxlength="11"
        v-model="phone"
        class="input-box"
      />
    </view>
    <view class="input-bottom-line" />
    <view
      :class="reg.test(phone) ? 'get-message-btn active-btn' : 'get-message-btn no-active-btn'"
      @tap="handleSend()"
      >发送验证码</view
    >
    <view class="password-btn" @tap="goPassword">密码登录</view>
    <view class="agreement-big-box" @tap="changeAgree">
      <view class="agreement">
        <view class="iconfont icon-select_circular_1_2" v-if="agree" @tap.stop="changeAgree" />
        <view class="iconfont icon-select_circular_1_1" v-else @tap.stop="changeAgree" />
        <p class="text-size-sl common-tip flex-center agreement-box login-tip-agree">
          我已经阅读并同意<span class="common-blue" @tap.stop="userAgreement">《注册协议》</span
          >，<span class="common-blue" @tap.stop="privacyAgreement">《隐私保护指引》</span></p
        >
      </view>
    </view>

    <MovePopup title="请阅读并同意以下条款" height="520rpx" v-model="showPopup">
      <view class="pop-bottom-line" />
      <view class="pop-text"
        ><span class="common-blue" @tap.stop="userAgreement">《注册协议》</span>，<span
          class="common-blue"
          @tap.stop="privacyAgreement"
          >《隐私保护指引》</span
        >
      </view>
      <view class="pop-btn" @tap="toSend">同意并继续</view>
    </MovePopup>
  </view>
</template>

<script>
  import MovePopup from '@/components/MovePopup/move-popup.vue';
  import { getCode } from '@/api/modules/register/index.ts';
  import { getH5ChannelId } from '@/api/modules/user/index.ts';
  import { newThrottle } from '@/utils/public.js';
  export default {
    name: 'getMessageCode',
    components: { MovePopup },
    data() {
      return {
        phone: '', // 手机号
        verification: '', // 验证码
        timer: null, // 倒计时定时器
        second: 60,
        ifCount: false,
        reg: /^1[3-9]\d{9}$/, // 正则验证手机号
        code: /^\d{6}$/, // 正则验证验证码
        sessionKey: '',
        thirdAppId: '',
        channelId: '',
        canSend: false, // 能否发送验证码
        agree: false,
        showPopup: false, // 弹出框
      };
    },
    onLoad(options) {
      this.channelId = options.channelId;
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
      async userAgreement() {
        try {
          const response = await getH5ChannelId();
          const channelId = response.body;
          const a = uni.navigateTo({
            url: `/page_material/login/privacyAgreement?channelId=${channelId}`,
          });
          console.log(a);
        } catch (error) {
          console.error('获取渠道 ID 出错:', error);
        }
      },

      async privacyAgreement() {
        try {
          const response = await getH5ChannelId();
          const channelId = response.body;
          uni.navigateTo({
            url: `/page_material/login/privacyAgreement?channelId=${channelId}`,
          });
        } catch (error) {
          console.error('获取渠道 ID 出错:', error);
        }
      },
      changeAgree() {
        console.log(this.agree);
        this.agree = !this.agree;
      },
      checkAgree() {
        if (!this.agree) {
          uni.showToast({ icon: 'none', title: '请勾选用户协议以及隐私政策' });
        }
      },
      // 发送验证码 核心
      toSend: newThrottle(async function() {
        this.showPopup = false;
        const res = await getCode({ mobile: this.phone });
        if (res.body) {
          this.sessionKey = res.body.sessionKey;
          //跳转页面
          uni.navigateTo({
            url: `/home/login/checkMessageCode?type=messageCodeLogin&phone=${this.phone}&sessionKey=${this.sessionKey}`,
          });
        } else if (res.code == 2003) {
          uni.showToast({
            title: '您的操作太频繁，请1分钟后再试。',
            icon: 'none',
          });
        }
      }),
      //发送验证码
      handleSend: function() {
        if (this.reg.test(this.phone)) {
          if (!this.agree) {
            this.showPopup = true;
          } else {
            this.toSend();
          }
        } else {
          uni.showToast({
            title: '请输入正确的手机号',
            icon: 'none',
          });
        }
      },
      //去密码登录页面
      goPassword() {
        // uni.navigateTo({
        //   url: '/home/login/passwordLogin',
        // });
        uni.redirectTo({
          url: '/home/login/passwordLogin',
        });
      },
      // 转发页面
      async onShareAppMessage() {
        return {
          path: '/home/login/getMessageCode',
          // imageUrl: 'https://app.static.wangxiao.cn/ykmf/images/zuduishuati.png',
        };
      },
      // // 获取验证码
      // getBindCode: newThrottle(async function() {
      //   if (this.reg.test(this.phone)) {
      //     if (this.timer) {
      //       return;
      //     }
      //     const res = await getCode({ mobile: this.phone });
      //     if (res.body) {
      //       this.ifCount = true;
      //       this.sessionKey = res.body.sessionKey;
      //       this.startTimer();
      //     } else if (res.code == 2003) {
      //       uni.showToast({
      //         title: '您的操作太频繁，请1分钟后再试。',
      //         icon: 'none',
      //       });
      //     }
      //   } else {
      //     uni.showToast({
      //       title: '请输入手机号',
      //       icon: 'none',
      //     });
      //   }
      // }, 1000),
      // // 开启倒计时
      // startTimer() {
      //   if (this.timer) {
      //     clearInterval(this.timer);
      //   }
      //   let timeDown = 60000;
      //   this.timer = setInterval(() => {
      //     timeDown -= 1000;
      //     this.second = Math.floor(timeDown / 1000);
      //     if (timeDown < 1000) {
      //       clearInterval(this.timer);
      //       this.timer = null;
      //       this.endTime();
      //     }
      //   }, 1000);
      // },
      // // 结束倒计时
      // endTime() {
      //   this.ifCount = false;
      //   this.second = 60;
      // },
      // // 页面销毁时结束
      // beforeDestroy() {
      //   if (this.timer) {
      //     clearInterval(this.timer);
      //     this.timer = null;
      //   }
      // },
      // // 确认绑定
      // handleBind: newThrottle(async function() {
      //   if (this.reg.test(this.phone)) {
      //     if (this.code.test(this.verification)) {
      //       const res = await goCodeLogin({
      //         sessionKey: this.sessionKey,
      //         code: this.verification,
      //         channelId: this.thirdAppId,
      //       });
      //       if (res.body.accessToken) {
      //         this.accessToken = res.body.accessToken;
      //         this.userLogin();
      //       } else if (res.body.sessionKey) {
      //         uni.showToast({
      //           title: '获取验证码失败',
      //           icon: 'none',
      //         });
      //       }
      //     } else {
      //       uni.showToast({
      //         title: '请输入验证码',
      //         icon: 'none',
      //       });
      //     }
      //   } else {
      //     uni.showToast({
      //       title: '请输入手机号',
      //       icon: 'none',
      //     });
      //   }
      // }, 1000),
      // async userLogin() {
      //   this.$store.commit('setToken', this.accessToken);
      //   const res = await getUserInfo();
      //   this.$store.commit('setNickName', res.body.nickname);
      //   this.$store.commit('setAvatar', res.body.avatar);
      //   this.$store.commit('setUid', res.body.uid);
      //   this.$store.commit('setOrg', res.body.org);
      //   this.$store.commit('setTenantId', res.body.tenantId);
      //   this.$store.commit('setChannelId', this.channelId);
      //   const data = await getConfigure({ channelId: this.channelId });
      //   if (data.body.first) {
      //     uni.reLaunch({ url: '/business/selectExam/index' });
      //   } else {
      //     this.$store.commit('setProjectId', data.body.project.k);
      //     this.$store.commit('setProjectName', data.body.project.v);
      //     uni.reLaunch({ url: '/pages/home/index' });
      //   }
      // },
    },
  };
</script>

<style lang="scss" scoped>
  .login-bg {
    background-size: 100% 100%;
    background-color: #ffffff;
    width: 100%;
    // height: 100%;
    // position: fixed;
    // top: 0;
    height: calc(100vh - 88rpx);
    padding-top: 200rpx;
    background-color: #ffffff;
    .message-login-title {
      margin-left: 80rpx;
      // margin-top: 200rpx;
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

    .phone-box {
      display: flex;
      align-items: center;
      margin-left: 86rpx;
      margin-top: 214rpx;
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
      text-align: center;
      line-height: 96rpx;
      color: #ffffffff;
      font-size: 32rpx;
      font-weight: 600;
      font-family: 'PingFang SC';
      margin: 0 auto;
    }
    .active-btn {
      background: #e51600ff;
    }
    .no-active-btn {
      background: #f7b2aaff;
    }
    .password-btn {
      color: #9fa1a4ff;
      font-size: 28rpx;
      font-weight: 400;
      font-family: 'PingFang SC';
      text-align: center;
      margin-top: 24rpx;
    }
    .agreement-big-box {
      height: 150rpx;
      width: 100%;
      position: absolute;
      /* #ifndef H5 */
      bottom: 52rpx;
      /* #endif */
      /* #ifdef H5 */
      margin-top: 240rpx;
      position: relative;
      /* #endif */
    }
    .agreement {
      display: flex;
      flex-direction: row;
      position: absolute;
      bottom: 60rpx;
      margin: 0 50%;
      transform: translateX(-50%);
    }
    .icon-select_circular_1_2 {
      color: #e51600ff;
      font-size: 28rpx;
      margin-right: 16rpx;
    }
    .icon-select_circular_1_1 {
      font-size: 28rpx;
      margin-right: 16rpx;
    }
    .agreement-box {
      white-space: nowrap;
    }
    .login-tip-agree {
      font-size: 22rpx;
      line-height: 16rpx;
    }

    .pop-bottom-line {
      width: 690rpx;
      height: 2rpx;
      border-radius: 6rpx;
      opacity: 1;
      background: #ddddddff;
      margin: 0rpx auto 40rpx;
    }
    .pop-text {
      color: #4b538aff;
      font-size: 28rpx;
      font-weight: 400;
      font-family: 'PingFang SC';
      text-align: center;
    }
    .pop-btn {
      width: 580rpx;
      height: 96rpx;
      margin: 108rpx auto 0rpx;
      text-align: center;
      line-height: 96rpx;
      border-radius: 72rpx;
      background: #e51600ff;
      color: #ffffffff;
      font-size: 32rpx;
      font-weight: 600;
      font-family: 'PingFang SC';
    }
    .common-blue {
      color: #4b538a;
    }
  }
</style>
