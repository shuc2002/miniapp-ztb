<!--
* @desc 做题--填空题
* @author daisitin
* @date 2022年06月14日
-->
<template>
  <view>
    <!-- 题干 start -->
    <DataTextarea
      :alias="questionData.alias"
      :textData="questionData.vignette"
      :type="questionData.type"
    />
    <!-- 题干 end -->
    <view>
      <view v-for="(_, index) in userAnswer" :key="index">
        <view class="flex-center-box input-box">
          <view class="flex">
            <p class="mr-16">{{ index + 1 }}.</p>
            <textarea
              v-model="userAnswer[index]"
              :disabled="questionData.needAnalysis"
              :placeholder="`请输入第${index + 1}题答案`"
              class="text-left"
              @input="changeData(userAnswer)"
            ></textarea>
          </view>
          <image
            v-show="questionData.needAnalysis"
            :src="
              answerRight[index] ? '../../../static/img/right.png' : '../../../static/img/wrong.png'
            "
            class="icon-answer"
            mode="scaleToFill"
          />
        </view>
      </view>
    </view>
    <button
      v-show="!questionData.needAnalysis"
      :class="hasAnswer ? 'confirm-btn bg-color-blue' : 'confirm-btn bg-color-unactive'"
      @tap="hasAnswer ? handleAccept() : ''"
      >确认回答</button
    >
  </view>
</template>
<script>
  import DataTextarea from '../DataTextarea.vue';
  export default {
    name: 'CompatibilityComp',
    components: {
      DataTextarea,
    },
    props: {
      questionData: {
        type: Object,
      },
    },
    data() {
      return {
        // userAnswer: [],
      };
    },
    watch: {
      questionData: {
        handler() {
          // const { userAnswer, judge =[] } = nv;
          // let answerRes = userAnswer ? userAnswer : new Array(judge.length).fill('');
          // console.log('bbb---', answerRes);
          // this.userAnswer = [...answerRes];
        },
        deep: true,
        immediate: true,
      },
    },
    computed: {
      userAnswer() {
        const { userAnswer, judge = [] } = this.questionData;
        let answerRes = userAnswer ? userAnswer : new Array(judge.length).fill('');
        return answerRes;
      },
      answerRight() {
        let list = [];
        this.questionData.userAnswer.map((data, index) => {
          let item = this.questionData.judge[index].includes(data) && data != '';
          list.push(item);
        });
        return list;
      },
      hasAnswer() {
        return this.userAnswer.toString().replace(/,/g, '');
      },
    },
    methods: {
      // 确认按钮
      handleAccept() {
        uni.$emit('turnLast', {
          userAnswer: this.userAnswer,
          id: this.questionData.id,
          type: this.questionData.type,
          index: this.questionData.index,
        });
      },
      changeData(data) {
        uni.$emit('changeFill', { userAnswer: data });
      },
    },
  };
</script>
<style lang="scss" scoped>
  @import '@/common/css/rushQuestion.scss';
  .input-box {
    margin-top: 32rpx;
    height: 96rpx;
    border-radius: 16rpx;
    background: rgba(245, 246, 250, 1);
    display: flex;
    align-items: center;
    padding: 0 32rpx;
  }
  .mr-16 {
    margin-right: 16rpx;
  }
  .icon-answer {
    flex-shrink: 0;
    width: 40rpx;
    height: 40rpx;
  }
  .text-left {
    width: 70vw;
    height: 50rpx;
    text-align: left;
  }
  /* #ifdef MP-TOUTIAO */
  .bg-color-blue {
    background-color: #475ffd;
  }
  .bg-color-unactive {
    background-color: #dae2ff;
  }
  /* #endif */
</style>
