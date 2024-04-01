<!--
* @desc 个人主页
* @author 江玉龙
* @date 2022年08月05日
-->
<template>
  <view class="others-bg">
    <view class="head-box">
      <image :src="avatar" mode="aspectFill" />
      <view class="edit">
        <view class="t-icon t-icon-edit icon-style" />
        <p>编辑</p>
      </view>
    </view>
    <p class="name-text">{{ nickName }}</p>
    <view class="address">
      <view class="t-icon t-icon-group icon-company" />
      <p>张老师等的小组</p>
    </view>
    <view class="statistics">
      <p><span>粉丝</span>860<span>关注</span>48</p>
    </view>
    <view class="lately-box">
      <p class="text-size-main common-text-700 common-text">最近学习</p>
      <view class="list-box">
        <view class="text-center">
          <p class="census"><span>0</span>题</p>
          <p class="sign-name">今日做题</p>
        </view>
        <view class="text-center">
          <p class="census"><span>0</span>题</p>
          <p class="sign-name">本周做题</p>
        </view>
        <view class="text-center">
          <p class="census"><span>12</span>天</p>
          <p class="sign-name">累计学习</p>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'myPage',
    onLoad() {},
    computed: {
      nickName() {
        return this.$store.getters.getNickName;
      },
      avatar() {
        return this.$store.getters.getAvatar;
      },
    },
    data() {
      return {};
    },
    methods: {},
  };
</script>

<style lang="scss" scoped>
  .others-bg {
    padding-top: 32rpx;
    background-image: url('https://app.static.wangxiao.cn/ztb/Frame10918.png');
    width: 100%;
    height: 500rpx;
    position: relative;
    background-size: cover;
  }
  .head-box {
    margin: 0 32rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    image {
      width: 160rpx;
      height: 160rpx;
      border-radius: 50%;
      border: 6rpx solid #ffffff;
    }
    .edit {
      padding: 8rpx 24rpx;
      background-color: #475ffd;
      color: #ffffff;
      border-radius: 56rpx;
      font-size: 24rpx;
      display: flex;
      align-items: center;
      .icon-style {
        width: 24rpx;
        height: 24rpx;
        margin-right: 8rpx;
        margin-top: 4rpx;
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
    padding: 64rpx;
    .sign-name {
      font-size: 24rpx;
      font-weight: 400;
      color: #989ead;
      margin-top: 24rpx;
    }
    .census {
      font-size: 24rpx;
      font-weight: 400;
      color: #323949;
      span {
        font-size: 36rpx;
        font-weight: 700;
        color: #323949;
        margin-right: 4rpx;
      }
    }
  }
</style>
