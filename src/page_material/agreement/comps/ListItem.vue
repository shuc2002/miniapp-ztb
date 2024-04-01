<template>
  <view class="item-box" @tap="gotoDetail()">
    <view class="flex content-box">
      <view class="icon-box iconfont icon-protocol"></view>
      <view class="text-box truncate-two">{{ data.exclusiveContractName }}</view>
    </view>
    <view class="more-btn iconfont icon-chevron-right "></view>
  </view>
</template>
<script>
  export default {
    name: 'agreement-item',
    props: {
      data: {
        type: Object,
      },
    },
    methods: {
      // 查看协议详情
      gotoDetail() {
        let isSigned = '';
        if (this.data.status == 0) {
          isSigned = 0;
        } else {
          isSigned = 1;
        }
        uni.navigateTo({
          url: `/page_material/agreement/agreementDetail?fileUrl=${this.data.exclusiveContractUrl}&recordId=${this.data.id}&isSigned=${isSigned}&isOrder=true`,
        });
      },
    },
  };
</script>
<style lang="scss" scoped>
  .item-box {
    background-color: #ffffff;
    width: 690rpx;
    height: 160rpx;
    margin: 24rpx auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    border-radius: var(--8, 8px);
  }
  .content-box {
    position: relative;
  }
  .icon-box {
    width: 26.37rpx;
    height: 30.82rpx;
    // margin-left: 30rpx;
    // margin-top: 8rpx;
    position: absolute;
    left: 31.66rpx;
    top: 5rpx;
    color: #ad724a;
  }
  .text-box {
    width: 546rpx;
    max-width: 546rpx;
    overflow: hidden;
    // margin-left: 16rpx;
    margin-left: 78rpx;
  }
  .more-btn {
    width: 24rpx;
    height: 24rpx;
    font-size: 24rpx;
    color: #9fa1a4;
    position: absolute;
    top: 70rpx;
    right: 30rpx;
    // margin-left: 12rpx;
  }
</style>
