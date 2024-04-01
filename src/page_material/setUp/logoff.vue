<!--
* @desc 注销
* @author 刘伟兴
* @date 2023年05月20日
-->
<template>
  <view class="logoff-page">
    <view class="logoff-line-top"></view>
    <view class="logoff-logo"></view>
    <p class="logoff-text">注销当前账号</p>
    <view class="logoff-info">
      <p class="logoff-mobie">当前绑定的手机号为:{{ phone }}</p>
      <p class="logoff-username" v-show="token">用户名：{{ nickName }}</p>
    </view>
    <view class="logoff-suggest-box">
      <p class="big-black-font">账户注销前，建议</p>
      <p class="big-black-font"
        >1.查看<span class="big-red-font">账户余额</span>,账号在{{
          title
        }}系统中无留有资产(包括但不限于学币积分等);</p
      >
      <p class="big-black-font"
        >2.查看<span class="big-red-font">我的订单</span>，<span class="big-red-font">我的课程</span
        >,账号内无未完成的订单，服务;</p
      >
      <p class="small-font"
        >账号一旦被注销，表示您自愿放弃账号内的服务，且账号将不可恢复，由此所导致的所有后果您自行承担，请您在操作之前自行备份准题库账号相关的所有信息和数据。</p
      >
    </view>
    <view class="logoff-agreement">
      <view class="radio-check t-icon t-icon-xuanze" v-if="agree" @tap="changeAgree" />
      <view class="radio-box mt-4" v-else @tap="changeAgree" />
      <p class="logoff-agreement-text">
        我已经阅读并了解以上信息，且自愿放弃账号内全部数据，权益资产及服务
      </p>
    </view>
    <button
      :class="agree ? 'to-logoff-btn active-btn' : 'to-logoff-btn no-active-btn'"
      @tap="toShowPop"
      >继续注销</button
    >
    <u-popup v-model="showPop" mode="center" width="602rpx" height="634rpx" border-radius="24">
      <view class="logoff-cancel-pop iconfont icon-close " @tap="toClosePop"></view>
      <p class="pop-text-1">注销账号</p>
      <p class="pop-text-2">{{ phone }}</p>
      <view class="check-code-box">
        <input
          placeholder="请输入验证码"
          placeholder-style="color:#c9cdd4ff;font-weight:400;"
          maxlength="6"
          v-model="checkCode"
          class="input-check-code"
        />
        <view v-show="!ifCount" class="get-check-code-btn" @tap="getCode">获取验证码</view>
        <p class="get-check-code-btn-2" v-show="ifCount">
          <span style="color: #333333ff;margin-right: 20rpx;">{{ second }} </span>秒后可重新获取
        </p>
        <view class="get-check-line" />
      </view>
      <button
        :class="code.test(checkCode) ? 'confirm-logoff active-btn' : 'confirm-logoff no-active-btn'"
        @tap="confirmLogoff"
        >确认注销</button
      >
      <p class="pop-text-3">*注销后对个人造成的损失将无法挽回，请慎重操作！</p>
    </u-popup>
    <view class="bottom-empty-box"></view>
  </view>
</template>
<script>
  import { getCancelCode, checkCancelCode, getUserInfo } from '@/api/modules/register/index.ts';
  // import { getSetup, setModify } from '@/api/modules/user/index';
  import baseInfo from '@/build/index';
  import { TitleByEnum } from '@/enums/msgEnum';
  export default {
    name: 'logoff',
    data() {
      return {
        agree: false,
        showPop: false, // 弹出框
        checkCode: '', // 验证码
        code: /^\d{6}$/, // 正则验证验证码
        timer: null, // 倒计时定时器
        second: 60,
        ifCount: false,
        phone: '',
        title: '',
      };
    },
    onLoad() {
      this.getPhone();
      this.title = TitleByEnum[baseInfo.CHANNEL];
    },
    computed: {
      token() {
        return this.$store.getters.getToken;
      },
      nickName() {
        return this.$store.getters.getNickName;
      },
      tenantId() {
        return this.$store.getters.getTenantId;
      },
    },
    methods: {
      // 获取手机号用于展示
      async getPhone() {
        const res = await getUserInfo();
        if (res.code == 1000) {
          this.phone = res.body.mobile;
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
      // 展开弹出框
      toShowPop() {
        if (this.agree) {
          this.showPop = true;
        } else {
          uni.showToast({
            title: '请先同意相关协议',
            icon: 'none',
          });
        }
      },
      // 关闭弹出框
      toClosePop() {
        this.checkCode = '';
        this.showPop = false;
      },
      // 获取注销用户的验证码
      async getCode() {
        const res = await getCancelCode();
        console.log(res);
        if (res.code == 1000) {
          this.ifCount = true;
          this.startTimer();
        } else if (res.code == 1001) {
          uni.showToast({
            title: '您的操作太频繁，请稍后重试',
            icon: 'none',
          });
        }
      },
      // 确认注销用户 验证验证码
      async confirmLogoff() {
        if (this.code.test(this.checkCode)) {
          const res = await checkCancelCode({ verifyCode: this.checkCode });
          console.log(res);
          if (res.code == 1000) {
            uni.showToast({
              title: '注销成功',
              icon: 'none',
            });
            this.$store.commit('setToken', '');
            let homeURL = '/home/login/login';
            /* #ifdef H5 */
            homeURL = '/home/login/passwordLogin';
            /* #endif */
            uni.reLaunch({
              url: homeURL,
            });
          } else {
            uni.showToast({
              title: '验证码不正确',
              icon: 'none',
            });
          }
        } else {
          uni.showToast({
            title: '请输入正确格式的验证码',
            icon: 'none',
          });
        }
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
    },
  };
</script>
<style lang="scss" scoped>
  .logoff-page {
    background-color: #ffffffff;
    .logoff-line-top {
      height: 2rpx;
      background: #f6f6f6;
    }
    .logoff-logo {
      width: 128rpx;
      height: 128rpx;
      // background-color: skyblue;
      margin-top: 56rpx;
      margin-left: 308rpx;
      background: url(../static/Frame.png) no-repeat;
      background-size: 100% 100%;
    }
    .logoff-text {
      margin-left: 264rpx;
      margin-top: 40rpx;
      height: 50rpx;
      color: #333333ff;
      font-size: 36rpx;
      font-weight: 500;
      font-family: 'PingFang SC';
      line-height: 50rpx;
    }
    .logoff-info {
      // width: 422rpx;
      height: 80rpx;
      margin-top: 16rpx;
      color: #9fa1a4ff;
      font-size: 28rpx;
      font-weight: 400;
      font-family: 'PingFang SC';
      // text-align: center;
      margin-left: 162rpx;
      .logoff-username {
        width: 422rpx;
        text-align: center;
      }
    }
    .logoff-suggest-box {
      width: 670rpx;
      height: 536rpx;
      border-radius: 16rpx;
      background: #f7f8faff;
      margin: 56rpx 40rpx 0rpx;

      .big-black-font {
        color: #333333ff;
        font-weight: 600;
        text-align: left;
        font-size: 28rpx;
        font-family: 'PingFang SC';
        margin-left: 40rpx;
        margin-right: 40rpx;
        padding-top: 40rpx;
        .big-red-font {
          color: #e51600ff;
        }
      }
      .small-font {
        color: #4e5969ff;
        font-weight: 400;
        // text-align: left;
        font-size: 24rpx;
        font-family: 'PingFang SC';
        margin-left: 40rpx;
        margin-right: 40rpx;
        line-height: 33.6rpx;
        padding-top: 40rpx;
      }
    }
    .logoff-agreement {
      display: flex;
      flex-direction: row;
      margin-top: 40rpx;
      // position: absolute;
      // bottom: 112rpx;
      // margin: 0 50%;
      // transform: translateX(-50%);
      .logoff-agreement-text {
        width: 630rpx;
        height: 64rpx;
        color: #9fa1a4ff;
        font-size: 22rpx;
        font-weight: 400;
        font-family: 'PingFang SC';
        text-align: left;
        line-height: 32rpx;
      }
    }
    .radio-check {
      width: 24rpx;
      height: 24rpx;
      margin-left: 40rpx;
      margin-right: 16rpx;
      margin-top: 5rpx;
      // line-height: 24rpx;
    }

    .radio-box {
      width: 24rpx;
      height: 24rpx;
      border: 2rpx solid #ecedf1;
      background-color: #f5f6fa;
      border-radius: 50%;
      margin-left: 40rpx;
      margin-right: 16rpx;
      margin-top: 5rpx;
      // line-height: 32rpx;
    }
    .to-logoff-btn {
      margin-top: 152rpx;
      margin-left: 86rpx;
      color: #ffffffff;
      font-size: 32rpx;
      font-weight: 600;
      width: 580rpx;
      height: 96rpx;
      line-height: 96rpx;
      text-align: center;
      border-radius: 72rpx;
      // background: #f7b2aaff;
    }
    .active-btn {
      background: #e51600ff;
    }
    .no-active-btn {
      background: #f7b2aaff;
    }
    .logoff-cancel-pop {
      width: 24rpx;
      height: 24rpx;
      // background-color: red;
      margin-left: 554rpx;
      margin-top: 24rpx;
      font-size: 24rpx;
    }
    .pop-text-1 {
      margin-top: 16rpx;
      height: 48rpx;
      color: #333333ff;
      font-size: 36rpx;
      font-weight: 600;
      font-family: 'PingFang SC';
      text-align: center;
      line-height: 48rpx;
    }
    .pop-text-2 {
      margin-top: 16rpx;
      height: 48rpx;
      color: #333333ff;
      font-size: 32rpx;
      font-weight: 500;
      font-family: 'PingFang SC';
      text-align: center;
      line-height: 44.8rpx;
    }
    .check-code-box {
      margin-top: 96rpx;
      margin-left: 48rpx;
      height: 78rpx;
      width: 506rpx;
      position: relative;
      .get-check-code-btn {
        position: absolute;
        top: 0rpx;
        right: 0rpx;
        width: 140rpx;
        height: 44rpx;
        color: #e51600ff;
        font-size: 28rpx;
        font-weight: 400;
        font-family: 'PingFang SC';
      }
      .get-check-code-btn-2 {
        position: absolute;
        top: 0rpx;
        right: 0rpx;
        // width: 140rpx;
        height: 44rpx;
        color: #c9cdd4ff;
        font-size: 28rpx;
        font-weight: 400;
        font-family: 'PingFang SC';
      }
      .input-check-code {
        position: absolute;
        top: 0rpx;
        left: 0rpx;
      }
      .get-check-line {
        height: 2rpx;
        width: 100%;
        border-radius: 6rpx;
        background: #ddddddff;
        position: absolute;
        bottom: 0rpx;
      }
    }
    .confirm-logoff {
      width: 506rpx;
      height: 96rpx;
      border-radius: 72rpx;
      margin: 48rpx;
      // background: #f7b2aaff;
      color: #ffffffff;
      font-size: 32rpx;
      font-weight: 600;
      font-family: 'PingFang SC';
      text-align: center;
      line-height: 96rpx;
    }

    .pop-text-3 {
      width: 472rpx;
      height: 28rpx;
      color: #e51600ff;
      font-size: 20rpx;
      font-weight: 400;
      font-family: 'PingFang SC';
      text-align: center;
      line-height: 28rpx;
      margin-left: 65rpx;
    }
    .bottom-empty-box {
      height: 132rpx;
    }
  }
</style>
