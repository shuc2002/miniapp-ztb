<!--
* @desc 拼团订单详情
* @author 江玉龙
* @date 2022年07月21日
-->
<template>
  <view class="common-bg">
    <view style="height: 1px; background-color: #f5f6fa" />
    <!-- 商品信息 -->
    <view class="list-box" v-if="!isOriginator && collageData.status != 2">
      <CommodityData :commodityData="[collageData]" :showAmount="false" :isCollage="true" />
    </view>
    <!-- 顶部提示 -->
    <view class="flex-center refund-box" v-if="isOriginator && collageData.status == 1">
      <image src="@/page_commodity/static/order/pay.png" />
      <view class="common-text-700 common-text text-size-main">下单成功</view>
    </view>
    <view class="list-box flex-column-center">
      <!-- 人员显示框顶部提示 -->

      <view class="flex-center" v-if="isOriginator && collageData.status == 1">
        <p
          class="common-text-700 common-text text-size-main"
          v-if="isOriginator && collageData.status == 1"
          >还差{{ collageData.lackNum }}人，</p
        >
        <NewCountdown backgroundColor="#323949" textColor="#ffffff" :remain="collageData.inDate" />
        <p class="common-text-700 common-text text-size-main">后结束</p>
      </view>
      <p
        class="common-text-700 common-text text-size-main"
        v-if="isOriginator && collageData.status == 1"
        >结束后，系统自动匹配好友拼单成功</p
      >
      <p
        class="common-text-700 common-text text-size-main"
        v-if="!isOriginator && collageData.status == 2 && !success"
        >拼团已结束失效</p
      >
      <view class="flex-center" v-if="!isOriginator && collageData.status == 1">
        <p class="common-text-700 common-text text-size-main"
          >仅剩<span class="common-blue span-text">{{ collageData.lackNum }}</span
          >个名额,</p
        >
        <NewCountdown backgroundColor="#323949" textColor="#ffffff" :remain="collageData.inDate" />
        <p class="common-text-700 common-text text-size-main">后结束</p>
      </view>
      <view class="flex-center refund-box" v-if="success && collageData.status == 2">
        <image src="@/page_commodity/static/order/pay.png" />
        <view class="common-text-700 common-text text-size-main">拼团成功</view>
      </view>
      <!-- 头像显示 -->
      <view class="flex-center-box img-item">
        <view class="flex-column-center" v-for="(item, key) in list.slice(0, 3)" :key="key">
          <image :src="item.avatar" mode="aspectFill" />
          <view class="table-group" v-if="key == 0">拼主</view>
        </view>
        <view
          class="flex-column-center invite-box"
          v-if="list.length < 2 && list.length + collageData.lackNum > 2"
        >
          <!-- #ifdef H5 -->
          <button @tap="shareClick()" class="add-image flex-center">+</button>
          <!-- #endif -->
          <!-- #ifndef H5 -->
          <button open-type="share" class="add-image flex-center">+</button>
          <!-- #endif -->
        </view>
        <view
          class="flex-column-center invite-box ml-8"
          v-if="list.length < 3 && list.length + collageData.lackNum > 3"
        >
          <!-- #ifdef H5 -->
          <button @tap="shareClick()" class="add-image flex-center">+</button>
          <!-- #endif -->
          <!-- #ifndef H5 -->
          <button open-type="share" class="add-image flex-center">+</button>
          <!-- #endif -->
        </view>
        <view class="ellipsis" v-if="list.length + collageData.lackNum > 4">...</view>
        <view class="flex-column-center invite-box ml-8" v-if="collageData.lackNum > 0">
          <!-- #ifdef H5 -->
          <button @tap="shareClick()" class="add-image flex-center">+</button>
          <!-- #endif -->
          <!-- #ifndef H5 -->
          <button open-type="share" class="add-image flex-center">+</button>
          <!-- #endif -->
          <view class="red-spot" />
        </view>
        <view class="flex-column-center" v-if="collageData.lackNum == 0 && list.length > 3">
          <image :src="list[list.length - 1].avatar" mode="aspectFill" />
        </view>
      </view>
      <!-- 按钮显示 -->
      <!-- #ifdef H5 -->
      <button
        @tap="shareClick()"
        class="collage-btn invite"
        v-if="isOriginator && collageData.status == 1"
        >邀请好友拼单</button
      >
      <!-- #endif -->
      <!-- #ifndef H5 -->
      <button
        open-type="share"
        class="collage-btn invite"
        v-if="isOriginator && collageData.status == 1"
        >邀请好友拼单</button
      >
      <!-- #endif -->
      <button class="collage-btn home" v-if="isOriginator && collageData.status == 1" @tap="goHome"
        >去首页</button
      >
      <button class="collage-btn invite" v-if="success && collageData.status == 2" @tap="goHome"
        >去首页</button
      >
      <button
        class="collage-btn invite"
        v-if="!isOriginator && collageData.status == 1"
        @tap="handleJoin"
        >参与<span class="span-text truncate">{{ list[0].nickname }}</span
        >的拼单</button
      >
      <button class="collage-btn fail" v-if="!isOriginator && collageData.status == 2 && !success"
        >活动已失效</button
      >
    </view>
    <!-- 订单详情 -->
    <view
      class="list-box flex-center-box"
      v-if="success && collageData.orderId"
      @tap="handleDetail"
    >
      <p class="text-size-xxs common-text-400 common-text">订单详情</p>
      <view class="flex-center">
        <p class="text-detail truncate">{{ collageData.commodityName }}</p>
        <view class="t-icon t-icon-chevron-right icon-text" />
      </view>
    </view>
    <!-- 底部提示 -->
    <view class="text-size-xxs common-text-400 common-tip text-tips"
      >好友拼单 · 人满发货 · 自动匹配拼单</view
    >
    <view style="height: 120rpx" />
    <WxShare ref="WxShare" />
  </view>
</template>
<script>
  import CommodityData from '../comps/CommodityData.vue';
  import NewCountdown from '@/components/Countdown/NewCountdown.vue';
  import { getLately, getGrouping } from '@/api/modules/order/index';
  import { getCommodityDetail } from '@/api/modules/commodity/index';
  // import { getCollageOrder } from '@/api/modules/order/index';
  import baseInfo from '@/build/index';
  import { sucCollageTip, failCollageTip } from '@/enums/msgEnum';
  import { bottomNavTo } from '@/utils/common.js';
  import WxShare from '@/components/WxShare/WxShare.vue';
  /* #ifdef H5 */
  import wxSdk from '@/utils/weixin.js';
  /* #endif */
  export default {
    name: 'collageDetail',
    components: {
      CommodityData,
      NewCountdown,
      WxShare,
    },
    onLoad(options) {
      if (options.commodityId) {
        this.getLately(options.commodityId, options.id);
        this.isOriginator = true;
      } else if (options.groupId) {
        uni.setStorageSync('groupId', options.groupId);
        this.isOriginator = false;
        this.getGrouping(options.groupId);
      }
    },
    computed: {
      avatar() {
        return this.$store.getters.getAvatar;
      },
      uid() {
        return this.$store.getters.getUid;
      },
    },
    // 分享按钮
    async onShareAppMessage() {
      return {
        title: '快来一起拼好课',
        path: `/page_commodity/order/pages/collageDetail?groupId=${this.collageData.groupId}`,
        imageUrl: this.collageData.image,
        /* #ifdef MP-TOUTIAO */
        templateId: '5ut6pnse3qmp687qh4',
        /* #endif */
      };
    },
    data() {
      return {
        collageData: {}, // 拼团数据
        isOriginator: false, // 判断是否是加入
        success: false, // 判断是否在拼团里面
        list: [], // 人员列表
        commodity: {}, // 商品数据
      };
    },
    methods: {
      shareClick() {
        let url =
          window.location.origin +
          `/#/page_commodity/order/pages/collageDetail?groupId=${this.collageData.groupId}`;
        /* #ifdef H5 */
        if (wxSdk.isWechat()) {
          wxSdk.shareWx({
            title: '快来一起拼好课',
            desc: '',
            imgUrl: this.collageData.image,
            link: url,
          });
          this.$refs.WxShare.showModal = true;
        } else {
          if (navigator.share) {
            console.log('支持分享');
            navigator.share({
              title: '快来一起拼好课',
              text: '快来一起拼好课',
              url: url,
            });
          } else {
            uni.setClipboardData({
              data: url,
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
          }
        }
        /* #endif */
      },
      // 获取最近一次拼团详情
      async getLately(commodityId, orderId) {
        const res = await getLately({ commodityId, orderId });
        if (res.body) {
          this.collageData = res.body;
          this.list = this.collageData.userInfos;
          if (this.collageData.userIds.indexOf(this.uid) > -1) {
            this.success = true;
          }
          this.getGrouping(res.body.groupId);
          uni.removeStorageSync('groupId');
        }
      },
      // 获取分享拼团数据
      async getGrouping(groupId) {
        const res = await getGrouping({ groupId });
        if (res.body) {
          this.collageData = res.body;
          this.list = this.collageData.userInfos;
          if (this.collageData.userIds.indexOf(this.uid) > -1) {
            this.success = true;
          }
          if (this.collageData.userIds[0] == this.uid) {
            this.isOriginator = true;
          }
          uni.removeStorageSync('groupId');
        }
      },

      async getCommodityList(commodityId, skuId) {
        const commodityRes = await getCommodityDetail({ id: commodityId });
        const commodity = commodityRes.body;
        // const activity = await getCollageOrder({ commodityId: commodityId });
        const option = commodity.skuList.find((sku) => {
          return sku.skuId == skuId;
        });
        let cartItem = {
          id: commodity.id,
          skuCode: option.skuCode,
          number: 1,
          name: commodity.name,
          price: option.price,
          amount: this.collageData.amount ? this.collageData.amount : option.price,
          linePrice: option.linePrice,
          thumbnail: commodity.thumbnail,
          stock: option.stock,
          commodityType: commodity.type,
          certificateId:
            commodity.certificateId && commodity.type === 1 ? commodity.certificateId : null,
        };
        return [cartItem];
      },
      // 加入拼单
      async handleJoin() {
        const goodsCart = await this.getCommodityList(
          this.collageData.commodityId,
          this.collageData.skuId
        );
        if (this.collageData.commodityType == 3) {
          uni.navigateTo({
            url: `/page_commodity/order/pages/entityOrder?commodityList=${JSON.stringify(
              goodsCart
            )}&isCollage=true&groupId=${this.collageData.groupId}&ifActivity=true`,
          });
        } else {
          uni.navigateTo({
            url: `/page_commodity/order/pages/collageOrder?commodityList=${JSON.stringify(
              goodsCart
            )}&isCollage=true&groupId=${this.collageData.groupId}&ifActivity=true`,
          });
        }
        wx.requestSubscribeMessage({
          tmplIds: [sucCollageTip[baseInfo.CHANNEL], failCollageTip[baseInfo.CHANNEL]],
        });
      },
      // 订单详情
      handleDetail() {
        if (this.collageData.commodityType == 3) {
          uni.navigateTo({
            url: `/page_commodity/order/pages/entityDetail?id=${this.collageData.orderId}`,
          });
        } else {
          uni.navigateTo({
            url: `/page_commodity/order/pages/orderDetails?id=${this.collageData.orderId}`,
          });
        }
      },
      // 去首页
      goHome() {
        // uni.reLaunch({
        //   url: '/pages/home/index',
        // });
        bottomNavTo('/pages/realHome/index', 2);
      },
    },
  };
</script>
<style lang="scss" scoped>
  .refund-box {
    padding-top: 48rpx;
    margin: 0 60rpx 32rpx 60rpx;
    image {
      width: 112rpx;
      height: 112rpx;
      margin-right: 22rpx;
    }
  }
  .list-box {
    margin: 20rpx 24rpx;
    border-radius: 24rpx;
    background: #ffffff;
    padding: 32rpx;
    .detail-text {
      width: 420rpx;
    }
    .icon-text {
      width: 28rpx;
      height: 28rpx;
    }
  }
  .img-item {
    margin: 48rpx 0;
    image {
      width: 96rpx;
      height: 96rpx;
      border: 2rpx solid #ffffff;
      border-radius: 50%;
      margin: 0 32rpx;
    }
    .table-group {
      padding: 4rpx 10rpx;
      border-radius: 16rpx;
      background-color: #323949;
      color: #ffffff;
      font-size: 20rpx;
      font-weight: 400;
      margin-top: 68rpx;
      position: absolute;
    }
    .ml-8 {
      margin-left: 32rpx;
    }
    .invite-box {
      position: relative;
      .add-image {
        width: 96rpx;
        height: 96rpx;
        border-radius: 50%;
        border: 2rpx solid #ffee83;
        background: #fffcec;
        color: #ffee83;
        font-size: 50rpx;
      }
      .red-spot {
        width: 8rpx;
        height: 8rpx;
        background-color: #fe5c23;
        position: absolute;
        border-radius: 50%;
        right: 0;
      }
    }
  }
  .collage-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 96rpx;
    border-radius: 24rpx;
    font-size: 32rpx;
    font-weight: 700;
    margin-bottom: 32rpx;
  }
  .invite {
    background: linear-gradient(140.2deg, #ff8058 0%, #ff6969 100%);
    color: #ffffff;
  }
  .home {
    border: 2px solid #f0522f;
    color: #f0522f;
  }
  .text-tips {
    text-align: center;
  }
  .fail {
    background-color: #ecedf1;
    color: #ffffff;
  }
  .span-text {
    margin: 0 12rpx;
    width: 120rpx;
  }
  .ellipsis {
    font-size: 32rpx;
    font-weight: 700;
    color: #989ead;
    margin-left: 32rpx;
    letter-spacing: 6rpx;
    margin-bottom: 6rpx;
  }
  .text-detail {
    font-size: 24rpx;
    font-weight: 400;
    color: #989ead;
    width: 420rpx;
    text-align: end;
  }
</style>
