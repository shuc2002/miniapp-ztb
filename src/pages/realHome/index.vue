<template>
  <view>
    <view class="home-common-bg" :style="{ backgroundColor: pageColor }">
      <!-- 遮罩层  -->
      <view class="toast-advert-box" v-if="toastList.length > 0 && showToast">
        <image
          class="toast-advert"
          :src="toastList[0].imgUrl"
          mode="scaleToFill"
          @tap="clickAdvert(toastList[0])"
        />
        <view class="t-icon t-icon-guanbi-copy" @tap="closeToast" />
      </view>
      <!-- 浮窗  -->
      <view class="window-advert-box" v-if="windowList.length > 0">
        <image
          class="window-advert"
          :src="windowList[0].imgUrl"
          mode="scaleToFill"
          @tap="clickAdvert(windowList[0])"
        />
      </view>
      <!-- 选择项目-科目  -->
      <view :class="topStyle == 1 ? 'top-select' : 'top-select-2'">
        <view
          class="flex-item-center text-size-xl common-text common-text-700 project-title"
          @tap="toSelectProject"
        >
          <view>{{ projectName ? projectName : '请选择考试项目' }}</view>
          <view class="switch-project iconfont icon-switch" />
        </view>
        <view :class="topStyle === 1 ? 'subject-tab-box' : 'subject-tab-box-top'" ref="navTab">
          <view style="width: 648rpx">
            <!-- #ifndef H5 -->
            <u-tabs
              :list="tabList"
              :current="current"
              :active-color="topStyle === 1 ? '#ffffffff' : '#E51600'"
              :bg-color="topStyle === 1 ? '#e51600ff' : '#ffffff'"
              font-size="28"
              :inactive-color="topStyle === 1 ? '#ffffffff' : '#333333'"
              :active-item-style="{
                fontSize: '36rpx',
                opacity: 1,
                color: topStyle === 1 ? '#ffffffff' : '#333333',
                textAlign: 'center',
              }"
              :inactive-item-style="{ fontSize: '36rpx', opacity: 0.6, textAlign: 'center' }"
              bar-width="30"
              bar-height="8"
              :bar-style="{ marigin: '0 auto', textAlign: 'center' }"
              @change="changeTab"
              ref="navTab"
            ></u-tabs>
            <!-- #endif -->

            <!-- #ifdef H5 -->
            <WebTabs
              :list="tabList"
              :current="current"
              :active-color="topStyle === 1 ? '#ffffffff' : '#E51600'"
              :bg-color="topStyle === 1 ? '#e51600ff' : '#ffffff'"
              font-size="28"
              :inactive-color="topStyle === 1 ? '#ffffffff' : '#333333'"
              :active-item-style="{
                fontSize: '36rpx',
                opacity: 1,
                color: topStyle === 1 ? '#ffffffff' : '#333333',
                textAlign: 'center',
              }"
              :inactive-item-style="{ fontSize: '36rpx', opacity: 0.6, textAlign: 'center' }"
              :showBar="false"
              :bar-style="{
                width: '30rpx',
                height: '8rpx',
                bottom: 0,
                left: '50%',
                marginLeft: '-15rpx',
                borderRadius: '4rpx',
                position: 'absolute',
                background: '#fff',
              }"
              @change="changeTab"
              ref="navTab"
            ></WebTabs>
            <!-- #endif -->
          </view>
          <view @tap="toSlelectSubjectPage" class="subject-more iconfont icon-directory" />
        </view>
      </view>

      <!-- 主体内容  -->
      <view class="px-24">
        <view :class="topStyle == 1 ? 'new-top-box' : 'new-top-box-2'"> </view>
        <!-- #ifndef H5 -->
        <view style="height: 40rpx"></view>
        <!-- #endif -->
        <swiper
          :current="currentTab"
          @change="swiperTab"
          :style="{ 'scroll-y': 'auto' }"
          class="swiper-hight"
        >
          <swiper-item v-for="(item, indexF) in tabList" :key="indexF">
            <scroll-view scroll-y class="swiper-hight">
              <!-- #ifdef H5 -->
              <view style="height: 40rpx"></view>
              <!-- #endif -->
              <view v-for="(item, index) in configAll" :key="index">
                <view
                  :class="index == 0 ? 'first-component' : ''"
                  v-if="item.type == 'function-comp'"
                >
                  <StateCard
                    :days="currentDays"
                    :currentGroupData="currentGroupData"
                    :content="item.action.config"
                    :config="item"
                    :showType="item.showType"
                    @handleDailyExercise="handleDailyExercise()"
                  />
                </view>
                <view :class="index == 0 ? 'first-component' : ''" v-if="item.type == 'grid-menu'">
                  <JingGangArea
                    :subjectId="currentSubjectId"
                    :activeSubjectId="currentSubjectId"
                    :config="item"
                    :subjectList="tabList"
                    :projectId="projectId"
                    :currentProp="current"
                    @handleDailyExercise="handleDailyExercise()"
                  />
                </view>
                <view
                  :class="index == 0 ? 'first-component' : ''"
                  v-if="item.type == 'single-goods'"
                >
                  <ChapterIndex
                    :projectId="projectId"
                    :subjectId="currentSubjectId"
                    :config="item"
                    :chapterConfig="chapterConfig"
                    :displayAreaId="displayAreaId"
                    :currentSubName="currentSubName"
                  />
                </view>
                <view
                  :class="index == 0 ? 'first-component' : ''"
                  v-if="item.type == 'ad-factory'"
                  :key="index"
                >
                  <Advertisement
                    :advStyle="item.style"
                    :config="item.action.config[0]"
                    @handleDailyExercise="handleDailyExercise()"
                  />
                </view>
                <view
                  :class="index == 0 ? 'first-component' : ''"
                  v-if="item.type == 'goods-list'"
                  :key="index"
                >
                  <Commodity :style="item.style" :content="item.content" />
                </view>
                <view
                  :class="index == 0 ? 'first-component' : ''"
                  v-if="item.type == 'info-list'"
                  :key="index"
                >
                  <Information
                    :title="item.info ? item.info.title : ''"
                    :subTitle="item.info ? item.info.subTitle : ''"
                    :dataList="item.info ? item.info.dataList : []"
                    :style="item.style"
                    :content="item.content"
                  />
                </view>
                <view
                  :class="index == 0 ? 'first-component' : ''"
                  style="background:#ffffff"
                  v-if="item.type === 'editor-text'"
                >
                  <RichText :content="item.content" :style="item.style" />
                </view>
              </view>
              <view style="width: 100%; height: 100rpx; opacity: 0" />
            </scroll-view>
          </swiper-item>
        </swiper>
      </view>
      <!-- 弹窗 -->
      <ExerciseModal
        ref="exercise"
        :doneNum="doneNum"
        @toReStart="toReStart()"
        @toContinue="toContinue()"
      />
      <OrderModel :order="unPayOrder" ref="orderModal" />
      <AddressModal :order="unAddressOrder" ref="addressModal" />
    </view>
    <CustomTab />
  </view>
</template>

<script>
  import OrderModel from './comps/OrderModel.vue';
  import CustomTab from '../../customTab';
  import AddressModal from './new-comps/AddressModal.vue';
  import ExerciseModal from './new-comps/ExerciseModal.vue';
  // import ChapterIndex from './comps/ChapterIndex.vue';
  // import RenderHomePage from './new-comps/renderHomePage.vue';
  import StateCard from './new-comps/StateCard.vue';
  import JingGangArea from '@/components/PublicSmallCom/JingGangArea.vue';
  import ChapterIndex from '@/components/PublicSmallCom/ChapterIndex.vue';
  import Advertisement from '@/components/PublicSmallCom/Advertisement.vue';
  import Commodity from '@/components/PublicSmallCom/Commodity.vue';
  import Information from '@/components/PublicSmallCom/Information.vue';
  import RichText from '@/components/PublicSmallCom/RichText.vue';
  import baseInfo from '@/build/index';
  import { ChannelSingleLogo } from '@/enums/msgEnum';
  import { AdertUrl, baseUrl } from '@/enums/advert';
  import { getUnFinishedOrder } from '@/api/modules/order/index';
  import { getPhotoJson, getConfigure, addRecord, getAdvertList } from '@/api/modules/user/index';
  import { getEmpower } from '@/api/modules/question/exercise';
  import {
    getCommodityDisplay,
    getVIPCommodity,
    getSubjectList,
    getMaterial,
    getInfoList,
    getCommodityStatus,
  } from '@/api/modules/commodity/index';
  import { getDailyExerciseRecord, getDefaultProject } from '@/api/modules/home/index';
  import { getBrushList, getStatistics } from '@/api/modules/question/exercise';
  import { getPageTempalte } from '@/api/modules/common/index';
  import { BaiduChannelId, WeixinChannelId, DouyinChannelId } from '@/enums/msgEnum';
  /* #ifdef H5 */
  import WebTabs from '@/components/H5Tabs/WebTabs.vue';
  /* #endif */

  export default {
    name: 'home',
    components: {
      OrderModel,
      ChapterIndex,
      JingGangArea,
      Advertisement,
      Information,
      Commodity,
      StateCard,
      RichText,
      ExerciseModal,
      AddressModal,
      CustomTab,
      /* #ifdef H5 */
      WebTabs,
      /* #endif */
    },
    data() {
      return {
        subjectId: 0, //子科目
        chapterInfo: {},
        chapterConfig: {},
        tabShow: 0,
        photoList: [],
        queCommodity: {},
        displayList: [],
        subjectList: [], // 科目列表
        materialList: [], // 资料列表
        activeNum: 0, // 科目的选项
        queBrush: {
          days: '--',
          signed: false,
          shared: false,
          queCount: '--',
          accuracy: '--',
        },
        manNumber: 0,
        current: 0,
        homeData: {
          adviseCommodityList: [], //商品列表
          //广告列表
          pubCommodityList: [
            {
              imgUrl: '',
            },
          ],
          stuLearnStatistics: {},
        },
        infoHeight: 0, // 资讯高度
        dataHeight: 0, // 学习资料高度
        questionHeight: 0, // 题目高度
        infoList: [], // 资讯列表
        isFirst: true,
        windowList: [],
        toastList: [],
        showToast: true,
        unPayOrder: {}, // 未支付订单数据
        unAddressOrder: {}, // 补录地址订单数据
        system: false,
        logoClass: '',
        tabList: [], //tab切换数组
        homeConfig: [], //首页配置
        currentTab: 0, //sweiper所在页 题目类型 0-错题 1-收藏
        currentSubjectId: '', //当前学科id
        displayAreaId: '', //金刚区id
        currentDays: 0, //当前的坚持天数
        currentGroupData: 0, // 当前小组题数
        configAll: [], //首页总配置数组
        channelId: '',
        topStyle: 1, // 科目栏置顶效果切换
        doneNum: 0, // 每日一练已做题目数
        codeExercise: '', // 暂存每日一练code
        currentSubName: '', //当前科目名称
        pageColor: '#ffffff',
        goLoad: 1, // 是否刷新过来
      };
    },
    computed: {
      projectId() {
        return this.$store.getters.getProjectId;
      },
      projectName() {
        return this.$store.getters.getProjectName;
      },
      token() {
        return this.$store.getters.getToken;
      },
      tourist() {
        return uni.getStorageSync('tourist');
      },
      list() {
        return this.$store.getters.getDailyAnalysis;
      },
      tenantId() {
        return this.$store.getters.getTenantId;
      },
      pageTabList() {
        return this.$store.getters.getPageTabList;
      },
      displayDimensions() {
        return this.$store.getters.getDisplayDimensions;
      },
    },
    watch: {
      currentSubjectId: {
        handler(val) {
          if (val) {
            this.$store.commit('setCurrentSubjectId', val);
          }
        },
        immediate: true,
        deep: true,
      },
      tabList: {
        handler(val) {
          if (val) {
            this.$store.commit('setSubjectList', val);
          }
        },
        immediate: true,
        deep: true,
      },
      pageTabList: {
        // handler(nv) {
        //   let startPageTab = 0;
        //   // nv.tabList.map((item, index) => {
        //   //   if (item.url == 'pages/realHome/index') {
        //   //     startPageTab = index;
        //   //   }
        //   // });
        //   // // 此处根据首页切换顺序
        //   // this.$store.commit('setCurrentTab', startPageTab);
        // },
      },
      goLoad: {
        handler(val) {
          if (val == 1) {
            this.getAllData();
          }
        },
        immediate: true,
        deep: true,
      },
    },
    onLoad(option) {
      this.goLoad = 0;
      /* #ifdef MP-BAIDU */
      // this.thirdAppId = ChannelAppId[baseInfo.CHANNEL];
      this.channelId = BaiduChannelId[baseInfo.CHANNEL];
      /* #endif */
      /* #ifdef MP-WEIXIN */
      this.channelId = WeixinChannelId[baseInfo.CHANNEL];
      /* #endif */
      /* #ifdef MP-TOUTIAO */
      this.channelId = DouyinChannelId[baseInfo.CHANNEL];
      /* #endif */
      this.logoClass = ChannelSingleLogo[baseInfo.CHANNEL];
      // 当用户有shareCode时存储
      if (option.shareCode) {
        uni.setStorageSync('shareCode', option.shareCode);
      }
      if (this.tourist) {
        uni.clearStorage();
      }
      // this.getPhoto();
      /* #ifndef H5 */
      this.getSystem();
      /* #endif */
      if (this.token) {
        this.tabList = [];
        this.getPhoto();
        this.getMysubject();
        this.getPageInfo();
        this.getBaseInfo();
      } else {
        this.getPageInfo();
        if (!this.projectId) {
          this.getDefaultProjectsSubject();
        }
        // this.tabList = [{ k: '10092', v: '口腔助理综合笔试', name: '口腔助理综合笔试' }];
      }
    },
    onShow() {
      uni.removeStorageSync('liveShow');
      // this.getCommodityDisplay();
      if (this.token) {
        // this.getVIPCommodity();
        this.getBaseInfo();
        this.getOrderModalInfo();
        if (!this.currentSubjectId || this.currentSubjectId == '') {
          this.getMysubject();
        }
      }
      if (this.projectId) {
        /* #ifdef MP-WEIXIN */
        this.getSubjectList();
        /* #endif */
        this.getInfoList();
        //首页swiper
        // this.getAdvertList();
        //弹窗
        this.getToastAdvert();
        //浮窗
        this.getWindowAdvert();
      }

      this.$store.commit('setShowType', 0);
      this.isFirst = true;
      uni.hideTabBar();
    },

    onPageScroll(e) {
      // if (e.scrollTop > 10) {
      //   this.topStyle = 2;
      // } else {
      //   this.topStyle = 1;
      // }
      if (this.isFirst) {
        this.getScroll('#info');
        this.getScroll('#data');
        this.getScroll('#question');
        this.isFirst = false;
      }
      if (e.scrollTop >= this.infoHeight - 60) {
        this.tabShow = 3;
      } else if (e.scrollTop >= this.dataHeight - 60) {
        this.tabShow = 2;
      } else if (e.scrollTop >= this.questionHeight - 60) {
        this.tabShow = 1;
      } else {
        this.tabShow = 0;
      }
    },
    // // 分享逻辑
    // async onShareAppMessage(res) {
    //   if (res.from === 'button') {
    //     let data = await checkSign();
    //     await dailyShare(data.body.code);
    //     this.getBaseInfo();
    //     return {
    //       title: '随时陪你刷好题',
    //       imageUrl: 'https://acc.wangxiao.cn/ztb/shareImg.png',
    //       path: '/pages/home/index',
    //       /* #ifdef MP-TOUTIAO */
    //       templateId: '1q3ra5e657d1qmadp9',
    //       /* #endif */
    //     };
    //   }
    // },
    // 转发页面
    async onShareAppMessage() {
      return {
        path: '/pages/realHome/index',
        // imageUrl: 'https://app.static.wangxiao.cn/ykmf/images/zuduishuati.png',
      };
    },
    methods: {
      // 非onLoad刷新首页
      getAllData() {
        /* #ifdef MP-BAIDU */
        // this.thirdAppId = ChannelAppId[baseInfo.CHANNEL];
        this.channelId = BaiduChannelId[baseInfo.CHANNEL];
        /* #endif */
        /* #ifdef MP-WEIXIN */
        this.channelId = WeixinChannelId[baseInfo.CHANNEL];
        /* #endif */
        /* #ifdef MP-TOUTIAO */
        this.channelId = DouyinChannelId[baseInfo.CHANNEL];
        /* #endif */
        this.logoClass = ChannelSingleLogo[baseInfo.CHANNEL];
        if (this.tourist) {
          uni.clearStorage();
        }
        // this.getPhoto();
        /* #ifndef H5 */
        this.getSystem();
        /* #endif */
        if (this.token) {
          this.tabList = [];
          this.getPhoto();
          this.getMysubject();
          this.getPageInfo();
          this.getBaseInfo();
        } else {
          this.getPageInfo();
          this.getDefaultProjectsSubject();
          // this.tabList = [{ k: '10092', v: '口腔助理综合笔试', name: '口腔助理综合笔试' }];
        }
      },
      // 判断所处环境是Android还是ios
      getSystem() {
        let that = this;
        uni.getSystemInfo({
          success: function(res) {
            that.system = res.system.indexOf('iOS') != -1;
            that.$store.commit('setSystem', that.system);
          },
        });
      },
      // 获取未完成订单弹窗信息
      async getOrderModalInfo() {
        const res = await getUnFinishedOrder();
        if (res.body?.unpaidOrder?.number > 0) {
          this.unPayOrder = res.body.unpaidOrder;
          this.$refs.orderModal.showModal = true;
          this.$refs.addressModal.showModal = false;
        } else if (res.body?.unfilledAddressOrder?.number > 0) {
          this.unAddressOrder = res.body.unfilledAddressOrder;
          this.$refs.addressModal.showModal = true;
          this.$refs.orderModal.showModal = false;
        } else {
          this.$refs.orderModal.showModal = false;
          this.$refs.addressModal.showModal = false;
        }
      },
      // 获取每日一练打卡人数
      async getBrushList() {
        const res = await getBrushList({ projectId: this.projectId });
        this.manNumber = res.body;
      },
      // 获取项目底下的科目列表
      async getSubjectList() {
        const res = await getSubjectList({ id: this.projectId });
        this.subjectList = res.body;
        this.activeNum = 0;
        if (this.subjectList.length > 0) {
          this.getMaterial(this.subjectList[0].k);
        }
      },
      // 获取科目底下的学习资料
      async getMaterial(subjectId) {
        // this.subjectId = subjectId;
        const res = await getMaterial({ projectId: this.projectId, subjectId });
        this.materialList = res.body;
      },
      // 根据项目获取对应资讯列表
      async getInfoList() {
        const res = await getInfoList({
          projectId: this.projectId,
          displayDimensions: this.displayDimensions,
        });
        this.infoList = res.body;
      },
      // 切换科目
      handleSub(id, index) {
        this.activeNum = index;
        this.getMaterial(id);
      },
      //获取基础信息
      async getBaseInfo() {
        this.getBrushList();
        this.getSum();
        const data = await getConfigure({ channelId: this.channelId });
        this.queBrush.days = data.body.dailySign.days;
        this.queBrush.signed = data.body.dailySign.signed;
        this.queBrush.shared = data.body.dailySign.shared || false;
        if (data.body.groupMember) {
          this.currentGroupData = data.body.groupMember.questionNum;
        }
        if (this.tabList.length != 0) {
          let arr = [];
          if (data.body.subjects) {
            data.body.subjects.map((item) => {
              let obj = {
                name: item.v,
                id: item.k,
                days: item.signDay,
              };
              arr.push(obj);
            });
            this.tabList = arr;
            this.currentSubName = this.tabList[0].name;
            this.currentDays = arr[this.current].days;
          }
        }
      },
      async getAdvertList() {
        const data = await getAdvertList({
          type: 1,
          productId: this.projectId,
          tenantId: this.tenantId,
        });
        if (data && data.length > 0) {
          this.homeData.pubCommodityList = data;
        } else {
          this.homeData.pubCommodityList = [
            {
              imgUrl: baseUrl + this.tenantId + '/7a5c8440da484523bb8ffa1e03af1937.png',
            },
          ];
        }
      },
      // 图片错误
      handleError() {
        this.pubCommodityList = [
          {
            imgUrl: AdertUrl.Home,
          },
        ];
      },
      //弹窗
      async getToastAdvert() {
        this.toastList = [];
        const data = await getAdvertList({
          type: 7,
          productId: this.projectId,
          tenantId: this.tenantId,
        });
        if (data && data.length > 0) this.toastList = data;
      },
      //浮窗
      async getWindowAdvert() {
        this.windowList = [];
        const data = await getAdvertList({
          type: 6,
          productId: this.projectId,
          tenantId: this.tenantId,
        });
        if (data && data.length > 0) this.windowList = data;
      },
      // 关闭弹窗
      closeToast() {
        this.showToast = false;
      },
      //获取统计
      async getSum() {
        const res = await getStatistics();
        if (res.code == '2037') {
          uni.navigateTo({
            url: '/business/selectExam/index',
          });
        }
        this.queBrush.sum = res.body.sum;
        this.queBrush.rate = res.body.rate;
      },
      // 获取商品陈列列表
      async getCommodityDisplay() {
        const res = await getCommodityDisplay({
          projectId: this.projectId,
        });
        this.displayList = res.body;
      },
      // 获取VIP题库
      async getVIPCommodity() {
        this.queCommodity = {};
        const res = await getVIPCommodity({
          projectId: this.projectId,
        });
        this.queCommodity = res.body;
        if (res.body) {
          if (!res.body.isBought) {
            uni.setStorageSync('vipId', this.queCommodity.id);
          } else {
            uni.removeStorageSync('vipId');
            uni.setStorageSync('questionBankId', this.queCommodity.id);
          }
        } else {
          uni.removeStorageSync('questionBankId');
          uni.removeStorageSync('vipId');
        }
      },
      //获取头像图片列表
      async getPhoto() {
        const res = await getPhotoJson();
        this.photoList = this.shuffle(res, 6);
      },
      //随机从数据种拿n项
      shuffle(arr, number) {
        let i = arr?.length;
        while (i) {
          let j = Math.floor(Math.random() * i--);
          [arr[j], arr[i]] = [arr[i], arr[j]];
        }
        return arr?.slice(0, number);
      },
      // 点击导航
      gotoQestionBank(n) {
        switch (n) {
          case 0:
            // 点击题库
            uni.pageScrollTo({
              duration: 100, //过渡时间
              scrollTop: 0, //到达距离顶部的top值
            });
            break;
          case 1:
            // 点击商品
            this.toScroll('#question');
            break;
          case 2:
            // 点击学习资料
            this.toScroll('#data');
            break;
          case 3:
            // 点击资讯
            this.toScroll('#info');
            break;
        }
      },
      // 获取元素到顶部的距离
      getScroll(id) {
        uni
          .createSelectorQuery()
          .select('.px-24')
          .boundingClientRect((container) => {
            uni
              .createSelectorQuery()
              .select(id)
              .boundingClientRect((data) => {
                if (id == '#info') {
                  this.infoHeight = data.top - container.top;
                } else if (id == '#data') {
                  this.dataHeight = data.top - container.top;
                } else if (id == '#question') {
                  this.questionHeight = data.top - container.top;
                }
              })
              .exec();
          })
          .exec();
      },
      // 获取元素到顶部的距离并滚动
      toScroll(id) {
        uni
          .createSelectorQuery()
          .select('.px-24')
          .boundingClientRect((container) => {
            uni
              .createSelectorQuery()
              .select(id)
              .boundingClientRect((data) => {
                uni.pageScrollTo({
                  duration: 100,
                  scrollTop: data.top - container.top - 40,
                });
              })
              .exec();
          })
          .exec();
      },
      // 点击广告
      async clickAdvert(data) {
        this.showToast = false;
        // 记录点击广告
        if (data.id) {
          await addRecord({ advertId: data.id });
          if (data.jumpType == 2) {
            //跳转链接
            uni.setClipboardData({
              data: data.jumpPage,
              success: () => {
                uni.hideToast();
                this.$nextTick(() => {
                  uni.showToast({
                    title: '链接已复制，请在浏览器打开',
                    icon: 'none',
                  });
                });
              },
            });
          } else {
            const status = await getCommodityStatus({ id: data.jumpPage });
            //跳转商品当type:1
            if (status.body == false) {
              uni.navigateTo({
                url: `/page_commodity/commodity/pages/commodityBank?id=${data.jumpPage}`,
              });
            } else if (status.body == true) {
              uni.navigateTo({
                url: `/page_commodity/courseList/index?id=${data.jumpPage}&isOrder=true`,
              });
            }
          }
        }
      },
      async getMysubject() {
        const res = await getConfigure({ channelId: this.channelId });
        if (res.body.subjects) {
          let arr = [];
          this.$store.commit('setProjectName', res.body.project.v);
          this.$store.commit('setProjectId', res.body.project.k);
          res.body.subjects.map((item) => {
            let obj = {
              name: item.v,
              id: item.k,
              days: item.signDay,
            };
            arr.push(obj);
          });
          this.tabList = arr;
          this.currentSubjectId = this.tabList[0].id;
          this.currentDays = this.tabList[0].days;
        }
      },

      // 获取页面信息
      async getPageInfo() {
        const res = await getPageTempalte({ pageCode: 'home', id: this.projectId });
        // this.displayAreaId = res.body.id;
        if (res.body.pageJson) {
          const config = JSON.parse(res.body.pageJson);
          // return;
          // 删除第一个配置
          config.shift();
          this.configAll = config;
          config.forEach((item) => {
            //只要是金刚区就需要传参过去渲染
            if (item.type == 'grid-menu') {
              //处理完样式 以后传过去
              item.style = this.getStyle(item.style);
              this.homeConfig.push(item);
            } else if (item.type == 'single-goods') {
              item.style = this.getStyle(item.style);
              this.chapterConfig = item;
              // 章节课陈列区id获取
              const hrefs = item?.action?.config?.href;
              if (hrefs?.length > 0) {
                this.displayAreaId = hrefs[hrefs.length - 1];
              }
            } else if (item.type == 'goods-list') {
              item.content.push({ attr: 'layout', val: this.getType(item.style) });
              item.style = this.getStyle(item.style);
            } else if (item.type == 'function-comp') {
              // item.content.push({ attr: 'layout', val: this.getType(item.style) });
              item.showType = this.getType(item.style);
              item.style = this.getStyle(item.style);
            } else {
              item.style = this.getStyle(item.style);
            }
          });
          this.configAll = config;
          // console.log(this.configAll, 'configAllconfigAll');
        }
        if (res.body.areaJson) {
          const config = JSON.parse(res.body.areaJson);
          if (config?.length > 0) {
            config.map((item) => {
              if (item.attr == 'background-color') {
                this.pageColor = item.val;
              }
            });
          }
        }
      },
      // async getPageInfo() {
      //   const res = await getHomePage({ channelId: this.channelId });
      //   this.displayAreaId = res.body.id;
      //   if (res.body.pageJson) {
      //     const config = JSON.parse(res.body.pageJson);
      //     // 删除第一个配置
      //     config.shift();
      //     this.configAll = config;
      //     config.map((item) => {
      //       //只要是金刚区就需要传参过去渲染
      //       if (item.type == 'grid-menu') {
      //         //处理完样式 以后传过去
      //         item.style = this.getStyle(item.style);
      //         this.homeConfig.push(item);
      //       }
      //       if (item.type == 'single-goods') {
      //         item.style = this.getStyle(item.style);
      //         this.chapterConfig = item;
      //       }
      //     });

      // 处理样式
      getStyle(temp) {
        const style = {};
        const k_v = {
          'padding-top': 'paddingTop',
          'padding-right': 'paddingRight',
          'padding-bottom': 'paddingBottom',
          'padding-left': 'paddingLeft',
        };
        temp.map((item) => {
          // const key = [item.attr];
          const key = k_v[item.attr];
          if (key) {
            style[key] = item.val + 'px';
          }
        });
        return style;
      },
      getType(temp) {
        // console.log(temp, 'temptemptemp');
        let val = 0;
        temp.map((item) => {
          if (item.attr == 'layout') {
            val = item.val;
          }
        });
        return val;
      },

      //切换科目
      changeTab(index) {
        this.current = index;
        this.currentTab = index;
        this.currentSubjectId = this.tabList[index].id;
        this.currentDays = this.tabList[index].days;
        this.currentSubName = this.tabList[index].name;
      },
      // 去往切换科目具体页面
      toSlelectSubjectPage() {
        uni.navigateTo({
          url: `/home/SelectSubject?projectId=${this.projectId}&projectName=${this.projectName}`,
        });
      },
      toSelectProject() {
        uni.navigateTo({
          url: '/business/selectExam/index?ifUpload=true',
        });
      },
      // swiper 滑动
      swiperTab(e) {
        let index = e.detail.current; //获取索引
        this.current = index;
        this.currentSubjectId = this.tabList[index].id;
        this.currentDays = this.tabList[index].days;
      },
      // 去往商品详情页
      toDetail() {
        uni.navigateTo({
          url: '/page_commodity/commodity/pages/commodityBank?id=MER000000227&isLive=true',
        });
      },
      // 点击每日一练
      async handleDailyExercise() {
        let params = {
          subjectId: this.currentSubjectId,
          projectId: this.projectId,
        };
        const res = await getDailyExerciseRecord(params);
        if (res.body) {
          if (res.body.hasRecord) {
            if (res.body.finished) {
              // 去往解析页
              uni.navigateTo({
                url: `/business/report/index?code=${res.body.code}&projectId=${this.projectId}&subjectId=${this.currentSubjectId}&fromHome=true`,
              });
            } else {
              this.doneNum = res.body.done;
              this.codeExercise = res.body.code;
              this.$refs.exercise.showModal = true;
            }
          } else {
            this.toExercise();
          }
        }
        // return;
        // this.$refs.exercise.showModal = true;
      },
      // 重新练习
      async toReStart() {
        let res = await getEmpower(this.currentSubjectId);
        uni.navigateTo({
          url: `/business/brushQuestions/index?code=${res.body.code}&subjectId=${this.currentSubjectId}`,
        });
      },
      // 没有记录 直接进
      async toExercise() {
        let res = await getEmpower(this.currentSubjectId);
        uni.navigateTo({
          url: `/business/brushQuestions/index?code=${res.body.code}&subjectId=${this.currentSubjectId}`,
        });
      },
      // 继续做题
      toContinue() {
        uni.navigateTo({
          url: `/business/brushQuestions/index?code=${this.codeExercise}&currentIndex=${this
            .doneNum - 1}&subjectId=${this.currentSubjectId}`,
        });
      },
      // 获取默认科目项目 -未登录
      async getDefaultProjectsSubject() {
        const res = await getDefaultProject({ channelId: this.channelId });
        const defaultProjectId = res.body.project[0].key;
        const defaultProjectName = res.body.project[0].value;
        let defaultSubjectInfo = {};
        for (var index in res.body.projects) {
          if (index == defaultProjectId) {
            defaultSubjectInfo = res.body.projects[index][0];
          }
        }
        this.$store.commit('setProjectName', defaultProjectName);
        this.$store.commit('setProjectId', defaultProjectId);
        this.tabList = [
          {
            id: defaultSubjectInfo.key,
            name: defaultSubjectInfo.value,
          },
        ];
        this.currentSubjectId = this.tabList[0].id;
      },
      // 根据滑动高度 动态控制顶部样式
      // scorllChange(e) {
      //   console.log(e);
      //   // if (e.detail?.scrollTop > 30) {
      //   //   this.topStyle = 2;
      //   // } else {
      //   //   this.topStyle = 1;
      //   // }
      // },
    },
  };
</script>

<style lang="scss" scoped>
  .home-common-bg {
    padding-bottom: 50rpx;
    /* #ifdef H5 */
    height: calc(100vh - 88rpx);
    padding-bottom: 120rpx;
    /* #endif */
    background-color: #ffffff !important;
    .top-select {
      height: 128rpx;
      /* #ifdef H5 */
      height: 180rpx;
      /* #endif */
      width: 100vw;
      background-color: #e51600;
      position: absolute;
      z-index: 999999;
      .project-title {
        opacity: 0.800000011920929;
        color: #ffffffff;
        font-size: 24rpx;
        font-weight: 400;
        font-family: 'PingFang SC';
        padding-left: 30rpx;
        padding-top: 6rpx;
        /* #ifdef H5 */
        margin-top: 30rpx;
        /* #endif */
        .switch-project {
          margin-left: 12rpx;
          font-size: 22rpx;
        }
      }
      .subject-tab-box {
        display: flex;
        border: 0 solid #979797ff;
        margin-top: 14rpx;
        .subject-more {
          color: #ffffff;
          line-height: 87rpx;
          font-size: 30rpx;
          margin-left: 42rpx;
        }
      }
      .subject-tab-box-top {
        display: flex;
        border: 0 solid #979797;
        background: #ffffff;
        margin-top: 14rpx;
        box-shadow: 0 2rpx 4rpx 0 #cccccc3d;
        width: 100%;
        position: fixed;
        top: -20rpx;
        z-index: 99999999999999999;
        .subject-more {
          color: #333;
          line-height: 87rpx;
          font-size: 30rpx;
          margin-left: 42rpx;
        }
      }
    }
    .top-select-2 {
      height: 128rpx;
      width: 100vw;
      // background-color: #e51600;
      position: absolute;
      z-index: 999999;
      .project-title {
        opacity: 0.800000011920929;
        color: #ffffffff;
        font-size: 24rpx;
        font-weight: 400;
        font-family: 'PingFang SC';
        padding-left: 30rpx;
        padding-top: 6rpx;
        .switch-project {
          margin-left: 12rpx;
          font-size: 22rpx;
        }
      }
      .subject-tab-box {
        display: flex;
        border: 0 solid #979797ff;
        margin-top: 10rpx;
        .subject-more {
          color: #ffffff;
          line-height: 87rpx;
          font-size: 30rpx;
          margin-left: 42rpx;
        }
      }
      .subject-tab-box-top {
        display: flex;
        border: 0 solid #979797;
        background: #ffffff;
        box-shadow: 0 2rpx 4rpx 0 #cccccc3d;
        width: 100%;
        position: fixed;
        top: -20rpx;
        z-index: 99999999999999999;
        margin-top: 10rpx;
        .subject-more {
          color: #333;
          line-height: 87rpx;
          font-size: 30rpx;
          margin-left: 42rpx;
        }
      }
    }
    .px-24 {
      .new-top-box {
        // background: url('../../static/img/home/bg.png') no-repeat;
        background-size: 100% 100%;
        // height: 308rpx;
        height: 152rpx;
        width: 100%;
        // position: absolute;
        background-color: #e51600ff !important;
      }
      .new-top-box-2 {
        // background: url('../../static/img/home/bg.png') no-repeat;
        background-size: 100% 100%;
        // height: 308rpx;
        height: 152rpx;
        width: 100%;
        background-color: #e51600ff;
        // position: absolute;
      }
    }
  }
  .common-barItem {
    display: flex;
    justify-content: center;
    flex-flow: column;
    align-items: center;

    image {
      width: 48rpx;
      height: 48rpx;
    }
  }
  .first-component {
    // padding-top: 160rpx;
  }
  .swiper-hight {
    height: 100vh;
    /* #ifdef H5 */
    height: calc(100vh - 360rpx);
    /* #endif */
  }
  .logo-box {
    margin: 40rpx auto;
    text-align: center;

    .t-icon {
      width: 320rpx;
      height: 44rpx;
      background-repeat: no-repeat;
    }
  }

  .banner-swiper {
    height: 200rpx;
    margin: 24rpx 0;
    .swiper-item {
      height: 100%;
      width: 702rpx;
      border-radius: 24rpx;
    }
  }
  .home-tab-box {
    height: 90rpx;
    width: 706rpx;
    position: fixed;
    top: 0;
    z-index: 99;
    background-color: #f5f6fa;
    p {
      line-height: 90rpx;
      width: 25%;
    }
    .subscript {
      position: relative;
      &:after {
        content: '';
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 0;
        width: 40rpx;
        height: 8rpx;
        border-radius: 4rpx;
        background-color: #475ffd;
      }
    }
  }
  .t-icon-qiehuanxiangmu {
    margin-left: 10rpx;
  }
  .toast-advert-box {
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    .toast-advert {
      width: 680rpx;
      height: 800rpx;
      margin-bottom: 48rpx;
    }
    .t-icon-guanbi-copy {
      width: 48rpx;
      height: 48rpx;
    }
  }
  .window-advert-box {
    position: fixed;
    z-index: 998;
    bottom: 200rpx;
    right: 24rpx;
    .window-advert {
      width: 200rpx;
      height: 200rpx;
    }
  }
</style>
