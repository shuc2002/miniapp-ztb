<template>
  <view :class="showType == 1 ? 'state-box-line-two' : 'state-box-big-img'" :style="[config.style]">
    <view v-if="showType == 1" class="state-box-line-two">
      <view
        class="state-box-one-line-two"
        :class="
          index % 2 == 1 && index > 1
            ? 'state-right bottom-box'
            : index % 2 == 1
            ? 'state-right'
            : index % 2 != 1 && index > 1
            ? 'state-left bottom-box'
            : 'state-left'
        "
        v-for="(item, index) in content"
        :key="index"
        @tap="handleClick(item.href[1])"
      >
        <view class="state-title">
          <view class="state-title-icon"></view>
          <view class="state-title-text">{{ item.title }}</view>
        </view>
        <view class="state-data">
          {{ item.href[1] == '每日一练' ? days : currentGroupData }}
        </view>
        <view class="state-ex">
          {{ item.href[1] == '每日一练' ? '累计坚持天数' : '小组答题' }}
        </view>
      </view>
    </view>
    <view
      class="state-box-one-big-img"
      :class="index != 0 ? 'bottom-box' : ''"
      v-for="(item, index) in content"
      :key="index"
      @tap="handleClick(item.href[1])"
      v-show="showType == 0"
    >
      <view class="state-title">
        <view class="state-title-icon"></view>
        <view class="state-title-text">{{ item.title }}</view>
      </view>
      <view class="state-data">
        {{ item.href[1] == '每日一练' ? days : currentGroupData }}
      </view>
      <view class="state-ex">
        {{ item.href[1] == '每日一练' ? '累计坚持天数' : '小组答题' }}
      </view>
    </view>
  </view>
</template>

<script>
  import baseInfo from '@/build/index';
  import { groupTip } from '@/enums/msgEnum';
  import publicFun from '@/utils/public.js';
  export default {
    name: 'StateCard',
    props: {
      days: { type: Number, default: 0 },
      currentGroupData: {
        type: Number,
        default: 0,
      },
      content: { type: Array, default: () => [] },
      showType: { type: Number, default: 0 }, // 0 大图模式 1 一行两个
      config: { type: Object, default: () => {} },
    },
    data() {
      return {
        code: '',
      };
    },
    methods: {
      handleClick(href) {
        console.log(href, 'hrefhref');
        if (href == '我的小组') {
          this.handleTeam();
        }
        if (href == '每日一练') {
          this.$emit('handleDailyExercise');
        }
      },
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
  // 一行两个
  .state-box-line-two {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 750rpx;
    // background-color:red;
    .state-box-one-line-two {
      background-color: #ffffff;
      position: relative;
      height: 216rpx;
      // width: 336rpx;
      width: 47%;
      border-radius: 20rpx;
      box-shadow: 0 0 30rpx 0 #e516001a;
      border: 0 solid #eeeeeeff;
      .state-title {
        display: flex;
        .state-title-icon {
          width: 8rpx;
          height: 20rpx;
          border-radius: 4rpx;
          background: #e51600ff;
          margin-top: 37rpx;
          margin-left: 32rpx;
        }
        .state-title-text {
          color: #333333ff;
          font-size: 28rpx;
          font-weight: 500;
          font-family: 'PingFang SC';
          line-height: 28rpx;
          margin-top: 32rpx;
          margin-left: 24rpx;
        }
      }
      .state-data {
        height: 78rpx;
        opacity: 1;
        color: #333333ff;
        font-size: 56rpx;
        font-weight: 600;
        font-family: 'PingFang SC';
        line-height: 78.4rpx;
        position: absolute;
        top: 80rpx;
        text-align: right;
        right: 63rpx;
      }
      .state-ex {
        // height: 30rpx;
        color: #9fa1a4ff;
        font-size: 22rpx;
        font-weight: 400;
        font-family: 'PingFang SC';
        text-align: right;
        line-height: 22rpx;
        position: absolute;
        right: 63rpx;
        top: 154rpx;
      }
    }
    // .state-left {
    //   margin-left: 30rpx;
    // }
    // .state-right {
    //   margin-left: 30rpx;
    // }
    .bottom-box {
      margin-top: 20rpx;
    }
  }
  // 大图模式
  .state-box-big-img {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 750rpx;
    .state-box-one-big-img {
      background-color: #ffffff;
      position: relative;
      height: 216rpx;
      // width: 700rpx;
      // width: 100%;
      width: 99%;
      border-radius: 20rpx;
      box-shadow: 0 0 30rpx 0 #e516001a;
      border: 0 solid #eeeeeeff;
      // margin-left: 25rpx;
      .state-title {
        display: flex;
        .state-title-icon {
          width: 8rpx;
          height: 20rpx;
          border-radius: 4rpx;
          background: #e51600ff;
          margin-top: 37rpx;
          margin-left: 32rpx;
        }
        .state-title-text {
          color: #333333ff;
          font-size: 28rpx;
          font-weight: 500;
          font-family: 'PingFang SC';
          line-height: 28rpx;
          margin-top: 32rpx;
          margin-left: 24rpx;
        }
      }
      .state-data {
        height: 78rpx;
        opacity: 1;
        color: #333333ff;
        font-size: 56rpx;
        font-weight: 600;
        font-family: 'PingFang SC';
        line-height: 78.4rpx;
        position: absolute;
        top: 80rpx;
        text-align: right;
        right: 63rpx;
      }
      .state-ex {
        color: #9fa1a4ff;
        font-size: 22rpx;
        font-weight: 400;
        font-family: 'PingFang SC';
        text-align: right;
        line-height: 22rpx;
        position: absolute;
        right: 63rpx;
        top: 154rpx;
      }
    }
    .bottom-box {
      margin-top: 20rpx;
    }
  }
</style>
