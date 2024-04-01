<!--
* @desc 他人主页
* @author 江玉龙
* @date 2022年08月05日
-->
<template>
  <view class="others-bg">
    <view class="head-box">
      <image src="@/page_material/static/portrait.png" mode="aspectFill" />
      <view class="follow">+ 关注</view>
      <!-- <view class="no-follow">
        <view class="t-icon t-icon-Followed icon-style" />
        <p>已关注</p>
      </view> -->
      <view class="follow-tip">
        <view class="tip-trangle-top" />
        <view class="flex-center">
          <image src="@/page_material/static/tip.gif" mode="aspectFill" />
          <p>关注考友 一起学习</p>
        </view>
      </view>
    </view>
    <p class="name-text">SlowLee</p>
    <view class="address">
      <view class="t-icon t-icon-company icon-company" />
      <p>湖南省人民医院</p>
    </view>
    <view class="statistics">
      <p><span>关注TA的人</span>860<span>累计学习天数</span>48</p>
    </view>
    <view class="lately-box">
      <p class="text-size-main common-text-700 common-text">最近学习</p>
      <view class="list-box">
        <view class="commodity-box" v-for="(item, key) in list" :key="key">
          <image src="@/page_material/static/portrait.png" mode="aspectFit" />
          <p>中医执业医师资格考试历年真题精选作品</p>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'othersPage',
    onLoad() {},
    data() {
      return {
        list: [1, 2, 3, 4],
      };
    },
    methods: {},
  };
</script>

<style lang="scss" scoped>
  .others-bg {
    background-image: url('https://app.static.wangxiao.cn/ztb/Frame10918.png');
    width: 100%;
    height: 500rpx;
    position: relative;
    background-size: cover;
    padding-top: 32rpx;
  }
  .head-box {
    margin: 0 32rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    image {
      width: 160rpx;
      height: 160rpx;
      border-radius: 50%;
      border: 6rpx solid #ffffff;
    }
    .follow {
      padding: 8rpx 24rpx;
      background-color: #475ffd;
      color: #ffffff;
      border-radius: 56rpx;
      font-size: 24rpx;
    }
    .no-follow {
      padding: 8rpx 24rpx;
      border-radius: 56rpx;
      border: 2rpx solid #475ffd;
      font-size: 24rpx;
      color: #475ffd;
      display: flex;
      align-items: center;
      .icon-style {
        width: 24rpx;
        height: 24rpx;
        margin-right: 8rpx;
        margin-top: 4rpx;
      }
    }
    .follow-tip {
      position: absolute;
      right: 0;
      bottom: -40rpx;
      padding: 0 32rpx;
      background-color: #ffffff;
      border-radius: 24rpx;
      font-size: 24rpx;
      color: #323949;
      animation: tip 1s infinite alternate;
      .tip-trangle-top {
        position: absolute;
        top: -12rpx;
        right: 20px;
        width: 0;
        height: 0;
        border-left: 16rpx solid transparent;
        border-right: 16rpx solid transparent;
        border-bottom: 16rpx solid #ffffff;
      }
      image {
        width: 50rpx;
        height: 60rpx;
        margin-right: 6rpx;
      }
    }
    @keyframes tip {
      from {
        bottom: -48rpx;
      }
      to {
        bottom: -32rpx;
      }
    }
  }
  .name-text {
    font-size: 40rpx;
    font-weight: 700;
    color: #2c364e;
    margin: 32rpx 0 12rpx 32rpx;
  }
  .address {
    margin-left: 32rpx;
    margin-bottom: 80rpx;
    display: flex;
    align-items: center;
    .icon-company {
      width: 32rpx;
      height: 32rpx;
    }
    p {
      font-size: 28rpx;
      font-weight: 400;
      color: #5b648d;
      margin-left: 8rpx;
    }
  }
  .statistics {
    margin-bottom: 60rpx;
    p {
      font-size: 28rpx;
      font-weight: 700;
      color: #323949;
      margin-left: 32rpx;
    }
    span {
      font-weight: 400;
      color: #989ead;
      margin-right: 8rpx;
    }
    span:last-child {
      margin-left: 120rpx;
    }
  }
  .lately-box {
    min-height: 1000rpx;
    background-color: #ffffff;
    border-top-right-radius: 32rpx;
    border-top-left-radius: 32rpx;
    padding: 48rpx 24rpx;
  }
  .list-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    .commodity-box {
      margin-top: 48rpx;
      display: flex;
      flex-flow: column;
      align-items: center;
      image {
        width: 178rpx;
        height: 222rpx;
        border-radius: 16rpx;
      }
      p {
        width: 200rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        font-size: 24rpx;
        font-weight: 400;
        color: #323949;
        margin-top: 24rpx;
      }
    }
  }
</style>
