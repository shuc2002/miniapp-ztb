<!--
* @desc 订单支付
* @author 江玉龙
* @date 2022年04月24日
-->
<template>
  <view class="common-bg">
    <view class="list-box">
      <view class="flex">
        <view>
          <image :src="commodity.thumbnail" class="img-style" mode="aspectFit" />
        </view>
        <view class="price-box">
          <view class="text-size-main common-text-400 truncate-style">{{ commodity.name }}</view>
          <view>
            <view class="text-size-sn common-tip across-line amount-item" v-if="commodity.linePrice"
              >￥{{ commodity.linePrice }}</view
            >
            <view class="text-size-sn">
              实付款<span class="common-text-700 money-style"
                >￥{{ JSON.stringify(activity) != '{}' ? activity.amount : commodity.price }}</span
              >
            </view>
          </view>
        </view>
      </view>
      <view class="coupon-item">
        <view class="flex-center">
          <view class="t-icon t-icon-coupon icon-coupon" />
          <p class="text-size-sn common-text-400 common-text">优惠金额</p>
        </view>
        <view class="flex-center" @tap="handleDraw()">
          <view
            class="common-text-400 text-size-xxs common-price discount-box price-display"
            v-if="pitchOnKey == 0"
            >未选择</view
          >
          <CouponName :item="pitchOn" v-if="pitchOnKey > 0" class="price-display" />
          <view class="text-size-sn common-text-400 common-price" v-if="pitchOnKey > 0"
            >-￥{{ pitchOnKey }}
          </view>
          <view class="t-icon t-icon-chevron-right right-icon" />
        </view>
      </view>
      <view class="divider" />
      <view class="text-coupon"
        >实付款<span class="common-text-700 money-style"
          >￥{{
            JSON.stringify(activity) != '{}'
              ? (activity.amount - pitchOnKey).toFixed(2)
              : (commodity.price - pitchOnKey).toFixed(2)
          }}</span
        ></view
      >
    </view>
    <view class="text-center text-size-xxs common-text-400 common-tip"
      >提示：所购商品可以在我的-已购买中查看。</view
    >
    <!-- 支付 -->
    <view class="pay-item" v-if="system">
      <view class="disable-Btn flex-center">iOS暂不支持购买</view></view
    >
    <view class="pay-item" v-else>
      <view class="pay-price">
        <view class="total-price">
          <view class="text-size-xxs">
            共<span class="common-price">1</span>件 合计:<span class="common-price">￥</span>
          </view>
          <span class="text-size-xl common-price">{{
            JSON.stringify(activity) != '{}'
              ? (activity.amount - pitchOnKey).toFixed(2)
              : (commodity.price - pitchOnKey).toFixed(2)
          }}</span>
        </view>
        <view class="across-line text-size-xxs common-tip ml-price" v-if="commodity.linePrice"
          >原价: ￥{{ commodity.linePrice }}</view
        >
      </view>
      <!-- #ifndef H5 -->
      <button class="button-buy" @tap="handleBuy()">立即抢购</button>
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <button class="button-buy" @tap="openPayModal()">立即抢购</button>
      <!-- #endif -->
    </view>
    <BottomModal ref="coupon" backgroundColor="#F5F6FA">
      <view slot="head">
        <view class="text-size-main common-text-700 common-text text-center">优惠明细</view>
        <view class="text-size-sn common-text-400 common-title text-center" v-if="discount > 0"
          >已选1张券，共优惠<span class="common-price">￥{{ discount }}</span></view
        >
      </view>
      <view slot="body">
        <scroll-view
          style="height: 50vh"
          scroll-y="true"
          scroll-with-animation
          class="scroll-box"
          v-if="usableList.length > 0"
        >
          <view v-for="(item, key) in usableList" :key="key" @tap="chooseCoupon(item, key)">
            <CouponPay
              class="coupon-box"
              :data="item"
              :invalid="!item.usable"
              :radio="radio == key"
              @handleMark="handleMark"
            />
          </view>
        </scroll-view>
        <view class="noCard flex-column-center" v-if="usableList.length == 0">
          <image src="@/home/static/img/empty/coupon-empty.png" mode="scaleToFill" />
          <p class="text-size-sn common-text-400 common-tip">暂无优惠券</p>
        </view>
        <button class="cancel-btn" @tap="handleCancel" v-if="usableList.length > 0">确认</button>
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
        <button class="btn-modal flex-center" @tap="handleBuy()">确认支付</button>
      </view>
    </BottomModal>
    <PopupWindow ref="question" title="提示" height="360rpx" :cancelShow="false">
      <p class="text-modal">{{ instructions }}</p>
    </PopupWindow>
  </view>
</template>
<script>
  import CouponPay from '@/components/Coupon/CouponPay.vue';
  import CouponName from '@/components/Coupon/CouponName.vue';
  import BottomModal from '@/components/BottomModal/BottomModal.vue';
  import PopupWindow from '@/components/PopupComp/PopupWindow.vue';

  import { getCommodityDetail } from '@/api/modules/commodity/index';
  import { handlePay, wxJsPay } from '@/utils/pay.js';
  // import { getPayRedicrtUrl } from '@/utils/payUrl.js';
  import { getPayCoupon } from '@/api/modules/coupon/index';
  import { getCollageOrder, createOrder } from '@/api/modules/order/index';
  import { throttle } from '@/page_commodity/courseList/util';
  export default {
    name: 'buyOrder',
    components: {
      BottomModal,
      CouponPay,
      CouponName,
      PopupWindow,
    },
    onLoad(options) {
      if (options.isCollage == 'true') {
        this.isCollage = true;
        this.groupId = options.groupId;
      }
      if (options.ifActivity == 'true') {
        this.getCollageOrder(options.commodityId);
      }
      this.getCommodityDetail(options.commodityId);

      /* #ifdef H5 */
      this.isWxOrAli();
      /* #endif */
    },
    data() {
      return {
        commodity: {},
        activity: {},
        isCollage: false, // 是否是拼团
        groupId: '',
        usableList: [],
        radio: -1, // 选择项
        discount: 0, // 优惠金额
        pitchOnKey: 0, // 确认后选中的优惠券key
        select: {}, // 选中的临时数据
        pitchOn: {}, // 确认后选中的优惠券数据
        instructions: '',
        payList: [
          { id: 1, name: '微信支付' },
          { id: 2, name: '支付宝支付' },
        ],
        payNum: 0,
        openId: '',
      };
    },
    computed: {
      system() {
        return this.$store.getters.getSystem;
      },
    },
    methods: {
      // 题库商品详情获取
      async getCommodityDetail(id) {
        const res = await getCommodityDetail({ id });
        this.commodity = res.body;
      },
      // 获取商品活动详情
      async getCollageOrder(id) {
        const res = await getCollageOrder({ commodityId: id });
        if (res.body) {
          this.activity = res.body;
        }
      },
      // 使用说明
      handleMark(val) {
        this.instructions = val;
        this.$refs.question.showModal = true;
      },
      // 打开支付弹窗
      openPayModal() {
        this.$refs.pay.showCover = true;
      },
      // 点击购买
      handleBuy: throttle(async function() {
        let res = {};
        if (JSON.stringify(this.activity) != '{}') {
          if (JSON.stringify(this.pitchOn) != '{}') {
            res = await createOrder({
              commodities: [{ id: this.commodity.id, number: 1 }],
              remark: '',
              coupons: [this.pitchOn.id],
              activity: { id: this.activity.activityId, groupId: this.groupId },
            });
          } else {
            res = await createOrder({
              commodities: [{ id: this.commodity.id, number: 1 }],
              remark: '',
              coupons: [],
              activity: { id: this.activity.activityId, groupId: this.groupId },
            });
          }
        } else {
          if (JSON.stringify(this.pitchOn) != '{}') {
            res = await createOrder({
              commodities: [{ id: this.commodity.id, number: 1 }],
              remark: '',
              coupons: [this.pitchOn.id],
            });
          } else {
            res = await createOrder({
              commodities: [{ id: this.commodity.id, number: 1 }],
              remark: '',
              coupons: [],
            });
          }
        }
        if (res.code == 2086) {
          uni.showToast({
            title: res.info,
            icon: 'none',
          });
          return;
        }
        if (res.code == 2068) {
          uni.showToast({
            title: '您已购买过该商品',
            icon: 'none',
          });
        } else {
          if (res.body.isCreated) {
            uni.redirectTo({
              url: `/page_commodity/order/pages/orderDetails?id=${res.body.orderId}`,
            });
            // 是否是0元商品
          } else if (res.body.isFree) {
            // 是否是拼团
            if (this.isCollage) {
              // 是否有小组id
              if (this.groupId) {
                uni.redirectTo({
                  url: `/page_commodity/order/pages/collageDetail?id=${res.body.orderId}&groupId=${this.groupId}`,
                });
              } else {
                uni.redirectTo({
                  url: `/page_commodity/order/pages/collageDetail?id=${res.body.orderId}&commodityId=${this.commodity.id}`,
                });
              }
            } else {
              uni.redirectTo({
                url: `/page_commodity/order/pages/orderDetails?id=${res.body.orderId}&showSuccess=true`,
              });
            }
          } else {
            if (this.isCollage) {
              /* #ifdef H5 */
              if (this.payNum === 3) {
                // 微信jsapi支付
                wxJsPay(
                  this.openId,
                  this.commodity.type,
                  res.body.orderId,
                  this.commodity.id,
                  this.groupId
                );
                return;
              }
              /* #endif */
              handlePay(
                this.openId,
                this.commodity.type,
                res.body.orderId,
                true,
                this.payNum,
                this.commodity.id,
                this.groupId
              );
            } else {
              /* #ifdef H5 */
              if (this.payNum === 3) {
                // 微信jsapi支付
                wxJsPay(this.openId, this.commodity.type, res.body.orderId);
                return;
              }
              /* #endif */
              handlePay(this.openId, this.commodity.type, res.body.orderId, true, this.payNum);
            }
          }
        }
      }, 300),
      // 切换支付方式
      changePay(key) {
        this.payNum = key;
      },
      // 选择优惠券弹窗
      async handleDraw() {
        const num =
          JSON.stringify(this.activity) != '{}' ? this.activity.amount : this.commodity.price;
        const res = await getPayCoupon({ commodityId: this.commodity.id, amount: num });
        this.usableList = res.body;
        this.$refs.coupon.showCover = true;
      },
      // 选择其中一个优惠券
      chooseCoupon(item, key) {
        if (this.select.id == item.id) {
          this.select = {};
          this.discount = 0;
          this.radio = -1;
        } else {
          this.select = item;
          const num =
            JSON.stringify(this.activity) != '{}' ? this.activity.amount : this.commodity.price;
          if (item.usable) {
            this.radio = key;
            if (item.type == 0) {
              if (num > item.discount) {
                this.discount = item.discount;
              } else {
                this.discount = num;
              }
            } else if (item.type == 1) {
              this.discount = (num * (10 - item.discount)) / 10;
            }
          }
        }
      },
      // 优惠券确认按钮
      handleCancel() {
        this.pitchOn = this.select;
        this.pitchOnKey = this.discount;
        this.$refs.coupon.cancel();
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
  .list-box {
    margin: 0 24rpx 20rpx 24rpx;
    border-radius: 24rpx;
    background: #ffffff;
    padding: 32rpx;
    .img-style {
      width: 160rpx;
      height: 212rpx;
      margin-right: 22rpx;
      border-radius: 12rpx;
      object-fit: cover;
    }
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
      width: 100%;
    }
    .amount-item {
      margin-bottom: 20rpx;
    }
  }
  .money-style {
    margin-left: 12rpx;
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
    .disable-Btn {
      width: calc(100% - 96rpx);
      font-size: 32rpx;
      height: 96rpx;
      border-radius: 50rpx;
      font-weight: 700;
      color: #fff;
      margin: auto;
      background-color: #ccc;
    }
  }
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
  .coupon-item {
    display: flex;
    justify-content: space-between;
    margin-top: 32rpx;
    margin-bottom: 32rpx;
    .icon-coupon {
      width: 40rpx;
      height: 40rpx;
      margin-right: 8rpx;
    }
    .discount-box {
      padding: 8rpx;
      border: 2rpx solid #f0522f;
      border-radius: 10rpx;
    }
    .right-icon {
      width: 28rpx;
      height: 28rpx;
    }
    .price-display {
      margin-right: 16rpx;
    }
  }
  .divider {
    width: 100%;
    height: 2rpx;
    background-color: #f5f6fa;
  }
  .text-coupon {
    text-align: end;
    margin-top: 18rpx;
  }
  .text-title {
    margin-bottom: 32rpx;
    text-align: center;
  }
  .scroll-box {
    margin-bottom: 140rpx;
    margin-top: 16rpx;
    .coupon-box {
      margin-bottom: 24rpx;
    }
  }
  .cancel-btn {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 72rpx;
    border-radius: 24rpx;
    font-size: 32rpx;
    font-weight: 700;
    color: #ffffff;
    background: linear-gradient(140.2deg, #ff8058 0%, #ff6969 100%);
    margin: 0 56rpx;
    padding: 8rpx 0;
  }
  .noCard {
    margin-top: 128rpx;
    margin-bottom: 128rpx;
    image {
      width: 324rpx;
      height: 316rpx;
    }
  }
  .head-pay {
    margin-top: 24rpx;
    margin-bottom: 48rpx;
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
  .btn-modal {
    width: 654rpx;
    height: 96rpx;
    border-radius: 24rpx;
    color: #ffffff;
    margin-top: 32rpx;
    background: linear-gradient(140.2deg, #ff8058ff 0%, #ff6969ff 100%);
  }
  .icon-pay {
    width: 48rpx;
    height: 48rpx;
    margin-right: 16rpx;
  }
</style>
