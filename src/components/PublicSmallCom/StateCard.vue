<template>
  <view :class="showType == 0 ? 'state-box-0' : 'state-box-1'" style="z-index:9999">
    <view v-if="showType == 0">
      <view
        class="state-box-one"
        :class="index % 2 == 0 ? 'state-right' : 'state-left'"
        v-for="(item, index) in content"
        :key="index"
        @tap="handleClick(item.href)"
      >
        <view class="state-title">
          <view class="state-title-icon"></view>
          <view class="state-title-text">{{ item.type }}</view>
        </view>
        <view class="state-data">
          {{ item.type == '每日一练' ? days : currentGroupData }}
        </view>
        <view class="state-ex">
          {{ item.type == '每日一练' ? '累计坚持天数' : '小组答题' }}
        </view>
      </view>
    </view>
    <view v-if="showType == 1">
      <view
        class="state-box-one-2"
        v-for="(item, index) in content"
        :key="index"
        @tap="handleClick(item.href)"
      >
        <view class="state-title">
          <view class="state-title-icon"></view>
          <view class="state-title-text">{{ item.type }}</view>
        </view>
        <view class="state-data">
          {{ item.type == '每日一练' ? days : currentGroupData }}
        </view>
        <view class="state-ex">
          {{ item.type == '每日一练' ? '累计坚持天数' : '小组答题' }}
        </view>
      </view></view
    >
    <!-- <view class="state-box-one state-right" @tap="handleTeam">
      <view class="state-title">
        <view class="state-title-icon"></view>
        <view class="state-title-text">我的小组</view>
      </view>
      <view class="state-data">
        {{ currentGroupData }}
      </view>
      <view class="state-ex">
        小组答题
      </view>
    </view> -->
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
      showType: { type: Number, default: 0 }, // 0 一行两个 1 大图模式
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
  .state-box-0 {
    display: flex;
    flex-wrap: wrap;
    .state-box-one {
      background-color: #ffffff;
      position: relative;
      height: 216rpx;
      width: 335rpx;
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
    .state-left {
      margin-left: 30rpx;
    }
    .state-right {
      margin-left: 20rpx;
    }
  }
  .state-box-1 {
    display: flex;
    flex-wrap: wrap;
    .state-box-one-2 {
      background-color: #ffffff;
      position: relative;
      height: 216rpx;
      width: 700rpx;
      border-radius: 20rpx;
      box-shadow: 0 0 30rpx 0 #e516001a;
      border: 0 solid #eeeeeeff;
      margin-left: 25rpx;
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
    .state-left {
      margin-left: 30rpx;
    }
    .state-right {
      margin-left: 20rpx;
    }
  }
</style>
