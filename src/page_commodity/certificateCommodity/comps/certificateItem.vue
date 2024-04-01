<template>
  <view class="certificate-item" @tap="gotoDetail">
    <view class="certificate-item-header">
      <!-- <view class="certificate-tag iconfont icon-certificate_2"></view> -->
      <image
        style="width: 40rpx;height: 40rpx;margin-right: 16rpx"
        :src="`${baseStatic}/certificate/title-icon.png`"
      ></image>
      <text>{{ item.name }}</text>
    </view>
    <view class="certificate-item-contain">
      <image style="width: 200rpx;height: 112rpx; margin-right: 16rpx" :src="item.thumbnail" />
      <text>{{ item.commodityName }}</text>
    </view>
  </view>
</template>
<script>
  import { baseStatic } from '@/api/config/index';
  export default {
    name: 'certificate-item',
    components: {},
    props: {
      clickable: {
        type: Boolean,
        default: true, // 默认允许点击
      },
      item: {
        type: Object,
      },
    },
    data() {
      return {
        baseStatic: baseStatic,
      };
    },
    computed: {
      projectId() {
        return this.$store.getters.getProjectId;
      },
    },
    methods: {
      gotoDetail() {
        if (this.clickable) {
          // 只有当clickable为true时才触发
          this.commonFun.routeTo(
            `/page_commodity/certificateCommodity/pages/certificateDetail?id=${this.item.certCourseRecordId}`
          );
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
  .certificate-item {
    margin-top: 24rpx;
    border-radius: 24rpx;
    background: #fff;
    padding: 20rpx 30rpx;
    .certificate-item-header {
      display: flex;
      align-items: center;
      color: #333333;
      font-size: 32rpx;
      font-weight: 600;
      margin-bottom: 32rpx;
      // .certificate-tag {
      //   width: 40rpx;
      //   height: 40rpx;
      //   margin-right: 16rpx;
      // }
    }
    .certificate-item-contain {
      image {
        width: 200rpx;
        height: 112rpx;
        margin-right: 16rpx;
      }
      display: flex;
      color: #333333;
      font-size: 28rpx;
    }
  }
</style>
