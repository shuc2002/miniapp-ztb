<!--
* @desc 支付订单优惠券组件
* @author 江玉龙
* @date 2022年08月01日
-->
<template>
  <view>
    <view class="list-box">
      <view class="price-box">
        <view
          class="text-size-sn"
          :class="invalid ? 'common-tip' : 'common-price'"
          v-if="data.type == 0"
          >￥<span class="text-size-4xl">{{ data.discount }}</span></view
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
      </view>
      <image src="@/page_commodity/static/cut-line.png" class="img-style" />
      <view class="left-box">
        <view class="left-item">
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
        <view class="mt-4 t-icon t-icon-xuanze-copy analysis-icon" v-if="radioChecK" />
        <view class="radio-box mt-4" v-else />
      </view>
    </view>
    <view class="wrong-box" v-if="invalid">
      <p class="common-price">不可使用原因</p>
      <p class="text-reason" @tap="handleCheck" :class="checked ? '' : 'truncate'">{{
        data.reason
      }}</p>
      <view
        class="t-icon"
        @tap="handleCheck"
        :class="checked ? 't-icon-chevron-up' : 't-icon-chevron-down'"
      />
    </view>
  </view>
</template>
<script>
  export default {
    name: 'couponPay',
    components: {},
    data() {
      return {
        checked: false,
      };
    },
    props: {
      data: {
        type: Object,
      },
      invalid: {
        type: Boolean,
        default: false,
      },
      radio: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      radioChecK() {
        console.log(this.radio, '当前');
        return this.radio;
      },
    },
    methods: {
      // 改变check的值
      handleCheck() {
        this.checked = !this.checked;
      },
      // 使用说明
      handleMark(val) {
        this.$emit('handleMark', val);
      },
    },
  };
</script>
<style lang="scss" scoped>
  .list-box {
    margin: 32rpx 32rpx 0 32rpx;
    display: flex;
    align-items: center;
  }
  .left-box {
    width: 442rpx;
    border-radius: 16rpx;
    background-color: #ffffff;
    padding: 16rpx 32rpx 32rpx 32rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left-item {
      width: 312rpx;
    }
    .radio-box {
      width: 48rpx;
      height: 48rpx;
      border: 2rpx solid #ecedf1;
      background: #f5f6fa;
      border-radius: 50%;
      z-index: 9;
    }
    .mt-4 {
      margin-top: 18rpx;
    }
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
    width: 140rpx;
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
    height: 210rpx;
    background-color: #ffffff;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    .use-btn {
      width: 120rpx;
      height: 48rpx;
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
  }
  .wrong-box {
    margin: 0 32rpx;
    background-color: #ffffff;
    padding: 16rpx 24rpx;
    font-size: 20rpx;
    font-weight: 400;
    display: flex;
    .text-reason {
      margin-left: 24rpx;
      margin-right: 18rpx;
      width: 440rpx;
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
