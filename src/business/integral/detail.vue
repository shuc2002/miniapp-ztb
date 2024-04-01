<!--
* @desc 积分详情
* @author dcj
* @date 2022年07月11日
-->
<template>
  <view class="common-bg page-box">
    <!-- 积分详情 start  -->
    <view class="integral-box flex-center-box">
      <view
        ><view class="text-size-main">我的积分</view
        ><view class="flex flex-start">
          <image src="@/home/static/img/shop/integral.png" />{{ integral }}</view
        >
      </view>
      <view class="rules-btn text-size-xxs common-blue flex-center" @tap="openModel">积分规则</view>
    </view>
    <!-- 积分详情 end  -->
    <!-- 积分明细 start  -->
    <view class="detail-content" v-if="currntNum >= 0">
      <refresh ref="refresh" @isRefresh="isRefresh" />
      <NavTab ref="navTab" :tabTitle="tabTitle" @changeTab="changeTab" />
      <SwiperScroll
        :list="detailList"
        :hasMore="hasMore"
        :currentTab="currntNum"
        @swiperTab="swiperTab"
        @handleToLower="handleToLower"
        height="calc(100vh - 200px)"
      />
    </view>
    <!-- 积分明细 end  -->
    <PopupWindow ref="detail" height="600rpx" title="积分说明" confirmTitle="我知道了">
      <view class="text-size-main modal-text"
        >1. 积分来源：每日登录签到、完成学习任务、好友点击你分享的链接等奖励。</view
      >
      <view class="text-size-main modal-text">
        2. 积分支出：积分可用于兑换商城商品，包括题库、资料、课程等各类商品。</view
      >
    </PopupWindow>
  </view>
</template>
<script>
  import { getRecord } from '@/api/modules/task/index';
  import { getIntegralNum } from '@/api/modules/order/index';

  import PopupWindow from '@/components/PopupComp/PopupWindow.vue';
  import NavTab from './comps/NavTab';
  import Refresh from './comps/Refresh';
  import SwiperScroll from './comps/SwiperScroll';

  export default {
    name: 'integralDetail',
    components: { PopupWindow, NavTab, Refresh, SwiperScroll },
    onLoad() {
      uni.showLoading({
        title: '加载中',
        mask: true,
      });
      this.getRecord(0);
      this.getRecord(1);
      this.getIntegralNum();
    },
    data() {
      return {
        currntNum: -1,
        detailList: [[], []],
        page: [0, 0],
        tabTitle: ['积分支出', '积分收入'],
        hasMore: [true, true],
        rowNum: 10,
        integral: 0,
      };
    },
    methods: {
      // 获取我的积分
      async getIntegralNum() {
        const data = await getIntegralNum();
        this.integral = data.body;
        setTimeout(() => {
          this.currntNum = 0;
          uni.hideLoading();
        }, 100);
      },
      openModel() {
        this.$refs.detail.showModal = true;
      },
      async getRecord(index) {
        const res = await getRecord({ type: index, index: this.page[index], row: this.rowNum });
        if (this.page[index] === 0) {
          this.detailList[index] = res.body;
        } else if (this.page[index] > 0) {
          this.detailList[index].push(...res.body);
        }
        if (res.body.length < this.rowNum) {
          this.hasMore[index] = false;
        } else {
          this.hasMore[index] = true;
        }
      },
      // 加载更多
      handleToLower() {
        if (this.hasMore[this.currntNum]) {
          uni.showLoading({
            title: '加载中',
            mask: true,
          });
          this.page[this.currntNum]++;
          this.getRecord(this.currntNum);
          setTimeout(() => {
            this.$forceUpdate();
            uni.hideLoading();
          }, 300);
        }
      },
      //改变tab
      changeTab(index) {
        this.currntNum = index;
      },
      // swiper 滑动
      swiperTab: function(e) {
        var index = e.detail.current; //获取索引
        this.$refs.navTab.longClick(index);
      },
      //刷新状态
      isRefresh() {
        setTimeout(() => {
          uni.showToast({
            icon: 'success',
            title: '刷新成功',
          });
          this.$refs.refresh.endAfter(); //刷新结束调用
        }, 1000);
      },
    },
  };
</script>
<style lang="scss" scoped>
  .page-box {
    min-width: calc(100vw - 48rpx);
    padding: 30rpx 24rpx;
    min-height: calc(100vh - 60rpx);
    line-height: 1.5;
  }
  .integral-box {
    width: calc(100% - 64rpx);
    background-color: #ffffff;
    padding: 32rpx;
    border-radius: 24rpx;
    image {
      width: 40rpx;
      height: 40rpx;
    }
    .flex-start {
      margin-top: 16rpx;
    }
    .rules-btn {
      width: 144rpx;
      height: 48rpx;
      border-radius: 56rpx;
      background: #eef2ff;
    }
  }
  .detail-content {
    background-color: #ffffff;
    border-radius: 24rpx;
    margin-top: 30rpx;
    .content-tab {
      height: 96rpx;
      line-height: 96rpx;
      .tab-item {
        width: 50%;
        height: 100%;
      }
      .active {
        position: relative;
        &:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 40rpx;
          height: 8rpx;
          border-radius: 4rpx;
          background: rgba(71, 95, 253, 1);
        }
      }
    }
  }

  .modal-text {
    margin: 0 48rpx;
    line-height: 1.8;
  }
</style>
