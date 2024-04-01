<template>
  <view class="certificate-item-box">
    <view class="pass-tag" v-if="examItem.isPassedExam">合格</view>
    <view class="exam-content">
      <image src="@/static/svgs/exams.svg" alt="" />
      <text>{{ examItem.examName }}</text>
    </view>
    <view class="exam-bottom">
      <view class="exam-num">
        <!-- <view class="press">
          <view class="press-inner" :style="{ width: pessWidth }"></view>
        </view> -->
        <text>{{ examItem.score ? `${examItem.score}分` : '暂无成绩' }}</text>
      </view>
      <view class="exam-button" @tap="gotoScore">{{
        examItem.isPassedExam ? '查看' : '考试'
      }}</view>
    </view>
  </view>
</template>
<script>
  import { fetchCheckExam } from '@/api/modules/certificate/index';
  export default {
    name: 'exam-item',
    props: {
      examItem: {
        type: Object,
      },
    },
    data() {
      return {};
    },
    computed: {
      projectId() {
        return this.$store.getters.getProjectId;
      },
      pessWidth() {
        return this.examItem.num * 80 + 'rpx';
      },
    },
    methods: {
      async gotoScore() {
        if (this.examItem.isPassedExam) {
          this.commonFun.routeTo(
            `/page_commodity/certificateCommodity/pages/certificateScore?code=${this.examItem.code}`
          );
        } else {
          let res = await fetchCheckExam({
            code: this.examItem.code,
            unitId: this.examItem.examId,
            certificateId: this.examItem.certificateId,
          });
          if (res.body.status == 2) {
            // 跳转考试页
            uni.navigateTo({
              url: `/page_mockExam/paperCover/index?id=${this.examItem.examId}&productId=${this.examItem.productId}&isBought=true&certId=${this.examItem.certificateId}&cerType=1`,
            });
          } else if (res.body.status == 0) {
            this.commonFun.routeTo(
              `/page_commodity/certificateCommodity/pages/certificateScore?code=${this.examItem.code}`
            );
          } else {
            // 计算中
            this.commonFun.routeTo(
              `/page_commodity/certificateCommodity/pages/certificateScore?code=${this.examItem.code}&examName=${this.examItem.examName}&realName=${this.examItem.realName}`
            );
          }
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
  .certificate-item-box {
    position: relative;
    background: #f6f6f6;
    padding: 32rpx 24rpx;
    border-radius: 16rpx;
    overflow: hidden;
    .exam-content {
      font-size: 28rpx;
      font-weight: 600;
      display: flex;
      align-items: center;
      image {
        width: 26rpx;
        height: 28rpx;
        margin-right: 20rpx;
      }
    }
    .exam-bottom {
      margin-left: 46rpx;
      margin-top: 8rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .exam-num {
        display: flex;
        align-items: center;
        color: #9fa1a4;
        font-size: 24rpx;
        font-weight: 400;
      }
      .press {
        width: 80rpx;
        height: 12rpx;
        border-radius: 8rpx;
        background: #e5e6eb;
        margin-right: 16rpx;
        position: relative;
        .press-inner {
          position: absolute;
          left: 0;
          top: 0;
          z-index: 1;
          max-width: 80rpx;
          height: 12rpx;
          border-radius: 8rpx;
          background: #e51600;
        }
      }
      .exam-button {
        background: #fde8e6;
        display: flex;
        width: 112rpx;
        height: 48rpx;
        color: #e51600;
        font-size: 24rpx;
        font-weight: 400;
        padding: 20rpx 16rpx;
        justify-content: center;
        align-items: center;
        border-radius: 72rpx;
        border: 2rpx solid #f7b2aa;
      }
    }
    .pass-tag {
      position: absolute;
      right: 0rpx;
      top: 0rpx;
      width: 62rpx;
      height: 34rpx;
      background: #5cc9a5;
      border-radius: 0rpx 0rpx 0rpx 20rpx;
      color: #ffffff;
      font-size: 20rpx;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
