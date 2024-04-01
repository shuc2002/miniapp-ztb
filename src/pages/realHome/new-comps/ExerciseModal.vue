<!--
* @desc 每日一练弹窗组件
* @author lwx
* @date 2023年08月29日
-->
<template>
  <view>
    <view class="exercise-content" v-if="showModal" @tap.stop="cancel()">
      <view class="exercise-box">
        <view class="exercise-title">做题记录</view>
        <view class="exercise-record-text top-01">您上次做到了第<text class="number-text">{{ doneNum }}</text>题</view>
        <view class="exercise-record-text top-02">请问是否继续?</view>
        <view class="btn-box">
          <button class="exercise-btn redo-btn" @tap="toReStart">重新练习</button>
          <button class="exercise-btn continue-btn" @tap="toContinue">继续做题</button>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
  export default {
    name: 'exerciseModal',
    components: {},
    data() {
      return {
        showModal: false,
      };
    },
    props: {
      doneNum: {
        type: Number,
        default: 0,
      },
    },
    methods: {
      // 关闭弹窗
      cancel() {
        this.showModal = false;
      },
      // 重新练习
      toReStart() {
        this.$emit('toReStart');
      },
      // 继续做题
      toContinue() {
        this.$emit('toContinue');
      }
    },
  };
</script>
<style lang="scss" scoped>
  .exercise-content {
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
    .exercise-box {
      width: 602rpx;
      border-radius: 24rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 64rpx;
      background: #ffffffff;
      .exercise-title {
        color: #323949;
        font-size: 36rpx;
        font-weight: 700;
        line-height: 36rpx;
      }
      .exercise-record-text {
        color: #323949;
        font-size: 32rpx;
        line-height: 32rpx;
        .number-text {
           color: #E51600;
        }
      }
      .top-01 {
        margin-top: 20rpx;
      }
      .top-02 {
        margin-top: 10rpx;
      }
      .btn-box {
        display: flex;
        margin-top: 48rpx;
        margin-bottom: 56rpx;
        .exercise-btn {
          width: 245rpx;
          height: 96rpx;
          border-radius: 72rpx;
          font-size: 32rpx;
          font-weight: 700;
          text-align: center;
          line-height: 96rpx;
        }
        .redo-btn {
          border: 2rpx solid #ecedf1;
          background: #ffffff;
          color: #4e5969;
          margin-right: 16rpx;
        }
        .continue-btn {
          background: #e51600;
          color: #ffffff;
        }
      }
    }
  }

</style>
