<!--
* @desc 直播回放
* @author 江玉龙
* @date 2023年01月06日
-->
<template>
  <view class="common-bg">
    <view class="list-box" v-for="(item, key) in list" :key="key">
      <image src="@/page_commodity/static/replay.png" />
      <view class="first-box">
        <p class="name">{{ item.replayName }}</p>
        <button class="play flex-center" @tap="handlePlay(item.playUrl)">播放</button>
      </view>
      <view class="text-size-xxs common-text-400 common-blue">{{ item.time }}</view>
      <view class="time">{{ item.startTime }} 至 {{ item.endTime }}</view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'playback',
    data() {
      return {
        list: [],
        hour: 0,
        minute: 0,
        second: 0,
      };
    },
    onLoad(options) {
      this.list = JSON.parse(decodeURIComponent(options.list));
      this.updateTimeData(this.list);
    },
    methods: {
      // 时间补全 0
      checkTime(i) {
        if (i < 10) {
          i = '0' + i;
        }
        return i;
      },
      // 拿到时分秒
      updateTimeData(val) {
        val.map((item) => {
          let hours = Math.floor(item.videoDuration / 60 / 60);
          let minutes = Math.floor((item.videoDuration / 60) % 60);
          let seconds = Math.floor(item.videoDuration % 60);

          this.hour = this.checkTime(hours);
          this.minute = this.checkTime(minutes);
          this.second = this.checkTime(seconds);
          if (hours > 0) {
            item.time = this.hour + '时' + this.minute + '分' + this.second + '秒';
          } else if (minutes > 0) {
            item.time = this.minute + '分' + this.second + '秒';
          } else {
            item.time = this.second + '秒';
          }
        });
      },
      // 播放
      handlePlay(playUrl) {
        uni.navigateTo({
          url: `/page_commodity/courseList/skipTo?indexUrl=${encodeURIComponent(
            JSON.stringify(playUrl)
          )}`,
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .common-bg {
    padding-top: 32rpx;
    padding-bottom: 32rpx;
  }
  .list-box {
    margin: 0 24rpx 32rpx 24rpx;
    border-radius: 24rpx;
    background: #ffffff;
    padding: 32rpx;
    image {
      width: 100%;
      height: 342rpx;
    }
  }
  .first-box {
    margin-top: 32rpx;
    margin-bottom: 8rpx;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    .name {
      font-size: 32rpx;
      font-weight: 700;
      color: #323949;
    }
    .play {
      margin: 0;
      flex-shrink: 0;
      width: 96rpx;
      height: 48rpx;
      border-radius: 36rpx;
      background: #eef2ff;
      font-size: 24rpx;
      font-weight: 700;
      color: #475ffd;
    }
  }
  .time {
    font-size: 24rpx;
    font-weight: 400;
    color: #989ead;
    margin-top: 32rpx;
  }
</style>
