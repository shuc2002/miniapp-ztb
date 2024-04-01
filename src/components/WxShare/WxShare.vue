<template>
  <cover-view class="share-mask" v-if="showModal" @tap.stop="close()">
    <cover-image class="share-img" :src="`${baseStatic}/mine/share_info.png`" />
    <text class="share-tit">{{ title }}</text>
    <text class="share-info">{{ subTitle }}</text>
  </cover-view>
</template>

<script>
  import { baseStatic } from '@/api/config/index';
  export default {
    name: 'WxShare',
    data() {
      return {
        showModal: false,
        baseStatic: baseStatic,
      };
    },
    props: {
      title: {
        type: String,
        default: '立即分享给好友吧',
      },
      subTitle: {
        type: String,
        default: '点击屏幕右上角将本页面分享给好友',
      },
    },
    methods: {
      close() {
        this.showModal = false;
      },
    },
  };
</script>

<style scoped lang="scss">
  .share-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 999999999999999;
    .share-img {
      position: absolute;
      right: 0;
      top: 48rpx;
      right: 32rpx;
      width: 280rpx;
      height: 260rpx;
    }
    .share-tit {
      position: absolute;
      top: 434rpx;
      color: #ffffff;
      width: 100%;
      text-align: center;
      font-size: 40rpx;
      font-style: normal;
      font-weight: 600;
    }
    .share-info {
      color: #ffffff;
      text-align: center;
      position: absolute;
      width: 100%;
      top: 512rpx;
      font-size: 28rpx;
      font-weight: 400;
    }
  }
</style>
