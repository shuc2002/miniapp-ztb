<!--
* @desc 抖音登录绑定手机号
* @author 江玉龙
* @date 2022年09月20日
-->
<template>
  <view class="login-bg">
    <p class="text-box">手机号登录/注册</p>
    <view class="phone-box">
      <p class="text-size-sn common-text-400 common-text">+86</p>
      <input
        placeholder="请输入手机号码"
        placeholder-style="color:#989EAD;font-weight:400;"
        maxlength="11"
        v-model="phone"
        class="input-box"
      />
    </view>
    <view class="divider" />
    <view class="phone-box" style="justify-content: space-between">
      <input
        placeholder="请输入验证码"
        placeholder-style="color:#989EAD;font-weight:400;"
        maxlength="6"
        v-model="verification"
        class="input-box"
      />
      <p
        class="text-size-sn common-text-400"
        :class="ifCount ? 'common-tip' : 'common-blue'"
        @tap="ifCount ? '' : getBindCode()"
        >{{ ifCount ? '倒计时' + second + '秒' : '获取验证码' }}</p
      >
    </view>
    <view class="divider" />
    <view class="bindBtn flex-center" @tap="handleBind()">确认登录</view>
  </view>
</template>

<script>
  import { getCode, goCodeLogin, getUserInfo } from '@/api/modules/register/index.ts';
  import { getConfigure } from '@/api/modules/user/index.ts';
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
  import { newThrottle } from '@/utils/public.js';
  import { bottomNavTo } from '@/utils/common.js';
  export default {
    name: 'douyinLogin',
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
      };
    },
    onLoad() {
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
      // 获取验证码
      getBindCode: newThrottle(async function() {
        if (this.reg.test(this.phone)) {
          if (this.timer) {
            return;
          }
          const res = await getCode({ mobile: this.phone });
          if (res.body) {
            this.ifCount = true;
            this.sessionKey = res.body.sessionKey;
            this.startTimer();
          } else if (res.code == 2003) {
            uni.showToast({
              title: '您的操作太频繁，请1分钟后再试。',
              icon: 'none',
            });
          }
        } else {
          uni.showToast({
            title: '请输入手机号',
            icon: 'none',
          });
        }
      }, 1000),
      // 开启倒计时
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
      // 确认绑定
      handleBind: newThrottle(async function() {
        if (this.reg.test(this.phone)) {
          if (this.code.test(this.verification)) {
            const that = this;
            uni.getSystemInfo({
              complete: async function(result) {
                const { deviceId = '', deviceModel = '', deviceBrand: deviceName = '' } = result;
                const res = await goCodeLogin({
                  sessionKey: that.sessionKey,
                  code: that.verification,
                  channelId: that.thirdAppId,
                  deviceId,
                  deviceModel,
                  deviceName,
                });
                if (res.body.accessToken) {
                  that.accessToken = res.body.accessToken;
                  that.userLogin();
                } else if (res.body.sessionKey) {
                  uni.showToast({
                    title: '获取验证码失败',
                    icon: 'none',
                  });
                }
              },
            });
          } else {
            uni.showToast({
              title: '请输入验证码',
              icon: 'none',
            });
          }
        } else {
          uni.showToast({
            title: '请输入手机号',
            icon: 'none',
          });
        }
      }, 1000),
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
          bottomNavTo('/pages/home/index',2);
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .login-bg {
    background-image: url(https://app.static.wangxiao.cn/ztb/bg1.png);
    background-size: 100% 100%;
    background-color: #ffffff;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    background-color: #ffffff;
    .text-box {
      line-height: 79rpx;
      margin: 112rpx 0 124rpx 64rpx;
      font-size: 48rpx;
      font-weight: 700;
      color: #323949;
    }
    .phone-box {
      display: flex;
      align-items: center;
      margin-left: 64rpx;
      p {
        white-space: nowrap;
        margin-right: 64rpx;
      }
      .input-box {
        font-weight: 400;
        font-size: 32rpx;
        color: #323949;
      }
    }
    .divider {
      width: 622rpx;
      height: 2rpx;
      background-color: #ecedf1;
      margin: 34rpx 64rpx;
    }
    .bindBtn {
      font-size: 32rpx;
      font-weight: 700;
      width: 622rpx;
      height: 96rpx;
      margin: 112rpx auto;
      border-radius: 24rpx;
      color: #ffffff;
      background-color: #475ffd;
    }
  }
</style>
