<!--
* @desc 做题--素材题
* @author daisitin
* @date 2022年06月14日
-->
<template>
  <view>
    <!-- 题干 start -->
    <view class="p-box">
      <DataTextarea
        :alias="questionData.alias"
        :textData="questionData.publicVignette"
        :type="questionData.type"
      />
    </view>
    <view class="childBox" :class="boxClass" @tap="changeOpen">
      <view class="childBox-btn flex-center"
        ><view class="t-icon" :class="isOpen === 1 ? ' t-icon-chevron-down' : ' t-icon-chevron-up'"
      /></view>
      <view class="child-content" @tap.stop="">
        <ChildQuestionComp :questionData="childQuestion" />
      </view>
    </view>
    <!-- 题干 end -->
  </view>
</template>
<script>
  import DataTextarea from '../DataTextarea.vue';
  import ChildQuestionComp from '@/components/QuestionSwiper/ChildQuestionComp.vue';

  export default {
    name: 'MaterlComp',
    components: {
      DataTextarea,
      ChildQuestionComp,
    },
    props: {
      questionData: {
        type: Object,
      },
    },
    data() {
      return {
        isOpen: 0,
        panStyle: '',
      };
    },
    onLoad() {
      this.getData();
    },
    computed: {
      childQuestion() {
        const { userAnswer, judge = [], childType } = this.questionData;
        let result = {
          ...this.questionData,
          alias: '',
          type: childType,
          userAnswer: userAnswer ? userAnswer : new Array(judge.length).fill(''),
        };
        return result;
      },
      boxClass() {
        return this.isOpen == 1 ? 'max-box' : this.isOpen == 2 ? 'min-box' : '';
      },
    },
    methods: {
      changeOpen() {
        //1是打开状态，2是关闭状态
        if (this.isOpen === 1) {
          this.isOpen = 2;
        } else {
          this.isOpen = 1;
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
  .p-box {
    padding: 30rpx 32rpx 200rpx 32rpx;
  }
  .childBox {
    width: 100%;
    padding-top: 50rpx;
    box-shadow: 0 -3px 2px #dcdde8;
    background: #ffffff;
    position: fixed;
    height: 10vh;
    bottom: 0;
    .child-content {
      overflow-y: scroll;
      height: calc(100% - 100rpx);
      padding-bottom: 100rpx;
    }
    .childBox-btn {
      position: absolute;
      width: 168rpx;
      height: 24rpx;
      opacity: 1;
      background: #ffffff;
      box-shadow: 0 -3px 2px #dcdde8;
      border-radius: 50rpx 50rpx 0 0;
      top: -20rpx;
      left: 50%;
      transform: translate(-50%);
    }
  }
  .max-box {
    animation: toOpen 0.5s linear 0s;
    animation-fill-mode: forwards;
  }
  .min-box {
    animation: toClose 0.5s linear 0s;
    animation-fill-mode: forwards;
  }
  @keyframes toClose {
    from {
      height: 70vh;
    }
    to {
      height: 10vh;
    }
  }
  @keyframes toOpen {
    from {
      height: 10vh;
    }
    to {
      height: 70vh;
    }
  }
</style>
