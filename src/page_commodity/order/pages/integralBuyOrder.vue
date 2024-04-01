<!--
* @desc 实体积分订单支付
* @author 江玉龙
* @date 2023年02月15日
-->
<template>
  <view class="common-bg">
    <!-- 地址 -->
    <view
      class="address-box"
      @tap="commonFun.routeTo(`/page_material/login/addressManage?isRadio=true`)"
    >
      <view class="t-icon t-icon-address1 icon-address" />
      <view class="flex-item">
        <view class="flex-item-center flex-wrap info-text" v-if="address.id">
          <view class="text-size-xl common-text-600 name-text">{{ address.name }}</view>
          <view class="text-size-xl common-text-600">{{ address.mobile }}</view>
        </view>
        <view class="text-size-xl common-text-600 info-text" v-else>
          请添加收货地址
        </view>
        <view class="t-icon t-icon-chevron-right icon-style" />
      </view>
      <view class="address-text" v-if="address.id">{{
        address.province + address.city + address.area
      }}</view>
    </view>
    <view class="divider"
      ><view
        v-for="item in list"
        :key="item"
        class="color-block"
        :class="item % 2 == 0 ? 'black' : 'blue'"
    /></view>
    <!-- 商品 -->
    <view class="list-box">
      <view class="flex">
        <view>
          <image :src="commodity.thumbnail" class="img-commodity" mode="aspectFit" />
        </view>
        <view class="price-box">
          <view class="text-size-main common-text-400 truncate-style">{{ commodity.name }} </view>
          <view class="flex-item">
            <view class="text-size-sn common-text-700"> {{ commodity.integral }}积分 </view>
            <view class="flex-item-center">
              <view class="t-icon t-icon-minus icon-style" />
              <span class="flex-center">1</span>
              <view class="t-icon t-icon-add icon-style" />
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 表格 -->
    <view class="list-box">
      <view class="price-list">
        <view class="text-size-sn common-text-400 common-text">
          <view class="item-name">订单金额</view>
          <view class="item-name">配送运费</view>
        </view>
        <view class="text-size-sn common-text-400 common-text item-box">
          <view class="item-name"> {{ commodity.integral }}积分 </view>
          <view class="item-name">包邮</view>
        </view>
      </view>
      <view class="text-coupon"
        >实付款<span class="common-text-700 money-style">{{ commodity.integral }}积分</span></view
      >
    </view>
    <view class="text-center text-size-xxs common-text-400 common-tip"
      >提示：所购商品可以在我的-已购买中查看。</view
    >
    <view class="pay-item">
      <view class="pay-price">
        <view class="total-price">
          <view class="text-size-xxs"> 共<span class="common-price">1</span>件 合计: </view>
          <span class="text-size-xl common-price">{{ commodity.integral }}积分</span>
        </view>
        <view class="across-line text-size-xxs common-tip ml-price" v-if="commodity.linePrice"
          >原价: ￥{{ commodity.linePrice }}</view
        >
      </view>
      <button class="button-buy" @tap="handleBuy()">立即支付</button>
    </view>
  </view>
</template>
<script>
  import { getCommodityDetail } from '@/api/modules/commodity/index';
  import { getAddressList } from '@/api/modules/user/setUp.ts';
  import { integralPay } from '@/api/modules/order/index';
  export default {
    name: 'integralBuyOrder',
    onLoad(options) {
      this.getCommodityDetail(options.commodityId);
      this.getDefaultAddress();
      // 首次进入清楚地址选择
      uni.setStorageSync('radio', -1);
    },
    onShow() {
      console.log(uni.getStorageSync('radio') >= 0);
      if (uni.getStorageSync('radio') >= 0) {
        this.addressKey = uni.getStorageSync('radio');
        if (this.addressKey >= 0) {
          this.getAddressList(this.addressKey);
        }
      }
    },
    computed: {
      uid() {
        return this.$store.getters.getUid;
      },
    },
    data() {
      return {
        list: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        addressKey: -1, // 选中的地址
        address: {}, // 地址数据
        commodity: {}, // 商品数据
      };
    },
    methods: {
      // 商品详情获取
      async getCommodityDetail(id) {
        const res = await getCommodityDetail({ id });
        this.commodity = res.body;
      },
      // 获取地址列表
      async getAddressList(key) {
        const res = await getAddressList({ stuUid: this.uid });
        if (res.body.length - 1 >= key) {
          // 无注释逆天
          this.address = res.body[key] || {};
        }
      },
      // 获取默认地址
      async getDefaultAddress() {
        const res = await getAddressList({ stuUid: this.uid });
        if (res.body.length > 0) {
          res.body.map((item) => {
            if (item.prime == 1) {
              this.address = item;
            }
          });
        }
      },
      // 点击购买
      async handleBuy() {
        if (JSON.stringify(this.address) == '{}') {
          uni.showToast({
            title: '请填写地址',
            icon: 'none',
          });
        } else {
          const res = await integralPay({
            commodityId: this.commodity.id,
            addressId: this.address.id,
          });
          if (res.code === 1000) {
            uni.redirectTo({
              url: '/page_commodity/order/pages/orderIntegral',
            });
          }
        }
      },
    },
    beforeDestroy() {
      uni.removeStorage({ key: 'radio' });
    },
  };
</script>
<style lang="scss" scoped>
  .address-box {
    width: 702rpx;
    min-height: 96rpx;
    background: #ffffff;
    margin: 0 auto;
    padding: 64rpx 32rpx;
    position: relative;
    .name-text {
      margin-right: 24rpx;
    }
    .info-text {
      margin-left: 52rpx;
      color: #2c364e;
    }
    .icon-address {
      width: 40rpx;
      height: 40rpx;
      position: absolute;
      top: 70rpx;
    }
    .address-text {
      font-size: 28rpx;
      font-weight: 400;
      margin: 16rpx 0 0 54rpx;
    }
  }
  .divider {
    width: 100%;
    display: flex;
    .color-block {
      width: 40rpx;
      height: 4rpx;
      margin-right: 16rpx;
    }
    .blue {
      background: #475ffd;
    }
    .black {
      background-color: #5b648d;
    }
  }
  .icon-style {
    width: 48rpx;
    height: 48rpx;
  }
  .list-box {
    margin: 20rpx 24rpx;
    border-radius: 24rpx;
    background: #ffffff;
    padding: 32rpx;
  }
  .img-commodity {
    width: 200rpx;
    height: 112rpx;
    margin-right: 22rpx;
    border-radius: 12rpx;
    object-fit: cover;
  }

  .price-box {
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
    padding: 12rpx 12rpx;
    .truncate-style {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      width: 420rpx;
    }
    .flex-item {
      width: 420rpx;
      span {
        width: 56rpx;
      }
    }
  }
  .money-style {
    margin-left: 12rpx;
  }
  .price-list {
    display: flex;
    justify-content: space-between;
    border-bottom: 2rpx solid #f5f6fa;
    margin-bottom: 24rpx;
    .item-box {
      text-align: end;
    }
    .item-name {
      margin-bottom: 24rpx;
    }
  }
  .text-coupon {
    text-align: end;
    margin-top: 18rpx;
  }
  .pay-item {
    width: 750rpx;
    height: 180rpx;
    background-color: white;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    .pay-price {
      margin-left: 60rpx;
    }
    .total-price {
      display: flex;
      align-items: center;
      margin-top: 20rpx;
    }
    .button-buy {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 296rpx;
      height: 96rpx;
      border-radius: 80rpx;
      color: #ffffff;
      background: linear-gradient(140.2deg, #ff8058 0%, #ff6969 100%);
      margin: 20rpx 60rpx 0 60rpx;
      &:active {
        opacity: 0.8;
      }
    }
    .ml-price {
      margin-left: 48rpx;
    }
  }
</style>
