<!--
* @desc 课程订单支付
* @author 江玉龙
* @date 2023年02月13日
-->
<template>
  <view class="common-bg" :style="{ paddingBottom: '200rpx' }">
    <!-- <Prompt :status="orderData.status" :expressStatus="orderData.expressStatus" /> -->
    <!-- 地址 -->
    <!-- <view
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
    </view> -->
    <!-- <view class="divider"
      ><view
        v-for="item in list"
        :key="item"
        class="color-block"
        :class="item % 2 == 0 ? 'black' : 'blue'"
    /></view> -->
    <!-- 商品 -->
    <view class="list-box">
      <p class="box-tit">商品信息</p>
      <view v-for="(item, index) in commodityList" :key="index" class="commoditylist">
        <view class="collage-flex">
          <view>
            <image :src="item.thumbnail" class="img-commodity" mode="aspectFit" />
          </view>
          <view class="name-box">
            <view class="common-text-400 truncate-style">{{ item.name }} </view>
            <view class="comm-date" v-if="item.subName">{{ item.subName }}</view>
          </view>
          <view class="price-box">
            <view class="comm-name">
              ￥{{ JSON.stringify(activity) != '{}' ? item.amount : item.price }}
            </view>
            <view class="lineprice">￥{{ item.linePrice }}</view>
            <view class="comm-count">x{{ item.number }}</view>
          </view>
        </view>
      </view>
    </view>
    <!-- 优惠卷 -->
    <view class="card-box" @tap="handleDraw()">
      <view class="card-list">
        <!-- <view class="text-size-sn common-text-400 common-text"> -->
        <view class="text-size-sn common-text-400">优惠卷</view>
        <!-- </view> -->
        <view class="text-size-sn common-text-400 item-box">
          <!-- <view class="item-name">
            ￥{{
              JSON.stringify(activity) != '{}'
                ? (activity.amount * 100 * num) / 100
                : (totalPrice * 100) / 100
            }}
          </view> -->
          <view class="flex-center">
            <view>
              <view
                class="common-text-400 text-size-xs price-display no-use"
                v-if="usableList.length === 0"
                >无可用</view
              >
              <view
                class="common-text-400 text-size-xxs common-price discount-box price-display"
                v-if="usableList.length != 0 && pitchOnKey === 0"
                >未选择优惠卷</view
              >
            </view>
            <CouponName :item="pitchOn" v-if="pitchOnKey > 0" class="price-display" />
            <view class="text-size-sn common-price pitch-price" v-if="pitchOnKey > 0"
              >-￥{{ pitchOnKey }}
            </view>
            <view class="t-icon t-icon-chevron-right right-icon" />
          </view>
        </view>
      </view>
    </view>
    <!-- 表格 -->
    <view class="list-box">
      <view class="price-list">
        <view class="text-size-sn common-text-400 common-text">
          <view class="item-name">商品原价</view>
          <view class="item-name">优惠金额</view>
        </view>
        <view class="text-size-sn common-text-400 common-text item-box">
          <view class="item-name common-price">
            ￥{{ ((totalPrice * 100) / 100).toFixed(2) }}
          </view>
          <view class="item-name flex-content">
            <view
              class="common-text-400 text-size-xxs common-price discount-box"
              v-if="pitchOnKey == 0"
              >-￥0</view
            >
            <CouponName :item="pitchOn" v-if="pitchOnKey <= 0" class="price-display" />
            <view class="text-size-sn pitch-price common-price" v-if="pitchOnKey > 0"
              >-￥{{ pitchOnKey }}
            </view>
            <!-- <view class="t-icon t-icon-chevron-right right-icon" /> -->
          </view>
        </view>
      </view>
      <view class="text-coupon"
        ><view class="act-pay">实际支付</view>
        <view class="common-text-400 common-price"
          >￥{{ (totalPrice - pitchOnKey).toFixed(2) }}</view
        ></view
      >
    </view>
    <!-- 签署协议 -->
    <view
      class="card-box"
      @tap="goSign()"
      v-if="commodity.contract && commodity.contract.signTime === 1"
    >
      <view class="card-list">
        <view class="text-size-sn common-text-400">产品协议</view>
        <view class="flex-center">
          <view class="common-text-400 text-size-xs price-display no-use">{{
            signStatus === 0 ? '未签署' : '已签署'
          }}</view>

          <view class="t-icon t-icon-chevron-right right-icon" />
        </view>
      </view>
    </view>
    <!-- <view class="text-center text-size-xxs common-text-400 common-tip"
      >提示：所购商品可以在我的-已购买中查看。</view
    > -->
    <view class="flex-row items-center group_7 space-x-6">
      <!-- <checkbox-group class="group">
        <checkbox :checked="ischecked" color="#E51600" />
      </checkbox-group> -->

      <view class="imgbox" @tap="checkboxChange">
        <image
          src="https://acc.wangxiao.cn/image/app/unselect.png"
          class="checkimg"
          v-if="!ischecked"
        ></image>
        <image src="https://acc.wangxiao.cn/image/app/selected.png" class="checkimg" v-else></image>
      </view>

      <view>
        <text class="font_6 text_7">我已阅读</text>
        <text v-if="!isMember && ifShowArgee" class="font_6 text_8" @click="viewProtocol(1)"
          >《产品协议》</text
        >
        <text v-if="!isMember && ifShowArgee" class="font_6 text_7">与</text>
        <text class="font_6 text_8" @click="viewProtocol(2)">《学员服务条款》</text>
        <text class="font_6 text_7">并知晓协议</text>
        <text class="font_6 text_7">内容。</text>
      </view>
    </view>
    <!-- 支付 -->
    <view class="pay-item" v-if="system">
      <view class="disable-Btn flex-center">iOS暂不支持购买</view></view
    >
    <view class="pay-item" v-else>
      <view class="pay-price">
        <view class="total-price">
          <!-- <view class="text-size-xxs">
            <span class="common-price goodsnow">￥</span>
          </view> -->
          <span class="text-size-xl common-price goodsnow"
            >￥{{ (totalPrice - pitchOnKey).toFixed(2) }}</span
          >
        </view>
        <!-- <view class="across-line text-size-xxs common-tip ml-price" v-if="commodity.linePrice"
          >原价: ￥{{ (commodity.linePrice * 100 * num) / 100 }}</view
        > -->
      </view>
      <!-- #ifndef H5 -->
      <button
        class="button-buy"
        @tap="goSign()"
        v-if="commodity.contract && commodity.contract.signTime === 1 && signStatus === 0"
        >签署协议
      </button>
      <button class="button-buy" @tap="handleBuy()" v-else>立即支付</button>
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <button
        class="button-buy"
        @tap="goSign()"
        v-if="commodity.contract && commodity.contract.signTime === 1 && signStatus === 0"
        >签署协议
      </button>
      <button class="button-buy" @tap="openPayModal()" v-else> 立即支付</button>
      <!-- #endif -->
    </view>
    <!-- 优惠券 -->
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
  import { handlePay, wxJsPay } from '@/utils/pay.js';
  // import { getPayRedicrtUrl } from '@/utils/payUrl.js';
  import { throttle } from '@/page_commodity/courseList/util';
  import { getPayCoupon } from '@/api/modules/coupon/index';
  import { getCommodityDetail } from '@/api/modules/commodity/index';
  import {
    getCollageOrder,
    createOrder,
    setSignRecord,
    getSignStatus,
  } from '@/api/modules/order/index';
  import { getH5ChannelId } from '@/api/modules/user/index.ts';
  import { getAddressList } from '@/api/modules/user/setUp.ts';
  export default {
    name: 'entityOrder',
    components: {
      BottomModal,
      CouponName,
      PopupWindow,
      CouponPay,
    },
    async onLoad(options) {
      // if (options.isCollage == 'true') {
      //   this.isCollage = true;
      //   this.groupId = options.groupId;
      // }
      // if (options.ifActivity == 'true') {
      //   this.getCollageOrder(options.commodityList[0].id);
      // }
      const { body } = await getH5ChannelId();
      this.channelId = body;
      this.commodityList = JSON.parse(options.commodityList);
      console.log(JSON.parse(options.commodityList), 'list--');
      console.log(this.commodityList, '商品数据');
      if (options.isCollage == 'true') {
        this.isCollage = true;
        this.groupId = options.groupId;
      }
      if (options.ifActivity == 'true') {
        this.getCollageOrder(this.commodityList[0].id);
      }
      // this.commodityList = options.commodityList;
      this.getCommodityDetail(this.commodityList[0].id);
      if (options.orderContractId) {
        this.orderContractId = options.orderContractId;
        this.contractSignRecord();
      }
      if (options.isMember) {
        // 会员商品屏蔽产品协议
        this.isMember = options.isMember;
      }
      if (options.ifShowArgee) {
        this.ifShowArgee = options.ifShowArgee == 'true' ? true : false;
        console.log();
      }

      // if (options.contract.signTime === 1) {
      //
      //   this.contractInfo = this.commodity.contract;
      //
      // }
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
        ischecked: false, //协议勾选
        channelId: '',
        addressKey: -1, // 选中的地址
        activity: {}, // 活动数据
        address: {}, // 地址数据
        commodity: {}, // 商品数据
        commodityId: 0,
        commodityList: [], //商品列表
        num: 1, // 商品数量
        usableList: [], // 优惠券数据
        radio: -1, // 选择项
        discount: 0, // 优惠金额
        pitchOnKey: 0, // 确认后选中的优惠券key
        select: {}, // 选中的临时数据
        pitchOn: {}, // 确认后选中的优惠券数据
        instructions: '', // 优惠券使用说明
        payList: [],
        payNum: 0, // 支付选择项
        contractInfo: {}, //协议签署信息
        recordId: '',
        signStatus: 0, //协议签署状态 0未签署 1已签署 3签署中
        orderContractId: '', //协议签署id
        openId: '',
        isMember: false,
        ifShowArgee: false,
      };
    },
    methods: {
      //协议勾选事件
      checkboxChange() {
        this.ischecked = !this.ischecked;
      },
      // checkboxChange: function(e) {
      //   console.log('checkbox发生change事件，携带value值为：', e.detail.value);
      //   let val = e.detail.value;
      //   if (val.length > 0) {
      //     this.setData({
      //       checked: true,
      //       disabled: false,
      //     });
      //   } else {
      //     this.setData({
      //       checked: false,
      //       disabled: true,
      //     });
      //   }
      // },

      // 商品详情获取
      async getCommodityDetail(id) {
        const res = await getCommodityDetail({ id });
        this.commodity = res.body;
        this.contractInfo = this.commodity.contract;
        if (this.contractInfo.signTime === 1 && this.orderContractId == '') {
          this.createSignStatus();
        }
      },
      // 获取商品活动详情
      async getCollageOrder(id) {
        const res = await getCollageOrder({ commodityId: id });
        if (res.body) {
          this.activity = res.body;
        }
      },
      // 获取地址列表
      async getAddressList(key) {
        const res = await getAddressList({ stuUid: this.uid });
        if (res.body.length - 1 >= key) {
          this.address = res.body[key] || {};
        }
      },
      //协议跳转
      viewProtocol(type) {
        // uni.navigateTo({
        //   url: `/page_commodity/order/pages/userProtocol?channelId=${this.channelId}`,
        // });
        if (type == 2) {
          /* #ifndef H5 */
          this.channelId = uni.getStorageSync('channelId');
          /* #endif */
          // console.log('channelId', this.channelId);

          uni.navigateTo({
            url: `/page_commodity/order/pages/userProtocol?channelId=${this.channelId}`,
          });
        } else {
          uni.navigateTo({
            url: `/page_commodity/order/pages/productAgreement?src=${this.commodity.contract.url}`,
          });
          // uni.navigateTo({
          //url: `/page_commodity/commodity/pages/goArgeement?url=${this.commodity.contract.url}`,
          // });
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
        item.number++;
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
      // 使用说明
      handleMark(val) {
        this.instructions = val;
        this.$refs.question.showModal = true;
      },
      //优惠券接口
      async handleCoupons() {
        const res = await getPayCoupon({
          commodityId: this.commodityList[0].id,
          amount: this.totalPrice,
          // amount: (money * 100 * this.num) / 100,
        });
        this.usableList = res.body;
      },
      // 选择优惠券弹窗
      async handleDraw() {
        // const money =
        //   JSON.stringify(this.activity) != '{}' ? this.activity.amount : this.commodity.price;

        this.$refs.coupon.showCover = true;
      },
      // 选择其中一个优惠券
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

          if (item.usable) {
            this.radio = key;
            if (item.type == 0) {
              if (this.totalPrice > item.discount) {
                this.discount = item.discount;
              } else {
                this.discount = money;
              }
            } else if (item.type == 1) {
              this.discount = ((this.totalPrice * (10 - item.discount) * 100) / 10 / 100).toFixed(
                2
              );
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
      //协议判断
      checkAgree() {
        if (!this.ischecked) {
          uni.showToast({ icon: 'none', title: '请勾选产品协议以及中大网校学员服务条款' });
        }
      },
      // 点击购买
      handleBuy: throttle(async function() {
        this.checkAgree();
        if (!this.ischecked) {
          return;
        }
        let res = {};

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
            // 如果是课程商品
            if (this.commodityList[0].commodityType != 3) {
              uni.redirectTo({
                url: `/page_commodity/order/pages/orderDetails?id=${res.body.orderId}`,
              });
            } else {
              uni.redirectTo({
                url: `/page_commodity/order/pages/entityDetail?id=${res.body.orderId}`,
              });
            }
            // 是否是0元商品
          } else if (res.body.isFree) {
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
              if (this.commodityList[0].commodityType != 3) {
                uni.redirectTo({
                  url: `/page_commodity/order/pages/orderDetails?id=${res.body.orderId}&showSuccess=true`,
                });
              } else {
                uni.redirectTo({
                  url: `/page_commodity/order/pages/entityDetail?id=${res.body.orderId}&showSuccess=true`,
                });
              }
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
                this.groupId,
                this.channelId
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
                // this.commodity.id,
                // this.channelId
              );
            }
          }
        }
      }, 300),
      // 转发页面
      async onShareAppMessage() {
        return {
          path: '/page_commodity/order/pages/collageOrder',
          // imageUrl: 'https://app.static.wangxiao.cn/ykmf/images/zuduishuati.png',
        };
      },
      async createSignStatus() {
        const { body } = await setSignRecord({ commodityId: this.commodityList[0].id });
        this.orderContractId = body;
        this.contractSignRecord();
      },
      // 生成协议记录
      async contractSignRecord() {
        const res = await getSignStatus({ orderContractId: this.orderContractId });
        this.signStatus = res.body.status;
        if (res.body.status === 2) {
          this.contractInfo.url = res.body.exclusiveContractUrl;
        }
        this.commodityList.forEach((item) => {
          Object.assign(item, { contractHistoryId: this.orderContractId });
        });
      },
      //产品协议签署跳转
      goSign() {
        uni.navigateTo({
          url: `/page_material/agreement/agreementDetail?fileUrl=${this.contractInfo.url}&recordId=${this.orderContractId}&isSigned=${this.signStatus}&isOrder=false&goodsId=${this.commodityList[0].id}`,
        });
      },
    },
    beforeDestroy() {
      uni.removeStorage({ key: 'radio' });
    },
  };
</script>
<style lang="scss">
  .no-use {
    color: #9fa1a4;
    font-size: 14px;
  }
  .goodsnow {
    // margin-left: 30rpx;
    color: #e51600;
    font-weight: 600;
    font-size: 48rpx;
    margin-right: 16rpx;
  }
  /*  重写 checkbox 样式  */
  /* 未选中的 背景样式 */
  checkbox .wx-checkbox-input {
    border-radius: 4rpx; /* 圆角 */
    width: 32rpx; /* 背景的宽 */
    height: 32rpx; /* 背景的高 */
    // border: 2rpx solid #e51600ff;
  }
  /* 选中后的 背景样式 （红色背景 无边框 可根据UI需求自己修改） */
  // checkbox .wx-checkbox-input.wx-checkbox-input-checked {
  //   background: red;
  // }
  /* 选中后的 对勾样式 （白色对勾 可根据UI需求自己修改） */
  checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
    border-radius: 4rpx; /* 圆角 */
    width: 32rpx; /* 背景的宽 */
    height: 32rpx; /* 背景的高 */
    text-align: center;
    font-size: 30rpx; /* 对勾大小 30rpx */
    color: #e51600ff; /* 对勾颜色 白色 */
    background: transparent;
    transform: translate(-50%, -50%) scale(1);
    -webkit-transform: translate(-50%, -50%) scale(1);
    border: 2rpx solid #e51600ff;
  }
  .imgbox {
    padding: 2px 6px 10px 10px;
  }
  .checkimg {
    width: 40rpx;
    height: 40rpx;
    // margin-right: 6px;
    // margin-top: 2px;
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
    // margin: 20rpx 24rpx;
    margin: 0 24rpx 20rpx 24rpx;
    border-radius: 24rpx;
    background: #ffffff;
    padding: 32rpx 20rpx;
    .box-tit {
      margin-bottom: 32rpx;
      font-size: 28rpx;
      font-weight: 400;
      color: #333333;
    }
    .commoditylist {
      height: 112rpx;
      .collage-flex {
        display: flex;
        justify-content: space-between;
        margin-top: 30rpx;
      }
      .name-box {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 112rpx;
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
          // white-space: nowrap;
          // overflow: hidden;
          // text-overflow: ellipsis;
          width: 320rpx;
        }
      }
    }
  }
  .card-box {
    box-sizing: border-box;
    margin: 20rpx 24rpx;
    border-radius: 24rpx;
    background: #ffffff;
    padding: 40rpx 20rpx;
    .card-list {
      display: flex;
      align-items: center;
      justify-content: space-between;
      line-height: 0 !important;
      color: #323949;
    }
    .discount-box {
      padding: 18rpx 6rpx;
      border: 2rpx solid #f0522f;
      border-radius: 10rpx;
    }
  }
  .img-commodity {
    width: 200rpx;
    height: 112rpx;
    margin-right: 16rpx;
    border-radius: 12rpx;
    object-fit: cover;
  }
  .pitch-price {
    font-size: 24rpx;
    color: #ff7200;
    font-weight: 400;
  }

  .price-box {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 112rpx;
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
    }
    .truncate-style {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      width: 420rpx;
      font-size: 24rpx;
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
  .price-list {
    display: flex;
    // align-items: center;
    justify-content: space-between;

    margin-bottom: 16rpx;
    .item-box {
      text-align: end;
    }
    .item-name {
      margin-bottom: 24rpx;
    }
    .flex-content {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    .discount-box {
      padding: 0rpx 4rpx;
      // border: 2rpx solid #f0522f;
      border-radius: 10rpx;
    }
    .right-icon {
      width: 28rpx;
      height: 28rpx;
    }
    .price-display {
      // margin-right: 16rpx;
    }
  }
  .text-coupon {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // margin-top: 18rpx;
    border-top: 2rpx solid #f5f6fa;
    padding-top: 24rpx;
    .act-pay {
      font-size: 28rpx;
      font-weight: 400;
      color: #333333;
    }
    .money-style {
      margin-left: 12rpx;
      color: #ff7200;
      font-size: 32rpx;
      font-weight: 400;
      font-family: 'Inter';
    }
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

  .group_7 {
    padding: 0 36rpx 0;
    display: flex;
    // align-items: center;
    // flex-wrap: wrap;
    .check-box {
      width: 32rpx;
      height: 32rpx;
      border: 2px solid #e51600;
      margin-right: 20rpx;
    }
    .image_6 {
      border-radius: 4rpx;
      width: 32rpx;
      height: 32rpx;
      margin-right: 20rpx;
    }
    .font_6 {
      font-size: 20rpx;
      font-family: PingFang SC;
      line-height: 21rpx;
    }
    .text_7 {
      color: #9ea1a3;
      font-size: 22rpx;
    }
    .text_8 {
      color: #4b538a;
      font-size: 22rpx;
    }
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
      font-size: 48rpx;
    }
    .button-buy {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 296rpx;
      height: 96rpx;
      border-radius: 80rpx;
      color: #ffffff;
      background: #e51600;
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
