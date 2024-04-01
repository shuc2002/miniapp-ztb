<!--
* @desc 我的订单
* @author 江玉龙
* @date 2022年04月21日
-->
<template>
  <view
    class="container999"
    @touchstart="refreshStart"
    @touchmove="refreshMove"
    @touchend="refreshEnd"
  >
    <!-- 刷新组件需搭配scroll-view使用-->
    <refresh ref="refresh" @isRefresh="isRefresh" />
    <view class="nav">
      <!-- 导航栏 agents导航栏标题 -->
      <navTab ref="navTab" :tabTitle="tabTitle" @changeTab="changeTab" /> </view
    ><SwiperList
      :showBottom="showBottom"
      :currentTab="currentTab"
      :list="list"
      :status="status"
      @swiperTab="swiperTab"
      :toView="toView"
      @handleToLower="handleToLower"
      @handleReceipt="handleReceipt"
      v-if="ifLoad"
    />
    <view class="noOrder" v-if="!ifLoad">
      <image src="@/page_commodity/static/order/empty.png" mode="scaleToFill" />
      <p class="text-size-sn common-text-400 common-tip">暂无订单</p>
    </view>
  </view>
</template>

<script>
  import Refresh from '@/page_commodity/courseList/comps/Refresh.vue';
  import NavTab from '@/components/NavTab/NavTab.vue';
  import SwiperList from './comps/SwiperList.vue';
  import { getOrderList, setReceipt } from '@/api/modules/order/index.ts';
  export default {
    name: 'orderList',
    components: { Refresh, NavTab, SwiperList },
    computed: {
      channelId() {
        return this.$store.getters.getChannelId;
      },
    },
    data() {
      return {
        status: -1, // 订单的状态 0 已付款 1 退款/失效 全部就不传
        toView: '',
        currentTab: 0, //swiper所在页
        pages: [1, 1, 1], //第几页存储
        tabTitle: ['全部', '待付款', '已付款'], //导航栏格式
        list: [[], [], []],
        showBottom: false,
        ifMore: false,
        ifLoad: false,
      };
    },
    onShow() {
      this.reFresh();
    },
    methods: {
      // 确认收货
      async handleReceipt(id) {
        await setReceipt(id);
        this.reFresh();
      },
      // 订单列表获取
      async reFresh() {
        this.pages = [1, 1, 1];
        this.list = [[], [], []];
        this.ifLoad = false;
        this.getOrderList();
      },
      async getOrderList() {
        if (this.pages[this.currentTab] == 1) {
          const data = await getOrderList({
            status: this.status == -1 ? '' : this.status,
            type: 'cash',
            index: this.pages[this.currentTab],
            row: 5,
            channelId: this.channelId,
          });
          this.list[this.currentTab] = data.body;
        } else if (this.pages[this.currentTab] > 1) {
          const res = await getOrderList({
            status: this.status == -1 ? '' : this.status,
            type: 'cash',
            index: this.pages[this.currentTab],
            row: 5,
            channelId: this.channelId,
          });
          if (res.body.length > 0) {
            this.list[this.currentTab].push(...res.body);
            if (res.body.length < 5) {
              this.ifMore = true;
            }
          } else if (res.body.length <= 0) {
            this.ifMore = true;
          }
        }
        this.ifLoad = true;
        this.$forceUpdate();
      },
      // 改变要搜索的订单状态值 0 未支付 1 已支付 2 已关闭 3 退款中 4 已退款
      //改变要搜索的订单状态值 0全部 1未支付 2已支付

      changeStatus(index) {
        if (index == 0) {
          this.status = -1;
        } else if (index == 1) {
          this.status = 0;
        } else if (index == 2) {
          this.status = 1;
        } else if (index == 3) {
          this.status = 7;
        } else if (index == 4) {
          this.status = 2;
        }
      },
      // 标题点击切换
      changeTab(index) {
        this.currentTab = index;
        this.changeStatus(index);
        if (this.list[this.currentTab].length == 0) {
          this.ifLoad = false;
          this.getOrderList();
        }
      },
      // swiper 滑动
      swiperTab(e) {
        let index = e.detail.current; //获取索引
        this.showBottom = false;
        this.ifMore = false;
        this.$refs.navTab.longClick(index);
      },
      // 加载更多
      handleToLower() {
        if (!this.showBottom) {
          this.pages[this.currentTab]++;
          this.getOrderList();
          setTimeout(() => {
            if (this.ifMore) {
              this.showBottom = true;
            }
            uni.hideLoading();
          }, 1000);
        }
      },
      // 刷新touch监听
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
          this.pages[this.currentTab] = 1;
          this.getOrderList();
          this.showBottom = false;
          this.ifMore = false;
          this.$refs.refresh.endAfter(); //刷新结束调用
        }, 1000);
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
  .nav {
    position: fixed;
    left: 0;
    top: var(--window-top);
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    background-color: #fff;
    z-index: 996;
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
