<!--
* @desc 小组排行榜
* @author 江玉龙
* @date 2022年6月15日
-->
<template>
  <view class="group-box">
    <!-- tab栏 start -->
    <view class="flex-center title-box">
      <view class="title-item">
        <view
          class="btn-my flex-center"
          @tap="handleTitle(0)"
          :class="activeNum === 0 ? 'bg-btn-title' : 'color-text-tap'"
          v-show="groupId"
          >我的小组</view
        >
        <view
          class="btn-day flex-center"
          @tap="handleTitle(1)"
          :class="activeNum === 1 ? 'bg-btn-title' : 'color-text-tap'"
          >日榜</view
        >
        <view
          class="btn-day flex-center"
          @tap="handleTitle(2)"
          :class="activeNum === 2 ? 'bg-btn-title' : 'color-text-tap'"
          >周榜</view
        >
      </view>
    </view>
    <!-- tab栏 end -->
    <!-- 我的小组 start -->
    <scroll-view
      style="height: 54vh"
      scroll-y="true"
      @scrolltolower="handleToLower"
      scroll-with-animation
      show-scrollbar="false"
      v-show="activeNum === 0 && groupId"
    >
      <!-- 自己的信息 -->
      <view class="info-box">
        <view class="flex-center">
          <RankGroup :keys="rank + 1" />
          <view class="img-box">
            <view class="table-group" v-if="ourInfo.leader">组长</view>
            <image :src="ourInfo.avatar" class="img-style" mode="aspectFill" lazy-load="true" />
          </view>
          <view>
            <view class="name-item">{{ ourInfo.nickname }}</view>
            <view class="common-tip common-text-400 text-size-xxs" />
          </view>
        </view>
        <view class="text-size-sn common-text">{{ ourInfo.count + ' ' + '题' }}</view>
      </view>
      <!-- 榜单信息 -->
      <view v-for="(item, key) in ourList" :key="key">
        <view class="group-item">
          <view class="flex-center">
            <RankGroup :keys="key + 1" />
            <view class="img-box">
              <view class="table-group" v-if="item.leader">组长</view>
              <image :src="item.avatar" class="img-style" lazy-load="true" mode="aspectFill" />
            </view>
            <view>
              <view class="name-item">{{ item.nickname }}</view>
              <view class="common-tip common-text-400 text-size-xxs" />
            </view>
          </view>
          <view class="text-size-sn common-text">{{ item.count + ' ' + '题' }}</view>
        </view>
      </view>
    </scroll-view>
    <!-- 我的小组 end -->
    <!-- 日榜和周榜 -->
    <scroll-view
      style="height: 54vh"
      scroll-y="true"
      @scrolltolower="handleToLower"
      scroll-with-animation
      v-show="activeNum === 1 || activeNum === 2"
    >
      <!-- <view class="info-box visibility" v-if="groupId">
        <view class="flex-center">
          <RankGroup :keys="ownGroup[activeNum - 1].currentNo" />
          <view class="group-img">
            <image
              :src="ownGroup[activeNum - 1].avatars[data]"
              lazy-load="true"
              v-for="data in 4"
              :key="data"
            />
          </view>
          <view>
            <p class="text-size-sn common-text common-text-600">{{
              ownGroup[activeNum - 1].name
            }}</p>
            <p class="text-size-xxs common-tip common-text-400 text-name"
              >{{ ownGroup[activeNum - 1].members + ' 人' }}<span>|</span
              >{{ '每日一练做题 ' + ownGroup[activeNum - 1].counts }}</p
            >
          </view>
        </view>
      </view> -->
      <view v-for="(item, key) in list[activeNum - 1]" :key="key">
        <view class="group-item">
          <view class="flex-center">
            <RankGroup :keys="key + 1" />
            <view class="group-img">
              <image
                :src="item.avatars[data]"
                lazy-load="true"
                v-for="data in four"
                :key="data"
                mode="aspectFill"
              />
            </view>
            <view>
              <p class="text-size-sn common-text common-text-600">{{ item.name }}</p>
              <p class="text-size-xxs common-tip common-text-400 text-name"
                >{{ item.members + ' 人' }}<span>|</span>{{ '每日一练做题 ' + item.counts }}</p
              >
            </view>
          </view>
        </view>
      </view>
      <!-- 新增空数据展示 -->
      <view v-show="list[activeNum - 1].length === 0" class="empty-bg">
        <image src="https://acc.wangxiao.cn/image/empty-star.png" class="empty-star" />
        <view class="empty-text">排行更新中....</view>
      </view>
    </scroll-view>
  </view>
</template>
<script>
  import { throttle } from '@/page_commodity/courseList/util';
  import RankGroup from './RankGroup.vue';
  export default {
    name: 'myGroup',
    components: { RankGroup },
    props: {
      groupId: {
        type: String,
        default: '',
      },
      groupInfo: {
        type: Object,
      },
      list: {
        type: Array,
        default: () => [],
      },
      ownGroup: {
        type: Array,
        default: () => [],
      },
      ourList: {
        type: Array,
        default: () => [],
      },
      activeNum: {
        type: Number,
        default: 1,
      },
      ourInfo: {
        type: Object,
      },
      rank: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        four: [0, 1, 2, 3],
      };
    },
    methods: {
      handleTitle(key) {
        this.$emit('choose', key);
      },
      // 触底加载更多
      handleToLower: throttle(function() {
        this.$emit('handleToLower');
      }, 300),
    },
  };
</script>
<style lang="scss" scoped>
  .group-box {
    background-color: white;
    padding: 32rpx 48rpx;
    border-radius: 24rpx;
    margin: 24rpx 24rpx 0 24rpx;
  }
  .title-box {
    margin-bottom: 24rpx;
    .title-item {
      margin: auto;
      height: 48rpx;
      display: flex;
      justify-content: center;
      border: 2rpx solid #d8dae1;
      border-radius: 56rpx;
      .btn-my {
        width: 144rpx;
        height: 48rpx;
        border-radius: 24rpx;
        font-size: 24rpx;
        font-weight: 700;
      }
      .btn-day {
        width: 96rpx;
        height: 48rpx;
        border-radius: 24rpx;
        font-size: 24rpx;
        font-weight: 700;
      }
      .bg-btn-title {
        background: #ecedf1;
        color: #323949;
      }
      .color-text-tap {
        color: #989ead;
      }
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
  .img-box {
    display: flex;
    justify-content: center;
    margin-left: 28rpx;
    margin-right: 40rpx;
    .img-style {
      width: 96rpx;
      height: 96rpx;
      border: 2rpx solid #ffffff;
      border-radius: 50%;
    }
    .table-group {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 64rpx;
      height: 32rpx;
      border-radius: 16rpx;
      background-color: #323949;
      color: #ffffff;
      font-size: 20rpx;
      font-weight: 400;
      margin-top: 66rpx;
    }
  }
  .name-item {
    display: flex;
    justify-content: flex-start;
    font-size: 28rpx;
    font-weight: 600;
    color: #333228;
    margin-bottom: 8rpx;
  }

  .group-img {
    width: 88rpx;
    height: 88rpx;
    padding: 2rpx;
    border-radius: 16rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    margin-left: 40rpx;
    margin-right: 40rpx;
    background-color: #f5f6fa;
    image {
      width: 34rpx;
      height: 34rpx;
      border-radius: 32rpx;
      background-color: #ecedf1;
      margin: 4rpx;
    }
  }
  .text-name {
    margin-top: 8rpx;
    span {
      margin: 0 16rpx;
      font-size: 18rpx;
    }
  }
  .empty-bg {
    // width: 750rpx;
    margin-top: 128rpx;
    .empty-star {
      width: 344rpx;
      height: 344rpx;
      text-align: center;
      margin-left: 120rpx;
    }
    .empty-text {
      color: #9fa1a4;
      font-size: 28rpx;
      font-weight: 400;
      font-family: 'PingFang SC';
      text-align: center;
      line-height: 28rpx;
      margin-top: -90rpx;
    }
  }
</style>
