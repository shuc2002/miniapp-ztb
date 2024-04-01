<!--
* @desc 产品树组件
* @author 江玉龙
* @date 2022年06月13日
-->
<template>
  <view>
    <view class="children-item">
      <view>
        <view class="chapter-box">
          <image
            src="@/page_commodity/static/course/material.png"
            class="img-style"
            v-if="treeData.type == 0"
          />
          <image
            src="@/page_commodity/static/course/video.png"
            class="img-style"
            v-if="treeData.type == 1"
          />
          <image
            src="@/page_commodity/static/course/exercise.png"
            class="img-style"
            v-if="treeData.type == 2"
          />
          <image
            src="@/page_commodity/static/course/test.png"
            class="img-style"
            v-if="treeData.type == 3"
          />
          <image
            src="@/page_commodity/static/course/broadcast.png"
            class="img-style"
            v-if="treeData.type == 4"
          />
          <view class="text-size-sn common-text-400 common-text name-text truncate">{{
            treeData.name
          }}</view>
        </view>
        <span
          class="tabs-item"
          v-if="treeData.type == 1 && treeData.uncoil && treeData.previewLength"
          >试听{{ treeData.previewLength }}分钟</span
        >
        <span
          class="tabs-item"
          v-if="treeData.type == 0 && treeData.uncoil && treeData.previewLength"
          >试看{{ treeData.previewLength }}页</span
        >
      </view>
      <view class="flex-center">
        <button
          class="btn-start flex-center text-size-xxs"
          v-if="treeData.type == 1 && treeData.uncoil"
          @tap="handleTry()"
          >试看</button
        >
        <view class="icon-display">
          <view
            class="t-icon t-icon-suo icon-style"
            v-if="
              ((treeData.type == 2 || treeData.type == 3 || treeData.type == 0) &&
                treeData.uncoil) ||
                !treeData.uncoil
            "
          />
        </view>
      </view>
    </view>
    <view class="divider" />
  </view>
</template>
<script>
  import { throttle } from '@/page_commodity/courseList/util';
  export default {
    name: 'productList',
    props: {
      treeData: {
        type: Object,
      },
      productId: {
        type: String,
        default: '',
      },
      commodityId: {
        type: String,
        default: '',
      },
    },
    methods: {
      // 点击试看
      handleTry: throttle(async function() {
        if (this.treeData.type == 1) {
          // 视频
          uni.navigateTo({
            url: `/page_commodity/courseList/skipTo?productId=${this.productId}&pdf=${this.treeData.material}&commodityId=${this.commodityId}&unit=${this.treeData.id}&downloadable=${this.treeData.downloadable}&handouts=${this.treeData.handouts}&vid=${this.treeData.videoId}&isTest=true`,
          });
        }
      }),
    },
  };
</script>
<style lang="scss" scoped>
  .children-item {
    margin: 32rpx 0 32rpx 80rpx;
    display: flex;
    justify-content: space-between;
    .chapter-box {
      margin-bottom: 8rpx;
      display: flex;
      align-items: center;
    }
    .img-style {
      width: 32rpx;
      height: 32rpx;
      margin-right: 16rpx;
      margin-top: 4rpx;
    }
    .tabs-item {
      color: #ff9f10;
      background-color: #fffcec;
      border: 2rpx solid #fff1be;
      font-size: 20rpx;
      padding: 6rpx;
      border-radius: 8rpx;
    }
    .btn-start {
      width: 96rpx;
      height: 48rpx;
      border-radius: 56rpx;
      background: #eef2ff;
      color: #475ffd;
      margin: 0;
      &:active {
        opacity: 0.8;
      }
    }
  }
  .icon-display {
    width: 116rpx;
    .icon-style {
      width: 32rpx;
      height: 32rpx;
    }
  }
  .name-text {
    width: 468rpx;
  }
  .divider {
    height: 2rpx;
    background-color: #f5f6fa;
    width: 640rpx;
    margin-left: 76rpx;
  }
</style>
