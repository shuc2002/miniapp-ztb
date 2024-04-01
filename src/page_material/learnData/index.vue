<!--
* @desc 学习资料详情
* @author 江玉龙
* @date 2022年07月07日
-->
<template>
  <view class="common-bg">
    <view class="integral-box">
      <view class="flex-center">
        <view>我的积分</view>
        <image src="@/home/static/img/shop/integral.png" />
        <view class="text-size-sn common-text common-text-700">{{ integral }}</view>
      </view>
      <view>
        <button class="btn-obtain flex-center" @tap="commonFun.routeTo(`/business/integral/index`)"
          >领取积分</button
        >
      </view>
    </view>
    <DataDetail :data="commodityData" :timeData="timeData" @handleCheck="handleCheck()" />
    <view class="learn-box" v-if="list.length > 0">
      <view class="trade-item">
        <image src="@/static/img/home/order-data.png" />
        <span class="text-size-main common-text-700 common-text">相关阅读</span>
      </view>
      <view v-for="(item, key) in list" :key="key">
        <view
          class="learn-item"
          @tap="
            item.isBought
              ? commonFun.routeTo(`/page_commodity/courseList/index?id=${item.id}&isOrder=true`)
              : commonFun.redirectTo(
                  `/page_material/learnData/index?id=${item.id}&subjectId=${item.subjectId}`
                )
          "
        >
          <view class="text-size-main common-text common-text-400 truncate">{{ item.name }}</view>
          <view class="flex read-item">
            <view class="tab-free flex-center" v-if="item.price == 0">限时免费</view>
            <view class="text-size-xxs common-tip common-text-400" v-if="item.readingAmount"
              >阅读：{{ item.readingAmount }}</view
            >
          </view>
        </view>
      </view>
    </view>
    <view class="order-content" v-if="showModal" @tap.stop="cancel()">
      <view class="order-box" @tap.stop v-if="!showIntegral">
        <view class="text-size-main common-text-700 text-item"
          >分享至<span>{{ projectName }}微信群</span></view
        >
        <view class="text-size-main common-text-700 text-item"
          >限时{{ commodityData.integral }}积分兑换</view
        >
        <view class="nav-btn">
          <button
            class="cancel-btn flex-center"
            :class="!system ? 'common-message' : 'common-main'"
            @tap.stop="system ? '' : handleBuy()"
            >原价{{
              commodityData.price >= 1 ? commodityData.price.toFixed(0) : commodityData.price
            }}元购买</button
          >
          <button class="success-btn flex-center" open-type="share">去分享</button>
        </view>
      </view>
      <view class="integral-pay" v-if="showIntegral">
        <p class="text-size-xxl common-text-700 common-brown exchange-box">兑换成功</p>
        <p class="text-size-main common-text-400 common-text">您以成功分享</p>
        <p class="text-size-main common-text-400 common-text"
          >使用{{ commodityData.integral }}积分即可免费兑换该资料</p
        >
        <button class="exchange-btn" @tap="integralPay()">兑换并查看</button>
        <p class="text-size-xxs common-text-400 common-tip"
          >当前剩余{{ integral }}积分，可完成任务赚取积分</p
        >
      </view>
    </view>
  </view>
</template>
<script>
  import { getIntegralNum } from '@/api/modules/order/index';
  import DataDetail from './comps/DataDetail.vue';
  import { getCommodityDetail, getRelevant } from '@/api/modules/commodity/index';
  import { integralPay } from '@/api/modules/order/index';
  export default {
    name: 'learningData',
    components: { DataDetail },
    computed: {
      projectId() {
        return this.$store.getters.getProjectId;
      },
      projectName() {
        return this.$store.getters.getProjectName;
      },
      system() {
        return this.$store.getters.getSystem;
      },
    },
    onLoad(options) {
      this.getIntegralNum();
      this.getCommodityDetail(options.id);
      this.getData(options.subjectId, options.id);
      this.reset();
    },
    data() {
      return {
        list: [],
        commodityData: {},
        integral: 0,
        showModal: false,
        showIntegral: false,
        timeData: 0,
      };
    },
    methods: {
      // 重置倒计时
      reset() {
        const startTime = new Date(); // 当前时间
        const endTime = new Date(new Date().setHours(23, 59, 59, 999)); // 设置今天最后时间
        this.timeData = endTime.getTime() - startTime.getTime();
      },
      // 商品详情获取
      async getCommodityDetail(id) {
        const res = await getCommodityDetail({ id });
        this.commodityData = res.body;
      },
      // 获取我的积分
      async getIntegralNum() {
        const res = await getIntegralNum();
        this.integral = res.body;
      },
      // 获取相关阅读资料
      async getData(subjectId, commodityId) {
        const res = await getRelevant({ projectId: this.projectId, subjectId, commodityId });
        this.list = res.body;
      },
      // 点击查看更多
      handleCheck() {
        if (this.commodityData.integral > this.integral) {
          uni.showToast({
            title: '积分不足',
            icon: 'none',
          });
        } else {
          this.showModal = true;
        }
      },
      // 立即购买
      handleBuy() {
        if (this.commodityData.type == 3) {
          uni.navigateTo({
            url: `/page_commodity/order/pages/entityOrder?commodityId=${this.commodityData.id}&ifActivity=true`,
          });
        } else {
          uni.navigateTo({
            url: `/page_commodity/order/pages/buyOrder?commodityId=${this.commodityData.id}&ifActivity=true`,
          });
        }
      },
      // 关闭弹窗
      cancel() {
        this.showModal = false;
        this.showIntegral = false;
      },
      // 确认积分支付
      async integralPay() {
        const res = await integralPay({ commodityId: this.commodityData.id, addressId: '' });
        if (res.code == 2038) {
          uni.showToast({
            title: '积分不足',
            icon: 'none',
          });
          this.showModal = false;
        } else {
          uni.redirectTo({
            url: `/page_commodity/courseList/index?id=${this.commodityData.id}&isOrder=true`,
          });
          this.showIntegral = false;
        }
      },
      // 分享按钮
      async onShareAppMessage() {
        this.showIntegral = true;
        return {
          path: '/pages/home/index',
          imageUrl: this.commodityData.thumbnail,
          /* #ifdef MP-TOUTIAO */
          templateId: '54j75t03jp375klb6m',
          /* #endif */
        };
      },
    },
  };
</script>
<style lang="scss" scoped>
  .common-bg {
    padding-top: 8rpx;
  }
  .learn-box {
    background-color: white;
    margin: 24rpx;
    padding: 32rpx;
    border-radius: 24rpx;
    margin-top: 24rpx;
    .trade-item {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      image {
        width: 48rpx;
        height: 48rpx;
        margin-right: 16rpx;
      }
    }
    .learn-item {
      padding: 32rpx 0;
      .tab-free {
        width: 96rpx;
        height: 36rpx;
        border-radius: 8rpx;
        color: #ff9f10;
        border: 2rpx solid #fff1be;
        background: #fffcec;
        font-size: 20rpx;
        font-weight: 400;
        margin-right: 16rpx;
      }
      .read-item {
        margin-top: 18rpx;
      }
    }
  }
  .integral-box {
    height: 112rpx;
    border-radius: 24rpx;
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 24rpx;
    padding: 0 32rpx;
    image {
      width: 38rpx;
      height: 38rpx;
      margin-left: 16rpx;
      margin-right: 8rpx;
    }
    .btn-obtain {
      width: 144rpx;
      height: 48rpx;
      border-radius: 56rpx;
      background-color: #eef2ff;
      color: #475ffd;
      font-size: 24rpx;
    }
  }
  .order-content {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99;
    .order-box {
      width: 602rpx;
      height: 300rpx;
      border-radius: 24rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 60rpx;
      background: linear-gradient(-0.2deg, #ffffff 0%, #f7fafe 81%, #ebf1fd 100%);
      .text-item {
        margin-bottom: 16rpx;
        color: #2c364e;
      }
      .nav-btn {
        display: flex;
        margin-top: 48rpx;
        .cancel-btn {
          width: 244rpx;
          height: 88rpx;
          border-radius: 24rpx;
          background: #ecedf1;
          font-size: 32rpx;
          font-weight: 700;
          margin-right: 18rpx;
        }
        .success-btn {
          width: 244rpx;
          height: 88rpx;
          border-radius: 24rpx;
          background: #475ffd;
          color: #ffffff;
          font-size: 32rpx;
          font-weight: 700;
          &:active {
            opacity: 0.8;
          }
        }
      }
    }
    .integral-pay {
      width: 622rpx;
      height: 532rpx;
      background: linear-gradient(0deg, #ffffffff 0%, #fefdf9ff 55%, #ffe7c9ff 100%);
      text-align: center;
      border-radius: 40px;
      .exchange-box {
        margin-top: 64rpx;
        margin-bottom: 48rpx;
      }
      .exchange-btn {
        width: 510rpx;
        height: 108rpx;
        border-radius: 66px;
        background: #f0522fff;
        font-size: 40rpx;
        font-weight: 500;
        color: #fff;
        margin-top: 48rpx;
        margin-bottom: 24rpx;
      }
    }
  }
</style>
