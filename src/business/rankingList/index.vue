<!--
* @desc 本周排行榜
* @author 江玉龙
* @date 2022年08月08日
-->
<template>
  <view class="common-bg">
    <view class="time-box">
      <p>排名将于周日晚24时更新</p>
      <p
        >剩余<span>{{ week == 0 ? week : 7 - week }}</span
        >天<span>{{ hour }}</span
        >小时</p
      >
    </view>
    <view class="group-box">
      <!-- tab栏 start -->
      <view class="flex-center title-box">
        <view class="title-item">
          <view
            class="btn-my flex-center"
            @tap="handleTitle(0)"
            :class="activeNum === 0 ? 'bg-btn-title' : 'common-tip'"
            >地区</view
          >
          <view
            class="btn-my flex-center"
            @tap="handleTitle(1)"
            :class="activeNum === 1 ? 'bg-btn-title' : 'common-tip'"
            >单位</view
          >
          <view
            class="btn-my flex-center"
            @tap="handleTitle(2)"
            :class="activeNum === 2 ? 'bg-btn-title' : 'common-tip'"
            >关注</view
          >
        </view>
      </view>
      <Probably />
      <view class="flex-center-box number-title">
        <p class="text-size-min common-text-400 common-tip">排名</p>
        <p class="text-size-min common-text-400 common-tip">答对题数</p>
      </view>
      <!-- tab栏 end -->
      <!-- 榜单 start -->
      <scroll-view
        style="height: 80vh"
        scroll-y="true"
        @scrolltolower="handleToLower"
        scroll-with-animation
        show-scrollbar="false"
      >
        <!-- 自己的信息 -->
        <view class="info-box">
          <view class="flex-center">
            <RankGroup :keys="ourInfo.rank + 1" />
            <image :src="ourInfo.avatar" class="img-style" mode="aspectFill" lazy-load="true" />
            <view class="name-item">{{ ourInfo.nickname }}</view>
          </view>
          <view class="text-size-sn common-text">{{ ourInfo.count }}</view>
        </view>
        <!-- 榜单信息 -->
        <view v-for="(item, key) in ourList" :key="key">
          <view class="group-item">
            <view class="flex-center">
              <RankGroup :keys="key + 1" />
              <image :src="item.avatar" class="img-style" lazy-load="true" mode="aspectFill" />
              <view class="name-item">{{ item.nickname }}</view>
            </view>
            <view class="text-size-sn common-text">{{ item.count }}</view>
          </view>
        </view>
      </scroll-view>
      <!-- 榜单 end -->
      <view class="no-card flex-column-center">
        <image src="@/static/img/empty/integral.png" mode="scaleToFill" />
        <p class="text-size-sn common-text-400 common-tip">完善你的单位信息，查看单位排名</p>
        <button class="address-btn flex-center" @tap="handleAddress">完善我的单位</button>
      </view>
    </view>
  </view>
</template>
<script>
  import Probably from '@/components/Probably/Probably.vue';
  import { throttle } from '@/page_commodity/courseList/util';
  import RankGroup from '@/business/learnGroup/comps/RankGroup.vue';
  export default {
    name: 'rankingList',
    components: { RankGroup, Probably },
    onLoad() {
      this.reset();
    },
    data() {
      return {
        activeNum: 0,
        ourInfo: {
          rank: 0,
          avatar: '',
          nickname: '111',
          count: 111,
        },
        week: 0,
        hour: 0,
        timer: null,
      };
    },
    methods: {
      handleTitle(key) {
        this.activeNum = key;
      },
      // 触底加载更多
      handleToLower: throttle(function() {}, 300),
      // 获取单位信息
      handleAddress() {},
      // 每周倒计时
      reset() {
        const startTime = new Date(); // 当前时间
        const endTime = new Date(new Date().setHours(23, 59, 59, 999)); // 设置今天最后时间
        this.week = startTime.getDay();
        this.hour = Math.floor((endTime.getTime() - startTime.getTime()) / 1000 / 60 / 60);
        if (this.timer) {
          clearInterval(this.timer);
        }
        if (endTime.getTime() - startTime.getTime() < 1000) {
          return;
        }
        let timeDown = endTime.getTime() - startTime.getTime();
        this.timer = setInterval(() => {
          timeDown -= 1000;
          this.hour = Math.floor(timeDown / 1000 / 60 / 60);
          if (timeDown < 1000) {
            clearInterval(this.timer);
          }
        }, 1000);
      },
    },
    // 页面销毁时结束
    beforeDestroy() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
  };
</script>
<style lang="scss" scoped>
  .time-box {
    padding: 16rpx 32rpx;
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      font-size: 24rpx;
      font-weight: 400;
      color: #989ead;
      span {
        color: #333228;
      }
    }
  }
  .group-box {
    background-color: white;
    padding: 32rpx 24rpx;
    border-radius: 24rpx;
    margin: 24rpx;
  }
  .title-box {
    margin-bottom: 32rpx;
    .title-item {
      margin: auto;
      height: 48rpx;
      display: flex;
      justify-content: center;
      border: 2rpx solid #d8dae1;
      border-radius: 56rpx;
      .btn-my {
        padding: 6rpx 36rpx;
        border-radius: 24rpx;
        font-size: 24rpx;
        font-weight: 700;
      }
      .bg-btn-title {
        background: #ecedf1;
        color: #323949;
      }
    }
  }
  .number-title {
    margin-top: 16rpx;
    margin-bottom: 12rpx;
    p:first-child {
      margin-left: 32rpx;
    }
    p:last-child {
      margin-right: 20rpx;
    }
  }
  .info-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
    border-radius: 24rpx;
    padding: 14rpx 28rpx;
    background-color: #f5f6fa;
  }
  .group-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40rpx;
    padding: 0 28rpx;
  }
  .img-style {
    width: 96rpx;
    height: 96rpx;
    border: 2rpx solid #ffffff;
    border-radius: 50%;
    margin-left: 28rpx;
    margin-right: 40rpx;
  }
  .name-item {
    font-size: 28rpx;
    font-weight: 600;
    color: #333228;
  }
  .no-card {
    position: absolute;
    top: 24%;
    left: 0;
    right: 0;
    image {
      width: 324rpx;
      height: 316rpx;
    }
    .address-btn {
      border-radius: 24rpx;
      background-color: #eef2ff;
      width: 528rpx;
      height: 96rpx;
      font-size: 32rpx;
      font-weight: 700;
      color: #475ffd;
      margin-top: 48rpx;
    }
  }
</style>
