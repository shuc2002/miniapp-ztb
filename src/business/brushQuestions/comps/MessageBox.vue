<!--
* @desc 题目广告信息
* @author daisitin
* @date 2022年04月24日
-->
<template>
  <view>
    <view class="message-box">
      <p class="text-size-xxs common-text">每天10题不够刷？立即解锁500道题</p>
      <view
        class="message-btn"
        @tap="commonFun.routeTo(`/page_commodity/commodity/pages/commodityBank?id=${vipId}`)"
        >去解锁</view
      >
    </view>
  </view>
</template>
<script>
  export default {
    name: 'messageBox',
    data() {
      return {};
    },
    computed: {
      vipId() {
        return uni.getStorageSync('vipId');
      },
    },
    methods: {},
  };
</script>
<style lang="scss" scoped>
  .message-box {
    padding: 0 32rpx;
    height: 72rpx;
    line-height: 72rpx;
    background-color: #f5f6fa;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 400;
    .message-btn {
      width: 92rpx;
      height: 36rpx;
      border-radius: 36rpx;
      background: #5b648d;
      color: #ffffff;
      font-size: 20rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
