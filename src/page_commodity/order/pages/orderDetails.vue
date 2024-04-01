<!--
* @desc 订单详情
* @author 江玉龙
* @date 2022年04月22日
-->
<template>
  <view>
    <view class="common-bg">
      <CustomNavBack title="订单详情" @customBack="navigateBack"></CustomNavBack>
      <Prompt :status="commodity.status" :showSuccess="showSuccess" />
      <view class="list-box">
        <p class="box-tit">商品信息</p>
        <view v-for="(item, index) in commodityList" :key="index" class="commoditylist">
          <view class="collage-flex" @tap="goCommodityDetail(item)">
            <view>
              <image :src="item.url" class="img-commodity" mode="aspectFit" />
            </view>
            <view class="name-box">
              <view class="text-size-main common-text-400 truncate-style">{{ item.name }} </view>
              <!-- <view class="comm-date">{{ item.skuName }}</view> -->
              <view class="comm-date">{{ item.skuValueName }}</view>
            </view>
            <view class="price-box1">
              <view class="comm-name"> ￥{{ item.price }} </view>
              <view class="lineprice">￥{{ item.linePrice }}</view>
              <view class="comm-count">x{{ item.number }}</view>
            </view>
          </view>
        </view>
      </view>
      <!-- 商品价格 -->
      <view class="list-box">
        <view class="price-box">
          <view class="text-size-xxs common-text-400">
            <view class="commodity-price">商品金额</view>
            <view class="amount-box-second" v-if="commodity.discount > 0">优惠金额</view>
          </view>
          <view class="common-price text-size-sn common-text-400">
            <view class="price-item-one"
              >￥{{ commodity.commodities[0] ? commodity.commodities[0].price : '' }}</view
            >
            <view class="amount-box-second" v-if="commodity.discount > 0"
              >-￥{{ commodity.discount }}</view
            >
          </view>
        </view>
        <view class="text-size-sn price-item">
          {{ commodity.status == 0 ? '待付款' : '实付款' }}
          <span class="common-text-700">￥{{ commodity.payAmount ? commodity.payAmount : 0 }}</span>
        </view>
      </view>
      <!-- 协商 -->
      <view
        class="list-box"
        v-if="
          (commodity.status > 0 && commodity.hasNegotiation) ||
            (commodity.status < 5 && commodity.hasNegotiation)
        "
      >
        <view
          class="flex-center-box"
          @tap="commonFun.routeTo(`/page_commodity/order/pages/consult?id=${commodity.id}`)"
        >
          <view class="common-text text-size-xxs">协商历史</view>
          <view class="t-icon t-icon-chevron-right" />
        </view>
      </view>
      <!-- 订单信息 -->
      <view class="list-box">
        <view class="price-box-second">
          <view class="text-size-xxs common-text-400">
            <view>订单编号</view>
            <view class="amount-box" v-if="commodity.status != 0">购买时间</view>
          </view>
          <view class="common-tip text-size-xxs common-text-400">
            <view class="copy-item flex" @tap="handleCopy(commodity.id)">
              {{ commodity.id ? commodity.id : '' }}
              <span class="copy-btn flex-center">复制</span>
            </view>
            <view class="amount-box" v-if="commodity.status != 0">{{
              commodity.createTime ? commodity.createTime : ''
            }}</view>
          </view>
        </view>
        <view
          class="serve-center"
          v-if="commodity.status == 1 && !showSuccess && !supplierId"
          @tap="handleService()"
        >
          <view class="common-text text-size-xxs">服务中心</view>
          <view class="t-icon t-icon-chevron-right" />
        </view>
      </view>
      <view class="text-center text-size-xxs common-text-400 common-tip"
        >提示：所购商品可以在我的-已购买中查看。</view>

      <button
        class="btn-detail common-button flex-center"
        v-if="commodity.status == 3"
        @tap="cancelRefund()"
        >取消退款</button
      >
      <button
        class="btn-detail common-button flex-center"
        v-if="commodity.status == 1"
        @tap="
          commonFun.routeTo(
            `/page_commodity/courseList/index?id=${commodity.commodities[0].id}&isOrder=true`
          )
        "
        >去学习</button
      >
      <!-- #ifndef H5 -->
      <button
        class="btn-detail common-button flex-center"
        v-if="commodity.status == 0"
        @tap="handleBuy()"
        >去支付</button
      >
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <button
        class="btn-detail common-button flex-center"
        v-if="commodity.status == 0"
        @tap="openPayModal()"
        >去支付</button
      >
      <!-- #endif -->
      <button class="cancel-order" v-if="commodity.status == 0" @tap="cancelOrder()">{{
        ifPay ? '取消支付' : '取消订单'
      }}</button>
      <view class="gif-box" v-show="commodity.paidPageQrCode">
        <!-- <image src="@/page_commodity/static/gif-code.gif" class="gif" /> -->
        <image :src="commodity.paidPageQrCode" class="qrcode" :show-menu-by-longpress="true" />
      </view>
      <view style="height: 240rpx" />
      <!-- 弹窗显示售后服务 -->
      <BottomModal ref="unit" :showFoot="true">
        <view slot="head">
          <view class="flex-center text-size-main common-text-700 common-black">服务中心</view>
        </view>
        <view slot="body">
          <view class="radio-flex-box" @tap="handleServe()">
            <view class="text-size-sn">申请退款</view>
            <view class="t-icon t-icon-chevron-right type-icon" @tap="handleServe()" />
          </view>
        </view>
      </BottomModal>
      <BottomModal ref="tips" :showFoot="false">
        <view slot="head">
          <view class="flex-center text-size-main common-text-700 common-black">退款理由</view>
          <view class="tips-box">取消后将会浪费本次优惠</view>
        </view>
        <view slot="body">
          <view v-for="(item, key) in servicelist" :key="key">
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
    </view>
  </view>
</template>
<script>
  // import CommodityData from '../comps/CommodityData.vue';
  import BottomModal from '@/components/BottomModal/BottomModal.vue';
  import CustomNavBack from '@/components/CustomNavBack/CustomNavBack.vue';
  import Prompt from '../comps/Prompt.vue';
  import { throttle } from '@/page_commodity/courseList/util';
  import { handlePay, wxJsPay } from '@/utils/pay.js';
  // import { getPayRedicrtUrl } from '@/utils/payUrl.js';
  import {
    getOrderDetail,
    setRefund,
    cancelOrder,
    cancelPay,
    getOrderStatus,
  } from '@/api/modules/order/index.ts';
  export default {
    name: 'orderDetails',
    components: {
      Prompt,
      BottomModal,
      CustomNavBack,
    },
    onLoad(option) {
      if (option.showSuccess == 'true') {
        this.showSuccess = true;
        this.ifPay = true;
      } else if (option.showSuccess == 'false') {
        this.showSuccess = false;
        this.ifPay = true;
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
        commodity: {},
        commodityList: [],
        servicelist: ['暂时不需要了', '价格有点贵', '商品拍错了', '其他'],
        activeNum: -1,
        showSuccess: false,
        orderId: '',
        ifPay: false,
        time: Date.now(),
        payList: [
          { id: 1, name: '微信支付' },
          { id: 2, name: '支付宝支付' },
        ],
        payNum: 0,
        openId: '',
        supplierId: '', // 供应商id
      };
    },
    methods: {
      // 订单详情获取
      async getOrderDetail(e) {
        const data = await getOrderDetail({ id: e });
        this.commodity = data.body;
        this.commodityList = this.commodity.commodities;
        console.log('test', this.commodityList);
        this.supplierId = this.commodity.supplierId;
        console.log('supplierId----', this.supplierId);
        if (this.commodity.paidPageQrCode) {
          this.commodity.paidPageQrCode = this.commodity.paidPageQrCode + '?timestamp' + this.time;
        }
        this.orderId = e;
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
      // 复制订单号
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
          orderId: this.commodity.id,
          reason: this.servicelist[this.activeNum],
        });
        this.$refs.tips.showCover = false;
        this.activeNum = -1;
        this.getOrderDetail(this.commodity.id);
      },
      // 取消退款
      async cancelRefund() {
        const data = await getOrderStatus({ id: this.commodity.id });
        if (data.body.status == 3) {
          await cancelOrder(this.commodity.refundId);
          this.getOrderDetail(this.commodity.id);
        } else if (data.body.status == 4) {
          uni.showToast({
            title: '已退款，订单已关闭',
            icon: 'none',
          });
          this.getOrderDetail(this.commodity.id);
        }
      },
      // 取消订单
      async cancelOrder() {
        if (this.ifPay) {
          uni.navigateBack({ delta: 1 });
        } else {
          await cancelPay(this.commodity.id);
          this.getOrderDetail(this.commodity.id);
        }
      },
      // 去支付
      handleBuy: throttle(async function() {
        /* #ifdef H5 */
        console.log(this.payNum, 'payNum');
        if (this.payNum == 3) {
          // 微信jsapi支付
          wxJsPay(this.openId, this.commodity.commodities[0].type);
          return;
        }
        /* #endif */
        handlePay(
          this.openId,
          this.commodity.commodities[0].type,
          this.commodity.id,
          true,
          this.payNum
        );
      }, 300),
      // 打开支付弹窗
      openPayModal() {
        this.$refs.pay.showCover = true;
      },
      // 切换支付方式
      changePay(key) {
        this.payNum = key;
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
      // 去往商品详情页面
      goCommodityDetail(val) {
        uni.navigateTo({
          url: `/page_commodity/commodity/pages/commodityBank?id=${val.id}`,
        });
      },
      navigateBack() {
        uni.redirectTo({
          url: `/page_commodity/order/index?index=${this.commodity.status == 0 ? 1 : 0}`,
        });
      },
    },
  };
</script>
<style lang="scss" scoped>
  .header-custom {
    height: 128rpx;
    /* #ifdef H5 */
    height: 88rpx;
    /* #endif */
    position: relative;
    .custom-title {
      position: absolute;
      line-height: 32rpx;
      top: 108rpx;
      /* #ifdef H5 */
      top: 28rpx;
      /* #endif */
      width: 400rpx;
      left: 50%;
      margin-left: -200rpx;
      z-index: 9999;
      text-align: center;
    }
    .goBack {
      position: absolute;
      top: 108rpx;
      /* #ifdef H5 */
      top: 28rpx;
      /* #endif */
      left: 34rpx;
      color: #000;
      z-index: 9999;
    }
  }

  .list-box {
    margin: 20rpx 24rpx;
    border-radius: 24rpx;
    background: #ffffff;
    padding: 32rpx;
    .box-tit {
      margin-bottom: 34rpx;
      font-size: 28rpx;
      font-weight: 400;
      color: #333333;
    }
    .commoditylist {
      height: 112rpx;
      margin-bottom: 52rpx;
      .collage-flex {
        display: flex;
        justify-content: space-between;
      }
      .name-box {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .comm-name {
          font-size: 24rpx;
          font-weight: 400;
          font-family: 'PingFang SC';
          text-align: left;
          color: #333333;
        }
        .comm-date {
          color: #9fa1a4;
          font-size: 24rpx;
          font-weight: 400;
          max-width: 350rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 5rpx;
        }
      }
    }
  }
  .img-commodity {
    width: 200rpx;
    height: 112rpx;
    margin-right: 16rpx;
    border-radius: 12rpx;
    object-fit: cover;
  }
  .price-box {
    display: flex;
    justify-content: space-between;
    border-bottom: 2rpx solid #f5f6fa;
    margin-bottom: 32rpx;
  }
  .price-box1 {
    // display: flex;
    // flex-wrap: wrap;
    // align-content: space-between;
    // padding: 12rpx 12rpx;
    text-align: right;
    .lineprice {
      color: #9fa1a4;
      font-size: 24rpx;
      font-weight: 400;
      text-decoration: line-through;
    }
    .comm-count {
      color: #9fa1a4;
      font-size: 24rpx;
      font-weight: 400;
      margin-top: 13rpx;
    }
    .truncate-style {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      width: 420rpx;
    }
    .money-style {
      margin-left: 12rpx;
      color: #ff7200;
      font-size: 32rpx;
      font-weight: 400;
      font-family: 'Inter';
    }
    .flex-item {
      width: 420rpx;
      span {
        width: 56rpx;
      }
    }
  }
  .price-box-second {
    display: flex;
    justify-content: space-between;
  }
  .serve-center {
    display: flex;
    justify-content: space-between;
    margin-top: 24rpx;
  }
  .price-item {
    text-align: end;
  }
  .price-item-one {
    margin-bottom: 20rpx;
    text-align: end;
  }
  .copy-item {
    justify-content: flex-end;
  }
  .amount-box {
    margin-top: 24rpx;
    text-align: end;
  }
  .amount-box-second {
    margin-bottom: 24rpx;
    text-align: end;
  }
  .copy-btn {
    width: 72rpx;
    height: 36rpx;
    border-radius: 36rpx;
    background-color: #f5f6fa;
    margin-left: 8rpx;
  }
  .btn-detail {
    margin-top: 16rpx;
    position: fixed;
    bottom: 128rpx;
    margin: auto;
    left: 0;
    right: 0;
    /* #ifdef MP-TOUTIAO */
    background-color: rgb(71, 95, 253);
    /* #endif */
    &:active {
      opacity: 0.8;
    }
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
  .tips-box {
    margin-top: 8rpx;
    margin-bottom: 16rpx;
    text-align: center;
    font-size: 28rpx;
    font-weight: 400;
    color: #989ead;
  }
  .radio-flex-box {
    display: flex;
    justify-content: space-between;
    padding: 32rpx 48rpx;
  }
  .btn-radio {
    width: 48rpx;
    height: 48rpx;
    border: 2rpx solid #ecedf1;
    border-radius: 50%;
  }
  .cancel-order {
    position: fixed;
    bottom: 40rpx;
    left: 0;
    right: 0;
    font-size: 28rpx;
  }
  .commodity-price {
    margin-bottom: 24rpx;
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
