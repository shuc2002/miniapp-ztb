<!--
* @desc 每张优惠券组件
* @author 江玉龙
* @date 2022年07月28日
-->
<template>
  <view class="list-box">
    <view class="left-box">
      <p
        class="text-size-main common-text-700 text-name truncate"
        :class="invalid ? 'common-tip' : 'common-text'"
        >{{ data.name }}</p
      >
      <p
        class="text-size-xxs common-text-400 effective-time"
        :class="invalid ? 'common-tip' : 'common-text'"
        >{{ data.useTime }}</p
      >
      <view class="instruct" @tap.stop="handleMark(data.instructions)">
        <p class="text-size-xxs common-text-400 common-tip">使用说明</p>
        <image src="@/static/img/prompt.png" />
      </view>
    </view>
    <image src="@/page_commodity/static/cut-line.png" class="img-style" />
    <view class="price-box" @tap="priceBoxClick">
      <view
        class="text-size-sn"
        :class="invalid ? 'common-tip' : 'common-price'"
        v-if="data.type == 0"
        >￥<span class="text-size-4xl common-text-600">{{ data.discount }}</span></view
      >
      <view
        class="text-size-sn"
        :class="invalid ? 'common-tip' : 'common-price'"
        v-if="data.type == 1"
        ><span class="text-size-4xl">{{ data.discount }}</span
        >折</view
      >
      <p class="text-size-min common-text-400" :class="invalid ? 'common-tip' : 'common-price'">{{
        data.content
      }}</p>
      <view
        v-if="showUser"
        class="use-btn"
        :class="invalid ? 'bg-invalid' : 'bg-price'"
        >去使用</view
      >
      <view
        v-if="!showUser"
        class="use-btn"
        :class="data.receive ? 'bg-get' : 'bg-price'"
        >{{ data.receive ? '已领取' : '立即领取' }}</view
      >
    </view>
  </view>
</template>
<script>
 import { bottomNavTo } from '@/utils/common.js';
  export default {
    name: 'couponData',
    components: {},
    props: {
      data: {
        type: Object,
      },
      invalid: {
        type: Boolean,
        default: false,
      },
      showUser: {
        type: Boolean,
        default: true,
      },
    },
    methods: {
      // 使用说明
      handleMark(val) {
        this.$emit('handleMark', val);
      },
      // 点击领取
      handleUser() {
        this.$emit('handleUser');
      },
      // 去首页
      goHome() {
        // uni.reLaunch({
        //   url: '/pages/home/index',
        // });
        bottomNavTo('/pages/realHome/index',2);
      },
      // 判断是“去使用"还是"点击领取"
      priceBoxClick() {
        if (this.showUser) {
          this.invalid
            ? ''
            : this.data.usableRange == 1
            ? this.commonFun.routeTo(`/page_commodity/coupon/scopeCommodity?id=${this.data.id}`)
            : this.goHome();
        } else {
          this.handleUser();
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
  .list-box {
    margin: 0 32rpx 32rpx 32rpx;
    display: flex;
    align-items: center;
  }
  .left-box {
    width: 442rpx;
    border-radius: 16rpx;
    background-color: #ffffff;
    padding: 16rpx 0 32rpx 48rpx;
  }
  .text-name {
    margin-top: 16rpx;
    width: 394rpx;
  }
  .effective-time {
    margin-top: 8rpx;
  }
  .instruct {
    margin-top: 24rpx;
    display: flex;
    align-items: center;
    image {
      width: 24rpx;
      height: 24rpx;
      margin-left: 8rpx;
    }
  }
  .img-style {
    width: 24rpx;
    height: 208rpx;
  }
  .price-box {
    width: 220rpx;
    border-radius: 16rpx;
    height: 206rpx;
    background-color: #ffffff;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    .use-btn {
      padding: 8rpx 24rpx;
      border-radius: 56rpx;
      color: #ffffff;
      font-size: 24rpx;
      margin-top: 12rpx;
    }
    .bg-price {
      background-color: #f0522f;
    }
    .bg-invalid {
      background-color: #989ead;
    }
    .bg-get {
      background-color: #ecedf1;
    }
  }
  .text-modal {
    font-size: 32rpx;
    font-weight: 400;
    color: #323949;
    margin: 0 52rpx;
    line-height: 1.5;
    word-break: break-all;
  }
</style>
