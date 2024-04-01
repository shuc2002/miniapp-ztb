<!--
* @desc 积分订单
* @author 江玉龙
* @date 2022年07月07日
-->
<template>
  <view
    class="container999"
    @touchstart="refreshStart"
    @touchmove="refreshMove"
    @touchend="refreshEnd"
  >
    <refresh ref="refresh" @isRefresh="isRefresh" />
    <scroll-view
      style="height: 100vh"
      scroll-y="true"
      @scrolltolower="handleToLower"
      scroll-with-animation
    >
      <view v-if="orderList.length > 0">
        <view v-for="(item, key) in orderList" :key="key">
          <view
            class="list-box"
            @tap.stop="
              item.commodities[0].type == 3
                ? commonFun.routeTo(
                    `/page_commodity/order/pages/entityDetail?id=${item.id}&ifIntegral=true`
                  )
                : ''
            "
          >
            <EntityCommodityData
              :commodityData="item.commodities[0]"
              :ifIntegral="true"
              v-if="item.commodities[0].type == 3"
            />
            <CommodityData :commodityData="item.commodities[0]" :ifIntegral="true" v-else />
            <view class="float-clear">
              <view
                v-if="item.commodities[0].type == 3"
                class="text-size-sn common-text-400 text-status common-tip"
              >
                {{ expressList[item.expressStatus] }}
              </view>
              <button
                class="btn-order study"
                v-if="item.commodities[0].type != 3"
                @tap.stop="
                  commonFun.routeTo(
                    `/page_commodity/courseList/index?id=${item.commodities[0].id}&isOrder=true`
                  )
                "
                >去学习</button
              >
              <button
                class="btn-order study"
                v-if="item.expressStatus == 1"
                @tap.stop="handleOpen(item.id)"
                >确认收货</button
              >
              <button class="btn-order check" v-if="item.expressStatus == 0">查看订单</button>
            </view>
          </view>
        </view>
      </view>
      <image
        class="noCard"
        v-if="orderList.length === 0"
        src="@/static/img/empty/order.png"
        mode="scaleToFill"
      />
      <view style="width: 100%; height: 50upx; opacity: 0" v-if="!showBottom" />
      <view class="no-more" v-if="showBottom">这是我的底线了~</view>
    </scroll-view>
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
  import CommodityData from '../comps/CommodityData.vue';
  import Refresh from '@/page_commodity/courseList/comps/Refresh.vue';
  import EntityCommodityData from '../comps/EntityCommodityData.vue';
  import PopupWindow from '@/components/PopupComp/PopupWindow.vue';
  import { getIntegralOrder, setIntegralReceipt } from '@/api/modules/order/index';
  export default {
    name: 'orderIntegral',
    components: {
      CommodityData,
      Refresh,
      EntityCommodityData,
      PopupWindow,
    },
    computed: {
      channelId() {
        return this.$store.getters.getChannelId;
      },
    },
    onLoad() {
      this.getOrderList();
    },
    data() {
      return {
        ifMore: false,
        showBottom: false,
        orderList: [],
        page: 1,
        expressList: ['待发货', '待收货', '已完成'],
        orderId: '',
      };
    },
    methods: {
      // 打开确认收货弹窗
      handleOpen(id) {
        this.$refs.detail.showModal = true;
        this.orderId = id;
      },
      // 确认收货
      async handleReceipt() {
        await setIntegralReceipt(this.orderId);
        this.page = 1;
        this.showBottom = false;
        this.ifMore = false;
        this.getOrderList();
      },
      // 积分订单列表获取
      async getOrderList() {
        const res = await getIntegralOrder({ index: this.page, row: 5, channelId: this.channelId });
        if (this.page == 1) {
          this.orderList = res.body;
        } else if (this.page > 1) {
          if (res.body.length > 0) {
            this.orderList.push(...res.body);
            if (res.body.length < 5) {
              this.ifMore = true;
            }
          } else if (res.body.length <= 0) {
            this.ifMore = true;
          }
        }
      },
      // 下拉刷新
      refreshStart(e) {
        this.$refs.refresh.refreshStart(e);
      },
      refreshMove(e) {
        this.$refs.refresh.refreshMove(e);
      },
      refreshEnd(e) {
        this.$refs.refresh.refreshEnd(e);
      },
      isRefresh() {
        setTimeout(() => {
          uni.showToast({
            icon: 'success',
            title: '刷新成功',
          });
          this.page = 1;
          this.getOrderList();
          this.showBottom = false;
          this.ifMore = false;
          this.$refs.refresh.endAfter(); //刷新结束调用
        }, 1000);
      },
      // 触底加载更多
      handleToLower() {
        if (!this.showBottom) {
          uni.showLoading({
            title: '加载中',
            mask: true,
          });
          this.page++;
          this.getOrderList();
          setTimeout(() => {
            if (this.ifMore) {
              this.showBottom = true;
            }
            this.$forceUpdate();
            uni.hideLoading();
          }, 1000);
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
  .container999 {
    width: 100vw;
    min-height: 100vh;
    overflow: hidden;
    position: relative;
    background-color: #f6f6f6;
  }
  .list-box {
    margin: 16rpx 24rpx 20rpx 24rpx;
    border-radius: 24rpx;
    background: #ffffff;
    padding: 32rpx;
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
    color: #ffffff;
    background: #475ffd;
  }
  .check {
    color: #5b648d;
    border: 2rpx solid #ecedf1;
    background: #ffffff;
  }
  .float-clear {
    overflow: hidden;
    margin-top: 16rpx;
    .text-status {
      margin-top: 12rpx;
      float: left;
    }
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
  .noCard {
    width: 344rpx;
    height: 344rpx;
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translate(-50%);
  }
</style>
