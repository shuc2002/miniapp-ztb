<!--
* @desc 实体订单支付
* @author 江玉龙
* @date 2023年02月13日
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
        <view class="text-size-xl common-text-600 info-text" v-else> 请添加收货地址 </view>
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
      <view v-for="(item, index) in commodityList" :key="index">
        <view class="flex">
          <view>
            <image :src="item.thumbnail" class="img-commodity" mode="aspectFit" />
          </view>
          <view class="price-box">
            <view class="text-size-main common-text-400 truncate-style">{{ item.name }} </view>
            <view class="flex-item">
              <view class="text-size-sn common-text-700">
                ￥{{
                  JSON.stringify(activity) != '{}' ? item.amount.toFixed(2) : item.price.toFixed(2)
                }}
              </view>
              <view class="flex-item-center">
                <view class="t-icon t-icon-minus icon-style" @tap="handleReduce(item.skuCode)" />
                <span class="flex-center">{{ item.number }}</span>
                <view class="t-icon t-icon-add icon-style" @tap="handleAdd(item.skuCode)" />
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 表格 -->
    <view class="list-box">
      <view class="price-list">
        <view class="text-size-sn common-text-400 common-text text-box">
          <view class="item-name">订单金额</view>
          <view class="item-name">配送运费</view>
          <view class="item-name" @tap="handleDraw()">优惠金额</view>
        </view>
        <view class="text-size-sn common-text-400 common-text item-box">
          <view class="item-name"> ￥{{ totalPrice.toFixed(2) }} </view>
          <view class="item-name">包邮</view>
          <view class="item-name youhui-box" @tap="handleDraw()">
            <view
              class="common-text-400 text-size-xxs no-use price-display"
              v-if="usableList.length == 0"
              >无可用</view
            >
            <view
              class="common-text-400 text-size-xxs common-price discount-box price-display"
              v-if="usableList.length != 0 && pitchOnKey === 0"
              >未选择</view
            >
            <CouponName :item="pitchOn" v-if="pitchOnKey > 0" class="price-display" />
            <view class="text-size-sn common-text-400 common-price" v-if="pitchOnKey > 0"
              >-￥{{ pitchOnKey }}
            </view>
            <view class="t-icon t-icon-chevron-right right-icon" />
          </view>
        </view>
      </view>
      <view class="text-coupon"
        >实付款<span class="common-text-700 money-style"
          >￥{{ (totalPrice - pitchOnKey).toFixed(2) }}</span
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
            <span class="text-size-main common-price">￥</span>
          </view>
          <span class="text-size-xxl common-price common-text-600">{{
            (totalPrice - pitchOnKey).toFixed(2)
          }}</span>
        </view>
        <view class="across-line text-size-xxs common-tip ml-price" v-if="commodity.linePrice"
          >原价: ￥{{ (commodity.linePrice * 100 * num) / 100 }}</view
        >
      </view>
      <!-- #ifndef H5 -->
      <button class="button-buy" @tap="handleBuy()">立即结算</button>
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <button class="button-buy" @tap="openPayModal()">立即结算</button>
      <!-- #endif -->
    </view>
    <!-- 优惠券 -->
    <BottomModal ref="coupon" backgroundColor="#F5F6FA">
      <view slot="head">
        <view class="text-size-main common-text-700 common-text text-center">优惠明细</view>
        <view class="text-size-sn common-text-400 common-title text-center" v-if="discount > 0"
          >已选1张券，共优惠<span class="">￥{{ discount }}</span></view
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
  import { handlePay, wxJsPay } from '@/utils/pay.js';
  // import { getPayRedicrtUrl } from '@/utils/payUrl.js';
  import { throttle } from '@/page_commodity/courseList/util';
  import { getPayCoupon } from '@/api/modules/coupon/index';
  import { getCommodityDetail } from '@/api/modules/commodity/index';
  import { getCollageOrder, createOrder } from '@/api/modules/order/index';
  import { getAddressList } from '@/api/modules/user/setUp.ts';
  export default {
    name: 'entityOrder',
    components: {
      BottomModal,
      CouponName,
      PopupWindow,
      CouponPay,
    },
    onLoad(options) {
      this.commodityList = JSON.parse(options.commodityList);
      console.log(this.commodityList, '商品信息11111111111111111');
      if (options.isCollage == 'true') {
        this.isCollage = true;
        this.groupId = options.groupId;
      }
      if (options.ifActivity == 'true') {
        this.getCollageOrder(this.commodityList[0].id);
      }
      // this.commodityList = options.commodityList;
      console.log(this.commodityList);
      this.getCommodityDetail(this.commodityList[0].id);
      this.getDefaultAddress();
      // 首次进入清楚地址选择
      uni.setStorageSync('radio', -1);
      this.handleCoupons();
      /* #ifdef H5 */
      this.isWxOrAli();
      /* #endif */
    },
    onShow() {
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
      system() {
        return this.$store.getters.getSystem;
      },
      totalNum() {
        let num = 0;
        this.commodityList.map((item) => {
          num += item.number;
        });
        return num;
      },
      totalPrice() {
        let price = 0;
        this.commodityList.map((item) => {
          if (JSON.stringify(this.activity) != '{}') {
            price += item.number * item.amount;
          } else {
            price += item.number * item.price;
          }
        });
        return price;
      },
    },
    data() {
      return {
        list: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        addressKey: -1, // 选中的地址
        activity: {}, // 活动数据
        address: {}, // 地址数据
        commodity: {}, // 商品数据
        commodityList: [], //商品列表
        num: 1, // 商品数量
        usableList: [], // 优惠券数据
        radio: -1, // 选择项
        discount: 0, // 优惠金额
        pitchOnKey: 0, // 确认后选中的优惠券key
        select: {}, // 选中的临时数据
        pitchOn: {}, // 确认后选中的优惠券数据
        instructions: '', // 优惠券使用说明
        payList: [
          // { id: 1, name: '微信支付' },
          // { id: 2, name: '支付宝支付' },
        ],
        payNum: 0, // 支付选择项
        openId: '',
      };
    },
    methods: {
      // 商品详情获取
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
        console.log(this.activity, '订单活动');
      },
      // 获取地址列表
      async getAddressList(key) {
        const res = await getAddressList({ stuUid: this.uid });
        if (res.body.length - 1 >= key) {
          this.address = res.body[key] || {};
        }
      },
      // 获取默认地址
      async getDefaultAddress() {
        console.log(res);
        const res = await getAddressList({ stuUid: this.uid });
        if (res.body.length > 0) {
          res.body.map((item) => {
            if (item.prime == 1) {
              this.address = item;
            }
          });
        }
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

      // 增加商品数量
      handleAdd(skuCode) {
        // if (this.commodity.limitCount) {
        //   if (this.num < this.commodity.limitCount) {
        //     this.num++;
        //     this.radio = -1;
        //     this.pitchOn = {};
        //     this.pitchOnKey = 0;
        //     this.discount = 0;
        //     this.select = {};
        //   } else {
        //     uni.showToast({
        //       title: '数量超出限制',
        //       icon: 'none',
        //     });
        //   }
        // } else {
        //   this.num++;
        //   this.radio = -1;
        //   this.pitchOn = {};
        //   this.pitchOnKey = 0;
        //   this.discount = 0;
        //   this.select = {};
        // }
        let item = this.commodityList.find((item) => item.skuCode == skuCode);
        let stock = item.stock ? item.stock : 10000; //没有库存同app逻辑设置为10000件
        // 活动取最小库存
        if (JSON.stringify(this.activity) != '{}') {
          let optionActivity = this.activity.skuData.find((item) => item.skuCode == skuCode);
          stock = Math.min(stock, optionActivity.quantity, optionActivity.overplus);
        }
        if (item.number >= stock) {
          uni.showToast({ icon: 'none', title: '库存不足' });
          return;
          // console.log('超出库存了');
        } else {
          item.number++;
        }
        // item.number++;
        this.radio = -1;
        this.pitchOn = {};
        this.pitchOnKey = 0;
        this.discount = 0;
        this.select = {};
      },
      // 减少商品数量
      handleReduce(skuCode) {
        let item = this.commodityList.find((item) => item.skuCode == skuCode);
        if (item.number > 1) {
          item.number--;
          this.radio = -1;
          this.pitchOn = {};
          this.pitchOnKey = 0;
          this.discount = 0;
          this.select = {};
        }
        // if (this.num > 1) {
        //   this.num--;
        //   this.radio = -1;
        //   this.pitchOn = {};
        //   this.pitchOnKey = 0;
        //   this.discount = 0;
        //   this.select = {};
        // }
      },
      // 使用说明
      handleMark(val) {
        this.instructions = val;
        this.$refs.question.showModal = true;
      },
      //查询优惠券接口
      async handleCoupons() {
        // const money = JSON.stringify(this.activity) != '{}' ? this.activity.amount : this.totalPrice;
        const res = await getPayCoupon({
          commodityId: this.commodityList[0].id,
          // amount: (money * 100 * this.num) / 100,
          // amount:
          //   JSON.stringify(this.activity) != '{}'
          //     ? (this.commodityList[0].amount * this.totalNum).toFixed(2)
          //     : this.totalPrice.toFixed(2),
          amount: this.totalPrice.toFixed(2),
        });
        this.usableList = res.body;
      },
      // 选择优惠券弹窗
      async handleDraw() {
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
          // const money =
          //   JSON.stringify(this.activity) != '{}'
          //     ? (this.activity.amount * 100 * this.num) / 100
          //     : this.totalPrice;
          const money = this.totalPrice;
          console.log(money, item, key, this.totalPrice, '优惠券');
          if (item.usable) {
            this.radio = key;
            if (item.type == 0) {
              if (this.totalPrice > item.discount) {
                this.discount = item.discount;
              } else {
                this.discount = money;
              }
            } else if (item.type == 1) {
              this.discount = (this.totalPrice * (10 - item.discount)) / 10;
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
      // 切换支付方式
      changePay(key) {
        this.payNum = key;
      },
      // 打开支付弹窗
      openPayModal() {
        this.$refs.pay.showCover = true;
      },
      // 点击购买
      handleBuy: throttle(async function() {
        let res = {};
        if (JSON.stringify(this.address) == '{}') {
          uni.showToast({
            title: '请填写地址',
            icon: 'none',
          });
        } else {
          if (JSON.stringify(this.activity) != '{}') {
            if (JSON.stringify(this.pitchOn) != '{}') {
              res = await createOrder({
                commodities: this.commodityList,
                remark: '',
                coupons: [this.pitchOn.id],
                activity: { id: this.activity.activityId, groupId: this.groupId },
                addressId: this.address.id,
              });
            } else {
              res = await createOrder({
                commodities: this.commodityList,
                remark: '',
                coupons: [],
                activity: { id: this.activity.activityId, groupId: this.groupId },
                addressId: this.address.id,
              });
            }
          } else {
            if (JSON.stringify(this.pitchOn) != '{}') {
              res = await createOrder({
                commodities: this.commodityList,
                remark: '',
                coupons: [this.pitchOn.id],
                addressId: this.address.id,
              });
            } else {
              res = await createOrder({
                // commodities: [{ id: this.commodity.id, number: this.num }],
                commodities: this.commodityList,
                remark: '',
                coupons: [],
                addressId: this.address.id,
              });
            }
          }
          // 不在购买返回
          if (res.code == 2086) {
            uni.showToast({
              title: res.info,
              icon: 'none',
            });
            return;
          }
          if (res.code == 2087) {
            uni.showToast({
              title: '超出商品限购数量',
              icon: 'none',
            });
          } else {
            if (res.body.isCreated) {
              uni.redirectTo({
                url: `/page_commodity/order/pages/entityDetail?id=${res.body.orderId}`,
              });
              // 是否是0元商品
            } else if (res.body.isFree) {
              // 是否是拼团
              if (this.isCollage) {
                //拼团
                if (this.groupId) {
                  // 是否有小组id
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
                  url: `/page_commodity/order/pages/entityDetail?id=${res.body.orderId}&showSuccess=true`,
                });
              }
            } else {
              if (this.isCollage) {
                /* #ifdef H5 */
                if (this.payNum == 3) {
                  // 微信jsapi支付
                  wxJsPay(
                    this.openId,
                    this.commodityList[0].commodityType,
                    res.body.orderId,
                    this.commodity.id,
                    this.groupId
                  );
                  return;
                }
                /* #endif */
                handlePay(
                  this.openId,
                  this.commodityList[0].commodityType,
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
                  wxJsPay(
                    this.openId,
                    this.commodityList[0].commodityType,
                    res.body.orderId
                    // this.commodity.id
                  );
                  return;
                }
                /* #endif */
                handlePay(
                  this.openId,
                  this.commodityList[0].commodityType,
                  res.body.orderId,
                  true,
                  this.payNum
                  // this.commodity.id
                );
              }
            }
          }
        }
      }, 300),
    },
    beforeDestroy() {
      uni.removeStorage({ key: 'radio' });
    },
  };
</script>
<style lang="scss" scoped>
  .no-use {
    color: #9fa1a4;
  }
  .address-box {
    width: 702rpx;
    min-height: 96rpx;
    background: #ffffff;
    margin: 0 auto;
    padding: 64rpx 24rpx;
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
    .money-style {
      margin-left: 12rpx;
    }
    .flex-item {
      width: 420rpx;
      span {
        width: 56rpx;
      }
    }
  }
  .price-list {
    display: flex;
    justify-content: space-between;
    border-bottom: 2rpx solid #f5f6fa;
    margin-bottom: 24rpx;
    .text-box {
      // width: 350rpx;
      width: 100%;
    }
    .item-box {
      text-align: end;
      width: 100%;
      .youhui-box {
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
    }
    .item-name {
      margin-bottom: 24rpx;
    }
    .discount-box {
      padding: 6rpx;
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
  .text-coupon {
    text-align: end;
    margin-top: 18rpx;
  }
  .scroll-box {
    margin-bottom: 140rpx;
    margin-top: 16rpx;
    .coupon-box {
      margin-bottom: 24rpx;
    }
  }
  .noCard {
    margin-top: 128rpx;
    margin-bottom: 128rpx;
    image {
      width: 324rpx;
      height: 316rpx;
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
    .pay-price {
      margin-left: 30rpx;
    }
    .total-price {
      display: flex;
      align-items: center;
      margin-top: 37rpx;
    }
    .button-buy {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 296rpx;
      height: 96rpx;
      border-radius: 80rpx;
      color: #ffffff;
      background: #e51600ff;
      margin: 20rpx 60rpx 0 60rpx;
      &:active {
        opacity: 0.8;
      }
    }
    .ml-price {
      margin-left: 48rpx;
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
