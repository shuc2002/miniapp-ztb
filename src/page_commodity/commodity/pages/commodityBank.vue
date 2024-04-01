<!--
* @desc 商品详情(题库)
* @author 江玉龙
* @date 2022年04月21日
-->
<template>
  <view class="bg-content">
    <!-- #ifdef H5 -->
    <view class="iconfont icon-return goBack" @tap="navigateBack"></view>
    <!-- #endif -->
    <scroll-view class="scroll-view" scroll-y="true">
      <view v-if="commodityData.type == 1" class="video-box">
        <image :src="commodityData.thumbnail" mode="aspectFit"></image>
        <!-- <view>{{ commodityData.name }}</view> -->
      </view>
      <view v-else>
        <swiper style="min-height: 422rpx; width: 750rpx" autoplay="true" interval="3000">
          <swiper-item v-for="(item, key) in commodityData.images" :key="key">
            <image :src="item" class="img-style" mode="aspectFit" lazy-load="true" />
          </swiper-item>
        </swiper>
      </view>

      <!-- 价格 -->
      <Price
        :data="commodityData"
        :activity="activity"
        :timeData="timeData"
        v-show="commodityData.activityType !== 4"
      />
      <view id="teacher" />
      <!-- 介绍 -->
      <Introduce
        :data="commodityData"
        :couponList="couponList"
        @handleUser="handleUser"
        :subscribeNumber="subscribeNumber"
        v-show="dataLoaded && showIntro"
        :followersNum="followersNum"
      />

      <!-- #ifdef MP-WEIXIN -->
      <!-- <Collage :data="commodityData" :activity="activity" /> -->
      <!-- #endif -->

      <!-- 内含商品目录 -->
      <BankCatalogue
        :commodityData="commodityData"
        :htmlStyle="marketContent"
        @treeClick="treeClick"
        @showTit="showTit"
        :isFixed="false"
        class="intro"
      />
      <view style="height: 180rpx background-color:#ffffff" />
      <!-- 支付 -->
      <PayProcess
        :data="commodityData"
        :single="single"
        :activity="activity"
        :mode="mode"
        :timeData="timeData"
        :iosShow="iosShow"
        :isLive="isLive"
        :hasLogin="hasLogin"
        @pop="handlePop"
        :formId="formId"
        ref="payRef"
        :orderContractId="orderContractId"
      />
      <!-- <GroupBuy :data="commodityData" :activity="activity"></GroupBuy> -->
    </scroll-view>
    <PopupWindow
      ref="force"
      height="308px"
      :confirmTitle="
        auditStatus === 0 ? '我知道了' : auditStatus === 1 ? '立即报名' : '修改报名信息'
      "
      @confirm="goBuy"
      class="popbox"
    >
      <img src="@/static/svgs/approved.svg" alt="" class="audit-status" v-if="auditStatus === 1" />
      <img src="@/static/svgs/rejection.svg" alt="" class="audit-status" v-if="auditStatus === 0" />
      <img src="@/static/svgs/toexamine.svg" alt="" class="audit-status" v-if="auditStatus === 2" />
      <view class="statusTit">{{
        auditStatus === 0 ? '审核中' : auditStatus === 1 ? '审核通过' : '审核驳回'
      }}</view>
      <view class="info" v-if="auditStatus === 0">您提交的报名信息正在审核中<br />请耐心等待</view>
      <view class="info" v-if="auditStatus === 1">您已审核通过，快去报名吧</view>
      <view class="info" v-if="auditStatus === 2">您提交的报名信息有误<br />请修改后重新提交</view>
    </PopupWindow>
  </view>
</template>
<script>
  import Price from '../comps/Price.vue';
  import Introduce from '../comps/Introduce.vue';
  import BankCatalogue from '../comps/BankCatalogue.vue';
  import PayProcess from '../comps/PayProcess.vue';
  // import Collage from '../comps/Collage.vue';
  import { getCommodityDetail, getCommodityFollowersNum } from '@/api/modules/commodity/index';
  import { getCollageOrder } from '@/api/modules/order/index';
  import { handleLoop, setChecked } from './util.js';
  import { getCommodityCoupon, receiveCoupon } from '@/api/modules/coupon/index';
  import { getApplicationStatus } from '@/api/modules/certificateCourse/index';
  import {
    certCourseRegistration,
    certCoursePopRecord,
  } from '@/api/modules/certificateCourse/index';
  import { touristSign } from '@/api/modules/register/index';
  import PopupWindow from '@/components/PopupComp/PopupWindow.vue';
  import { BaseFormUrl } from '@/enums/envEnum';
  import baseInfo from '@/build/index';
  // import { bottomNavTo } from '@/utils/common.js';

  export default {
    name: 'commodityBank',
    components: {
      Price,
      Introduce,
      PayProcess,
      BankCatalogue,
      PopupWindow,
    },
    //option
    async onLoad(option) {
      let id = '';

      if (option.formId) {
        // 表单重定向
        console.log(option.formId, 'formId----');
        this.formId = option.formId;
      }
      if (option.scene) {
        let scene = decodeURIComponent(option.scene); // 例如：isScan=1&storeId=11
        console.log(scene, 'scene');
        //&是我们定义的参数链接方式
        var dataArr = scene.split('&'); //["id=1","isLive=11"]
        console.log(dataArr, dataArr);
        id = dataArr[0].split('=')[1];
        if (dataArr[1] == 'live') {
          // console.log('来了来了');
          wx.hideHomeButton();
          this.isLive = true;
        }
        if (this.$store.getters.getToken) {
          this.getCommodityDetail(id);
          this.getCollageOrder(id);
          this.getCommodityCoupon(id);
          this.hasLogin = true;
        } else {
          this.getInfoByTourist(id);
          this.hasLogin = false;
        }
        this.getFollowersNum(id);
      } else {
        id = option.id;
        if (option.isLive) {
          this.isLive = true;
          wx.hideHomeButton();
        } else {
          this.isLive = false;
        }
        this.getCommodityDetail(id);
        this.getCollageOrder(id);
        this.getFollowersNum(id);
        // this.isLive = false;
        if (this.$store.getters.getToken) {
          this.getCommodityCoupon(id);
          this.hasLogin = true;
        }
      }
      if (option.orderContractId) {
        this.orderContractId = option.orderContractId;
      }

      // 用活动type以及token判断 不用isLive判断
      // if (this.$store.getters.getToken) {
      //   this.getCommodityDetail(id);
      //   this.getCollageOrder(id);
      //   this.getCommodityCoupon(id);
      //   this.hasLogin = true;
      // } else {
      //   this.getInfoByTourist(id);
      //   this.hasLogin = false;
      // }
      this.shareId = id;
      this.single = uni.getStorageSync('single');
      this.mode = uni.getStorageSync('mode');

      // this.reset();
    },
    computed: {
      channelId() {
        return this.$store.getters.getChannelId;
      },
    },
    onShow() {
      // this.$refs.force.showModal = true;
      // this.getScroll();
      if (this.isLive) {
        wx.hideHomeButton();
      }
      // this.getCertificateStatus();
    },
    data() {
      return {
        commodityData: {},
        marketContent: '',
        couponList: [],
        timeData: 0,
        activity: {},
        time: Date.now(),
        full: false,
        isWidth: 0,
        isHeight: 0,
        single: false,
        mode: 0,
        subscribeNumber: 0, // 直播商品的预约人数
        salesVolume: 0, // 直播商品的预约人数
        iosShow: false, // 如果是ios是否展示预约按钮 0元以及单规格需要展示
        isLive: false, // 是否是通过扫码进来的 是则隔离页面
        hasLogin: false, // 是否登录
        shareId: '', // 商品id 用于分享
        showIntro: true, //标题栏是否展示
        isfixed: false,
        contentHeight: 0, //详情高度
        current: 0,
        auditStatus: 0,
        formId: '',
        orderContractId: '',
        followersNum: 0, // 已关注人数
        dataLoaded: false,
      };
    },
    methods: {
      navigateBack() {
        // bottomNavTo('/pages/newCourse/index', 1);
        uni.navigateBack();
      },
      // 题库商品详情获取id
      async getCommodityDetail(id) {
        const res = await getCommodityDetail({ id });
        this.commodityData = res.body;
        console.log(this.commodityData, '商品数据');
        if (this.commodityData.detailPageQrCode) {
          this.commodityData.detailPageQrCode =
            this.commodityData.detailPageQrCode + '?timestamp' + this.time;
        }
        let detail = this.commodityData.detail;
        this.marketContent = detail.replace(/<img/g, '<img style="width:100vw;height:auto;" ');
        setChecked(this.commodityData.products);
        this.dataLoaded = true;
        if (res.body.certificateId) {
          const result = await getApplicationStatus({
            certificateId: this.commodityData.certificateId,
          });
          const { registrationStatus, signUpFormLimit, checkTime, notice = 0 } = result.body;
          if (registrationStatus === 1 && signUpFormLimit === 1 && checkTime === 0) {
            this.auditStatus = 1;
            if (notice == 0) {
              this.$refs.force.showModal = true;
            }
          }
        }

        if (this.formId && this.commodityData.certificateId) {
          // 表单报名
          await certCourseRegistration({
            certificateId: this.commodityData.certificateId,
            formRecordId: this.formId,
          });
        }
      },
      // 获取商品活动详情 获取预约人数
      async getCollageOrder(id) {
        const res = await getCollageOrder({ commodityId: id });
        if (res.body) {
          let amount = this.fechActiveMinPrice(res.body.skuData);
          res.body.amount = amount;
          this.activity = res.body;
          this.timeData = res.body.inDate;
          this.subscribeNumber = res.body.subscribeNumber;
          if (res.body.skuData.length === 1 && res.body.skuData[0].amount === 0) {
            this.iosShow = true;
          } else {
            this.iosShow = false;
          }
        }
      },
      fechActiveMinPrice(data) {
        const min = data.reduce((prev, current) => (prev.amount < current.amount ? prev : current))
          .amount;
        return min;
      },
      // 树节点点击
      treeClick(key, index, sign) {
        handleLoop(this.commodityData.products, key, index, sign);
        this.$forceUpdate();
      },
      // 查询商品有效优惠卷列表
      async getCommodityCoupon(id) {
        const res = await getCommodityCoupon({ commodityId: id });
        this.couponList = res.body;
      },
      // 领取优惠券
      async handleUser(key) {
        if (this.couponList[key].receive == false) {
          const res = await receiveCoupon({ id: this.couponList[key].id });
          if (res.code == 2069) {
            uni.showToast({
              title: '优惠券已失效',
              icon: 'none',
            });
          } else {
            this.$set(this.couponList[key], 'receive', true);
            uni.showToast({
              title: '领取成功',
              icon: 'none',
            });
          }
        }
      },
      // 重置倒计时
      reset() {
        const startTime = new Date(); // 当前时间
        const endTime = new Date(new Date().setHours(23, 59, 59, 999)); // 设置今天最后时间
        this.timeData = endTime.getTime() - startTime.getTime();
      },
      //视频全屏的方法
      changeFull() {
        if (!this.full) {
          console.log(111);
        } else {
          console.log(222);
        }
      },
      //游客获取信息展示
      async getInfoByTourist(id) {
        this.$store.commit('setToken', '');
        const res = await touristSign();
        uni.setStorageSync('tourist', true);
        this.$store.commit('setNickName', '游客');
        this.$store.commit('setToken', res.body.accessToken);
        this.getCommodityDetail(id);
        this.getCollageOrder(id);
        this.getCommodityCoupon(id);
      },
      // 转发页面
      async onShareAppMessage() {
        return {
          path: `/page_commodity/commodity/pages/commodityBank?id=${this.shareId}&isLive=true`,
          // imageUrl: 'https://app.static.wangxiao.cn/ykmf/images/zuduishuati.png',
        };
      },
      // 获取元素到顶部的距离
      getScroll() {
        uni
          .createSelectorQuery()
          .select('.intro')
          .boundingClientRect((container) => {
            this.contentHeight = container.top;
          })
          .exec();
      },
      //切换tab
      showTit(e) {
        this.current = e;
        // this.getScroll();
        if (e == 1 || e == 2) {
          // this.isfixed = true;
        }
      },
      onPageScroll(e) {
        //滑动到固定位置
        if (e.scrollTop >= this.contentHeight) {
          //吸顶
          this.isfixed = true;
        } else {
          this.isfixed = false;
        }
      },
      handlePop(info) {
        this.auditStatus = info;
        this.$refs.force.showModal = true;
      },
      async goBuy() {
        if (this.auditStatus === 0) {
          this.$refs.force.showModal = false;
        } else if (this.auditStatus === 1) {
          await certCoursePopRecord({ certificateId: this.commodityData.certificateId });
          this.$refs.payRef.handleBuy();
        } else if (this.auditStatus === 2) {
          const res = await getApplicationStatus({
            certificateId: this.commodityData.certificateId,
          });
          let clientOrigin = '';
          /* #ifdef H5 */
          clientOrigin = window.location.origin;
          /* #endif */
          const { formId = '', answerUrl2, formRecordId = '' } = res.body;
          await certCourseRegistration({
            certificateId: this.commodityData.certificateId,
            formRecordId: formRecordId,
          });
          const baseUrl = BaseFormUrl[baseInfo.ENV];
          const uri = encodeURIComponent(
            `${baseUrl}/form${answerUrl2}&token=${uni.getStorageSync('token')}&channelId=${
              this.channelId
            }&clientOrigin=${clientOrigin}&platform=${
              uni.getSystemInfoSync().uniPlatform
            }&formId=${formId}&formRecordId=${formRecordId}&id=${
              this.commodityData.id
            }&redirectUrl=/page_commodity/commodity/pages/commodityBank`
          );
          const url = `/page_common/iframe/index?uri=${uri}`;
          // console.log(url, 'url----');
          uni.navigateTo({
            url,
          });
        }
      },
      async getFollowersNum(id) {
        const res = await getCommodityFollowersNum(id);
        if (res.body?.salesVolume) {
          this.followersNum = res.body.salesVolume;
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
  .scroll-view {
    min-width: 100vw;
    background-color: #f5f6fa !important;
    font-size: 32rpx;
  }
  .goBack {
    position: fixed;
    top: 108rpx;
    /* #ifdef H5 */
    top: 28rpx;
    /* #endif */
    left: 34rpx;
    z-index: 9999;
  }
  .video-box {
    width: 100%;
    height: 422rpx;
    // background: #070a21;
    color: #fff;
    font-size: 62rpx;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    image {
      width: 100%;
      height: 100%;
    }
  }
  .fullthumbnail {
    width: height;
    height: width;
  }
  .thumbnail {
    height: var(--isHeight);
    width: var(--isWidth);
    z-index: 10;
  }
  .img-style {
    width: 750rpx;
    // height: 750rpx;
    height: 422rpx;
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
