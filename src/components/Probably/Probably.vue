<!--
* @desc 我的粉丝页面
* @author 江玉龙
* @date 2022年08月10日
-->
<template>
  <view>
    <view class="head-box" @tap="handleKnow" :style="{ '--margin': margin }">
      <p>可能认识的人</p>
      <view class="flex-center">
        <image
          v-for="(item, idx) in photoList"
          :key="idx"
          class="photo-img"
          :src="item"
          mode="scaleToFill"
        />
        <view class="t-icon t-icon-chevron-right icon-right" />
      </view>
    </view>
    <BottomModal ref="bottom">
      <view slot="head">
        <view class="head-text">可能认识的人</view>
      </view>
      <view slot="body">
        <scroll-view style="height: 36vh" scroll-y="true" scroll-with-animation class="scroll-box">
          <view class="list-box" v-for="item in 5" :key="item">
            <view class="flex-center">
              <image src="@/static/img/empty/order.png" />
              <view>
                <view class="flex-item-center">
                  <p class="text-size-sn common-text">刘华</p>
                  <view class="relation">同事</view>
                </view>
                <p class="address">朝阳凌和望京医院</p>
              </view>
            </view>
            <view class="follow-btn flex-center">关注</view>
          </view>
        </scroll-view>
        <view class="all-follow flex-center">一键关注</view>
      </view>
    </BottomModal>
  </view>
</template>
<script>
  import BottomModal from '@/components/BottomModal/BottomModal.vue';
  export default {
    name: 'probably',
    components: {
      BottomModal,
    },
    props: {
      photoList: {
        type: Array,
        default: () => [],
      },
      margin: {
        type: String,
        default: '',
      },
    },
    data() {
      return {};
    },
    methods: {
      // 打开弹窗
      handleKnow() {
        this.$refs.bottom.showCover = true;
      },
    },
  };
</script>
<style lang="scss" scoped>
  $margin: var(--margin);
  .head-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: $margin;
    height: 88rpx;
    background-color: #fffcec;
    border-radius: 16rpx;
    border: 2rpx solid #fff1be;
    padding: 0 24rpx;
    p {
      font-size: 24rpx;
      font-weight: 700;
      color: #8c513e;
    }
    .photo-img {
      border: 2rpx solid #ffffff;
      width: 40rpx;
      height: 40rpx;
      border-radius: 50%;
      margin-left: -16rpx;
      &:first-child {
        margin: 0;
      }
    }
    .icon-right {
      width: 40rpx;
      height: 40rpx;
      margin-left: 16rpx;
    }
  }
  .head-text {
    font-size: 32rpx;
    font-weight: 700;
    color: #2c364e;
    text-align: center;
    margin-bottom: 22rpx;
  }
  .all-follow {
    color: #ffffff;
    font-size: 32rpx;
    font-weight: 700;
    width: 654rpx;
    height: 96rpx;
    border-radius: 24rpx;
    background-color: #475ffd;
    margin: 48rpx 48rpx 0 48rpx;
  }
  .list-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 32rpx 32rpx 32rpx;
    image {
      width: 96rpx;
      height: 96rpx;
      border: 2px solid #ffffff;
      margin-right: 32rpx;
    }
    .relation {
      padding: 4rpx 12rpx;
      margin-left: 8rpx;
      background-color: #ffee83;
      border-radius: 36rpx;
      font-size: 20rpx;
      color: #8c513e;
    }
    .address {
      font-size: 24rpx;
      font-weight: 400;
      color: #989ead;
      margin-top: 8rpx;
    }
    .follow-btn {
      width: 128rpx;
      height: 56rpx;
      border-radius: 56rpx;
      font-size: 24rpx;
      color: #475ffd;
      border: 2rpx solid #475ffd;
    }
  }
</style>
