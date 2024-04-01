<template>
  <view class="info-box study-info-box">
    <text class="info-header">学习信息</text>
    <view class="info-from">
      <text>学习时长</text>
      <text class="info-val">{{ item.classHours }}</text>
    </view>
    <view class="study-prees">
      <view class="study-num"
        ><text>学习进度：</text><text class="num">{{ pessWidth }}</text>
      </view>
      <view class="press">
        <view class="press-inner" :style="{ width: pessWidth }"></view>
      </view>
    </view>
    <view class="info-action" v-if="showAction">
      <view class="info-button info-active-button" @tap="gotoExam">去学习</view>
    </view>
  </view>
</template>
<script>
  export default {
    name: 'study-info',
    props: {
      studyItem: {
        type: Object,
      },
    },
    data() {
      return {
        item: {},
      };
    },
    computed: {
      projectId() {
        return this.$store.getters.getProjectId;
      },
      pessWidth() {
        return (this.item.processPercent ? this.item.processPercent * 100 : 0) + '%';
      },
      showAction() {
        let show = true;
        // 学习前，未填写报名信息或未审核通过
        if (this.item.checkTime == 1 && this.item.registrationStatus != 1) {
          show = false;
        }
        return show;
      },
    },
    mounted() {
      this.item = this.studyItem;
    },
    watch: {
      studyItem: {
        handler(val) {
          this.item = val;
        },
        immediate: false,
        deep: true,
      },
    },
    methods: {
      gotoExam() {
        this.commonFun.routeTo(
          `/page_commodity/courseList/index?certificateId=${this.item.certificateId}`
        );
      },
    },
  };
</script>
<style lang="scss" scoped>
  @import './info.scss';
  .study-info-box {
    position: relative;
    .study-prees {
      margin-top: 32rpx;
      padding: 20rpx 16rpx;
      border-radius: 8rpx;
      background: #f7f8fa;
      .study-num {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #9fa1a4;
        font-size: 24rpx;
        font-weight: 600;
        .num {
          color: #333333;
        }
      }
      .press {
        width: 100%;
        height: 12rpx;
        border-radius: 8rpx;
        background: #e5e6eb;
        margin-top: 16rpx;
        position: relative;
        .press-inner {
          position: absolute;
          left: 0;
          top: 0;
          z-index: 1;
          height: 12rpx;
          border-radius: 8rpx;
          background: #e51600;
        }
      }
    }
  }
</style>
