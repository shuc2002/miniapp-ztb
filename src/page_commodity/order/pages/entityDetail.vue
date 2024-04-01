<!--
* @desc 实体订单详情
* @author 江玉龙
* @date 2023年02月13日
-->
<template>
  <view class="common-bg">
    <CustomNavBack title="订单详情" @customBack="navigateBack"></CustomNavBack>
    <Prompt :status="orderData.status" :expressStatus="orderData.expressStatus" />
    <!-- 地址 -->
    <view class="address-box">
      <view class="t-icon t-icon-address1 icon-address" />
      <view class="flex-item-center flex-wrap info-text">
        <view class="text-size-xl common-text-600 name-text">{{ address.receiverName }}</view>
        <view class="text-size-xl common-text-600">{{ address.receiverPhoneNo }}</view>
      </view>
      <view class="address-text">{{ address.receiverAddress }}</view>
    </view>
    <view class="divider"
      ><view
        v-for="item in list"
        :key="item"
        class="color-block"
        :class="item % 2 == 0 ? 'black' : 'blue'"
    /></view>
    <!-- 商品 -->
    <!-- <view class="list-box" v-for="(val, index) in commodity" :key="index">
      <EntityCommodityData :commodityData="val" :ifIntegral="ifIntegral" />
    </view> -->
    <view class="list-box">
      <EntityCommodityData :commodityData="commodity" :ifIntegral="ifIntegral" />
    </view>
    <!-- 表格 -->
    <view class="list-box">
      <view class="price-list border">
        <view class="text-size-sn common-text-400 common-text">
          <view class="item-name">订单金额</view>
          <view class="item-name">配送运费</view>
          <view class="item-name" v-if="orderData.discount > 0">优惠金额</view>
        </view>
        <view class="text-size-sn common-text-400 common-text item-box">
          <view class="item-name">
            <span v-if="ifIntegral">{{ orderData.integralAmount }}积分</span>
            <span v-else>￥{{ orderData.amount }}</span>
          </view>
          <view class="item-name">包邮</view>
          <view class="item-name common-price" v-if="orderData.discount > 0"
            >-￥{{ orderData.discount }}</view
          >
        </view>
      </view>
      <view class="text-coupon">
        实付款
        <span class="common-text-700 money-style">
          <span v-if="ifIntegral">{{ orderData.integralAmount }}积分</span>
          <span v-else>￥{{ orderData.payAmount }}</span>
        </span>
      </view>
    </view>
    <!-- 协商 -->
    <view class="list-box" v-if="orderData.hasNegotiation">
      <view
        class="flex-center-box"
        @tap="commonFun.routeTo(`/page_commodity/order/pages/consult?id=${orderData.id}`)"
      >
        <view class="common-text text-size-xxs">协商历史</view>
        <view class="t-icon t-icon-chevron-right" />
      </view>
    </view>
    <!-- 订单信息 -->
    <view class="list-box">
      <view class="price-list">
        <view class="text-size-sn common-text-400 common-text">
          <view class="item-name">订单编号</view>
          <view class="item-name" v-if="orderData.expressNo">物流单号</view>
          <view
            :class="
              orderData.status == 1 && orderData.expressStatus == 2 && !ifIntegral
                ? 'item-name'
                : ''
            "
            >购买时间</view
          >
          <view v-if="orderData.status == 1 && orderData.expressStatus == 2 && !ifIntegral"
            >服务中心</view
          >
        </view>
        <view class="common-tip text-size-xxs common-text-400 item-box">
          <view class="copy-item item-name flex service-box" @tap="handleCopy(orderData.id)">
            {{ orderData.id }}
            <span class="copy-btn flex-center">复制</span>
          </view>
          <view
            class="copy-item item-name flex service-box"
            v-if="orderData.expressNo"
            @tap="handleCopy(orderData.expressNo)"
          >
            {{ orderData.expressNo }}
            <span class="copy-btn flex-center">复制</span>
          </view>
          <view
            class="service-box"
            :class="
              orderData.status == 1 && orderData.expressStatus == 2 && !ifIntegral
                ? 'item-name'
                : ''
            "
            >{{ orderData.createTime }}</view
          >
          <view
            class="icon-service"
            @tap="handleService()"
            v-if="orderData.status == 1 && orderData.expressStatus == 2 && !ifIntegral"
            ><view class="t-icon t-icon-chevron-right"
          /></view>
        </view>
      </view>
    </view>
    <view class="text-center text-size-xxs common-text-400 common-tip">
      提示：所购商品可以在我的-已购买中查看。
    </view>
    <view class="gif-box" v-show="orderData.paidPageQrCode">
      <!-- <image src="@/page_commodity/static/gif-code.gif" class="gif" /> -->
      <image :src="orderData.paidPageQrCode" class="qrcode" :show-menu-by-longpress="true" />
    </view>
    <view style="height: 260rpx" />
    <view
      class="operation-box"
      v-if="
        !(orderData.status == 1 && orderData.expressStatus == 0) &&
          !(orderData.status == 1 && orderData.expressStatus == 2) &&
          orderData.status != 2 &&
          orderData.status != 4 &&
          orderData.status != 5
      "
    >
      <view
        class="operation-btn flex-center"
        v-if="orderData.status == 1 && orderData.expressStatus == 1"
        @tap="handleOpen()"
        >确认收货</view
      >
      <view class="operation-btn flex-center" v-if="orderData.status == 3" @tap="cancelRefund()"
        >取消退款</view
      >
      <!-- #ifndef H5 -->
      <view class="operation-btn flex-center" v-if="orderData.status == 0" @tap="handleBuy()"
        >去支付</view
      >
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <view class="operation-btn flex-center" v-if="orderData.status == 0" @tap="openPayModal()"
        >去支付</view
      >
      <!-- #endif -->
      <view class="cancel-order" v-if="orderData.status == 0" @tap="cancelOrder()">取消订单</view>
    </view>
    <!-- 弹窗显示售后服务 -->
    <BottomModal ref="unit" :showFoot="true">
      <view slot="head">
        <view class="flex-center text-size-main common-text-700 common-black">服务中心</view>
      </view>
      <view slot="body">
        <view class="radio-flex-box" @tap="handleServe()">
          <view class="text-size-sn">申请退款</view>
          <view class="t-icon t-icon-chevron-right type-icon" />
        </view>
      </view>
    </BottomModal>
    <BottomModal ref="tips" :showFoot="false">
      <view slot="head">
        <view class="flex-center text-size-main common-text-700 common-black">退款理由</view>
        <view class="tips-box">取消后将会浪费本次优惠</view>
      </view>
      <view slot="body">
        <view v-for="(item, key) in serviceList" :key="key">
          <view class="radio-flex-box" @tap="changeRadio(key)">
            <view class="text-size-sn">{{ item }}</view>
            <view class="btn-radio" :class="activeNum == key ? 't-icon t-icon-xuanze' : ''" />
          </view>
        </view>
        <button
          class="btn-modal flex-center"
          :class="activeNum === -1 ? 'bg-color-grey' : 'bg-color-blue'"
          @tap="activeNum === -1 ? '' : handleRefund()"
          >确认</button
        >
      </view>
    </BottomModal>
    <BottomModal ref="pay" :showFoot="false">
      <view slot="head">
        <view class="flex-center text-size-main common-text-700 common-black head-pay"
          >选择支付方式</view
        >
      </view>
      <view slot="body">
        <view v-for="item in payList" :key="item.id">
          <view class="radio-flex-box" @tap="changePay(item.id)">
            <view class="flex-center">
              <view
                class="t-icon icon-pay"
                :class="item.id == 1 || item.id == 3 ? 't-icon-wechat' : ' t-icon-zhifubao'"
              />
              <view class="text-size-sn">{{ item.name }}</view>
            </view>
            <view class="btn-radio" :class="payNum == item.id ? 't-icon t-icon-xuanze' : ''" />
          </view>
        </view>
        <button class="btn-modal flex-center bg-color-red" @tap="handleBuy()">确认支付</button>
      </view>
    </BottomModal>
    <PopupWindow
      ref="detail"
      height="320rpx"
      title="温馨提示"
      :cancelShow="true"
      @confirm="handleReceipt()"
    >
      <view class="text-size-main">是否确认收货</view>
    </PopupWindow>
  </view>
</template>
<script>
  import BottomModal from '@/components/BottomModal/BottomModal.vue';
  import Prompt from '../comps/Prompt.vue';
  import { handlePay, wxJsPay } from '@/utils/pay.js';
  // import { getPayRedicrtUrl } from '@/utils/payUrl.js';
  import { throttle } from '@/page_commodity/courseList/util';
  import {
    getOrderDetail,
    setRefund,
    cancelOrder,
    cancelPay,
    getOrderStatus,
    getIntegralDetail,
    setReceipt,
    setIntegralReceipt,
  } from '@/api/modules/order/index.ts';
  import EntityCommodityData from '../comps/EntityCommodityData.vue';
  import PopupWindow from '@/components/PopupComp/PopupWindow.vue';
  import CustomNavBack from '@/components/CustomNavBack/CustomNavBack.vue';
  export default {
    name: 'entityDetail',
    components: {
      BottomModal,
      Prompt,
      EntityCommodityData,
      PopupWindow,
      CustomNavBack,
    },
    onLoad(option) {
      if (option.ifIntegral == 'true') {
        this.ifIntegral = true;
      }
      this.orderId = '';
      this.getOrderDetail(option.id);
      /* #ifdef H5 */
      this.isWxOrAli();
      /* #endif */
    },
    onShow() {
      if (this.orderId) {
        this.getOrderDetail(this.orderId);
      }
    },
    data() {
      return {
        list: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        address: {}, // 地址数据
        activeNum: -1,
        orderId: '',
        serviceList: ['暂时不需要了', '价格有点贵', '商品拍错了', '其他'],
        commodity: {}, // 商品数据
        orderData: {}, // 订单数据
        ifIntegral: false, //  是否是积分订单
        time: Date.now(),
        payList: [
          { id: 1, name: '微信支付' },
          { id: 2, name: '支付宝支付' },
        ],
        payNum: 0,
        openId: '',
      };
    },
    methods: {
      // 订单详情获取
      async getOrderDetail(e) {
        let data = {};
        if (this.ifIntegral) {
          data = await getIntegralDetail({ orderId: e });
        } else {
          data = await getOrderDetail({ id: e });
        }
        this.orderData = data.body;
        if (this.orderData.paidPageQrCode) {
          this.orderData.paidPageQrCode = this.orderData.paidPageQrCode + '?timestamp' + this.time;
        }
        this.commodity = data.body.commodities;
        // this.commodity = data.body;
        this.address = data.body.address;
        this.orderId = e;
      },
      // 复制
      handleCopy(val) {
        uni.setClipboardData({
          data: val,
          success: () => {
            uni.showToast({
              title: '复制成功',
              icon: 'none',
            });
          },
        });
      },
      // 点击更多弹出弹窗
      handleService() {
        this.$refs.unit.showCover = true;
      },
      // 弹窗点击售后
      handleServe() {
        this.$refs.unit.showCover = false;
        this.$refs.tips.showCover = true;
      },
      // 弹窗点击退款条件
      changeRadio(key) {
        this.activeNum = key;
      },
      // 退款确认按钮
      async handleRefund() {
        if (this.activeNum == -1) {
          uni.showToast({
            title: '请先选择退款原因',
            icon: 'none',
          });
          return;
        }
        await setRefund({
          orderId: this.orderData.id,
          reason: this.serviceList[this.activeNum],
        });
        this.$refs.tips.showCover = false;
        this.activeNum = -1;
        this.getOrderDetail(this.orderData.id);
      },
      // 打开确认收货弹窗
      handleOpen() {
        this.$refs.detail.showModal = true;
      },
      // 确认收货
      async handleReceipt() {
        if (this.ifIntegral) {
          await setIntegralReceipt(this.orderData.id);
        } else {
          await setReceipt(this.orderData.id);
        }
        this.getOrderDetail(this.orderData.id);
      },
      // 取消退款
      async cancelRefund() {
        const data = await getOrderStatus({ id: this.orderData.id });
        if (data.body.status == 3) {
          await cancelOrder(this.orderData.refundId);
          this.getOrderDetail(this.orderData.id);
        } else if (data.body.status == 4) {
          uni.showToast({
            title: '已退款，订单已关闭',
            icon: 'none',
          });
          this.getOrderDetail(this.orderData.id);
        }
      },
      // 取消订单
      async cancelOrder() {
        await cancelPay(this.orderData.id);
        this.getOrderDetail(this.orderData.id);
      },
      // 去支付
      handleBuy: throttle(async function() {
        /* #ifdef H5 */
        if (this.payNum == 3) {
          // 微信jsapi支付
          wxJsPay(this.openId, this.commodity.type, this.orderData.id);
          return;
        }
        /* #endif */
        handlePay(this.openId, this.commodity.type, this.orderData.id, true, this.payNum);
      }, 300),
      // 打开支付弹窗
      openPayModal() {
        this.$refs.pay.showCover = true;
      },
      // 切换支付方式
      changePay(key) {
        this.payNum = key;
      },
      navigateBack() {
        uni.redirectTo({
          url: `/page_commodity/order/index?index=${this.orderData.status == 0 ? 1 : 0}`,
        });
      },
      async isWxOrAli() {
        var ua = window.navigator.userAgent.toLowerCase();
        //判断是不是微信
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
          this.payList = [{ id: 3, name: '微信支付' }];
          this.payNum = 3;
          let openId = uni.getStorageSync('openId');
          if (openId) {
            this.openId = openId;
          } else {
            // const baseUrl = getPayRedicrtUrl();
            // const state = window.location.origin;
            // const EncodeUrl = `page_commodity/order/pages/redirctPage?state=${state}&payOrign=${state}`;
            // const redirectUrl = baseUrl + EncodeUrl;
            // window.location.href = redirectUrl;
          }
        } else if (ua.match(/AlipayClient/i) == 'alipayclient') {
          this.payList = [{ id: 2, name: '支付宝支付' }];
          this.payNum = 2;
        } else {
          this.payList = [
            { id: 1, name: '微信支付' },
            { id: 2, name: '支付宝支付' },
          ];
          this.payNum = 1;
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
  .address-box {
    width: 654rpx;
    min-height: 96rpx;
    background: #ffffff;
    margin: 0 auto;
    padding: 40rpx 24rpx;
    position: relative;
    border-radius: 24rpx;
    .name-text {
      margin-right: 24rpx;
    }
    .info-text {
      margin-left: 52rpx;
    }
    .icon-address {
      width: 40rpx;
      height: 40rpx;
      position: absolute;
      top: 46rpx;
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
    margin-left: 32rpx;
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
  .list-box {
    margin: 20rpx 24rpx;
    border-radius: 24rpx;
    background: #ffffff;
    padding: 32rpx;
  }
  .money-style {
    margin-left: 12rpx;
  }
  .price-list {
    display: flex;
    justify-content: space-between;
    .item-box {
      text-align: end;
    }
    .item-name {
      margin-bottom: 24rpx;
    }
  }
  .border {
    border-bottom: 2rpx solid #f5f6fa;
  }
  .text-coupon {
    text-align: end;
    margin-top: 18rpx;
  }
  .copy-item {
    justify-content: flex-end;
  }
  .copy-btn {
    width: 72rpx;
    height: 36rpx;
    border-radius: 36rpx;
    background-color: #f5f6fa;
    margin-left: 8rpx;
  }
  .service-box {
    height: 42rpx;
  }
  .icon-service {
    width: 400rpx;
  }
  .operation-box {
    width: 750rpx;
    min-height: 180rpx;
    background-color: white;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    .operation-btn {
      width: calc(100% - 96rpx);
      font-size: 32rpx;
      height: 96rpx;
      border-radius: 50rpx;
      font-weight: 700;
      color: #fff;
      margin: 32rpx auto;
      background-color: #475ffd;
    }
    .cancel-order {
      text-align: center;
      margin-bottom: 60rpx;
    }
  }
  .gif-box {
    position: relative;
    .gif {
      height: 232rpx;
      margin: 36rpx 98rpx;
    }
    .qrcode {
      width: 166rpx;
      height: 166rpx;
      position: absolute;
      top: 58rpx;
      left: 132rpx;
    }
  }
  .radio-flex-box {
    display: flex;
    justify-content: space-between;
    padding: 32rpx 48rpx;
    .btn-radio {
      width: 48rpx;
      height: 48rpx;
      border: 2rpx solid #ecedf1;
      border-radius: 50%;
    }
  }
  .tips-box {
    margin-top: 8rpx;
    margin-bottom: 16rpx;
    text-align: center;
    font-size: 28rpx;
    font-weight: 400;
    color: #989ead;
  }
  .btn-modal {
    width: 654rpx;
    height: 96rpx;
    border-radius: 24rpx;
    color: #ffffff;
    margin-top: 16rpx;
  }
  .bg-color-grey {
    background-color: #f5f6fa;
  }
  .bg-color-blue {
    background-color: #475ffd;
  }
  .bg-color-red {
    background: linear-gradient(140.2deg, #ff8058ff 0%, #ff6969ff 100%);
  }
  .head-pay {
    margin-top: 24rpx;
    margin-bottom: 48rpx;
  }
  .icon-pay {
    width: 48rpx;
    height: 48rpx;
    margin-right: 16rpx;
  }
</style>
