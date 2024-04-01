<template>
  <MovePopup
    title="订单信息"
    v-model="showOrderPop"
    @change="movePopupChange"
    :showClose="true"
    class="popbox"
  >
    <view class="buy-box">
      <view class="price-box">
        <!-- <view>1111111</view>
        <view>{{ orderId }}</view>
        <view>1111111</view> -->
        <!-- <view class="price-flex">
        <view>优惠卷</view>
        <view
          ><span>-50</span><view class="iconfont icon-more_large" @tap="navigateBack"></view
        ></view>
      </view> -->
        <view class="price-flex">
          <view>商品金额</view><view class="price-item">￥{{ commodity.payAmount }}</view>
        </view>
        <view class="price-flex">
          <view>优惠金额</view><view class="price-item">-￥300</view>
        </view>
        <view class="price-flex totalprice">
          <view>合计</view><view>￥{{ commodity.payAmount }}</view>
        </view>
      </view>
      <button class="buy-btn">确认支付48元</button>
    </view>
  </MovePopup>
</template>
<script>
  import MovePopup from './MovePopup.vue';
  import { getOrderDetail } from '@/api/modules/order/index.ts';
  export default {
    name: 'orderMovepop',
    components: {
      MovePopup,
    },
    props: {
      showOrderPop: {
        type: Boolean,
        default: true,
      },

      orderData: {
        type: Object,
      },
    },
    // watch: {
    //   orderId(val) {
    //     console.log('val--', val);
    //     if (val) {
    //       this.getOrderDetail(val);
    //     }
    //   },
    // },
    watch: {
      // orderId(val) {
      //   console.log('val--', val);
      //   if (val) {
      //     this.getOrderDetail(val);
      //   }
      // },
      orderData(val) {
        this.commodity = JSON.parse(JSON.stringify(val));
        this.commodityList = this.commodity.commodities;
        this.orderId = this.commodity.id;
        console.log(' this.commodity', this.commodity);
        console.log('this.commodityList', this.commodityList);
        console.log(' this.orderId', this.orderId);
      },
    },
    computed: {
      nickName() {
        return this.$store.getters.getNickName;
      },
      avatar() {
        return this.$store.getters.getAvatar;
      },
    },
    data() {
      return {
        commodity: {},
        orderId: 0,
        commodityList: [],

        // showPop: this.showOrderPop,
      };
    },
    methods: {
      async getOrderDetail(e) {
        console.log('e--', e);
        const data = await getOrderDetail({ id: e });
        this.commodity = data.body;
        if (this.commodity.paidPageQrCode) {
          this.commodity.paidPageQrCode = this.commodity.paidPageQrCode + '?timestamp' + this.time;
        }
        this.orderId = e;
      },
      movePopupChange(vis) {
        this.$emit('update:showOrderPop', vis);
        // this.showPop = vis;
        // console.log(111);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .hqs-popup .qs-con {
    background: skyblue !important;
  }
  .buy-box {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .price-box {
      background: #fff;
      width: 702rpx;
      padding: 32rpx 32rpx;
      border-radius: 24rpx;
      margin-bottom: 64rpx;
    }
    .price-flex {
      display: flex;
      font-size: 28rpx;
      color: #333;
      justify-content: space-between;
      margin-bottom: 24rpx;
    }
    .totalprice {
      margin-top: 48rpx;
    }
    .price-item {
      color: #f0522f;
      font-size: 28rpx;
    }
    .buy-btn {
      width: 652rpx;
      height: 96rpx;
      text-align: center;
      line-height: 96rpx;
      color: #fff;
      font-size: 32rpx;
      background: #e51600;
      border-radius: 72rpx;
      margin-bottom: 50rpx;
    }
  }
</style>
