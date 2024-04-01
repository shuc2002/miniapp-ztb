<!--
* @desc 商品介绍组件
* @author 江玉龙
* @date 2022年04月20日
-->
<template>
  <view class="name-box" v-if="data.type != 1 && data.activityType !== 4">
    <!-- 商品名称 -->
    <view class="trade-box">
      <view class="unclocked-box">好友已购</view>
      <p class="trade-text common-black">{{ data.name }}</p>
      <p class="common-tip trade-text-second text-size-sn">{{ data.sellingPoint }}</p>
      <view class="flex-center-box" @tap="handleDraw()" v-if="showCoupon && couponList.length > 0">
        <view v-if="couponList.length > 3" class="flex-center">
          <view v-for="(item, key) in couponList.slice(0, 3)" :key="key">
            <CouponName :item="item" />
          </view>
        </view>
        <view v-if="couponList.length <= 3" class="flex-center">
          <view v-for="(item, key) in couponList" :key="key">
            <CouponName :item="item" />
          </view>
        </view>
        <view class="flex-center">
          <p class="common-text-400 text-size-xxs common-price">领券</p>
          <view class="t-icon t-icon-chevron-right-copy right-icon" />
        </view>
      </view>
    </view>
    <!-- 标签 -->
    <view class="tradebox-tip flex" v-if="data.type == 3">
      <view class="trade-item"><view class="circle" />全国包邮</view>
      <view class="trade-item"><view class="circle" />极速发货</view>
    </view>
    <!-- <view class="trade-box flex" v-else>
      <view class="trade-item"><view class="circle" />紧跟大纲</view>
      <view class="trade-item"><view class="circle" />定期更新</view>
    </view> -->
    <BottomModal ref="modal" backgroundColor="#F5F6FA">
      <view slot="head">
        <view class="text-size-main common-text-700 common-text text-title">优惠明细</view>
      </view>
      <view slot="body">
        <scroll-view style="height: 36vh" scroll-y="true" scroll-with-animation class="scroll-box">
          <CouponData
            class="coupon-box"
            v-for="(item, key) in couponList"
            :key="key"
            :data="item"
            :showUser="false"
            @handleUser="handleUser(key)"
            @handleMark="handleMark"
          />
        </scroll-view>
        <button class="cancel-btn" @tap="handleCancel">关闭</button>
      </view>
    </BottomModal>
    <PopupWindow ref="question" title="提示" height="360rpx" :cancelShow="false">
      <p class="text-modal">{{ instructions }}</p>
    </PopupWindow>
  </view>
  <view v-else class="courseintro">
    <p class="tit-text">{{ data.name }}</p>
    <view v-if="data.activityType === 4" class="course-tit">
      <view class="Volumes"
        ><span class="salseVolume">{{ subscribeNumber }}</span
        >人已预约</view
      >
    </view>
    <view v-else class="course-tit">
      <view class="Volumes"
        ><span class="salseVolume">{{ followersNum }}</span
        >人已关注</view
      >
      <view @tap="handleDraw()" class="card">领劵</view>
    </view>

    <BottomModal ref="modal" backgroundColor="#F5F6FA">
      <view slot="head">
        <view class="text-size-main common-text-700 common-text text-title">优惠明细</view>
      </view>
      <view slot="body">
        <scroll-view
          style="height: 36vh"
          scroll-y="true"
          scroll-with-animation
          class="scroll-box"
          v-if="couponList.length > 0"
        >
          <CouponData
            class="coupon-box"
            v-for="(item, key) in couponList"
            :key="key"
            :data="item"
            :showUser="false"
            @handleUser="handleUser(key)"
            @handleMark="handleMark"
          />
        </scroll-view>
        <view class="noCard flex-column-center" v-if="couponList.length == 0">
          <image src="@/home/static/img/empty/coupon-empty.png" mode="scaleToFill" />
          <p class="text-size-sn common-text-400 common-tip">暂无优惠券</p>
        </view>
        <button class="cancel-btn" @tap="handleCancel">关闭</button>
      </view>
    </BottomModal>
    <PopupWindow ref="question" title="提示" height="360rpx" :cancelShow="false">
      <p class="text-modal">{{ instructions }}</p>
    </PopupWindow>
  </view>
</template>
<script>
  import CouponData from '@/page_commodity/coupon/comps/CouponData.vue';
  import BottomModal from '@/components/BottomModal/BottomModal.vue';
  import CouponName from '@/components/Coupon/CouponName.vue';
  import PopupWindow from '@/components/PopupComp/PopupWindow.vue';
  export default {
    name: 'introduce',
    components: {
      BottomModal,
      CouponData,
      CouponName,
      PopupWindow,
    },
    props: {
      data: {
        type: Object,
      },
      showCoupon: {
        type: Boolean,
        default: true,
      },
      couponList: {
        type: Array,
        default: () => [],
      },
      subscribeNumber: {
        type: Number,
        default: 0,
      },

      followersNum: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return { instructions: '' };
    },
    methods: {
      // 打开优惠券弹窗
      handleDraw() {
        this.$refs.modal.showCover = true;
      },
      // 关闭优惠券弹窗
      handleCancel() {
        this.$refs.modal.cancel();
      },
      // 领取优惠券
      async handleUser(key) {
        this.$emit('handleUser', key);
      },
      // 使用说明
      handleMark(val) {
        this.instructions = val;
        this.$refs.question.showModal = true;
      },
    },
  };
</script>
<style lang="scss" scoped>
  .name-box {
    margin-bottom: 20rpx;
    background-color: white;
  }
  .unclocked-box {
    padding: 6rpx 10rpx;
    text-align: center;
    border-radius: 8rpx;
    background: #ffee83;
    color: #8c513e;
    font-size: 20rpx;
    float: left;
    margin-right: 12rpx;
    margin-top: 8rpx;
  }
  .trade-box {
    padding: 32rpx;
    background-color: white;
    border-bottom: 1px solid #f5f6fa;
    p {
      word-break: normal;
      white-space: pre-warp;
      word-wrap: break-word;
    }
  }
  .tradebox-tip {
    padding: 0rpx 32rpx 22rpx 32rpx;
    background-color: white;
    border-bottom: 1px solid #f5f6fa;
    p {
      word-break: normal;
      white-space: pre-warp;
      word-wrap: break-word;
    }
  }
  .trade-text {
    line-height: 50rpx;
    font-weight: 600;
  }
  .trade-item {
    color: #989ead;
    font-size: 24rpx;
    margin-right: 32rpx;
    display: flex;
    align-items: center;
  }
  .circle {
    width: 8rpx;
    height: 8rpx;
    border: 2px solid #dae2ff;
    border-radius: 50%;
    margin-right: 10rpx;
    margin-top: 2rpx;
  }
  .trade-text-second {
    margin-top: 20rpx;
    margin-bottom: 24rpx;
  }
  .discount-box {
    padding: 8rpx;
    border: 2rpx solid #f0522f;
    border-radius: 10rpx;
    margin-right: 24rpx;
  }
  .right-icon {
    width: 28rpx;
    height: 28rpx;
  }
  .text-title {
    margin-bottom: 32rpx;
    text-align: center;
  }
  .scroll-box {
    margin-bottom: 140rpx;
    .coupon-box {
      margin-bottom: 24rpx;
    }
  }
  .noCard {
    margin-top: 128rpx;
    margin-bottom: 128rpx;
    image {
      width: 324rpx;
      height: 316rpx;
    }
  }
  .cancel-btn {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 72rpx;
    border-radius: 24rpx;
    font-size: 32rpx;
    font-weight: 700;
    color: #ffffff;
    background: linear-gradient(140.2deg, #ff8058 0%, #ff6969 100%);
    margin: 0 56rpx;
    padding: 8rpx 0;
  }
  .courseintro {
    background: #fff;
    // margin-bottom: 20rpx;
    padding: 40rpx 26rpx 32rpx;
    .tit-text {
      font-size: 40rpx;
      color: #333333;
      font-weight: 500;
      line-height: 56rpx;
      text-align: left;
      margin-bottom: 24rpx;
    }
    .course-tit {
      position: relative;
      display: flex;
      height: 40rpx;
      line-height: 40rpx;
      justify-content: space-between;
      .Volumes {
        color: #888888;
        font-size: 24rpx;
      }
      .salseVolume {
        color: #ff4200;
      }
      .card {
        position: relative;
        width: 100rpx;
        height: 40rpx;
        line-height: 40rpx;
        background: linear-gradient(90deg, #fe8e2aff 0%, #fd622cff 100%);
        color: #fff;
        font-size: 24rpx;
        text-align: center;
        border-top-left-radius: 40rpx;
        border-bottom-left-radius: 40rpx;
        right: -25rpx;
        // margin: 20rpx 0rpx 20rpx 40rpx;
      }
    }
  }
</style>
