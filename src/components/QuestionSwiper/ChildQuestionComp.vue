<!--
* @desc 题目组件
* @author 戴聪杰
* @date 2022/06/01
-->
<template>
  <div class="flex flex-column">
    <view class="px-32">
      <RadioComp
        :questionData="questionData"
        v-if="questionData.type === 0 || questionData.type === 5 || questionData.type == 4"
      />
      <CheckboxComp :questionData="questionData" v-if="questionData.type === 1" />
      <FillComp :questionData="questionData" v-if="questionData.type === 3" />
      <SketchComp :questionData="questionData" v-if="questionData.type === 6" />
    </view>
    <view class="question-child-analysis" v-show="questionData.needAnalysis">
      <QuestionAnalysis
        :questionType="questionData.type"
        :textData="questionData.analysis"
        :type="questionData.type"
        :userAnswer="questionData.userAnswer"
        :answer="questionData.answer"
      />
    </view>
  </div>
</template>

<script>
  import RadioComp from './QuestionTypeComp/RadioComp.vue';
  import CheckboxComp from './QuestionTypeComp/CheckboxComp.vue';
  import FillComp from './QuestionTypeComp/FillComp.vue';
  import SketchComp from './QuestionTypeComp/SketchComp.vue';
  import QuestionAnalysis from './QuestionAnalysis.vue';

  export default {
    name: 'ChildQuestionComp',
    components: {
      RadioComp,
      FillComp,
      CheckboxComp,
      SketchComp,
      QuestionAnalysis,
    },
    props: {
      questionData: {
        type: Object,
      },
    },
    computed: {},
    data() {
      return {};
    },
    methods: {},
  };
</script>
<style lang="scss" scoped>
  @import '@/common/css/rushQuestion.scss';
  .question-child-analysis {
    margin-top: 100rpx;
    flex: 1;
    padding-bottom: 100rpx;
    background-color: #f5f6fa;
  }
  .px-32 {
    padding: 0 32rpx;
  }
</style>
