<!--
* @desc 做题页tab
* @author daisitin
* @date 2022年04月24日
-->
<template>
  <view class="question-box">
    <!-- 题目信息 start  -->
    <view class="text-size-sn common-text">
      <p class="text-size-xxs">
        <text class="text-size-xl common-text-700 common-blue">{{ questionNum }}</text>
        <text class="text-size-xl">/</text>{{ length }}
      </p>
      <view class="question-name common-text-700">{{ projectName }}</view>
    </view>
    <!-- 题目信息 end  -->
    <!-- 按钮 start  -->
    <view class="question-btn text-size-xxs common-blue" @tap="routeTo('/business/report/plan')"
      >学习计划</view
    >
    <!-- 按钮 end  -->
  </view>
</template>
<script>
  export default {
    name: 'questionTab',
    props: {
      length: {
        type: Number,
        default: 0,
      },
      questionNum: {
        type: Number,
        default: 0,
      },
      projectName: {
        type: String,
        default: '',
      },
    },
    data() {
      return {};
    },
    methods: {
      routeTo(url) {
        uni.navigateTo({ url });
      },
    },
  };
</script>
<style lang="scss" scoped>
  .question-box {
    padding: 48rpx 40rpx;
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .question-name {
      margin-top: 6rpx;
    }
    .question-btn {
      width: 144rpx;
      height: 48rpx;
      border-radius: 56rpx;
      background: #eef2ff;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
