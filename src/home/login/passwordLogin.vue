<!-- 密码登录页面 -->

<template>
  <view class="login-bg">
    <view class="password-login-title">密码登录</view>
    <view class="phone-password-box">
      <input
        placeholder="请输入手机号"
        placeholder-style="color:#c9cdd4ff;font-weight:400;"
        maxlength="11"
        type="number"
        v-model="phone"
        class="input-box"
      />
      <view class="password-login-line" />
      <input
        placeholder="密码"
        placeholder-style="color:#c9cdd4ff;font-weight:400;"
        maxlength="20"
        type="text"
        v-model="password"
        class="input-password"
        v-if="showPassword"
      />
      <input
        placeholder="密码"
        placeholder-style="color:#c9cdd4ff;font-weight:400;"
        maxlength="20"
        type="password"
        password
        v-model="password"
        class="input-password"
        v-else
      />
      <view
        :class="
          showPassword ? 'password-logo iconfont icon-hide' : 'password-logo iconfont icon-show'
        "
        @tap="changeInputType"
      ></view>
      <view class="password-login-line" />
    </view>
    <button
      type="primary"
      @tap="usePasswordLogin"
      :class="
        reg.test(phone) && password.length >= 8
          ? 'login-btn login-active'
          : 'login-btn login-no-active'
      "
    >
      登录
    </button>
    <view class="other-login">
      <!-- #ifdef H5 -->
      <view @tap="toMessageLogin">短信验证码登录</view>
      <!-- #endif -->
      <view @tap="toForgetPasswordStepOne">忘记密码</view>
    </view>
    <view class="agreement-big-box" @tap="changeAgree">
      <view class="agreement">
        <view class="iconfont icon-select_circular_1_2" v-if="agree" @tap.stop="changeAgree" />
        <view class="iconfont icon-select_circular_1_1" v-else @tap.stop="changeAgree" />
        <p class="text-size-sl common-tip flex-center agreement-box login-tip-agree">
          我已经阅读并同意<span class="common-blue" @tap.stop="userAgreement">《注册协议》</span
          >,<span class="common-blue" @tap.stop="privacyAgreement">《隐私保护指引》</span></p
        >
      </view>
    </view>
  </view>
</template>

<script>
  // import MovePopup from '@/components/MovePopup/move-popup.vue';
  import { passwordLogin, getUserInfo } from '@/api/modules/register/index.ts';
  import { getConfigure, setProject, getH5ChannelId } from '@/api/modules/user/index.ts';
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
  // import { newThrottle } from '@/utils/public.js';
  export default {
    name: 'passwordLogin',
    // components: { MovePopup },
    data() {
      return {
        phone: '', // 手机号
        password: '', //密码
        verification: '', // 验证码
        timer: null, // 倒计时定时器
        second: 60,
        ifCount: false,
        reg: /^1[3-9]\d{9}$/, // 正则验证手机号
        pass: /^\d{6}$/, // 正则验证密码
        code: /^\d{6}$/, // 正则验证验证码
        sessionKey: '',
        thirdAppId: '',
        channelId: '',
        agree: false,
        showPassword: false, //密码明文展示与否
        accessToken: '',
      };
    },
    watch: {
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
    computed: {
      projectId() {
        return this.$store.getters.getProjectId;
      },
      subjectId() {
        return this.$store.getters.getSubject;
      },
      isCard() {
        return this.$store.getters.getIsCard;
      },
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
      changeInputType() {
        console.log(this.showPassword);
        this.showPassword = !this.showPassword;
        console.log(this.showPassword);
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

      toMessageLogin() {
        uni.navigateTo({
          url: `/home/login/getMessageCode?channelId=${this.channelId}`,
        });
      },
      toForgetPasswordStepOne() {
        uni.navigateTo({
          url: '/home/login/forgetPasswordStepOne',
        });
      },

      //使用密码登录
      async usePasswordLogin() {
        this.checkAgree();
        if (!this.agree) {
          return;
        }
        if (this.reg.test(this.phone) && this.password.length >= 8) {
          console.log('success', this.phone, this.password);
          let that = this;
          uni.getSystemInfo({
            complete: async function(result) {
              const { deviceId = '', deviceModel = '', deviceBrand: deviceName = '' } = result;
              const res = await passwordLogin({
                mobile: that.phone,
                password: that.password,
                channelId: that.thirdAppId,
                deviceId,
                deviceModel,
                deviceName,
              });
              if (res.code == '1000') {
                console.log(res);
                that.accessToken = res.body.accessToken;
                await that.userLogin();
              } else if (res.code == '1017') {
                uni.showToast({
                  title: '账号或密码错误',
                  icon: 'none',
                });
              }
            },
          });
        } else {
          uni.showToast({
            title: '请输入正确的手机号和密码',
            icon: 'none',
          });
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
        if (this.isCard) {
          //保存从百度卡片进入首页的用户的项目和科目
          await setProject({ projectId: this.projectId, subjectIds: [this.subjectId] });
        }
        const data = await getConfigure({ channelId: this.channelId });
        if (uni.getStorageSync('joinId')) {
          if (!data.body.first) {
            this.$store.commit('setProjectId', data.body.project.k);
            this.$store.commit('setProjectName', data.body.project.v);
          }
          uni.reLaunch({ url: `/business/learnGroup/index?uid=${uni.getStorageSync('joinId')}` });
          return;
        }
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
          /* #ifndef H5 */
          if (pages?.length > 0) {
            if (pages?.[0].route == 'home/login/login') {
              bottomNavTo('/pages/home/index', 2);
            } else {
              uni.navigateBack({ delta: 2 });
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
          path: '/home/login/passwordLogin',
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
    height: calc(100vh - 88rpx);
    padding-top: 198rpx;
    background-color: #ffffff;
    .password-login-title {
      margin-left: 80rpx;
      color: #333333ff;
      font-size: 56rpx;
      font-weight: 600;
      font-family: 'PingFang SC';
      text-align: left;
    }
    .phone-password-box {
      margin: 128rpx 86rpx 0rpx;
      position: relative;
      width: 578rpx;
      font-size: 40rpx;
      font-weight: 400;
      font-family: 'PingFang SC';
      .password-login-line {
        height: 2rpx;
        width: 100%;
        border-radius: 6rpx;
        background: #ddddddff;
        margin-top: 18rpx;
      }
      .input-password {
        margin-top: 64rpx;
        width: 410rpx;
      }
      .password-logo {
        position: absolute;
        height: 40rpx;
        width: 40rpx;
        right: 2rpx;
        bottom: 18rpx;
        z-index: 99;
      }
    }
    .login-btn {
      width: 580rpx;
      height: 96rpx;
      margin-top: 82rpx;
      border-radius: 72rpx;
      opacity: 1;
      font-size: 32rpx;
      font-weight: 600;
      font-family: 'PingFang SC';
      line-height: 96rpx;
    }
    .login-active {
      background: #e51600ff;
    }
    .login-no-active {
      background: #f7b2aaff;
    }
    .other-login {
      display: flex;
      justify-content: flex-end;
      height: 40rpx;
      line-height: 40rpx;
      margin: 24rpx 86rpx 0rpx 86rpx;
      color: #9fa1a4ff;
      font-size: 28rpx;
      font-weight: 400;
      font-family: 'PingFang SC';
      /* #ifdef H5 */
      justify-content: space-between;
      /* #endif */
    }
    .agreement-big-box {
      height: 150rpx;
      width: 100%;
      /* #ifndef H5 */
      position: absolute;
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
    .common-blue {
      color: #4b538a;
    }
  }
</style>
