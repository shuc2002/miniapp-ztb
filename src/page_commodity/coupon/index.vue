<!--
* @desc 优惠券页面
* @author 江玉龙
* @date 2022年07月28日
-->
<template>
  <view class="container999" v-if="ifLoad">
    <view>
      <view v-for="(item, key) in usableList" :key="key">
        <CouponData :data="item" @handleMark="handleMark" />
      </view>
      <view class="overdue-title" v-if="overdueList.length > 0">失效优惠券</view>
      <view v-for="(item, key) in overdueList" :key="key">
        <CouponData :data="item" @handleMark="handleMark" :invalid="true" />
      </view>
    </view>
    <view class="noCard" v-if="usableList.length == 0 && overdueList.length == 0">
      <image src="@/home/static/img/empty/coupon-empty.png" mode="scaleToFill" />
      <p class="text-size-sn common-text-400 common-tip">暂无优惠券</p>
    </view>
    <PopupWindow ref="question" title="提示" height="360rpx" :cancelShow="false">
      <p class="text-modal">{{ instructions }}</p>
    </PopupWindow>
  </view>
</template>
<script>
  import CouponData from './comps/CouponData.vue';
  import PopupWindow from '@/components/PopupComp/PopupWindow.vue';
  import { getCouponList } from '@/api/modules/coupon/index';
  export default {
    name: 'coupon',
    components: {
      CouponData,
      PopupWindow,
    },
    onLoad() {
      this.getCouponList();
    },
    data() {
      return {
        overdueList: [],
        usableList: [],
        instructions: '',
        ifLoad: false,
      };
    },
    methods: {
      async getCouponList() {
        const res = await getCouponList();
        this.overdueList = res.body.overdueCoupons;
        this.usableList = res.body.usableCoupons;
        this.ifLoad = true;
      },
      // 使用说明
      handleMark(val) {
        this.instructions = val;
        this.$refs.question.showModal = true;
      },
    },
  };
</script>
<style lang="scss" scoped>
  .container999 {
    width: 100vw;
    min-height: 100vh;
    overflow: hidden;
    position: relative;
    background-color: #f6f6f6;
    padding-top: 24rpx;
  }
  .overdue-title {
    font-size: 24rpx;
    font-weight: 400;
    text-align: center;
    margin-top: 16rpx;
    margin-bottom: 32rpx;
    color: #989ead;
  }
  .noCard {
    position: absolute;
    top: 31%;
    left: 50%;
    transform: translate(-50%);
    text-align: center;
    image {
      width: 324rpx;
      height: 316rpx;
    }
  }
</style>
