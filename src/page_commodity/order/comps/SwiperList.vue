<!--
* @desc 左右滑动及上下滑动
* @author 江玉龙
* @date 2022年05月05日
-->
<template>
  <view>
    <!-- swiper切换 swiper-item表示一页 scroll-view表示滚动视窗 -->
    <swiper style="min-height: 100vh" :current="currentTab" @change="swiperTab">
      <swiper-item v-for="(listItem, listIndex) in list" :key="listIndex">
        <scroll-view
          style="height: 100%"
          scroll-y="true"
          @scrolltolower="handleToLower"
          scroll-with-animation
          :scroll-into-view="toView"
        >
          <!-- 占位容器 -->
          <view :id="'top' + listIndex" style="width: 100%; height: 116rpx" />
          <!-- 积分商城订单 -->
          <!-- <view
            class="other-item"
            @tap="commonFun.routeTo('/page_commodity/order/pages/orderIntegral')"
          > -->
          <!-- <view class="flex-center">
              <image src="@/page_commodity/static/order/order-integral.png" class="icon-img" />
              <view class="text-size-sn common-text-400 common-text">积分商城订单</view>
            </view> -->
          <!-- <view class="triangle" />
          </view> -->
          <view class="content" v-if="listItem.length > 0">
            <!-- 订单列表 -->
            <view v-for="(item, key) in listItem" :key="key">
              <view class="list-box">
                <!-- #ifdef MP-WEIXIN -->
                <view
                  v-if="item.commodities[0].type == 1"
                  @tap="gotoDetail(item.commodities[0].type, item)"
                >
                  <view class="orderStatus">
                    <view>
                      <view
                        v-if="(item.status == 0 || item.status == 5) && item.remainder"
                        class="countdown-box"
                        ><span>订单将在</span
                        ><CountDown
                          backgroundColor="#fff"
                          :remain="item.remainder"
                          :showBox="true"
                        ></CountDown
                        ><span>后关闭</span></view
                      >
                      <view class="ordertime" v-else>{{ item.createTime.substring(0, 10) }}</view>
                    </view>
                    <view
                      v-if="item.commodities[0].type == 3 && item.status == 1"
                      class="text-size-sn common-text-400 text-status common-tip text-font-size"
                    >
                      {{ expressList[item.expressStatus] }}
                    </view>
                    <view
                      v-else
                      class="text-size-sn common-text-400 text-status"
                      :class="item.status == 5 ? 'common-price' : 'common-tip'"
                      >{{ statusList[item.status] }}</view
                    >
                  </view>
                  <EntityCommodityData :commodityData="item.commodities" />
                </view>
                <view v-else @tap="gotoDetail(item.commodities[0].type, item)">
                  <view class="orderStatus">
                    <view>
                      <view
                        v-if="(item.status == 0 || item.status == 5) && item.remainder"
                        class="countdown-box"
                        ><span>订单将在</span
                        ><CountDown
                          backgroundColor="#fff"
                          :remain="item.remainder"
                          :showBox="true"
                        ></CountDown
                        ><span>后关闭</span>{{ item.remainder }}</view
                      >
                      <view class="ordertime" v-else>{{ item.createTime.substring(0, 10) }}</view>
                    </view>
                    <view
                      v-if="item.commodities[0].type == 3 && item.status == 1"
                      class="text-size-sn common-text-400 text-status common-tip text-font-size"
                    >
                      {{ expressList[item.expressStatus] }}
                    </view>
                    <view
                      v-else
                      class="text-size-sn common-text-400 text-status text-font-size"
                      :class="item.status == 5 ? 'common-price' : 'common-tip'"
                      >{{ statusList[item.status] }}</view
                    >
                  </view>
                  <CommodityData :commodityData="item.commodities" />
                </view>
                <!-- #endif -->
                <!-- #ifndef MP-WEIXIN -->

                <view
                  v-if="item.commodities[0].type == 1"
                  @tap="gotoDetail(item.commodities[0].type, item)"
                >
                  <view class="orderStatus">
                    <view>
                      <view
                        v-if="(item.status == 0 || item.status == 5) && item.remainder"
                        class="countdown-box"
                        ><span>订单将在</span
                        ><CountDown
                          backgroundColor="#fff"
                          :remain="item.remainder"
                          :showBox="true"
                        ></CountDown
                        ><span>后关闭</span></view
                      >
                      <view class="ordertime" v-else>{{ item.createTime.substring(0, 10) }}</view>
                    </view>
                    <view
                      v-if="item.commodities[0].type == 3 && item.status == 1"
                      class="text-size-sn common-text-400 text-status common-tip text-font-size"
                    >
                      {{ expressList[item.expressStatus] }}
                    </view>
                    <view
                      v-else
                      class="text-size-sn common-text-400 text-status text-font-size"
                      :class="item.status == 5 ? 'common-price' : 'common-tip'"
                      >{{ statusList[item.status] }}</view
                    >
                  </view>
                  <EntityCommodityData :commodityData="item.commodities" />
                </view>
                <view v-else @tap="gotoDetail(item.commodities[0].type, item)">
                  <view class="orderStatus">
                    <view>
                      <view
                        v-if="(item.status == 0 || item.status == 5) && item.remainder"
                        class="countdown-box"
                        ><span>订单将在</span
                        ><CountDown
                          backgroundColor="#fff"
                          :remain="item.remainder"
                          :showBox="true"
                        ></CountDown
                        ><span>后关闭</span>{{ item.remainder }}</view
                      >
                      <view class="ordertime" v-else>{{ item.createTime.substring(0, 10) }}</view>
                    </view>
                    <view
                      v-if="item.commodities[0].type == 3 && item.status == 1"
                      class="text-size-sn common-text-400 text-status common-tip"
                    >
                      {{ expressList[item.expressStatus] }}
                    </view>
                    <view
                      v-else
                      class="text-size-sn common-text-400 text-status"
                      :class="item.status == 5 ? 'common-price' : 'common-tip'"
                      >{{ statusList[item.status] }}</view
                    >
                  </view>
                  <CommodityData :commodityData="item.commodities" />
                </view>

                <!-- <view
                  @tap="commonFun.routeTo(`/page_commodity/order/pages/entityDetail?id=${item.id}`)"
                  v-if="item.commodities[0].type == 3"
                >
                  <view class="orderStatus">
                    <view class="ordertime">{{ item.createTime.substring(0, 10) }}</view>
                    <view
                      v-if="item.commodities[0].type == 3 && item.status == 1"
                      class="text-size-sn common-text-400 text-status common-tip"
                    >
                      {{ expressList[item.expressStatus] }}
                    </view>
                    <view
                      v-else
                      class="text-size-sn common-text-400 text-status"
                      :class="item.status == 5 ? 'common-price' : 'common-tip'"
                      >{{ statusList[item.status] }}</view
                    >
                  </view>
                  <EntityCommodityData :commodityData="item.commodities[0]" />
                </view>
                <view
                  @tap="commonFun.routeTo(`/page_commodity/order/pages/orderDetails?id=${item.id}`)"
                  v-else
                >
                  <view class="orderStatus">
                    <view
                      v-if="item.commodities[0].type == 3 && item.status == 1"
                      class="text-size-sn common-text-400 text-status common-tip"
                    >
                      {{ expressList[item.expressStatus] }}
                    </view>
                    <view
                      v-else
                      class="text-size-sn common-text-400 text-status"
                      :class="item.status == 5 ? 'common-price' : 'common-tip'"
                      >{{ statusList[item.status] }}</view
                    >
                  </view>
                  <view>已付款</view>
                  <CommodityData :commodityData="item.commodities[0]" />
                </view> -->
                <!-- #endif -->
                <view class="float-clear">
                  <button
                    class="btn-order confirm"
                    v-if="item.status == 1 && item.commodities[0].type != 3 && item.signStatus != 0"
                    @tap="goStudy(item)"
                    >去学习</button
                  >
                  <button
                    class="btn-order study"
                    v-if="
                      item.status == 1 && item.commodities[0].type != 3 && item.signStatus === 0
                    "
                    @tap="goSign(item)"
                    >签署协议</button
                  >

                  <view class="button-box" v-if="item.status == 0">
                    <button class="btn-order study" @click="goBuy(item)">去支付</button>
                    <button
                      class="btn-order collage"
                      @tap="gotoReFillAddress(item)"
                      v-if="item.needAddress"
                      >补填地址</button
                    >
                    <button class="btn-order collage" @tap="cancleOrder(item.id, item)"
                      >取消订单</button
                    >
                  </view>
                  <button
                    class="btn-order"
                    v-if="
                      item.expressStatus == 1 && item.status == 1 && item.commodities[0].type == 3
                    "
                    @tap="handleOpen(item.id, item)"
                    >确认收货</button
                  >
                  <button
                    class="btn-order check"
                    v-if="
                      (item.commodities[0].type == 3 && item.status == 1) ||
                        (item.commodities[0].type == 3 && item.status == 3)
                    "
                    @tap="gotoCollageDetail(item)"
                    >查看详情</button
                  >
                  <!-- #ifdef MP-WEIXIN -->
                  <button
                    class="btn-order study"
                    v-if="item.status == 5"
                    @tap="gotoCollageDetail(item)"
                    >去拼单</button
                  >
                  <!-- #endif -->
                </view>
              </view>
            </view>
          </view>
          <image
            class="no-card"
            v-if="listItem.length === 0"
            src="@/static/img/empty/order.png"
            mode="scaleToFill"
          />
          <!-- 占位容器 -->
          <view style="width: 100%; height: 50upx; opacity: 0" v-if="!showBottom" />
          <view class="no-more" v-if="showBottom">没有更多了</view>
        </scroll-view>
      </swiper-item>
    </swiper>
    <PopupWindow
      ref="detail"
      height="320rpx"
      title="温馨提示"
      :cancelShow="true"
      @confirm="handleReceipt()"
    >
      <view class="text-size-main">是否确认收货</view>
    </PopupWindow>
    <OrderMovePop
      title="已选明细"
      :showOrderPop.sync="showOrderPop"
      :orderData="orderData"
    ></OrderMovePop>
  </view>
</template>
<script>
  import { throttle } from '@/page_commodity/courseList/util';
  import CommodityData from './CommodityData.vue';
  import EntityCommodityData from './EntityCommodityData.vue';
  import PopupWindow from '@/components/PopupComp/PopupWindow.vue';
  import CountDown from './CountDown.vue';
  import {
    getApplicationStatus,
    certCourseRegistration,
  } from '@/api/modules/certificateCourse/index';
  import OrderMovePop from './orderMovepop.vue';
  import { getOrderDetail, cancelPay } from '@/api/modules/order/index.ts';
  import baseInfo from '@/build/index';
  import { BaseFormUrl } from '@/enums/envEnum';
  export default {
    name: 'swiperList',
    components: {
      CommodityData,
      EntityCommodityData,
      PopupWindow,
      CountDown,
      OrderMovePop,
    },
    props: {
      currentTab: {
        type: Number,
        default: 0,
      },
      status: {
        type: Number,
        default: 0,
      },
      list: {
        type: Array,
        default: () => [],
      },
      toView: {
        type: String,
        default: '',
      },
      PayNum: {
        type: Number,
        default: 0,
      },
      showBottom: {
        type: Boolean,
        default: false,
      },
      formId: {
        type: String,
        default: '',
      },
    },
    computed: {
      channelId() {
        return this.$store.getters.getChannelId;
      },
    },
    data() {
      return {
        statusList: ['待付款', '已付款', '已关闭', '退款中', '已退款', '拼团中'],
        expressList: ['待发货', '待收货', '已完成'],
        orderId: 0,
        showOrderPop: false,
        orderData: {},
      };
    },
    methods: {
      gotoDetail(type, item) {
        this.$store.commit('setSupplierId', item.supplierId || '');
        if (type == 1 || type == 4) {
          item.status != 5
            ? this.commonFun.routeTo(`/page_commodity/order/pages/orderDetails?id=${item.id}`)
            : this.commonFun.routeTo(
                `/page_commodity/order/pages/collageDetail?id=${item.id}&commodityId=${item.commodities[0].id}`
              );
        } else {
          item.status != 5
            ? this.commonFun.routeTo(`/page_commodity/order/pages/entityDetail?id=${item.id}`)
            : this.commonFun.routeTo(
                `/page_commodity/order/pages/collageDetail?id=${item.id}&commodityId=${item.commodities[0].id}`
              );
        }
      },
      gotoCollageDetail(item) {
        this.$store.commit('setSupplierId', item.supplierId || '');
        this.commonFun.routeTo(
          `/page_commodity/order/pages/collageDetail?id=${item.id}&commodityId=${item.commodities[0].id}`
        );
      },
      gotoReFillAddress(item) {
        this.$store.commit('setSupplierId', item.supplierId || '');
        this.commonFun.routeTo(`/page_material/login/pages/reFillAddress?orderId=${item.id}`);
      },
      gotoEntityDetail(item) {
        this.$store.commit('setSupplierId', item.supplierId || '');
        this.commonFun.routeTo(`/page_commodity/order/pages/entityDetail?id=${item.id}`);
      },
      // 打开确认收货弹窗
      handleOpen(id, item) {
        this.$store.commit('setSupplierId', item.supplierId || '');
        this.$refs.detail.showModal = true;
        this.orderId = id;
      },
      async goBuy(item) {
        if (item.commodities[0].type == 3) {
          uni.navigateTo({
            // url: `/page_commodity/order/pages/entityOrder?id=${item.id}`,
            url: `/page_commodity/order/pages/entityDetail?id=${item.id}`,
          });
        } else if (item.commodities[0].type == 1) {
          uni.navigateTo({
            url: `/page_commodity/order/pages/orderDetails?id=${item.id}`,
          });
        }

        // this.showOrderPop = true;
        // this.getOrderDetail(id);
        // this.orderId = id;
        // console.log('id', id);
        // console.log('dddddddddddddddd', this.orderId);

        // console.log(id);
      },
      async getOrderDetail(e) {
        const data = await getOrderDetail({ id: e });
        this.orderData = data.body;
        if (this.orderData.paidPageQrCode) {
          this.orderData.paidPageQrCode = this.orderData.paidPageQrCode + '?timestamp' + this.time;
        }
        this.orderId = e;
      },

      //取消订单
      async cancleOrder(id, item) {
        console.log(id);
        this.$store.commit('setSupplierId', item.supplierId || '');
        const res = await cancelPay(id);
        if (res) {
          // uni.redirectTo({
          //   url: '/page_commodity/order/index',
          // });
          uni.showToast({
            title: '取消订单成功',
            icon: 'none',
          });
          this.$emit('handleReload');
        }
      },
      // 确认收货
      async handleReceipt() {
        this.$emit('handleReceipt', this.orderId);
      },
      // 轮播图切换
      swiperTab(e) {
        this.$emit('swiperTab', e);
      },
      // 触底触发加载
      handleToLower: throttle(function() {
        if (!this.showBottom) {
          uni.showLoading({
            title: '加载中',
            mask: true,
          });
        }
        this.$emit('handleToLower');
      }, 300),

      async goStudy(item) {
        this.$store.commit('setSupplierId', item.supplierId || '');
        if (item.commodities[0].certificateId) {
          if (this.formId) {
            const res = await certCourseRegistration({
              certificateId: item.commodities[0].certificateId,
              formRecordId: this.formId,
            });
            const { registrationStatus } = res.body;
            switch (registrationStatus) {
              case 0:
                this.$emit('pop', { status: 0, id: item.commodities[0].id });
                break;
              case 1:
                this.$emit('pop', { status: 1, id: item.commodities[0].id });
                break;
              case 2:
                this.$emit('pop', {
                  status: 2,
                  id: item.commodities[0].id,
                  certificateId: item.commodities[0].certificateId,
                });
                break;
            }
            // this.handleBuy();
            // uni.navigateTo({
            //   url: `/page_commodity/certificateCommodity/pages/certificateReport?id=${certificateId}`,
            // });
          } else {
            this.getCertsStatus(item.commodities[0].certificateId, item.commodities[0].id);
          }
        } else {
          uni.navigateTo({
            url: `/page_commodity/courseList/index?id=${item.commodities[0].id}&isOrder=true`,
          });
        }
      },
      async getCertsStatus(certificateId, orderId) {
        const res = await getApplicationStatus({
          certificateId,
        });
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
          let clientOrigin = '';
          /* #ifdef H5 */
          clientOrigin = window.location.origin;
          /* #endif */
          const baseUrl = BaseFormUrl[baseInfo.ENV];
          // 报名表单限制为填写表单
          if (checkTime === 1) {
            switch (registrationStatus) {
              case 0:
                this.$emit('pop', { status: 0, id: orderId });
                break;
              case 1:
                if (notice == 0) {
                  this.$emit('pop', { status: 1, id: orderId });
                } else {
                  uni.navigateTo({
                    url: `/page_commodity/courseList/index?id=${orderId}&isOrder=true`,
                  });
                }
                break;
              case 2:
                this.$emit('pop', { status: 2, id: orderId, certificateId });
                break;
              case 3:
                await certCourseRegistration({ certificateId, formRecordId: formRecordId });
                // eslint-disable-next-line no-case-declarations
                const uri = encodeURIComponent(
                  `${baseUrl}/form${answerUrl2}&token=${uni.getStorageSync('token')}&channelId=${
                    this.channelId
                  }&clientOrigin=${clientOrigin}&platform=${
                    uni.getSystemInfoSync().uniPlatform
                  }&formId=${formId}&formRecordId=${formRecordId}&certId=${certificateId}&redirectUrl=/page_commodity/order/index`
                );
                // eslint-disable-next-line no-case-declarations
                const url = `/page_common/iframe/index?uri=${uri}`;
                console.log(url);
                uni.navigateTo({
                  url,
                });
                break;
            }
          } else {
            //无需填写表单
            uni.navigateTo({
              url: `/page_commodity/courseList/index?id=${orderId}&isOrder=true`,
            });
          }
        } else {
          uni.navigateTo({
            url: `/page_commodity/courseList/index?id=${orderId}&isOrder=true`,
          });
        }
      },
      goSign(item) {
        this.$store.commit('setSupplierId', item.supplierId || '');
        uni.navigateTo({
          url: `/page_material/agreement/agreementDetail?fileUrl=${item.contractUrl}&recordId=${item.historyId}&isSigned=0&isOrder=true&goodsId=${item.commodities[0].id}`,
        });
      },
    },
  };
</script>
<style lang="scss" scoped>
  .content {
    width: 100%;
  }
  .no-card {
    width: 344rpx;
    height: 344rpx;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%);
  }
  .list-box {
    margin: 0 24rpx 20rpx 24rpx;
    border-radius: 24rpx;
    background: #ffffff;
    padding: 32rpx 20rpx;
  }
  .orderStatus {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 24rpx;
    font-weight: 400;
    padding-bottom: 16rpx;
    border-bottom: 2rpx solid #f6f6f6;
    margin-bottom: 60rpx;
    .ordertime {
      color: #9fa1a4;
    }
    .countdown-box {
      display: flex;
      justify-content: flex-start;
    }
    .text-font-size {
      font-size: 24rpx;
    }
  }
  .btn-order {
    width: 160rpx;
    height: 60rpx;
    border-radius: 68rpx;
    float: right;
    margin-right: 12rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 28rpx;
    font-weight: 400;
  }
  .study {
    color: #e51600;
    background: #fff;
    border: 2rpx solid #e51600;
    // color: #ffffff;
    // background: #475ffd;
  }
  .confirm {
    color: #475ffd;
    background: #fff;
    border: 2rpx solid #475ffd;
  }
  .collage {
    color: #5b648d;
    background: #fff;
    border: 2rpx solid #ecedf1;
  }
  .check {
    color: #5b648d;
    border: 2rpx solid #ecedf1;
    background: #ffffff;
  }
  .float-clear {
    overflow: hidden;
    margin-top: 32rpx;
    .text-status {
      margin-top: 12rpx;
      float: left;
    }
  }
  .triangle {
    border: 8rpx solid transparent;
    border-left: 8rpx solid black;
    border-radius: 8rpx;
    margin-left: 15rpx;
  }
  .no-more {
    font-size: 28rpx;
    font-weight: 400;
    text-align: center;
    width: 100%;
    height: 100upx;
    color: #989ead;
    line-height: 50upx;
  }
  .other-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 24rpx 24rpx 24rpx;
    padding: 24rpx 32rpx;
    height: 48rpx;
    border-radius: 24rpx;
    background-color: #ffffff;
    .icon-img {
      width: 48rpx;
      height: 48rpx;
      margin-right: 8rpx;
    }
  }
</style>
