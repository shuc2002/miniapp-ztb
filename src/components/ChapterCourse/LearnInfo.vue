<template>
  <view class="chapter-content-wrap">
    <view>
      <u-circle-progress
        active-color="#E51600"
        borderWidth="7"
        width="168"
        :percent="courseInfo.percent"
      >
        <view class="u-progress-content">
          <view v-if="courseInfo.learnedProgress">{{ courseInfo.learnedProgress }}</view>
          <view v-else>
            <text class="number-style">0</text>
            <text class="percent">%</text>
          </view>
          <view class="u-progress-info">学习进度</view>
        </view>
      </u-circle-progress>
    </view>
    <view class="chapter-right-content-wrap">
      <view class="chapter-detail-title">{{ currentSubName }}</view>
      <view class="chapter-bottom-content-wrap">
        <view class="chapter-learned-status">
          <text class="doneText">已学</text>
          <text class="doneText"
            >{{
              currentTabIndex != 1
                ? courseInfo.typeDone
                  ? courseInfo.typeDone[currentTabIndex] || 0
                  : 0
                : ''
            }}{{
              currentTabIndex == 2 || currentTabIndex == 3
                ? '道'
                : currentTabIndex == 4 || currentTabIndex == 0
                ? '个'
                : currentTabIndex == 1
                ? formatSeconds(courseInfo.typeDone ? courseInfo.typeDone[currentTabIndex] : 0)
                : ''
            }}
          </text>
        </view>
        <view class="chapter-middle-line"></view>
        <view class="chapter-learned-duration">
          <text class="totalText">{{
            currentTabIndex == 2 || currentTabIndex == 3
              ? '总习题'
              : currentTabIndex == 4
              ? '总直播数'
              : currentTabIndex == 0
              ? '总资料数'
              : currentTabIndex == 1
              ? '总学时'
              : ''
          }}</text>
          <text class="totalText"
            >{{
              currentTabIndex !== 1
                ? courseInfo.typeNum
                  ? courseInfo.typeNum[currentTabIndex]
                  : 0
                : ''
            }}{{
              currentTabIndex == 2 || currentTabIndex == 3
                ? '道'
                : currentTabIndex == 4 || currentTabIndex == 0
                ? '个'
                : currentTabIndex == 1
                ? formatSeconds(courseInfo.typeNum ? courseInfo.typeNum[currentTabIndex] : 0)
                : ''
            }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'LearnInfo',
    props: ['currentTabIndex', 'courseInfo', 'currentSubName'],
    methods: {
      formatSeconds(value) {
        //  秒
        let second = value;
        //  分
        let minute = 0;
        //  小时
        let hour = 0;
        //  天
        //  let day = 0
        //  如果秒数大于60，将秒数转换成整数
        if (second > 60) {
          //  获取分钟，除以60取整数，得到整数分钟
          minute = parseInt(second / 60);
          //  获取秒数，秒数取佘，得到整数秒数
          second = parseInt(second % 60);
          //  如果分钟大于60，将分钟转换成小时
          if (minute > 60) {
            //  获取小时，获取分钟除以60，得到整数小时
            hour = parseInt(minute / 60);
            //  获取小时后取佘的分，获取分钟除以60取佘的分
            minute = parseInt(minute % 60);
            //  如果小时大于24，将小时转换成天
            //  if (hour > 23) {
            //    //  获取天数，获取小时除以24，得到整天数
            //    day = parseInt(hour / 24)
            //    //  获取天数后取余的小时，获取小时除以24取余的小时
            //    hour = parseInt(hour % 24)
            //  }
          }
        }
        let result = `${hour}时${minute}分`;
        return String(result);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .number-style {
    color: #e61d08;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 28px;
  }
  .chapter-class {
    color: #333333;
    font-size: 36rpx;
    font-weight: 500;
  }
  .chapter-content-wrap {
    display: flex;
    justify-content: space-around;
    margin-top: 24rpx;
  }
  .chapter-right-content-wrap {
    width: 360rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .chapter-detail-title {
      font-size: 32rpx;
      font-weight: 500;
      color: #4e4e4e;
    }
    .chapter-bottom-content-wrap {
      display: flex;
      justify-content: space-between;
      .chapter-learned-status {
        display: flex;
        flex-direction: column;
        .doneText {
          color: #9fa1a4;
          font-size: 12px;
          font-weight: 400;
          font-family: 'PingFang SC';
        }
      }
      .chapter-middle-line {
        border-left: 1px solid #eeeeee;
      }
      .chapter-learned-duration {
        display: flex;
        flex-direction: column;
        .totalText {
          color: #9fa1a4;
          font-size: 12px;
          font-weight: 400;
          font-family: 'PingFang SC';
        }
      }
    }
  }
  .u-progress-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .percent {
    color: #4e5969;
    position: absolute;
    margin-left: 10rpx;
    font-size: 24rpx;
    margin-top: 17rpx;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  .u-progress-info {
    font-size: 28rpx;
    // padding-left: 16rpx;
    padding-left: 5rpx;
    letter-spacing: 2rpx;
    color: #9fa1a4;
    font-size: 10px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
</style>
