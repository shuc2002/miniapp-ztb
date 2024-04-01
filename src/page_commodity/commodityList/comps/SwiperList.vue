<!--
* @desc 左右滑动及上下滑动
* @author 江玉龙
* @date 2022年05月05日
-->
<template>
  <view>
    <!-- swiper切换 swiper-item表示一页 scroll-view表示滚动视窗 -->
    <swiper style="min-height: 100vh" :current="currentTab" @change="swiperTab">
      <swiper-item>
        <scroll-view
          style="height: 100%"
          scroll-y="true"
          @scrolltolower="handleToLower"
          scroll-with-animation
          :scroll-into-view="toView"
        >
          <!-- 占位容器 -->
          <view :id="'top' + listIndex" style="width: 100%; height: 116rpx" />

          <view class="content">
            <!-- 商品列表 -->
            <view class="list-box">
              <!-- <view
                @tap="
                  commonFun.routeTo(
                    `/page_commodity/pages/commodityBank?id=${listItem[listIndex].id}`
                  )
                "
              > -->
              <!-- 多商品列表 -->
              <NewCourseList :list="courseList" @handleItem="handleItem" />
              <EntityCommodity
                :commodityData="entityList"
                :single="this.single"
                :mode="this.mode"
              />
              <!-- 单商品列表 -->

              <!-- </view> -->
              <!-- <view
                @tap="
                  item.status != 5
                    ? commonFun.routeTo(`/page_commodity/order/pages/orderDetails?id=${item.id}`)
                    : commonFun.routeTo(
                        `/page_commodity/order/pages/collageDetail?id=${item.id}&commodityId=${item.commodities[0].id}`
                      )
                "
              > -->

              <!-- <CourseCommodity :commodityData="item.commodities[0]" /> -->
              <!-- </view> -->
              <!-- #endif -->
              <!-- #ifndef MP-WEIXIN -->
              <!-- <view
                  @tap="commonFun.routeTo(`/page_commodity/order/pages/entityDetail?id=${item.id}`)"
                  v-if="item.commodities[0].type == 3"
                >
                  <EntityCommodity :commodityData="item.commodities[0]" />
                </view>
                <view
                  @tap="commonFun.routeTo(`/page_commodity/order/pages/orderDetails?id=${item.id}`)"
                  v-else
                >
                  <view>已付款</view>
                  <CourseCommodity :commodityData="item.commodities[0]" />
                </view> -->
              <!-- #endif -->
              <!-- <view class="float-clear">
                  <button
                    class="btn-order confirm"
                    v-if="item.status == 1 && item.commodities[0].type != 3"
                    @tap="
                      commonFun.routeTo(
                        `/page_commodity/courseList/index?id=${item.commodities[0].id}&isOrder=true`
                      )
                    "
                    >去学习</button
                  >
                  <view class="button-box" v-if="item.status == 0">
                    <button
                      class="btn-order study"
                      @tap="
                        commonFun.routeTo(`/page_commodity/order/pages/entityDetail?id=${item.id}`)
                      "
                      >去支付</button
                    >
                    <button class="btn-order collage" @tap="cancleOrder(item.id)">取消订单</button>
                  </view>
                  <button
                    class="btn-order "
                    v-if="
                      item.expressStatus == 1 && item.status == 1 && item.commodities[0].type == 3
                    "
                    @tap="handleOpen(item.id)"
                    >确认收货</button
                  >
                  <button
                    class="btn-order check"
                    v-if="
                      (item.commodities[0].type == 3 && item.status == 1) ||
                        (item.commodities[0].type == 3 && item.status == 3)
                    "
                    @tap="
                      commonFun.routeTo(`/page_commodity/order/pages/entityDetail?id=${item.id}`)
                    "
                    >查看详情</button
                  > -->
              <!-- </view> -->
            </view>
          </view>
          <view class="noOrder" v-if="this.list[this.currentTab].length == 0">
            <image src="@/page_commodity/static/order/empty.png" mode="scaleToFill" />
            <p class="text-size-sn common-text-400 common-tip">暂无数据</p>
          </view>
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
  </view>
</template>
<script>
  import { throttle } from '@/page_commodity/courseList/util';
  // import CourseCommodity from './CourseCommodity.vue';
  import EntityCommodity from './EntityCommodity.vue';
  import PopupWindow from '@/components/PopupComp/PopupWindow.vue';
  import { cancelPay } from '@/api/modules/order/index.ts';
  import { getCommodityDetail } from '@/api/modules/commodity/index';
  import NewCourseList from '../../../pages/newCourse/comps/NewCourseList.vue';
  export default {
    name: 'swiperList',
    components: {
      NewCourseList,
      EntityCommodity,
      PopupWindow,
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
      single: {
        type: Boolean,
        default: false,
      },
      mode: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        // statusList: ['待付款', '已付款', '已关闭', '退款中', '已退款', '拼团中'],
        // expressList: ['待发货', '待收货', '已完成'],
        orderId: '',
        courseData: {
          type: Array,
          default: () => [],
        },
        isSingle: false,
        isMode: 0,
      };
    },
    computed: {
      entityList() {
        return this.list[this.currentTab].filter((item) => item.type == 3);
      },
      courseList() {
        return this.list[this.currentTab].filter((item) => item.type == 1);
      },
    },
    onLoad() {
      this.list.map((item) => {
        if (item.type == 1) {
          this.courseData.push(item);
        }
      });
    },
    onShow() {
      this.isSingle = this.single;
      this.isMode = this.mode;
    },
    methods: {
      async handleItem(item) {
        // 协议模式跳转
        if (this.mode === 2) {
          const data = await getCommodityDetail({ id: item.id });
          uni.setStorageSync('commodityData',data.body);
          uni.navigateTo({
            url: `/page_commodity/commodity/pages/goArgeement?url=${data.body.contract.url}`,
          });
        } else {
          uni.navigateTo({
            url: `/page_commodity/commodity/pages/commodityBank?id=${item.id}`,
          });
        }
      },
      // 打开确认收货弹窗
      handleOpen(id) {
        this.$refs.detail.showModal = true;
        this.orderId = id;
        // console.log('aaaa1', this.isSingle);
        // console.log('bbbb1', this.isMode);
      },
      //取消订单
      async cancleOrder(id) {
        console.log(id);
        await cancelPay(id);
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
  // .list-box {
  //   // padding: 0rpx 30rpx 0rpx;
  // }
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
  .noOrder {
    position: absolute;
    left: 50%;
    top: 30%;
    transform: translate(-50%);
    text-align: center;
    image {
      width: 344rpx;
      height: 344rpx;
    }
  }
</style>
