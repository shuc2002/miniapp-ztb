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
      <view style="width: 648rpx">
        <u-tabs
          :list="tabTitle"
          :current="current"
          active-color="#e51600ff"
          bg-color="#fff"
          font-size="28"
          inactive-color="#4E5969"
          :active-item-style="{ fontSize: '36rpx', opacity: 1, color: '#000' }"
          :inactive-item-style="{ fontSize: '28rpx', opacity: 0.6 }"
          bar-width="30"
          bar-height="8"
          @change="changeTab"
          ref="navTab"
          class="nav-tab"
          :is-scroll="true"
        ></u-tabs>
      </view>
      <view @tap="toSlelectSubjectPage" class="subject-more iconfont icon-directory" />
      <!-- <navTab ref="navTab" :tabTitle="tabTitle" @changeTab="changeTab" />  -->
    </view>

    <div v-if="mode == 1 || mode == 2" class="unit-container">
      <div class="unit-list" v-if="productModeList.length == 0">
        <view class="noOrder">
          <image src="@/page_commodity/static/order/empty.png" mode="scaleToFill" />
          <p class="text-size-sn common-text-400 common-tip">暂无数据</p>
        </view>
      </div>
      <div class="unit-list" v-else>
        <RecursionLevelList
          :list="productModeList"
          :statics="statics"
          :commodityId="commodityId"
          :showSpeed="true"
          :mode="mode"
          :defaultExpan="true"
          :supplierId="supplierId"
          @goSign="showSignModal"
        />
      </div>
    </div>
    <div v-else>
      <SwiperList
        :showBottom="showBottom"
        :currentTab="currentTab"
        :list="list"
        :status="status"
        :single="single"
        :mode="mode"
        @swiperTab="swiperTab"
        :toView="toView"
        @handleToLower="handleToLower"
        @handleReceipt="handleReceipt"
        v-if="ifLoad"
      />
    </div>
    <AgreementModal ref="agreement" @confirm="goToSign" />
    <!-- 占位容器 -->
    <!-- <view style="width: 100%; height: 50upx; opacity: 0" v-if="!showBottom" />
    <view class="no-more" v-if="showBottom">没有更多了</view> -->
  </view>
</template>

<script>
  import Refresh from '@/page_commodity/courseList/comps/Refresh.vue';
  import SwiperList from './comps/SwiperList.vue';
  import RecursionLevelList from '@/components/ChapterCourse/RecursionLevelList';
  import { flatList, getProductIds } from '@/course/chapter/utils/index';
  import { getDisplayList } from '@/api/modules/commodity/index.ts';
  import { fetchGetStudyStat } from '@/api/modules/common/index';
  import AgreementModal from '@/components/Agreement/AgreementModal.vue';

  export default {
    name: 'orderList',
    components: { Refresh, SwiperList, RecursionLevelList, AgreementModal },
    computed: {
      channelId() {
        return this.$store.getters.getChannelId;
      },
    },
    data() {
      return {
        status: 0, // 当前科目id
        statusList: [],
        current: 0,
        toView: '',
        currentTab: 0, //swiper所在页
        pages: [], //第几页存储
        tabTitle: [], //导航栏格式
        list: [],
        subjectData: {},
        tabsLength: 0, //tab栏的长度
        showBottom: false,
        ifMore: false,
        ifLoad: false,
        projectId: 0,
        statics: [],
        areaId: 0, //金刚区id
        single: false, //单商品 多商品
        mode: 0, //0 商品模式 1 产品模式 2 协议模式
        productModeList: [], // 产品模式数据
        commodityId: '', // 商品id
        supplierId: '', // 分销商id
        contractInfoList: [], //未签署合同记录信息
      };
    },

    onLoad(option) {
      this.subjectData = JSON.parse(option.subjectList);
      this.projectId = option.projectId;
      this.current = option.current; //首页科目下标
      this.areaId = option.areaId;
      this.single = option.single == 1 ? true : false;
      this.mode = option.mode;
      console.log('option', option);
      uni.setStorageSync('single', this.single);
      uni.setStorageSync('mode', this.mode);
      this.subjectData.map((item) => {
        this.tabTitle.push(item);
        this.statusList.push(item.id);
        this.pages.push(1);
        this.list.push([]);
      });
      this.reFresh();
      // this.getCommodityList();
    },
    // onShow() {
    //   this.reFresh();
    //   // this.getMysubject()
    // },
    methods: {
      // 订单列表获取
      async reFresh() {
        // this.subjectData.map((item) => {
        //   this.pages.push(1);
        //   this.list.push([]);
        // });
        this.tabsLength = this.subjectData.length;
        for (let i = 0; i < this.tabsLength; i++) {
          this.pages.push(1);
          this.list.push([]);
        }

        // this.pages = [1, 1, 1];
        // this.list = [];
        this.ifLoad = false;
        this.getCommodityList();
      },

      getProductModelist(products) {
        let result = [];
        for (let i = 0; i < (products?.length || 0); i++) {
          let { id, name, subjectName, constructs, speedRate, spnum } = products?.[i];
          result[i] = {
            id,
            name,
            subjectName,
            speedRate,
            spnum,
            children: flatList(constructs, 1),
          };
        }
        console.log('result--', result);
        return result;
      },

      async getCommodityList() {
        if (this.pages[this.currentTab] == 1) {
          const data2 = {
            // status: this.status == -1 ? '' : this.status,
            // status: this.status == -1 ? '' : this.status,
            channelId: this.channelId,
            projectId: this.projectId,
            subjectId: this.statusList[this.current],
            displayAreaId: this.areaId,
            isMulti: this.single,
            type: 4,
            index: this.pages[this.currentTab] - 1,
            row: 5,
          };
          console.log(this.mode, 'this.mode');
          const res = await getDisplayList(data2);
          if (+this.mode == 1 || this.mode == 2) {
            // 产品模式
            let { productTrees: constructs = [], id = '', supplierId = '' } = res?.body[0] || {};
            this.commodityId = id;
            // 分销商id
            this.supplierId = supplierId;
            // 利用缓存重新组织树结构
            const productIds = getProductIds(constructs, 'P');
            const statics = await fetchGetStudyStat({ productIds });
            // constructs = assembleData(constructs, statics.body);
            let originList = flatList(constructs);
            this.productModeList = originList;
            this.statics = statics.body;
          } else {
            // this.list[this.currentTab] = res.body;
            this.list[this.currentTab].push(...res.body);
          }
        } else if (this.pages[this.currentTab] > 1) {
          const res = await getDisplayList({
            channelId: this.channelId,
            projectId: this.projectId,
            // subjectId: this.status,
            subjectId: this.statusList[this.current],
            isMulti: this.single,
            displayAreaId: this.areaId,
            index: this.pages[this.currentTab] - 1,
            type: 4,
            row: 5,
          });
          if (+this.mode === 1 || this.mode == 2) {
            // 产品模式
            let { productTrees: constructs = [], id = '', supplierId = '' } = res?.body[0] || {};
            this.commodityId = id;
            // 分销商id
            this.supplierId = supplierId;
            // 利用缓存重新组织树结构
            const productIds = getProductIds(constructs, 'P');
            const statics = await fetchGetStudyStat({ productIds });
            // constructs = assembleData(constructs, statics.body);
            let originList = flatList(constructs);
            this.statics = statics.body;
            this.productModeList = originList;
          } else {
            if (res.body.length > 0) {
              this.list[this.currentTab].push(...res.body);
              if (res.body.length < 5) {
                this.ifMore = true;
              }
            } else if (res.body.length <= 0) {
              this.ifMore = true;
            }
          }
        }
        this.ifLoad = true;
        this.$forceUpdate();
      },
      //获取选择的科目列表
      // async getMysubject() {
      //   const res = await getConfigure({ channelId: this.channelId });
      //   if (res.body.subjects) {
      //     let arr = [];

      //     res.body.subjects.map((item) => {
      //       let obj = {
      //         name: item.v,
      //         id: item.k,
      //         days:item.signDay,
      //       };
      //       arr.push(obj);
      //     });
      //     this.tabList = arr;
      //     this.currentSubjectId = this.tabList[0].id;
      //     this.currentDays = this.tabList[0].days;
      //     console.log(this.currentSubjectId);
      //   }
      // },
      // 改变要搜索的课程
      changeStatus(index) {
        this.status = this.statusList[index];
      },
      toSlelectSubjectPage() {
        // console.log('1');
        uni.navigateTo({
          url: `/home/SelectSubject?projectId=${this.projectId}&fromCommList=true&areaId=${this.areaId}&single=${this.single}`,
        });
      },
      // 标题点击切换
      changeTab(index) {
        this.current = index;
        this.currentTab = index;
        this.changeStatus(index);
        // console.log('changeTab--', this.list[this.currentTab].length == 0);

        this.ifLoad = false;
        this.list[this.currentTab] = [];
        this.getCommodityList();
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
          this.getCommodityList();
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
          this.getCommodityList();
          this.showBottom = false;
          this.ifMore = false;
          this.$refs.refresh.endAfter(); //刷新结束调用
        }, 1000);
      },
      // 签署协议提醒弹窗
      showSignModal(info) {
        console.log(info, 'sign-----');
        this.contractInfoList = info;
        this.$refs.agreement.showModal = true;
      },
      goToSign() {
        uni.navigateTo({
          url: `/page_material/agreement/agreementDetail?fileUrl=${this.contractInfoList[0].contractUrl}&recordId=${this.contractInfoList[0].contractHistoryId}&isSigned=0&isOrder=true&goodsId=${this.commodityId}`,
        });
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
    // flex-direction: column;
    // align-items: flex-start;
    // justify-content: flex-start;
    background-color: #fff;
    z-index: 996;
  }
  .unit-container {
    display: flex;
    width: 100%;
    height: 100vh;
    overflow: scroll;
    background-color: #ffffff;
  }
  .unit-list {
    width: 100%;
    padding: 0 12px;
    padding-top: 76px;
  }

  .subject-more {
    color: #333333;
    line-height: 80rpx;
    font-size: 30rpx;
    margin-left: 42rpx;
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
