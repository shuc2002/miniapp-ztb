<!-- 忘记密码获取验证码页面 -->

<template>
  <view class="login-bg">
    <p class="message-login-title">输入手机号</p>
    <view class="phone-box">
      <p class="text-size-sn common-text-400 common-text">+86</p>
      <input
        placeholder="请输入手机号"
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
  </view>
</template>

<script>
  //   import { getCode, goCodeLogin, getUserInfo } from '@/api/modules/register/index.ts';
  import { getCode } from '@/api/modules/register/index.ts';
  //   import { getConfigure } from '@/api/modules/user/index.ts';
  //   import baseInfo from '@/build/index';
  //   import {
  //     ChannelAppId,
  //     DouyinAppId,
  //     WeixinAppId,
  //     BaiduChannelId,
  //     DouyinChannelId,
  //     WeixinChannelId,
  //   } from '@/enums/msgEnum';
  import { newThrottle } from '@/utils/public.js';
  export default {
    name: 'forgetPasswordStepOne',
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
      };
    },
    // watch: {
    //      this.data.phone:{
    //         console.log(this.data.phone);
    //      }
    //   projectId() {
    //     return this.$store.getters.getProjectId;
    //   },
    //   token() {
    //     return this.$store.getters.getToken;
    //   },
    //   nickName() {
    //     return this.$store.getters.getNickName;
    //   },
    //   avatar() {
    //     return this.$store.getters.getAvatar;
    //   },
    //   uid() {
    //     return this.$store.getters.getUid;
    //   },
    //   tenantId() {
    //     return this.$store.getters.getTenantId;
    //   },
    // },
    // onLoad() {
    //   /* #ifdef H5 */
    //   this.thirdAppId = WeixinAppId[baseInfo.CHANNEL];
    //   this.channelId = WeixinChannelId[baseInfo.CHANNEL];
    //   /* #endif */
    //   /* #ifdef MP-TOUTIAO */
    //   this.thirdAppId = DouyinAppId[baseInfo.CHANNEL];
    //   this.channelId = DouyinChannelId[baseInfo.CHANNEL];
    //   /* #endif */
    //   /* #ifdef MP-BAIDU */
    //   this.thirdAppId = ChannelAppId[baseInfo.CHANNEL];
    //   this.channelId = BaiduChannelId[baseInfo.CHANNEL];
    //   /* #endif */
    //   /* #ifdef MP-WEIXIN */
    //   this.thirdAppId = WeixinAppId[baseInfo.CHANNEL];
    //   this.channelId = WeixinChannelId[baseInfo.CHANNEL];
    //   /* #endif */
    // },
    methods: {
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
      // 发送验证码 核心
      toSend: function() {
        //发送请求
        //跳转页面
        console.log('发送了');
        uni.navigateTo({
          url: '/home/login/checkMessageCode',
        });
      },
      //发送验证码
      handleSend: newThrottle(async function() {
        if (this.reg.test(this.phone)) {
          const res = await getCode({ mobile: this.phone });
          console.log(res);
          if (res.body) {
            this.ifCount = true;
            this.sessionKey = res.body.sessionKey;
            //发送成功以后 跳转到验证页面 先暂时跳转到直接修改的页面
            uni.navigateTo({
              url: `/home/login/checkMessageCode?type=resetPassword&phone=${this.phone}&sessionKey=${this.sessionKey}`,
            });
            // uni.navigateTo({
            //   url: '/home/login/resetPassword',
            // });
          } else if (res.code == 2003 || res.code == 1001) {
            uni.showToast({
              title: '您的操作太频繁，请1分钟后再试。',
              icon: 'none',
            });
          }
        } else {
          uni.showToast({
            title: '请输入正确的手机号',
            icon: 'none',
          });
        }
      }),
      // 转发页面
      async onShareAppMessage() {
        return {
          path: '/home/login/forgetPasswordStepOne',
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
    //   background-image: url(https://app.static.wangxiao.cn/ztb/bg1.png);
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
