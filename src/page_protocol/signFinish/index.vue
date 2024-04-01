<template>
  <view>
    <view class="wrap-top flex flex-column">
      <CustomNavBack title="签署协议" @customBack="handleAction"></CustomNavBack>
      <!-- <view class="topbar"> </view> -->
      <!-- <view class="flex-item topbox">
        <view class="title-day">签署协议</view>
      </view> -->
    </view>
    <view class="flex-col page">
      <view class="flex-col flex-auto group_3">
        <view class="flex-col">
          <view class="flex-col justify-start items-center self-center image-wrapper">
            <img class="image_5" src="https://app.static.wangxiao.cn/images/tick2.png" />
          </view>
          <view class="flex-col items-center group_4 space-y-12">
            <text class="text_4">签署成功</text>
            <text class="text_5">恭喜您，已成功签署协议</text>
          </view>
        </view>
        <view class="flex-col justify-start items-center button text-wrapper" @click="handleAction">
          <text class="font_2 text_6">
            {{ options.isOrder === 'true' ? '继续学习' : '继续购买' }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import { bottomNavTo } from '@/utils/common.js';
  import CustomNavBack from '@/components/CustomNavBack/CustomNavBack.vue';
  export default {
    components: {
      CustomNavBack,
    },
    props: {},
    data() {
      return {
        options: {
          isOrder: 'false',
        },
      };
    },
    onLoad(options) {
      this.options = options;
    },
    methods: {
      handleAction() {
        const { isOrder = '', goodsId = '', orderContractId = '', redirectUrl = '' } = this.options;
        const url = decodeURIComponent(redirectUrl);
        if (redirectUrl) {
          uni.navigateTo({
            url,
          });
        } else if (isOrder === 'true') {
          // 已购买
          if (goodsId) {
            // 商品id
            uni.redirectTo({
              url: `/page_commodity/courseList/index?isOrder=true&id=${goodsId}&orderContractId=${orderContractId}`,
            });
          } else {
            uni.setStorageSync('current', 1);
            bottomNavTo('/pages/newCourse/index', 2);
          }
        } else {
          // 未购买
          uni.redirectTo({
            url: `/page_commodity/commodity/pages/commodityBank?id=${goodsId}&orderContractId=${orderContractId}`,
          });
        }
      },
    },
  };
</script>

<style scoped lang="css">
  .flex-row {
    display: flex;
    flex-direction: row;
  }

  .flex-col {
    display: flex;
    flex-direction: column;
  }

  .justify-start {
    justify-content: flex-start;
  }

  .justify-end {
    justify-content: flex-end;
  }

  .justify-center {
    justify-content: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  .justify-around {
    justify-content: space-around;
  }

  .justify-evenly {
    justify-content: space-evenly;
  }

  .items-start {
    align-items: flex-start;
  }

  .items-end {
    align-items: flex-end;
  }

  .items-center {
    align-items: center;
  }

  .items-baseline {
    align-items: baseline;
  }

  .items-stretch {
    align-items: stretch;
  }

  .self-start {
    align-self: flex-start;
  }

  .self-end {
    align-self: flex-end;
  }

  .self-center {
    align-self: center;
  }

  .self-baseline {
    align-self: baseline;
  }

  .self-stretch {
    align-self: stretch;
  }

  .flex-1 {
    flex: 1 1 0%;
  }

  .flex-auto {
    flex: 1 1 auto;
  }

  .grow {
    flex-grow: 1;
  }

  .grow-0 {
    flex-grow: 0;
  }

  .shrink {
    flex-shrink: 1;
  }

  .shrink-0 {
    flex-shrink: 0;
  }

  .relative {
    position: relative;
  }
  .page {
    background-color: #ffffff;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
  }
  .header {
    padding: 18px 16px 14px;
    height: 90px;
    border-bottom: solid 1px #f6f6f6;
  }
  .space-y-28 > *:not(:first-child) {
    margin-top: 28px;
  }
  .group {
    padding-left: 18px;
  }
  .group_2 {
    line-height: 10.5px;
    height: 10.5px;
  }
  .font_1 {
    font-size: 14px;
    font-family: SF Pro Text;
    line-height: 10.5px;
    font-weight: 600;
    color: #000000;
  }
  .text {
    word-break: break-all;
  }
  .text_2 {
    line-height: 10px;
  }
  .space-x-6 > *:not(:first-child) {
    margin-left: 6px;
  }
  .image {
    width: 17px;
    height: 11px;
  }
  .image_2 {
    width: 15px;
    height: 11px;
  }
  .image_3 {
    width: 24px;
    height: 11.5px;
  }
  .image_4 {
    width: 16px;
    height: 16px;
  }
  .pos {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  .font_2 {
    font-size: 16px;
    font-family: PingFang SC;
    line-height: 15px;
  }
  .text_3 {
    color: #333333;
  }
  .group_3 {
    padding: 135px 0 372px;
    overflow-y: auto;
  }
  .image-wrapper {
    padding: 21px 0 15px;
    background-color: #ffffff;
    border-radius: 50%;
    width: 60px;
    border: solid 2px #e51600;
  }
  .image_5 {
    width: 31px;
    height: 20px;
  }
  .group_4 {
    padding-top: 20px;
  }
  .space-y-12 > *:not(:first-child) {
    margin-top: 12px;
  }
  .text_4 {
    color: #e51600;
    font-size: 22px;
    font-family: PingFang SC;
    line-height: 20.5px;
  }
  .text_5 {
    margin-top: 12px;
    color: #9ea1a3;
    font-size: 14px;
    font-family: PingFang SC;
    line-height: 13.5px;
  }
  .button {
    align-self: center;
    margin-top: 40px;
  }
  .text-wrapper {
    padding: 16px 0;
    background-color: #e51600;
    border-radius: 36px;
    width: 295px;
  }
  .text_6 {
    color: #ffffff;
    font-weight: 600;
  }
</style>
<style lang="scss" scoped>
  .wrap-top {
    width: 100%;
    height: 100%;
    .topbar {
      width: 100%;
      height: 122rpx;
      padding-top: 68rpx;
      padding-left: 32rpx;
    }
    .topbox {
      position: relative;

      .icon-return {
        position: absolute;
        left: 32rpx;
        top: -20rpx;
        color: #333333;
        font-size: 32rpx;
      }
      .title-day {
        text-align: center;
        width: 100%;
        margin-top: -20rpx;
      }
    }
    background-color: #ffffff;
    font-size: 32rpx;
  }
</style>
