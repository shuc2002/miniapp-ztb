<!--
* @desc 选择考试
* @author 戴聪杰
* @date 2021年12月22日
-->
<template>
  <view class="login-bg">
    <!-- 试用暂时去掉 -->
    <!-- <view
      class=" iconfont icon-close"
      @tap="closeBack"
      style="font-size: 32rpx;margin-left: 48rpx;"
    /> -->
    <!-- 准题库图标 -->
    <view class="logo-area">
      <img class="login-img" :src="loginLogo" />
    </view>
    <!-- <img src="https://acc.wangxiao.cn/image/logo.png" class="login-img" /> -->
    <!-- #ifdef MP-WEIXIN -->

    <!-- 存在sessionKey且同意协议 -->
    <button
      type="primary"
      class="loginBtn flex-center"
      contact
      v-if="sessionKey && agree"
      open-type="getPhoneNumber"
      @getphonenumber="getPhoneNumber"
    >
      授权手机号快捷登录
    </button>
    <button
      type="primary"
      class="loginBtn flex-center"
      contact
      v-else-if="sessionKey && !agree"
      @tap="checkAgree"
    >
      授权手机号快捷登录
    </button>

    <view class="loginBtn flex-center" v-else @tap="accessToken ? userLogin() : ''">
      授权手机号快捷登录
    </view>
    <!-- #endif -->

    <!-- #ifdef MP-TOUTIAO -->

    <!-- 存在sessionKey且同意协议 -->
    <button
      type="primary"
      class="loginBtn flex-center"
      contact
      v-if="sessionKey && agree"
      open-type="getPhoneNumber"
      @getphonenumber="getPhoneNumber"
    >
      抖音手机号授权快捷登录
    </button>
    <button
      type="primary"
      class="loginBtn flex-center"
      contact
      v-else-if="sessionKey && !agree"
      @tap="checkAgree"
    >
      抖音手机号授权快捷登录
    </button>

    <view class="loginBtn flex-center" v-else @tap="accessToken ? userLogin() : ''">
      抖音手机号授权快捷登录
    </view>
    <!-- #endif -->

    <!-- #ifdef MP-BAIDU -->
    <button
      type="primary"
      class="loginBtn flex-center"
      contact
      open-type="getPhoneNumber"
      @getphonenumber="getPhoneNumber"
    >
      授权手机号快捷登录
    </button>
    <!-- #endif -->
    <!-- #ifdef H5 -->
    <button type="primary" class="loginBtn flex-center" @tap="goBindPhone">授权手机号登录</button>
    <!-- #endif -->

    <!-- 取消登录按钮  改为短信验证码-->
    <!-- <view class="login-message-btn flex-center" @tap="goUseMessage"> 短信验证码 </view> -->
    <!-- 密码登录 -->
    <view class="login-password-btn flex-center" @tap="goPasswordLogin">密码登录</view>
    <view class="agreement-big-box" @tap="changeAgree">
      <view class="agreement">
        <view class="iconfont icon-select_circular_1_2" v-if="agree" @tap.stop="changeAgree" />
        <view class="iconfont icon-select_circular_1_1" v-else @tap.stop="changeAgree" />
        <p class="text-size-sl common-tip flex-center agreement-box login-tip-agree">
          我已经阅读并同意<span class="common-blue" @tap.stop="userAgreement">《注册协议》</span
          >,<span class="common-blue" @tap.stop="privacyAgreement"> 《隐私保护指引》</span></p
        >
      </view>
    </view>
  </view>
</template>

<script>
  import {
    getRegister,
    getPhone,
    getUserInfo,
    getMiniPhone,
    getAccordAddress,

    // touristSign,
  } from '@/api/modules/register/index.ts';
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
    payoffTip,
    sucBuyTip,
    matureTip,
  } from '@/enums/msgEnum';
  import { bottomNavTo } from '@/utils/common.js';
  export default {
    data() {
      return {
        thirdAppId: '25689579',
        sessionKey: '',
        accessToken: '',
        channelId: '',
        agree: false,
        loginLogo: '',
      };
    },
    computed: {
      shareCode() {
        return uni.getStorageSync('shareCode');
      },
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
    onShow() {
      if (uni.getStorageSync('joinId')) {
        let joinId = uni.getStorageSync('joinId');
        uni.clearStorageSync();
        uni.setStorageSync('joinId', joinId);
      } else {
        uni.clearStorageSync();
      }
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
      /* #ifndef MP-BAIDU */
      this.getCode();
      /* #endif */
      this.getLoginLogo(this.channelId);
    },
    methods: {
      // 试用 需获取临时token
      // async closeBack() {
      //   const res = await touristSign();
      //   console.log(res, 'dddd');
      //   if (res.code == '1000') {
      //     this.$store.commit('setToken', res.body.accessToken);
      //     this.$store.commit('setChannelId', this.channelId);
      //     uni.setStorageSync('isTryOut', true);
      //     // this.$store.commit('setNickName', '游客');
      //     // this.$store.commit('setToken', res.body.accessToken);
      //   }
      //   //  console.log(this.channelId,'cccc');
      //   // this.$store.commit('setToken', '');
      //   uni.switchTab({
      //     url: '/pages/home/index',
      //   });
      // },
      async getLoginLogo(id) {
        const res = await getAccordAddress(id);
        this.loginLogo = res.body.imgUrl;
      },
      //去往短信验证码登录页面
      goUseMessage() {
        uni.navigateTo({
          url: `/home/login/getMessageCode?channelId=${this.channelId}`,
        });
      },
      //去往密码登录页面
      goPasswordLogin() {
        uni.navigateTo({
          url: '/home/login/passwordLogin',
        });
        // uni.redirectTo({
        //   url: '/home/login/passwordLogin',
        // });
      },
      /* #ifndef MP-BAIDU */
      //用户注册
      getCode() {
        let provider = '';
        let that = this;
        uni.getProvider({
          service: 'oauth',
          success: function(res) {
            provider = res.provider[0];
          },
        });
        uni.login({
          provider: provider,
          success: async function(res) {
            uni.showLoading({
              title: '加载中',
            });
            // 通过code去处理获取openID
            const data = await getRegister({
              channelId: that.thirdAppId,
              code: res.code,
            });
            if (data.body.accessToken) {
              that.accessToken = data.body.accessToken;
              uni.setStorageSync('token', this.accessToken);
            }
            uni.hideLoading();
            that.sessionKey = data.body.sessionKey;
          },
        });
      },
      /* #endif */

      async userLogin() {
        this.checkAgree();
        if (!this.agree) {
          return;
        }
        this.$store.commit('setToken', this.accessToken);
        uni.setStorageSync('token', this.accessToken);
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
        if (uni.getStorageSync('groupId')) {
          if (!data.body.first) {
            this.$store.commit('setProjectId', data.body.project.k);
            this.$store.commit('setProjectName', data.body.project.v);
          }
          uni.reLaunch({
            url: `/page_commodity/order/pages/collageDetail?groupId=${uni.getStorageSync(
              'groupId'
            )}`,
          });
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
          console.log(pages[0], 'pages');
          if (pages?.length > 0) {
            if (pages?.[0].route == 'home/login/login') {
              bottomNavTo('/pages/home/index', 2);
            } else {
              uni.navigateBack(1);
            }
          } else {
            bottomNavTo('/pages/home/index', 2);
          }
          /* #ifdef MP-WEIXIN */
          wx.requestSubscribeMessage({
            tmplIds: [
              payoffTip[baseInfo.CHANNEL],
              sucBuyTip[baseInfo.CHANNEL],
              matureTip[baseInfo.CHANNEL],
            ],
          });
          /* #endif */
        }
      },
      //获取手机号验证
      async getPhoneNumber(e) {
        console.log(e);
        let that = this;
        // 获取设备信息
        uni.getSystemInfo({
          complete: async function(res) {
            const { deviceId = '', deviceModel = '', deviceBrand: deviceName = '' } = res;
            /* #ifdef MP-BAIDU */
            // eslint-disable-next-line no-undef
            swan.getLoginCode({
              success: async function(res) {
                // 通过code去处理获取openID
                const data = await getRegister({
                  channelId: that.thirdAppId,
                  code: res.code,
                });
                if (data.body.accessToken) {
                  that.accessToken = data.body.accessToken;
                } else {
                  that.sessionKey = data.body.sessionKey;
                  const params = {
                    vector: e.detail.iv,
                    encrypted: e.detail.encryptedData,
                    sessionKey: that.sessionKey,
                    deviceId,
                    deviceModel,
                    deviceName,
                  };
                  //获取手机号
                  const res = await getPhone(params, that.shareCode);
                  that.accessToken = res.body.accessToken;
                  if (that.shareCode) {
                    uni.removeStorageSync('shareCode');
                  }
                }
                that.userLogin();
              },
              fail: function() {},
            });
            /* #endif */

            /* #ifndef MP-BAIDU */
            if (e.detail.iv && !that.accessToken) {
              const params = {
                /* #ifdef MP-WEIXIN */
                code: e.detail.code,
                /* #endif */
                /* #ifndef MP-WEIXIN */
                vector: e.detail.iv,
                encrypted: e.detail.encryptedData,
                /* #endif */
                sessionKey: that.sessionKey,
                deviceId,
                deviceModel,
                deviceName,
              };
              //分享邀请逻辑
              //获取手机号
              /* #ifdef MP-WEIXIN */
              const data = await getMiniPhone(params, that.shareCode);
              that.accessToken = data.body.accessToken;
              /* #endif */
              /* #ifndef MP-WEIXIN */
              const res = await getPhone(params, that.shareCode);
              that.accessToken = res.body.accessToken;
              /* #endif */
              if (that.shareCode) {
                uni.removeStorageSync('shareCode');
              }
              that.userLogin();
            }
            /* #endif */
          },
        });
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
      // 去绑定手机号（抖音）
      goBindPhone() {
        if (!this.agree) {
          uni.showToast({
            title: '请确认用户协议以及隐私政策',
            icon: 'none',
          });
          return;
        }
        uni.navigateTo({
          url: '/home/login/douyinLogin',
        });
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
      // 转发页面
      async onShareAppMessage() {
        return {
          path: '/home/login/login',
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
    .login-message-btn {
      font-size: 32rpx;
      font-weight: 600;
      width: 580rpx;
      height: 96rpx;
      border-radius: 72rpx;
      border: 1px solid #ddddddff;
      background-color: #ffffff;
      position: absolute;
      left: 50%;
      top: calc(50% + 116rpx);
      color: #333333ff;
      transform: translateX(-50%);
    }
    .loginBtn {
      font-size: 32rpx;
      font-weight: 600;
      position: absolute;
      left: 50%;
      // top: 50%;
      // top: 600rpx;
      transform: translateX(-50%);
      top: 660rpx;
      width: 580rpx;
      height: 96rpx;
      border-radius: 72rpx;
      color: #ffffff;
      background: #e51600ff;
      font-family: 'PingFang SC';
      // &:active {
      //   background-color: #394cca;
      // }
    }
    .login-password-btn {
      position: absolute;
      left: 50%;
      // top: calc(50% + 236rpx);
      // top: calc(50% + 110rpx);
      top: 780rpx;
      color: #333333ff;
      transform: translateX(-50%);
      color: #9fa1a4ff;
      font-size: 28rpx;
      font-weight: 400;
      font-family: 'PingFang SC';
      width: 100%;
    }
    .agreement-big-box {
      height: 150rpx;
      width: 100%;
      position: absolute;
      bottom: 52rpx;
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
      // background-color: red;
    }
    .login-tip-agree {
      font-size: 22rpx;
      line-height: 16rpx;
      // height: 32rpx;
      // line-height: 32rpx;
    }
  }
  .login-img {
    flex: 1;
    // width: 750rpx;
    // height: 320rpx;
    // max-width: 750rpx;
    max-height: 320rpx;
    // object-fit: contain;
    // min-width: 116rpx;
    // min-height: 116rpx;
    // border-radius: 58rpx;
    // font-size: 116rpx;
    // color: red;
    // position: absolute;
    // left: 50%;
    // top: 140rpx;
    // transform: translateX(-50%);
  }
  .logo-area {
    width: 750rpx;
    height: 320rpx;
    // background-color: skyblue;
    margin-top: 140rpx;
    display: flex;
    // justify-content: center;
    // align-items: center;
  }
  .common-blue {
    color: #4b538a;
  }
</style>
