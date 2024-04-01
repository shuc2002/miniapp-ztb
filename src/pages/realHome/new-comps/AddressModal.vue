<!-- 首页补录地址弹窗 -->
<template>
  <!-- <view> -->
    <view class="popup-mask" v-if="showModal" @tap.stop="cancel()">
      <view class="popup-box" @tap.stop>
        <image :src="avatar" mode="scaleToFill" class="avatar" />
        <p class="text-size-main common-text-700 common-text text-item">{{ nickName }}</p>
        <p class="common-text-400 text-size-sn common-text text-ex"
          >您还有1笔订单未填写地址，请尽快补填</p
        >
        <image :src="order.thumbnail" mode="aspectFit" class="order-img" />
        <!-- 底部按钮 -->
        <view class="nav-btn">
          <button class="cancel-btn flex-center" @tap.stop="cancel()">放弃</button>
          <button class="success-btn flex-center" @tap.stop="commonFun.routeTo(`/page_material/login/pages/reFillAddress?orderId=${order.orderId}`)">补填地址</button>
        </view>
      </view>
    </view>
  <!-- </view> -->
</template>
<script>
  export default {
    name: 'AddressModal',
    data() {
      return {
        showModal: false,
      };
    },
    props: {
      order: {
        type: Object,
      },
    },
    computed: {
      nickName() {
        return this.$store.getters.getNickName;
      },
      avatar() {
        return this.$store.getters.getAvatar;
      },
    },
    methods: {
      // 关闭弹窗
      cancel() {
        this.showModal = false;
        this.$emit('cancel');
      },
    },
  };
</script>
<style lang="scss" scoped>
  .popup-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999999999999;
    .popup-box {
      position: relative;
      width: calc(100vw - 150rpx);
      height: 620rpx;
      border-radius: 24rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: linear-gradient(-0.2deg, #ffffff 0%, #f7fafe 81%, #ebf1fd 100%);
      // padding-bottom: 30rpx;
      .text-item {
        margin-top: 96rpx;
        margin-bottom: 16rpx;
        color: #2c364e;
      }
      .text-ex {
        margin-top: 0px;
        padding-top: 0px;
        margin-bottom: 0px;
        line-height: 12px;
      }
      .order-img {
        margin-top: 48rpx;
        // margin: 0rpx 50rpx;
        max-width: 200rpx;
        height: 200rpx;
        object-fit: cover;
      }
      .nav-btn {
        display: flex;
        margin-top: 48rpx;
        .cancel-btn {
          width: 245rpx;
          height: 96rpx;
          line-height: 96rpx;
          border-radius: 72rpx;
          background: #ecedf1;
          border: 2rpx solid #ecedf1;
          color: #4e5969;
          font-size: 32rpx;
          font-weight: 700;
          margin-right: 16rpx;
          &:active {
            opacity: 0.8;
          }
        }
        .success-btn {
          width: 245rpx;
          height: 96rpx;
          line-height: 96rpx;
          border-radius: 72rpx;
          background: #E51600;
          color: #ffffff;
          font-size: 32rpx;
          font-weight: 700;
          &:active {
            opacity: 0.8;
          }
        }
      }
    }
  }
  .avatar {
    width: 144rpx;
    height: 144rpx;
    border-radius: 50%;
    position: absolute;
    top: -72rpx;
    right: calc(50% - 72rpx);
  }
</style>
