<!--
* @desc 支付组件
* @author 江玉龙
* @date 2022年04月21日
-->
<template>
  <view class="pay-box">
    <view class="pay-item" v-if="system && commodityData.activityType != 4">
      <view class="disable-Btn flex-center">iOS暂不支持购买</view></view
    >

    <view v-else class="pay-content">
      <view class="pay-item" v-if="commodityData.isExpired">
        <view class="expired-Btn flex-center">已过期</view></view
      >
      <!-- 证书课程报名按钮 -->
      <view class="pay-item" v-if="commodityData.certificateId">
        <view
          class="flex-center live-btn"
          style="margin-top: 10px;height:52px"
          @tap="handleEnroll(commodityData.certificateId)"
          >{{ commodityData.buttonName ? commodityData.buttonName : '立即报名' }}</view
        ></view
      >

      <!-- 直播相关按钮 -->
      <view class="pay-item" v-else-if="commodityData.activityType == 4">
        <view class="pay-item" v-if="system && !iosShow">
          <view class="disable-Btn flex-center">iOS暂不支持购买</view></view
        >
        <view class="flex center pay-item" v-else>
          <button
            type="primary"
            class="live-btn"
            contact
            v-if="
              liveStep === 0 && sessionKey && !commodityData.isExpired && commodityData.status != 1
            "
            open-type="getPhoneNumber"
            @getphonenumber="getCode"
          >
            请先授权
          </button>
          <button
            type="primary"
            class="live-btn"
            contact
            v-else-if="liveStep === 0 && !commodityData.isExpired && commodityData.status != 1"
            @tap="getCode"
          >
            请先授权
          </button>
          <view
            class="live-btn"
            v-if="liveStep == 1 && !commodityData.isExpired && commodityData.status != 1"
            @tap="reserve"
            >{{ btnName ? btnName : '预约课程' }}</view
          >
          <view
            class="live-btn"
            v-show="liveStep === 2 && !commodityData.isExpired && commodityData.status != 1"
            @tap="toLearn"
            >去学习</view
          >
        </view>
        <!-- 支付按钮 -->
        <!-- <view class="live-btn" v-show="liveStep === 0">请先授权</view> -->
        <!-- <button
          type="primary"
          class="live-btn"
          contact
          v-if="
            liveStep === 0 && sessionKey && !commodityData.isExpired && commodityData.status != 1
          "
          open-type="getPhoneNumber"
          @getphonenumber="getCode"
        >
          请先授权
        </button>
        <button
          type="primary"
          class="live-btn"
          contact
          v-else-if="liveStep === 0 && !commodityData.isExpired && commodityData.status != 1"
          @tap="getCode"
        >
          请先授权
        </button>
        <view
          class="live-btn"
          v-show="liveStep === 1 && !commodityData.isExpired && commodityData.status != 1"
          @tap="reserve"
          >{{ btnName ? btnName : '预约课程' }}</view
        >
        <view
          class="live-btn"
          v-show="liveStep === 2 && !commodityData.isExpired && commodityData.status != 1"
          @tap="toLearn"
          >去学习</view
        > -->

        <!-- <view v-if="commodityData.status == 0">
          <view class="skubutton">
            <view class="sku-left">
              <view class="goodsnow"><span>￥</span>{{ commodityData.price }}起</view>

              <view class="lineprice">{{ commodityData.linePrice }}起</view>
            </view>
          </view>
        </view>
        <view v-if="commodityData.status == 0" class="no-collage-second">
          <button class="button-buy" @tap="handleBuy()">立即选购</button>
        </view> -->

        <view class="shelf-box"
          ><view class="shelf-btn flex-center" v-if="commodityData.status == 1">已售罄</view></view
        >
      </view>
      <view class="pay-item" v-else>
        <!-- 支付按钮 -->

        <view v-if="commodityData.status == 0">
          <view class="skubutton">
            <view class="sku-left">
              <view class="goodsnow"
                ><span style="font-weight: 500;font-size:24rpx">￥</span
                >{{
                  commodityData.activityType == 3 || commodityData.activityType == 2
                    ? activity.amount
                      ? activity.amount
                      : commodityData.price
                    : commodityData.price
                }}
                <span style="font-size:10px">起</span></view
              >
              <view class="lineprice">￥{{ commodityData.linePrice }}起</view>
            </view>
          </view>
        </view>
        <view v-if="commodityData.status == 0" class="no-collage-second">
          <button class="button-buy" @tap="handleBuy()">立即选购</button>
        </view>

        <view class="shelf-box"
          ><view class="shelf-btn flex-center" v-if="commodityData.status == 1">已售罄</view></view
        >
      </view>
      <view>{{ liveStep }}</view>
    </view>
    <MovePopup
      v-model="showPopup"
      @change="movePopupChange"
      :goodsdata="goodsdata"
      class="popbox"
      showClose="close"
    >
      <view class="goodstit">{{ commodityData.name }}</view>
      <view class="goodsprice flex">
        <view class="goodsnow" v-if="amountPrice == 0">
          <span style="font-weight: 500;font-size:28rpx">￥</span>
          <span style="font-size:28rpx"
            >{{
              commodityData.activityType == 3
                ? activity.amount
                  ? activity.amount
                  : commodityData.price
                : commodityData.price
            }}
          </span>
          <span style="font-size:28rpx">起</span>
        </view>
        <view class="goodsnow" v-else><span>￥</span>{{ amountPrice }}</view>
        <view class="lineprice"
          ><span>￥</span> <span>{{ commodityData.linePrice }}</span> <span>起</span>
        </view>
      </view>
      <view class="sku-box" v-for="(data, key) in commodityData.skuOptions" :key="key">
        <p>{{ data.name }}</p>
        <view class="skuitem-box">
          <view
            v-for="(item, index) in data.values"
            :key="index"
            class="skuitem"
            :class="[select[key] === index ? 'select' : 'unselect']"
            @click="onClickOption(key, index)"
          >
            {{ item }}
            <img
              src="@/static/svgs/bixue.svg"
              alt=""
              class="miaosha-tit"
              v-if="commodityData.certificateId"
            />
            <view
              v-if="
                (commodityData.activityType == 3 || commodityData.activityType == 2) &&
                  key == level - 1 &&
                  !getOverplus(key, index)
              "
              class="shouqing-tag"
            >
              <text class="scale">售罄</text></view
            >
            <view
              v-if="commodityData.activityType == 3 && key == level - 1 && getOverplus(key, index)"
              class="miaosha-tag"
              ><text class="scale">秒杀</text>
            </view>
            <view
              v-if="commodityData.activityType == 2 && key == level - 1 && getOverplus(key, index)"
              class="pintuan-tit"
              ><text class="scale">拼团</text></view
            >
          </view>
        </view>
      </view>
      <view
        class="countdown-box"
        v-if="commodityData.activityType == 3 && activity.skuData[0].amount"
      >
        <view>
          <view>限时秒杀</view>
          <view class="flex-countdown"
            >剩<NewCountdown
              backgroundColor="#fff"
              textColor="#FF7200"
              fgColor="#FF7200"
              :remain="timeData"
              :showBox="true"
            />后活动截止</view
          >
        </view>
      </view>
      <view class="skubutton">
        <view v-if="commodityData.activityType != 2 && commodityData.status == 0" class="btn-comm">
          <view>
            <view class="sku-left" v-if="goodsCart.length == 0">
              <view class="goodsnow"
                ><span style="font-size:10px">￥</span
                >{{
                  commodityData.activityType == 3
                    ? activity.amount
                      ? activity.amount
                      : commodityData.price
                    : commodityData.price
                }}
                <span style="font-size:10px">起</span></view
              >
              <view class="lineprice">
                <span class="qi">￥</span>{{ commodityData.linePrice }}</view
              >
            </view>
            <view class="pay-price" v-else>
              <view class="total-price">
                <view class="text-size-xxs">
                  合计:<span class="common-price" style="font-size: 32rpx;font-weight: 500;"
                    >￥</span
                  >
                  <span class="text-size-xl common-price goodsnow">{{
                    totalPrice.toFixed(2)
                  }}</span>
                  <view
                    >已选<span class="common-price">{{ totalNum }}</span
                    >件，<span class="cartdetail" @click="checkCart">查看明细 ></span>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view class="sku-right" v-if="commodityData.status == 0">
            <button class="button-right" @click="pay">立即结算</button>
            <button class="button-left" @click="addCart">加入清单</button>
          </view>
        </view>
        <!-- 拼团 -->
        <view class="miaosha-btn" v-else>
          <view>
            <view class="button-buy bug-money" @tap="handleOriginal()">
              <p class="text-size-xl common-text-700">￥{{ originalPrice }}</p>
              <p class="text-size-xxs common-text-700">单独购买</p>
            </view>
          </view>
          <view>
            <view class="button-buy bug-collage" @tap="handleCollage()">
              <p class="text-size-xl common-text-700">￥{{ amountPrice }}</p>
              <p class="text-size-xxs common-text-700">发起拼单</p>
            </view>
          </view>
        </view>
      </view>
    </MovePopup>
    <MovePopup
      title="已选明细"
      v-model="showCart"
      @change="cartChange"
      class="popbox"
      showClose="close"
    >
      <view>
        <view class="list-box">
          <view v-for="(item, index) in goodsCart" :key="index">
            <view class="detail-content">
              <view class="thumbnail">
                <image :src="item.thumbnail" class="img-commodity" mode="aspectFit" />
              </view>
              <view class="price-box">
                <view class="common-text-400 thruncate-style commodity-tit">{{ item.name }}</view>
                <div class="flex-item">
                  <view class="flex" style="align-items: center;margin-right:120rpx ;">
                    <view class="text-size-xs common-text-400" style="font-size: 28rpx;"
                      >￥{{ item.price }}</view
                    >
                    <view
                      class="text-size-xxs common-text-400"
                      style="text-decoration: line-through;"
                      >￥{{ item.linePrice }}</view
                    >
                  </view>

                  <view class="flex-item-center">
                    <view
                      class="t-icon t-icon-minus icon-style"
                      @tap="handleReduce(item.skuCode)"
                    />
                    <span class="flex-center">{{ item.number }}</span>
                    <view class="t-icon t-icon-add icon-style" @tap="handleAdd(item.skuCode)" />
                  </view>
                </div>
              </view>
            </view>
          </view>
        </view>
        <view style="height: 180rpx"></view>
        <view class="pay-item">
          <view class="pay-price">
            <view class="total-price">
              <view class="text-size-xxs price-left">
                合计:<span class="common-price" style="font-size: 32rpx;font-weight: 500;">￥</span>
                <span class="text-size-xl common-price goodsnow">{{ totalPrice.toFixed(2) }}</span>
                <view
                  >已选<span class="common-price">{{ totalNum }}</span
                  >件
                </view>
              </view>
            </view>
          </view>
          <view class="btn-box">
            <button class="button-buy" @tap="handlePay(true)">立即结算</button>
          </view>
        </view>
      </view>
    </MovePopup>
    <!-- 直播营销弹窗start -->
    <MovePopup
      v-model="showPopupLive"
      @change="movePopupChangeLive"
      :goodsdata="goodsdata"
      class="popbox"
      showClose="close"
    >
      <view class="goodstit">{{ commodityData.name }}</view>
      <view class="goodsprice flex"
        ><view class="goodsnow" v-if="amountPrice == 0"
          ><span>￥</span>{{ commodityData.price }}起</view
        >
        <view class="goodsnow" v-else><span>￥</span>{{ amountPrice }}</view>
        <view class="lineprice">￥{{ commodityData.linePrice }}</view>
      </view>
      <view class="sku-box" v-for="(data, key) in commodityData.skuOptions" :key="key">
        <p>{{ data.name }}</p>
        <view class="skuitem-box">
          <view
            v-for="(item, index) in data.values"
            :key="index"
            class="skuitem"
            :class="[select[key] === index ? 'select' : 'unselect']"
            @click="onClickOption(key, index)"
          >
            {{ item }}
          </view>
        </view>
      </view>
      <view class="skubutton">
        <view v-if="commodityData.activityType != 2 && commodityData.status == 0" class="btn-comm">
          <view>
            <view class="sku-left" v-if="goodsCart.length == 0">
              <view class="goodsnow"><span>￥</span>{{ commodityData.price }}起</view>
              <view class="lineprice">{{ commodityData.linePrice }}</view>
            </view>
            <view class="pay-price" v-else>
              <view class="total-price">
                <view class="text-size-xxs">
                  合计:<span class="common-price">￥</span>
                  <span class="text-size-xl common-price goodsnow">{{
                    totalPrice.toFixed(2)
                  }}</span>
                  <view
                    >已选<span class="common-price">{{ totalNum }}</span
                    >件 <span class="cartdetail" @click="pay">查看明细 ></span>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view
            class="sku-right"
            v-if="commodityData.activityType != 2 && commodityData.status == 0"
          >
            <button class="button-right" @click="pay">立即结算</button>
            <button class="button-left" @click="addCart">加入清单</button>
          </view>
        </view>
      </view>
    </MovePopup>
    <MovePopup v-model="showSuccess" :showClose="false" :showHeader="false" class="success-pop">
      <view class="success-pop">
        <img class="success-img" src="https://acc.wangxiao.cn/image/success.png" />
        <img
          class="success-img-close"
          @tap="() => (showSuccess = false)"
          src="@/static/img/live-close.png"
        />
        <view class="success-text">直播预约成功</view>
        <view class="success-btn flex-center">
          <view class="to-learn-btn" @tap="toLearn">去学习</view>
        </view>
      </view>
    </MovePopup>
    <!-- 直播营销弹窗end -->
  </view>
</template>
<script>
  import MovePopup from '@/components/MovePopup/move-popup.vue';
  import {
    getUserInfo,
    getMiniPhone,
    getRegister,
    // touristSign,
  } from '@/api/modules/register/index.ts';
  import { getLiveReserveStatus } from '@/api/modules/commodity/index';
  import { sucCollageTip, failCollageTip } from '@/enums/msgEnum';
  import { getCollageOrder, createOrder } from '@/api/modules/order/index';
  import baseInfo from '@/build/index';
  import { BaseFormUrl } from '@/enums/envEnum';
  import NewCountdown from '@/components/Countdown/NewCountdown.vue';
  import {
    ChannelAppId,
    DouyinAppId,
    WeixinAppId,
    BaiduChannelId,
    DouyinChannelId,
    WeixinChannelId,
    liveRemindTip,
  } from '@/enums/msgEnum';
  import { bottomNavTo } from '@/utils/common.js';
  import {
    getApplicationStatus,
    certCourseRegistration,
  } from '@/api/modules/certificateCourse/index';
  export default {
    name: 'payProcess',
    components: {
      MovePopup,
      NewCountdown,
    },
    data() {
      return {
        showPopup: false,
        showCart: false,
        amountPrice: 0,
        originalPrice: 0,
        overplus: 0,
        goodsdata: {},
        select: [],
        level: 0,
        commodityData: {},
        goodsCart: [
          // {
          //   id: '',
          //   skuCode: '',
          //   number: 0,
          //   name: '',
          //   price: '',
          //   linePrice: '',
          //   url: '',
          // },
        ],
        liveStep: 0, // 直播的按钮的相关状态 0-请先授权 1-预约课程 2-去学习
        btnName: '', // 按钮名字
        activityInfo: '', // 直播活动的相关信息
        showSuccess: false, // 直播预约成功弹窗
        showPopupLive: false, // 直播购买弹窗
        thirdAppId: '25689579',
        sessionKey: '',
        accessToken: '',
        channelId: '',
        isCollage: false,
      };
    },
    props: {
      data: {
        type: Object,
        required: true,
      },
      timeData: {
        type: Number,
        default: 0,
      },
      single: {
        type: Boolean,
      },
      // mode: {
      //   type: Number || String,
      // },
      iosShow: {
        type: Boolean,
        default: false,
      },
      isLive: {
        type: Boolean,
        default: false,
      },
      hasLogin: {
        type: Boolean,
        default: false,
      },
      formId: {
        type: String,
        default: '',
      },
      orderContractId: {
        type: String,
        default: '',
      },
      activity: {
        type: Object,
      },
    },
    computed: {
      system() {
        return this.$store.getters.getSystem;
      },
      totalNum() {
        let num = 0;
        this.goodsCart.map((item) => {
          num += item.number;
        });
        return num;
      },
      totalPrice() {
        let price = 0;
        this.goodsCart.map((item) => {
          if (JSON.stringify(this.activity) != '{}') {
            price += item.number * item.amount;
          } else {
            price += item.number * item.price;
          }
        });
        return price;
      },
      loginInfo() {
        let id = this.data.id;
        let isLogin = this.hasLogin;
        return {
          id,
          isLogin,
        };
      },
      curChannelId() {
        return this.$store.getters.getChannelId;
      },

      // computedData() {
      //   return this.commodityData;
      // },
    },
    watch: {
      data: {
        deep: true,
        handler(val) {
          this.commodityData = JSON.parse(JSON.stringify(val));
          uni.setStorageSync('commodityData', this.commodityData);
          // const level = this.commodityData.skuOptions.length;
          this.level = this.commodityData.skuOptions.length;
          const arr = [];
          for (let i = 0; i < this.level; i++) {
            arr.push(i < this.level ? 0 : '');
            this.select.push(i < this.level ? 0 : '');
          }
          // this.getCode();
        },
        /* #ifdef MP-TOUTIAO */
        immediate: true,
        /* #endif */
      },
      loginInfo: {
        deep: true,
        handler(n) {
          if (n.id && n.isLogin) {
            this.liveStep = 1;
            this.getBtnSatus(n.id);
            this.$forceUpdate();
          } else {
            this.liveStep = 0;
            this.$forceUpdate();
          }
        },
        immediate: true,
      },
    },
    // 是否登录 操作授权状态

    onLoad(options) {
      this.single = options.single;
      // this.mode = options.mode;
    },
    onReady() {},
    methods: {
      // 原价支付
      handleOriginal() {
        if (this.level != this.select.length) {
          uni.showToast({ icon: 'none', title: '请选择规格' });
          return;
        }
        this.goodsCart = [];
        this.addCart();
        this.handlePay(true);
      },
      // 发起拼单
      handleCollage() {
        if (this.overplus <= 0) {
          uni.showToast({ icon: 'none', title: '库存不足' });
          return;
        }
        if (this.level != this.select.length) {
          uni.showToast({ icon: 'none', title: '请选择规格' });
          return;
        }
        this.goodsCart = [];
        this.addCart();
        this.isCollage = true;
        this.handlePay();
        wx.requestSubscribeMessage({
          tmplIds: [sucCollageTip[baseInfo.CHANNEL], failCollageTip[baseInfo.CHANNEL]],
        });
      },
      // 活动库存
      getOverplus(key, index) {
        console.log(key, index, this.select, 'skuCode');
        let skuCode = '';
        const mockSelect = JSON.parse(JSON.stringify(this.select));
        mockSelect[key] = index;
        mockSelect.map((item, index) => {
          skuCode += index == 0 ? item : ':' + item;
        });
        let overplus = 0;
        if (JSON.stringify(this.activity) != '{}') {
          let option = this.activity.skuData.find((item) => item.skuCode == skuCode);
          overplus = option.overplus;
        }
        return overplus > 0;
      },
      //切换效果
      onClickOption(key, index) {
        // this.select[key] = index;
        let skuCode = '';
        this.$set(this.select, key, index);

        this.select.map((item, index) => {
          skuCode += index == 0 ? item : ':' + item;
        });

        if (JSON.stringify(this.activity) != '{}') {
          let option = this.activity.skuData.find((item) => item.skuCode == skuCode);
          this.overplus = option.overplus;
          this.amountPrice = option.amount;
          // 拼团的原价
          if (this.commodityData.activityType == 2) {
            let option2 = this.commodityData.skuList.find((item) => item.skuCode == skuCode);
            this.originalPrice = option2.price;
          }
        } else {
          let option = this.commodityData.skuList.find((item) => item.skuCode == skuCode);
          this.amountPrice = option.price;
        }
      },
      movePopupChange(vis) {
        this.showPopup = vis;
        if (this.level == 1) {
          // 规格只有一层时，默认选中
          this.onClickOption(0, 0);
        } else {
          // 全部层级也默认选中第一层
          this.commodityData.skuOptions.map((item, index) => {
            this.onClickOption(index, 0);
          });
        }
      },
      movePopupChangeLive(vis) {
        this.showPopupLive = vis;
      },
      cartChange(vis) {
        this.showCart = vis;
      },
      // 活动支付
      handleBuy() {
        this.goodsCart = [];
        this.showPopup = true;
      },
      checkCart() {
        if (this.goodsCart.length == 0) {
          return;
        }
        this.showPopup = false;
        this.showCart = true;
      },

      //增加商品数量
      handleAdd(skuCode) {
        let item = this.goodsCart.find((item) => item.skuCode == skuCode);
        let option = this.data.skuList.find((item) => item.skuCode == skuCode);
        let stock = option.stock ? option.stock : 10000; //没有库存同app逻辑设置为10000件
        // 活动取最小库存
        if (JSON.stringify(this.activity) != '{}') {
          let optionActivity = this.activity.skuData.find((item) => item.skuCode == skuCode);
          stock = Math.min(stock, optionActivity.quantity, optionActivity.overplus);
        }
        if (item.number >= stock) {
          uni.showToast({ icon: 'none', title: '库存不足' });
          return;
        } else {
          item.number++;
        }
      },
      //减少商品数量
      handleReduce(skuCode) {
        let item = this.goodsCart.find((item) => item.skuCode == skuCode);
        if (item.number > 1) {
          item.number--;
        }
      },
      addCart() {
        if (this.level != this.select.length) {
          uni.showToast({ icon: 'none', title: '请选择规格' });
          return false;
        }
        let skuCode = '';

        this.select.map((item, index) => {
          skuCode += index == 0 ? item : ':' + item;
        });

        // let skuCode = `${this.select[0]}:${this.select[1]}`;
        if (this.goodsCart.find((item) => item.skuCode == skuCode)) {
          let item = this.goodsCart.find((item) => item.skuCode == skuCode);

          let option = this.data.skuList.find((item) => item.skuCode == skuCode);
          let stock = option.stock ? option.stock : 10000; //没有库存同app逻辑设置为10000件
          if (JSON.stringify(this.activity) != '{}') {
            let optionActivity = this.activity.skuData.find((item) => item.skuCode == skuCode);
            stock = Math.min(stock, optionActivity.quantity, optionActivity.overplus);
          }
          if (item.number >= stock) {
            uni.showToast({ icon: 'none', title: '库存不足' });
            return;
          } else {
            item.number++;
          }
          return;
        }
        let option = this.data.skuList.find((item) => item.skuCode == skuCode);
        if (JSON.stringify(this.activity) != '{}') {
          option = this.activity.skuData.find((item) => item.skuCode == skuCode);
          if (option.overplus <= 0) {
            uni.showToast({ icon: 'none', title: '库存不足' });
            return false;
          }
        }
        console.log(this.data, 'kkk');
        let cartItem = {
          id: this.data.id,
          skuCode: skuCode,
          subName: this.skuCodeToName(skuCode),
          number: 1,
          name: this.data.name,
          price: option.price,
          amount: option.amount ? option.amount : option.price,
          linePrice: option.linePrice,
          thumbnail: this.data.thumbnail,
          stock: option.stock,
          commodityType: this.data.type,
          certificateId:
            this.data.certificateId && this.data.type === 1 ? this.data.certificateId : null,
        };
        this.goodsCart.push(cartItem);
      },
      //支付
      handlePay(Original, goodsnow) {
        let ifActivity = false;
        let ifShowArgee = this.data.contract ? true : false;
        if (JSON.stringify(this.activity) != '{}') {
          ifActivity = true;
        }
        if (Original) {
          ifActivity = false;
        }
        let goodsData = [];
        if (goodsnow == undefined) {
          goodsData = this.goodsCart;
        } else {
          goodsData.push(goodsnow);
        }

        //3 实体商品
        if (this.data.type == 3) {
          uni.navigateTo({
            url: `/page_commodity/order/pages/entityOrder?commodityList=${JSON.stringify(
              goodsData
            )}&isCollage=${this.isCollage}&ifActivity=${ifActivity}&first=true`,
          });
        } else if (this.data.type == 1) {
          uni.navigateTo({
            url: `/page_commodity/order/pages/collageOrder?commodityList=${JSON.stringify(
              goodsData
            )}&isCollage=${this.isCollage}&ifActivity=${ifActivity}&contract=${JSON.stringify(
              this.data.contract
            )}&orderContractId=${this.orderContractId}&first=true&ifShowArgee=${ifShowArgee}`,
          });
        }

        // uni.navigateTo({
        //   url: `/page_commodity/order/pages/collageOrder?commodityList=${JSON.stringify(
        //     this.goodsCart
        //   )}&isCollage=true&ifActivity=true`,
        // });
      },
      pay() {
        if (this.goodsCart.length != 0) {
          this.handlePay(true);
        } else {
          if (this.level == this.select.length) {
            this.goPayRightNow();
          } else {
            if (this.goodsCart.length == 0) {
              this.goodsCart = [];
              if (this.level != this.select.length) {
                uni.showToast({ icon: 'none', title: '请选择规格' });
                return false;
              }
              let skuCode = '';
              this.select.map((item, index) => {
                skuCode += index == 0 ? item : ':' + item;
              });
              let option = this.data.skuList.find((item) => item.skuCode == skuCode);
              if (JSON.stringify(this.activity) != '{}') {
                option = this.activity.skuData.find((item) => item.skuCode == skuCode);
                if (option.overplus <= 0) {
                  uni.showToast({ icon: 'none', title: '库存不足' });
                  return false;
                }
              }
              let cartItem = {
                id: this.data.id,
                skuCode: skuCode,
                number: 1,
                subName: this.skuCodeToName(skuCode),
                name: this.data.name,
                price: option.price,
                amount: option.amount ? option.amount : option.price,
                linePrice: option.linePrice,
                thumbnail: this.data.thumbnail,
                stock: option.stock,
                commodityType: this.data.type,
                certificateId:
                  this.data.certificateId && this.data.type === 1 ? this.data.certificateId : null,
              };
              this.goodsCart.push(cartItem);
              if (this.commodityData.skuList.length == 1) {
                this.handlePay();
              }
            }
          }
        }

        // this.goodsCart = [];
        // if (this.level != this.select.length) {
        //   uni.showToast({ icon: 'none', title: '请选择规格' });
        //   return false;
        // }
        // let skuCode = '';
        // this.select.map((item, index) => {
        //   skuCode += index == 0 ? item : ':' + item;
        // });
        // let option = this.data.skuList.find((item) => item.skuCode == skuCode);
        // let cartItem = {
        //   id: this.data.id,
        //   skuCode: skuCode,
        //   number: 1,
        //   name: this.data.name,
        //   price: option.price,
        //   linePrice: option.linePrice,
        //   thumbnail: this.data.thumbnail,
        //   stock: option.stock,
        //   commodityType: this.data.type,
        // };
        // this.goodsCart.push(cartItem);
        // this.handlePay();
      },
      goPayRightNow() {
        let skuCode = '';
        this.select.map((item, index) => {
          skuCode += index == 0 ? item : ':' + item;
        });
        let option = this.data.skuList.find((item) => item.skuCode == skuCode);
        if (JSON.stringify(this.activity) != '{}') {
          option = this.activity.skuData.find((item) => item.skuCode == skuCode);
          if (option.overplus <= 0) {
            uni.showToast({ icon: 'none', title: '库存不足' });
            return false;
          }
        }
        let cartItem = {
          id: this.data.id,
          skuCode: skuCode,
          number: 1,
          subName: this.skuCodeToName(skuCode),
          name: this.data.name,
          price: option.price,
          amount: option.amount ? option.amount : option.price,
          linePrice: option.linePrice,
          thumbnail: this.data.thumbnail,
          stock: option.stock,
          commodityType: this.data.type,
          certificateId:
            this.data.certificateId && this.data.type === 1 ? this.data.certificateId : null,
        };
        this.handlePay(true, cartItem);
      },
      //获取手机号验证
      async getPhoneNumber(e) {
        // 先获取session 并处理验证流程
        this.getCode(e);
      },
      async userLogin() {
        this.$store.commit('setToken', this.accessToken);
        this.$store.commit('setProjectId', this.data.projectId);
        // this.$store.commit('setProjectName', data.body.project.v);
        const res = await getUserInfo();
        this.$store.commit('setNickName', res.body.nickname);
        this.$store.commit('setAvatar', res.body.avatar);
        this.$store.commit('setUid', res.body.uid);
        this.$store.commit('setOrg', res.body.org);
        this.$store.commit('setTenantId', res.body.tenantId);
        this.$store.commit('setChannelId', this.channelId);
        const data = await getCollageOrder({ commodityId: this.data.id });
        this.activityInfo = data.body;
        if (data.body.enrollButton) {
          this.btnName = data.body.enrollButton;
        }
        // 查询是否预约
        const result = await getLiveReserveStatus(data.body?.activityId);
        if (result.body) {
          this.liveStep = 2;
        } else {
          this.liveStep = 1;
        }
      },
      // 查询按钮名称以及是否已经预约
      async getBtnSatus(id) {
        if (!id) {
          return;
        }
        // 查询活动按钮名称
        const data = await getCollageOrder({ commodityId: id });
        this.activityInfo = data.body;
        if (data.body && data.body.enrollButton) {
          this.btnName = data.body.enrollButton;
        }
        // 查询是否预约
        const result = await getLiveReserveStatus(data.body?.activityId);
        if (result.body) {
          this.liveStep = 2;
        } else {
          this.liveStep = 1;
        }
        this.$forceUpdate();
      },
      handleId() {
        /* #ifdef MP-TOUTIAO */
        this.thirdAppId = DouyinAppId[baseInfo.CHANNEL];
        this.channelId = DouyinChannelId[baseInfo.CHANNEL];
        /* #endif */
        /* #ifdef MP-BAIDU */
        this.thirdAppId = ChannelAppId[baseInfo.CHANNEL];
        this.channelId = BaiduChannelId[baseInfo.CHANNEL];
        /* #endif */
        /* #ifdef MP-WEIXIN */
        this.thirdAppId = WeixinAppId[baseInfo.CHANNEL];
        this.channelId = WeixinChannelId[baseInfo.CHANNEL];
        /* #endif */
      },
      // 原有的验证手机号代码
      async handleCheck(e) {
        /* #ifndef MP-BAIDU */
        if (e.detail.iv) {
          const params = {
            /* #ifdef MP-WEIXIN */
            code: e.detail.code,
            /* #endif */
            /* #ifndef MP-WEIXIN */
            vector: e.detail.iv,
            encrypted: e.detail.encryptedData,
            /* #endif */
            sessionKey: this.sessionKey,
            projectId: this.commodityData.projectId,
          };
          //分享邀请逻辑
          //获取手机号
          /* #ifdef MP-WEIXIN */
          const data = await getMiniPhone(params, this.shareCode);
          this.accessToken = data.body.accessToken;
          /* #endif */
          if (this.shareCode) {
            uni.removeStorageSync('shareCode');
          }
          this.userLogin();
        }
        /* #endif */
      },
      getCode(e) {
        // 处理id
        this.handleId();
        //
        let provider = '';
        let that = this;
        uni.getProvider({
          service: 'oauth',
          success: function(res) {
            provider = res.provider[0];
          },
        });
        /* #ifdef MP-WEIXIN */
        uni.login({
          provider: provider,
          success: async function(res) {
            uni.showLoading({
              title: '加载中',
            });
            // 通过code去处理获取openID
            const data = await getRegister({
              channelId: that.thirdAppId,
              code: res.code,
            });
            if (data.body.accessToken) {
              that.accessToken = data.body.accessToken;
              uni.hideLoading();
              that.userLogin();
            } else {
              that.handleCheck(e);
            }
            uni.hideLoading();
            that.sessionKey = data.body.sessionKey;
          },
        });
        /* #endif */
      },
      // 去学习
      toLearn() {
        this.$store.commit('setProjectId', this.commodityData.projectId);
        if (this.isLive) {
          uni.setStorageSync('liveShow', true);
        }
        // uni.switchTab({
        //   url: '/pages/newCourse/index',
        // });
        bottomNavTo('/pages/newCourse/index', 1);
      },
      // 预约课程
      async reserve() {
        // 需判断是否价格为0且只有一个规格 则直接调接口 预约成功
        if (this.activityInfo.skuData.length === 1 && this.activityInfo.skuData[0].amount === 0) {
          // 直接下单 预约
          const res = await createOrder({
            commodities: [{ id: this.data.id, skuCode: 0, number: 1 }],
            activity: {
              id: this.activityInfo.activityId,
            },
          });
          // 创建成功 弹窗预约成功
          if (res.body.isFree) {
            /* #ifdef MP-WEIXIN */
            wx.requestSubscribeMessage({ tmplIds: [liveRemindTip[baseInfo.CHANNEL]] });
            /* #endif */
            this.showSuccess = true;
            this.liveStep = 2;
          }
        } else {
          //  否则按原有流程走
          this.showPopupLive = true;
        }
      },
      //报名接口
      // async certCourseRegistration(certificateId, formId) {
      //   const res = await certCourseRegistration({ certificateId, formId: this.formId });
      // },
      async getCertsStatus(certificateId) {
        if (certificateId) {
          const res = await getApplicationStatus({ certificateId });
          const {
            signUpFormLimit,
            checkTime,
            registrationStatus = null,
            formId = '',
            answerUrl2,
            formRecordId = '',
            notice = 0,
          } = res.body;
          if (signUpFormLimit === 1) {
            const baseUrl = BaseFormUrl[baseInfo.ENV];
            let clientOrigin = '';
            /* #ifdef H5 */
            clientOrigin = window.location.origin;
            /* #endif */
            // 报名表单限制为填写表单
            if (checkTime === 0) {
              switch (registrationStatus) {
                case 0:
                  this.$emit('pop', 0);
                  break;
                case 1:
                  if (notice == 0) {
                    this.$emit('pop', 1);
                  }
                  break;
                case 2:
                  this.$emit('pop', 2);
                  break;
                case 3:
                  await certCourseRegistration({
                    certificateId: certificateId,
                    formRecordId: formRecordId,
                  });
                  // eslint-disable-next-line no-case-declarations
                  const uri = encodeURIComponent(
                    `${baseUrl}/form${answerUrl2}&token=${uni.getStorageSync('token')}&channelId=${
                      this.curChannelId
                    }&clientOrigin=${clientOrigin}&platform=${
                      uni.getSystemInfoSync().uniPlatform
                    }&formId=${formId}&formRecordId=${formRecordId}&id=${
                      this.commodityData.id
                    }&redirectUrl=/page_commodity/commodity/pages/commodityBank`
                  );
                  // eslint-disable-next-line no-case-declarations
                  const url = `/page_common/iframe/index?uri=${uri}`;
                  uni.navigateTo({
                    url,
                  });
                  break;
              }
            } else {
              //无需填写表单
              this.handleBuy();
            }
          } else {
            this.handleBuy();
          }
        }
      },

      async handleEnroll(certificateId) {
        if (this.formId) {
          const res = await certCourseRegistration({ certificateId, formRecordId: this.formId });
          const { registrationStatus } = res.body;
          switch (registrationStatus) {
            case 0:
              this.$emit('pop', 0);
              break;
            case 1:
              this.$emit('pop', 1);
              break;
            case 2:
              this.$emit('pop', 2);
              break;
          }
          // this.handleBuy();
          // uni.navigateTo({
          //   url: `/page_commodity/certificateCommodity/pages/certificateReport?id=${certificateId}`,
          // });
        } else {
          this.getCertsStatus(certificateId);
        }
      },
      skuCodeToName(skuCode) {
        let skuName = '';
        let arr = skuCode.split(':');
        console.log(arr, 999);
        this.commodityData.skuOptions.forEach((item, index) => {
          const levelIndex = arr[index];
          skuName = index == 0 ? item.values[levelIndex] : `${skuName},${item.values[levelIndex]}`;
        });
        console.log(skuName, 999);
        return skuName;
      },
    },
  };
</script>
<style lang="scss" scoped>
  .pay-box {
    height: 180rpx;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    .pay-content {
      height: 180rpx;
    }
  }
  .pay-item {
    width: 750rpx;
    height: 180rpx;
    // position: fixed;
    // bottom: 0;
    // left: 0;
    // right: 0;
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    box-shadow: 0 -6px 8px 0 #e9e9e940;
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
    .expired-Btn {
      width: calc(100% - 64rpx);
      font-size: 32rpx;
      height: 96rpx;
      border-radius: 80rpx;
      font-weight: 700;
      color: #fff;
      margin: auto;
      background-color: #989ead;
    }
    .live-btn {
      width: 690rpx;
      height: 100rpx;
      background: #e51600;
      border-radius: 50rpx;
      font-size: 36rpx;
      color: #ffffff;
      line-height: 100rpx;
      text-align: center;
      margin: 50rpx auto 0rpx;
    }
  }
  .icon-style {
    width: 24px;
    height: 24px;
  }
  .total-price {
    display: flex;
    align-items: center;
    // margin-top: 20rpx;
  }
  .price-left {
    padding-left: 30rpx;
    padding-top: 16rpx;
  }
  .btn-box {
    margin-right: 30rpx;
  }
  .button-buy {
    width: 296rpx;
    height: 96rpx;
    border-radius: 80rpx;
    color: #ffffff;
    background: #e51600;
    margin-left: 32rpx;
    margin-top: 16rpx;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    font-weight: 600;
    &:active {
      opacity: 0.8;
    }
  }
  .goodsnow {
    // margin-left: 30rpx;
    color: #e51600;
    font-weight: 600;
    font-size: 32rpx;
    margin-right: 16rpx;
  }
  .bug-money {
    background: #ffffff;
    color: #f0522f;
    border: 2px solid #f0522f;
  }
  .bug-collage {
    margin-right: 32rpx;
  }
  .ml-price {
    margin-left: 48rpx;
  }
  .radio-flex-box {
    display: flex;
    justify-content: space-between;
    padding: 32rpx 48rpx;
    .discount-box {
      padding: 8rpx;
      border: 2rpx solid #f0522f;
      border-radius: 10rpx;
    }
    .price-display {
      margin-right: 16rpx;
    }
  }
  .border-top {
    border-top: 20rpx solid #f5f6fa;
  }
  .btn-radio {
    width: 48rpx;
    height: 48rpx;
    border: 2rpx solid #ecedf1;
    border-radius: 50%;
  }
  .icon-size {
    width: 48rpx;
    height: 48rpx;
    margin-right: 12rpx;
  }
  .text-pay {
    font-size: 28rpx;
    color: #323949;
    font-weight: 600;
  }
  .button-pay {
    width: 654rpx;
    height: 96rpx;
    border-radius: 24rpx;
    background: linear-gradient(140.2deg, #ff8058 0%, #ff6969 100%);
    color: #ffffff;
    margin-bottom: 24rpx;
    margin-top: 60rpx;
    &:active {
      opacity: 0.8;
    }
  }
  .no-collage {
    margin-left: 44rpx;
    // margin-top: 16rpx;
  }
  .no-collage-second {
    margin-right: 32rpx;
  }
  .shelf-box {
    position: fixed;
    right: 0;
  }
  .shelf-btn {
    width: 296rpx;
    height: 96rpx;
    font-size: 32rpx;
    font-weight: 600;
    color: #ffffff;
    background-color: #c9cdd4;
    border-radius: 80rpx;
    margin: 16rpx 30rpx;
    float: right;
  }
  .title-modal {
    margin: 36rpx 0;
    text-align: center;
    font-size: 32rpx;
    font-weight: 700;
    color: #2c364e;
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
  .goodstit {
    margin-left: 30rpx;
    font-size: 40rpx;
    font-weight: 600;
    color: #333333;
    font-family: 'PingFang SC';
    margin-bottom: 40rpx;
  }
  .goodsprice {
    height: 56rpx;
    line-height: 56rpx;
    margin-bottom: 50rpx;
    padding-left: 30rpx;

    span {
      font-size: 24rpx;
    }
    .goodsnow {
      // margin-left: 30rpx;
      color: #e51600;
      font-weight: 500;
      font-size: 32rpx;
      margin-right: 16rpx;
    }
    .lineprice {
      color: #e51600;
      font-size: 20rpx;
      font-weight: 400;
      text-decoration: line-through;
    }
  }
  .sku-box {
    margin-left: 30rpx;
    font-size: 28rpx;
    p {
      margin-bottom: 24rpx;
    }
    .skuitem-box {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 48rpx;
      flex-wrap: wrap;

      .unselect {
        padding: 0 24rpx;
        height: 72rpx;
        line-height: 72rpx;
        background: #f7f8fa;
        margin-right: 20rpx;
        font-weight: 500;
        margin-bottom: 20rpx;
      }
      .select {
        padding: 0 24rpx;
        height: 72rpx;
        line-height: 72rpx;
        background: #fff1ea;
        color: #ff6d24;
        font-weight: 500;
        margin-right: 20rpx;
        margin-bottom: 20rpx;
      }
      .skuitem {
        position: relative;
        border-radius: 8rpx;
        overflow: hidden;
        .miaosha-tit {
          position: absolute;
          width: 1.3rem;
          height: 0.6rem;
          right: 0;
          top: 0;
          display: flex;
          align-items: center;
        }
      }
      .miaosha-tit {
        position: absolute;
        width: 1.3rem;
        height: 0.6rem;
        right: 0;
        top: 0;
        display: flex;
        align-items: center;
      }
      .miaosha-tag {
        position: absolute;
        width: 1.3rem;
        height: 0.6rem;
        background: linear-gradient(90deg, #ff5e53ff 0%, #fa4c3eff 100%) !important;
        color: #fff;
        right: 0;
        top: 0;
        font-size: 0.4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom-left-radius: 0.6rem;
        /* #ifdef H5 */
        .scale {
          font-size: 12px;
          transform: scale(0.5);
          transform-origin: 0 0;
          top: -12rpx;
          right: -12rpx;
          position: absolute;
          z-index: 2;
          white-space: nowrap;
        }
        /*  #endif  */
      }
      .shouqing-tag {
        position: absolute;
        width: 1.3rem;
        height: 0.6rem;
        background: linear-gradient(90deg, #b9bacb 0%, #b9bacb 100%) !important;
        color: #fff;
        right: 0;
        top: 0;
        font-size: 0.4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom-left-radius: 0.6rem;
        /* #ifdef H5 */
        .scale {
          font-size: 12px;
          transform: scale(0.5);
          transform-origin: 0 0;
          top: -12rpx;
          right: -12rpx;
          position: absolute;
          z-index: 2;
          white-space: nowrap;
        }
        /*  #endif  */
      }
      .pintuan-tit {
        position: absolute;
        width: 1.3rem;
        height: 0.6rem;
        background: linear-gradient(90deg, #ffc553ff 0%, #ff782dff 100%) !important;
        color: #fff;
        right: 0;
        top: 0;
        font-size: 0.4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom-left-radius: 0.6rem;
        /* #ifdef H5 */
        .scale {
          font-size: 12px;
          transform: scale(0.5);
          transform-origin: 0 0;
          top: -12rpx;
          right: -12rpx;
          position: absolute;
          z-index: 2;
          white-space: nowrap;
        }
        /*  #endif  */
      }
    }
  }
  .countdown-box {
    margin-left: 30rpx;
    margin-bottom: 70rpx;
  }
  .flex-countdown {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .time-clock {
    margin-left: 0px !important;
    margin-right: 0px !important;
  }
  .time-item {
    text-align: center;
    color: #ff7200 !important;
  }
  .skubutton {
    // height: 180rpx;
    padding: 0;
    // margin-right: 30rpx;
    display: flex;
    justify-content: space-between;
    padding-top: 16rpx;
    padding: 26rpx 30rpx 0;
    z-index: 100;
    // background-color: green;
    .btn-comm {
      width: 100%;
      height: 180rpx;
      padding-top: 20rpx;

      display: flex;
      justify-content: space-between;
    }
    // position: fixed;
    // bottom: 0;

    .sku-left {
      flex: 1;
      // padding-left: 30rpx;
      span {
        font-size: 24rpx;
      }
      .goodsnow {
        // margin-left: 30rpx;
        color: #e51600;
        font-weight: 600;
        font-size: 32rpx;
        margin-right: 16rpx;
        font-family: 'PingFang SC';
      }
      .lineprice {
        color: #9fa1a4;
        font-size: 24rpx;
        font-weight: 400;
        text-decoration: line-through;
      }
    }
    .cartdetail {
      color: #e51600;
      padding-left: 6rpx;
    }
    .sku-right {
      // display: flex;
      // justify-content: flex-end;
      // flex: 1;
      float: right;
      .button-left {
        width: 200rpx;
        height: 96rpx;
        line-height: 96rpx;
        font-size: 32rpx;
        text-align: center;
        font-weight: 600;
        vertical-align: middle;
        border-radius: 80rpx 0 0 80rpx;
        color: #e51600;
        border: 2rpx solid #e51600;
        float: right;
        opacity: 1;
      }
      // .button-left {
      //   width: 64rpx;
      //   height: 24rpx;
      //   opacity: 1;
      //   color: #e51600;
      //   font-size: 32rpx;
      //   font-weight: 600;

      // }
      .button-right {
        width: 200rpx;
        height: 96rpx;
        font-size: 32rpx;
        text-align: center;
        vertical-align: middle;
        border-radius: 0 80rpx 80rpx 0;
        background: #e51600;
        color: #fff;
        border: 2rpx solid #e51600;
        float: right;
        opacity: 1;
        line-height: 96rpx;
      }
    }
  }
  .miaosha-btn {
    display: flex;
    width: 100%;
    height: 4.5rem;
    font-size: 0.6rem;
    padding: 0.4rem 3.2rem;
    justify-content: space-around;
    .routinebuy {
      width: 7.775rem;
      height: 2.75rem;
      border-radius: 1.8rem;
      border: 2px solid #e51600;
      background: #fff;
      color: #e51600;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .collage {
      width: 7.775rem;
      height: 2.75rem;
      border-radius: 1.8rem;
      border: 2px solid #e51600;
      background: #e51600;
      color: #fff;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }

  .list-box {
    border-radius: 24rpx;
    background: #fff;
    padding: 0 30rpx;
    width: 750rpx;
    .detail-content {
      display: flex;
      width: 100%;
      height: 112rpx;
      margin-bottom: 32rpx;
      .thumbnail {
        height: 112rpx;
        width: 200rpx;
        margin-right: 16rpx;
        image {
          height: 100%;
        }
      }
    }
  }
  .img-commodity {
    width: 200rpx;
    height: 112rpx;
    border-radius: 12rpx;
    object-fit: cover;
  }
  .price-box {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: space-between;
    justify-content: space-between;
    flex: 1;
    // padding: 12rpx 12rpx;
    .commodity-tit {
      font-size: 28rpx;
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
    }
    .flex-item {
      width: 100%;
      padding-right: 60rpx;
      span {
        width: 56rpx;
      }
    }
  }

  /*  #ifdef  H5  */
  .mr {
    margin-right: 20px;
  }
  /*  #endif  */

  .qi {
    font-size: 10rpx;
    padding-left: 3px;
  }
  .success-pop {
    .success-img {
      width: 750rpx;
      height: 300rpx;
    }
    .success-img-close {
      position: absolute;
      top: 40rpx;
      right: 30rpx;
      width: 30rpx;
      height: 30rpx;
    }
    .success-text {
      margin-top: 30rpx;
      font-weight: 700;
      font-size: 48rpx;
      color: #2e2e2e;
      text-align: center;
      line-height: 48px;
    }
    .success-btn {
      margin-top: 78rpx;
      margin-bottom: 68rpx;
      .to-list-btn {
        width: 311rpx;
        height: 96rpx;
        background: #ffffff;
        border: 2rpx solid #e51600;
        border-radius: 72rpx;
        font-weight: 700;
        font-size: 32rpx;
        color: #e51600;
        text-align: center;
        line-height: 96rpx;
        margin-right: 33rpx;
      }
      .to-learn-btn {
        width: 311rpx;
        height: 96rpx;
        background: #e51600;
        border-radius: 72rpx;
        font-weight: 700;
        font-size: 32rpx;
        color: #ffffff;
        text-align: center;
        line-height: 96rpx;
      }
    }
  }
</style>
