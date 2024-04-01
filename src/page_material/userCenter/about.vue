<!--
* @desc 选择考试
* @author 戴聪杰
* @date 2021年12月22日
-->
<template>
  <view class="page-bg">
    <view style="height: 2rpx" />
    <view class="logo-box">
      <image :src="appletLogo" class="logo-image" />
      <view class="introduce">
        <p class="text-size-xl common-text-700 common-text">{{ appletName }}</p>
        <P class="text-size-sn common-text-400 common-tip">职业教育行业领军企业 </P>
      </view>
    </view>
    <view class="brief-box">
      <view class="flex-item-center">
        <view class="sign" />
        <p class="text-size-main common-text-700 common-text">公司简介</p>
      </view>
      <view class="text-introduce">
        <p>
          {{ introduce }}
        </p>
      </view>
      <image src="@/page_material/static/license.png" />
    </view>
  </view>
</template>

<script>
  import baseInfo from '@/build/index';
  import { ChannelName, ChannelLogo, ChannelIntroduce } from '@/enums/msgEnum';
  export default {
    name: 'about',
    data() {
      return {
        appletName: '',
        appletLogo: '',
        introduce: '',
      };
    },
    onLoad() {
      this.appletName = ChannelName[baseInfo.CHANNEL];
      this.appletLogo = ChannelLogo[baseInfo.CHANNEL];
      this.introduce = ChannelIntroduce[baseInfo.CHANNEL];
    },
  };
</script>

<style lang="scss" scoped>
  .logo-box {
    margin: 40rpx 32rpx;
    display: flex;
    .logo-image {
      width: 138rpx;
      height: 132rpx;
      border-radius: 16rpx;
      margin-right: 40rpx;
      border: 2rpx solid #ecedf1;
    }
    .introduce {
      padding: 10rpx 0;
      display: flex;
      flex-flow: column;
      justify-content: space-between;
    }
  }
  .brief-box {
    margin: 0 32rpx;
    padding: 32rpx 40rpx;
    border-radius: 16rpx;
    background-color: #f5f6fa;
    .sign {
      height: 20rpx;
      background-color: #475ffd;
      width: 4rpx;
      margin-right: 16rpx;
    }
    .text-introduce {
      margin-top: 16rpx;
      margin-bottom: 40rpx;
      line-height: 1.5;
      font-size: 28rpx;
      font-weight: 400;
      color: #323949;
    }
    image {
      width: 322rpx;
      height: 232rpx;
      position: relative;
    }
    image::before {
      content: '中大英才营业执照';
      font-size: 20rpx;
      font-weight: 400;
      color: #ffffff;
      background: rgba(32, 35, 57, 0.6);
      position: absolute;
      bottom: 0;
      width: 324rpx;
      height: 48rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
