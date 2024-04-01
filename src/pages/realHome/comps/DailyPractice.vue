<template>
  <view class="state-box">
    <view class="state-box-left">1</view>
    <view class="state-box-right">2</view>
    <view class="flex-center-box">
      <!-- 累计天数栏 start -->
      <!-- <view
        class="state-msg-item flex-center"
        @tap="commonFun.routeTo('/business/brushQuestions/punchIn')"
      >
        <view class="text-size-xxxl">{{
          token ? (learnSattistics.days ? learnSattistics.days : '0') : '--'
        }}</view>
        <view class="flex-center logoMsg">
          <image src="@/static/img/home/day.png" />
          <text class="text-size-sn common-message">累计坚持天数</text>
        </view> -->
      <!-- </view> -->
      <!-- 累计天数栏 end -->
      <!-- 做题状态 start -->
      <!-- <view class="state-msg-item flex-center">
        <view class="sum-text">
          <view class="accuracy">
            <text class="text-size-xxs common-tip">做题数：</text
            ><text class="text-size-sn common-text">{{
              token ? (learnSattistics.sum ? learnSattistics.sum : '0') : '--'
            }}</text>
          </view>
          <view class="accuracy">
            <text class="text-size-xxs common-tip">正确率：</text
            ><text class="text-size-sn common-text">{{
              token ? (learnSattistics.rate ? learnSattistics.rate + '%' : '0%') : '--'
            }}</text>
          </view>
        </view>
      </view> -->
      <!-- 做题状态 end -->
    </view>
    <!-- 按钮 start -->
    <view class="flex">
      <!-- <view
        class="common-button flex-center"
        @tap="
          learnSattistics.signed
            ? learnSattistics.shared
              ? clickRedo()
              : handleMark()
            : clickBrush()
        "
      >
        {{ !learnSattistics.signed ? '领取' : '进入' }}每日一练<view
          class="unclocked-box"
          v-show="!learnSattistics.signed"
          >未打卡</view
        >
      </view> -->
      <!-- #ifdef MP-WEIXIN -->
      <!-- <view class="my-group flex-center" @tap="handleTeam()">我的小组</view> -->
      <!-- #endif -->
    </view>
    <!-- 按钮 end -->
    <!-- 头像集合 -->
    <!-- <PhotoList :photoList="photoList" :manNumber="number" /> -->
    <PopupWindow
      ref="share"
      title="分享解锁"
      cancelTitle="重做一遍"
      confirmTitle="立即分享"
      :cancelShow="true"
      :openType="'share'"
      height="366rpx"
      @cancel="clickBrush()"
    >
      <p class="text-modal"
        >你已完成10道题，分享至<text class="common-blue">{{ projectName }}群</text>即可继续做题</p
      >
    </PopupWindow>
  </view>
</template>

<script>
  import PhotoList from './PhotoList.vue';
  import { checkSign, getEmpower } from '@/api/modules/question/exercise';
  import PopupWindow from '@/components/PopupComp/PopupWindow.vue';

  import baseInfo from '@/build/index';
  import { dakaTip, groupTip } from '@/enums/msgEnum';
  import publicFun from '@/utils/public.js';

  export default {
    name: 'DailyPractice',
    components: { PhotoList, PopupWindow },
    props: {
      learnSattistics: {
        type: Object,
        default: () => ({
          signCount: '--',
          queCount: '--',
          accuracy: '--',
        }),
      },
      number: { type: Number, default: 0 },
      photoList: { type: Array, default: () => [] },
      token: { type: String, default: '' },
      projectName: { type: String, default: '' },
    },
    data() {
      return {
        code: '',
      };
    },
    methods: {
      // 打开分享弹窗
      handleMark() {
        this.$refs.share.showModal = true;
      },
      async clickRedo() {
        // 检测是否领取每日一练
        let data = await checkSign();
        uni.showToast({
          title: '正在重新答题',
        });
        if (data.code == 1000) {
          let code = data.body.code;
          this.$store.commit('setDailyCode', code);
          uni.navigateTo({
            url: `/business/brushQuestions/index?code=${code}`,
          });
        } else {
          let res = await getEmpower();
          uni.navigateTo({
            url: `/business/brushQuestions/index?code=${res.body.code}`,
          });
        }
        /* #ifdef MP-WEIXIN */
        wx.requestSubscribeMessage({ tmplIds: [dakaTip[baseInfo.CHANNEL]] });
        /* #endif */
      },
      async clickBrush() {
        // 检测是否领取每日一练
        let data = await checkSign();
        if (data.code == 1000) {
          let code = data.body.code;
          this.$store.commit('setDailyCode', code);
          uni.navigateTo({
            url: `/business/brushQuestions/index?code=${code}`,
          });
        } else {
          let res = await getEmpower();
          uni.navigateTo({
            url: `/business/brushQuestions/index?code=${res.body.code}`,
          });
        }
        /* #ifdef MP-WEIXIN */
        wx.requestSubscribeMessage({ tmplIds: [dakaTip[baseInfo.CHANNEL]] });
        /* #endif */
      },
      // 小组跳转
      handleTeam() {
        const value = uni.getStorageSync('token');
        const projectId = uni.getStorageSync('projectId');
        if (value) {
          if (projectId) {
            publicFun.throttle(function() {
              uni.navigateTo({
                url: '/business/learnGroup/index',
              });
              /* #ifdef MP-WEIXIN */
              wx.requestSubscribeMessage({ tmplIds: [groupTip[baseInfo.CHANNEL]] });
              /* #endif */
            }, 2000);
          } else {
            publicFun.throttle(function() {
              uni.navigateTo({
                url: '/business/selectExam/index',
              });
            }, 2000);
          }
        } else {
          // eslint-disable-next-line no-undef
          let pages = getCurrentPages();
          let homeURL = '/home/login/login';
          /* #ifdef H5 */
          homeURL = '/home/login/passwordLogin';
          /* #endif */
          if (pages.length == 1) {
            uni.navigateTo({
              url: homeURL,
            });
          } else {
            uni.redirectTo({
              url: homeURL,
            });
          }
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .state-box {
    display: flex;
    // margin-top: -144rpx;

    // height: 216rpx;
    // width: 335rpx;
    // background-color: #ffffff;
    .state-box-left {
      background-color: #ffffff;
      // width: calc(100% - 64rpx);
      position: relative;
      height: 216rpx;
      width: 335rpx;
      border-radius: 20rpx;
      // margin-top: 32rpx;
      // margin-top: -144rpx;
      // border-radius: 20rpx;
      // height: 216rpx;
      // width: 335rpx;
      margin-top: -144rpx;
      margin-left: 30rpx;
      box-shadow: 0 0 30rpx 0 #e516001a;
      border: 0 solid #eeeeeeff;
      // z-index: 999;
      // padding: 32rpx;

      .state-msg-item {
        width: 50%;
        flex-flow: column;
        .sum-text {
          display: flex;
          flex-flow: column;
          align-items: baseline;
          .accuracy {
            margin-top: 22rpx;
          }
        }
        .logoMsg {
          text-align: center;

          image {
            margin-right: 10rpx;
            width: 32rpx;
            height: 36rpx;
          }
        }
      }
      .common-button {
        width: 100%;
        margin-top: 44rpx;
        margin-right: 16rpx;
        .unclocked-box {
          width: 92rpx;
          height: 36rpx;
          line-height: 36rpx;
          text-align: center;
          border-radius: 56rpx;
          background: rgba(255, 238, 131, 1);
          color: #8c513e;
          font-size: 20rpx;
          margin-left: 10rpx;
        }
      }
      .my-group {
        margin-top: 44rpx;
        width: 260rpx;
        height: 96rpx;
        border-radius: 16rpx;
        background: #eef2ff;
        font-size: 32rpx;
        font-weight: 700;
        color: #475ffd;
      }
    }
    .state-box-right {
      margin-left: 20rpx;
      box-shadow: 0 0 30rpx 0 #e516001a;
      border: 0 solid #eeeeeeff;
      height: 216rpx;
      width: 335rpx;
      border-radius: 20rpx;
      margin-top: -144rpx;
      background-color: #ffffff;
    }
    .text-modal {
      padding: 0 40rpx;
    }
  }
  // .state-box-left {
  //   background-color: #ffffff;
  //   // width: calc(100% - 64rpx);
  //   position: relative;
  //   // margin-top: 32rpx;
  //   margin-top: -144rpx;
  //   border-radius: 20rpx;
  //   height: 216rpx;
  //   width: 335rpx;
  //   margin-left: 30rpx;
  //   box-shadow: 0 0 30rpx 0 #e516001a;
  //   border: 0 solid #eeeeeeff;
  //   // padding: 32rpx;

  //   .state-msg-item {
  //     width: 50%;
  //     flex-flow: column;
  //     .sum-text {
  //       display: flex;
  //       flex-flow: column;
  //       align-items: baseline;
  //       .accuracy {
  //         margin-top: 22rpx;
  //       }
  //     }
  //     .logoMsg {
  //       text-align: center;

  //       image {
  //         margin-right: 10rpx;
  //         width: 32rpx;
  //         height: 36rpx;
  //       }
  //     }
  //   }
  //   .common-button {
  //     width: 100%;
  //     margin-top: 44rpx;
  //     margin-right: 16rpx;
  //     .unclocked-box {
  //       width: 92rpx;
  //       height: 36rpx;
  //       line-height: 36rpx;
  //       text-align: center;
  //       border-radius: 56rpx;
  //       background: rgba(255, 238, 131, 1);
  //       color: #8c513e;
  //       font-size: 20rpx;
  //       margin-left: 10rpx;
  //     }
  //   }
  //   .my-group {
  //     margin-top: 44rpx;
  //     width: 260rpx;
  //     height: 96rpx;
  //     border-radius: 16rpx;
  //     background: #eef2ff;
  //     font-size: 32rpx;
  //     font-weight: 700;
  //     color: #475ffd;
  //   }
  // }
  // .text-modal {
  //   padding: 0 40rpx;
  // }
</style>
