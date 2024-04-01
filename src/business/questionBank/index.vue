<!--
* @desc 题库科目列表
* @author daisitin
* @date 2022年04月22日
-->
<template>
  <view>
    <view v-for="(item, index) in subjectList" :key="index" class="subject-card">
      <view class="subject-list-item">
        <p class="text-size-sn common-text">{{ item.productName }}</p>
        <view class="text-size-xxs common-tip text-box"
          ><text>刷题数： {{ item.doSrcCount + '/' + item.srcCount }}</text
          ><text class="text-item">正确率：{{ item.correctRate }}%</text></view
        >
      </view>
      <view class="button-flex" v-if="item.srcStatus == 0">
        <button class="start-button">开始做题</button>
        <view class="t-icon t-icon-chevron-right" />
      </view>
      <view class="button-flex" v-if="item.srcStatus == 1">
        <button class="question-button" @tap="handleTopic(item.doSrcCount)">继续做题</button>
        <view class="t-icon t-icon-chevron-right" />
      </view>
    </view>
    <ProceedModal ref="point" :problemNum="problemNum" />
  </view>
</template>
<script>
  import ProceedModal from './comps/ProceedModal.vue';
  export default {
    name: 'order',
    components: {
      ProceedModal,
    },
    onLoad() {
      this.getProductList();
    },
    data() {
      return {
        subjectList: [],
        problemNum: 0,
      };
    },
    methods: {
      async getProductList() {},
      handleTopic(num) {
        this.$refs.point.showModal = true;
        this.problemNum = num;
      },
    },
  };
</script>
<style lang="scss" scoped>
  .subject-card {
    margin: auto 32rpx 24rpx 32rpx;
    padding: 32rpx;
    width: calc(100% - 128rpx);
    height: 156rpx;
    border-radius: 16rpx;
    background: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .text-box {
      margin-top: 28rpx;
      .text-item {
        margin-left: 12rpx;
      }
    }
    .button-flex {
      display: flex;
      align-items: center;
      .question-button {
        width: 144rpx;
        height: 48rpx;
        border-radius: 36rpx;
        background: #eef2ff;
        color: #475ffd;
        font-size: 24rpx;
        font-weight: 700;
        text-align: center;
        line-height: 48rpx;
        &:active {
          opacity: 0.8;
        }
      }
      .start-button {
        width: 144rpx;
        height: 48rpx;
        border-radius: 36rpx;
        background: #475ffd;
        color: #eef2ff;
        font-size: 24rpx;
        font-weight: 700;
        text-align: center;
        line-height: 48rpx;
        &:active {
          opacity: 0.8;
        }
      }
    }
  }
</style>
