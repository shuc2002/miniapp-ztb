<!--
* @desc 商品详情(积分)
* @author 江玉龙
* @date 2022年05月27日
-->
<template>
  <view class="common-bg">
    <view>
      <swiper style="min-height: 750rpx; width: 750rpx" autoplay="true" interval="3000">
        <swiper-item v-for="(item, key) in commodityData.images" :key="key">
          <image :src="item" class="img-style" mode="aspectFit" lazy-load="true" />
        </swiper-item>
      </swiper>
    </view>
    <!-- 价格 -->
    <IntegralPrice :data="commodityData" :timeData="timeData" />
    <!-- 介绍 -->
    <Introduce :data="commodityData" :showCoupon="false" />
    <!-- 内含商品目录 -->
    <BankCatalogue
      :commodityData="commodityData"
      :htmlStyle="marketContent"
      @treeClick="treeClick"
    />
    <view style="height: 180rpx" />
    <!-- 支付 -->
    <IntegralPay :data="commodityData" :integral="integral" />
  </view>
</template>
<script>
  import IntegralPrice from '../comps/IntegralPrice.vue';
  import Introduce from '../comps/Introduce.vue';
  import BankCatalogue from '../comps/BankCatalogue.vue';
  import IntegralPay from '../comps/IntegralPay.vue';
  import { getCommodityDetail } from '@/api/modules/commodity/index';
  import { getIntegralNum } from '@/api/modules/order/index';
  import { handleLoop, setChecked } from './util.js';
  export default {
    name: 'commodityIntegral',
    components: {
      IntegralPrice,
      Introduce,
      IntegralPay,
      BankCatalogue,
    },
    onLoad(option) {
      this.getCommodityDetail(option.id);
      this.reset();
    },
    onShow() {
      this.getIntegralNum();
    },
    data() {
      return {
        commodityData: {},
        marketContent: '',
        integral: 0,
        timeData: 0,
        time: Date.now(),
      };
    },
    methods: {
      // 获取我的积分
      async getIntegralNum() {
        const res = await getIntegralNum();
        this.integral = res.body;
      },
      // 题库商品详情获取
      async getCommodityDetail(id) {
        const res = await getCommodityDetail({ id });
        this.commodityData = res.body;
        if (this.commodityData.detailPageQrCode) {
          this.commodityData.detailPageQrCode =
            this.commodityData.detailPageQrCode + '?timestamp' + this.time;
        }
        let detail = this.commodityData.detail;
        this.marketContent = detail.replace(
          /<img style="max-width: 100%;"/g,
          '<img style="width:100vw;height:auto;" '
        );
        setChecked(this.commodityData.products);
      },
      // 树节点点击
      treeClick(key, index, sign) {
        handleLoop(this.commodityData.products, key, index, sign);
        this.$forceUpdate();
      },
      // 重置倒计时
      reset() {
        const startTime = new Date(); // 当前时间
        const endTime = new Date(new Date().setHours(23, 59, 59, 999)); // 设置今天最后时间
        this.timeData = endTime.getTime() - startTime.getTime();
      },
    },
  };
</script>
<style lang="scss" scoped>
  .img-style {
    width: 750rpx;
    height: 750rpx;
  }
</style>
