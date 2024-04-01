<!--
* @desc 我的订单
* @author 江玉龙
* @date 2022年04月21日
-->
<template>
  <view>
    <CustomNavBack title="我的订单" @customBack="navigateBack"></CustomNavBack>
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
        <navTab
          ref="navTab"
          :defaultIndex="defaultTab"
          :tabTitle="tabTitle"
          @changeTab="changeTab"
        /> </view
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
        @handleReload="reFresh"
        @pop="handlePop"
        :formId="formId"
      />
      <view class="noOrder" v-if="!ifLoad">
        <image src="@/page_commodity/static/order/empty.png" mode="scaleToFill" />
        <p class="text-size-sn common-text-400 common-tip">暂无订单</p>
      </view>
      <PopupWindow
        ref="force"
        height="308px"
        :confirmTitle="
          auditStatus === 0 ? '我知道了' : auditStatus === 1 ? '立即学习' : '修改报名信息'
        "
        @confirm="goBuy"
        class="popbox"
      >
        <img
          src="@/static/svgs/approved.svg"
          alt=""
          class="audit-status"
          v-if="auditStatus === 1"
        />
        <img
          src="@/static/svgs/rejection.svg"
          alt=""
          class="audit-status"
          v-if="auditStatus === 0"
        />
        <img
          src="@/static/svgs/toexamine.svg"
          alt=""
          class="audit-status"
          v-if="auditStatus === 2"
        />
        <view class="statusTit">{{
          auditStatus === 0 ? '审核中' : auditStatus === 1 ? '审核通过' : '审核驳回'
        }}</view>
        <view class="info" v-if="auditStatus === 0"
          >您提交的报名信息正在审核中<br />请耐心等待</view
        >
        <view class="info" v-if="auditStatus === 1">您已审核通过，快去报名吧</view>
        <view class="info" v-if="auditStatus === 2"
          >您提交的报名信息有误<br />请修改后重新提交</view
        >
      </PopupWindow>
    </view>
  </view>
</template>

<script>
  import Refresh from '@/page_commodity/courseList/comps/Refresh.vue';
  import NavTab from '@/components/NavTab/NavTab.vue';
  import SwiperList from './comps/SwiperList.vue';
  import { getOrderList, setReceipt } from '@/api/modules/order/index.ts';
  import PopupWindow from '@/components/PopupComp/PopupWindow.vue';
  import baseInfo from '@/build/index';
  import { BaseFormUrl } from '@/enums/envEnum';
  import { getApplicationStatus, certCoursePopRecord } from '@/api/modules/certificateCourse/index';
  import { certCourseRegistration } from '@/api/modules/certificateCourse/index';
  import CustomNavBack from '@/components/CustomNavBack/CustomNavBack.vue';
  import { bottomNavTo } from '@/utils/common.js';
  export default {
    name: 'orderList',
    components: { Refresh, NavTab, SwiperList, PopupWindow, CustomNavBack },
    computed: {
      channelId() {
        return this.$store.getters.getChannelId;
      },
    },
    data() {
      return {
        status: -1, // 订单的状态 0 已付款 1 退款/失效 全部就不传
        toView: '',
        defaultTab: 0,
        currentTab: 0, //swiper所在页
        pages: [1, 1, 1], //第几页存储
        tabTitle: ['全部', '待付款', '已付款'], //导航栏格式
        list: [[], [], []],
        showBottom: false,
        ifMore: false,
        ifLoad: false,
        auditStatus: 0,
        formId: '',
        id: '',
        certificateId: '',
      };
    },
    onLoad(option) {
      if (option.formId) {
        console.log(option.formId, 'formId----');
        this.formId = option.formId;
        certCourseRegistration({ certificateId: option.certId, formRecordId: this.formId });
      }
      if (option.index) {
        console.log(option.index, '当前选中');
        this.defaultTab = option.index;
      }
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
      handlePop(info) {
        console.log(info, 'info---');
        this.auditStatus = info.status;
        this.$refs.force.showModal = true;
        this.id = info.id;
        this.certificateId = info.certificateId;
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
      // 转发页面
      async onShareAppMessage() {
        return {
          path: '/page_commodity/order/index',
          // imageUrl: 'https://app.static.wangxiao.cn/ykmf/images/zuduishuati.png',
        };
      },
      async goBuy() {
        if (this.auditStatus === 0) {
          this.$refs.force.showModal = false;
        } else if (this.auditStatus === 1) {
          await certCoursePopRecord({ certificateId: this.certificateId });
          uni.navigateTo({ url: `/page_commodity/courseList/index?id=${this.id}&isOrder=true` });
        } else if (this.auditStatus === 2) {
          const res = await getApplicationStatus({
            certificateId: this.certificateId,
          });
          let clientOrigin = '';
          /* #ifdef H5 */
          clientOrigin = window.location.origin;
          /* #endif */
          const { formId = '', answerUrl2, formRecordId = '' } = res.body;
          await certCourseRegistration({
            certificateId: this.certificateId,
            formRecordId: formRecordId,
          });
          const baseUrl = BaseFormUrl[baseInfo.ENV];
          const uri = encodeURIComponent(
            `${baseUrl}/form${answerUrl2}&token=${uni.getStorageSync('token')}&channelId=${
              this.channelId
            }&clientOrigin=${clientOrigin}&platform=${
              uni.getSystemInfoSync().uniPlatform
            }&formId=${formId}&formRecordId=${formRecordId}&certId=${
              this.certificateId
            }&redirectUrl=/page_commodity/order/index`
          );
          const url = `/page_common/iframe/index?uri=${uri}`;
          uni.navigateTo({
            url,
          });
        }
      },
      navigateBack() {
        bottomNavTo('/pages/mine/index', 2);
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
    top: 148rpx;
    /* #ifdef H5 */
    top: 88rpx;
    /* #endif */
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
  .audit-status {
    width: 80px;
    height: 80px;
    padding-top: 32px;
    margin-bottom: 5px;
  }
  .statusTit {
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: 26px;
  }
  .info {
    color: #9fa1a4;
    text-align: center;
    font-family: 'PingFang SC';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    margin-top: 4px;
  }
</style>
