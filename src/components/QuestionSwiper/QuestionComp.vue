<!--
* @desc 题目组件
* @author 戴聪杰
* @date 2022/06/01
-->
<template>
  <view class="flex flex-column">
    <scroll-view :style="{ height: height }" scroll-y="true" scroll-x="false">
      <view class="question-body" v-if="questionData.type === 2">
        <MaterialComp :questionData="questionData" />
      </view>
      <view
        class="question-body"
        :class="questionData.needAnalysis ? 'bg-color-grey' : 'bg-color-white'"
        v-else
      >
        <view class="px-32 bg-color-white">
          <RadioComp
            :questionData="questionData"
            :optionName="optionName"
            :valueName="valueName"
            v-if="questionData.type === 0 || questionData.type === 5 || questionData.type == 4"
          />
          <CheckboxComp
            :optionName="optionName"
            :valueName="valueName"
            :questionData="questionData"
            :userAnswer="questionData.userAnswer"
            v-if="questionData.type === 1"
          />
          <FillComp :questionData="questionData" v-if="questionData.type === 3" />
          <SketchComp :questionData="questionData" v-if="questionData.type === 6" />
        </view>
        <!-- 解析 -->
        <view class="question-analysis" v-show="questionData.needAnalysis || showAnalysis">
          <QuestionAnalysis
            :questionType="questionData.type"
            :childType="questionData.childType"
            :textData="questionData.analysis"
            :type="questionData.type"
            :userAnswer="questionData.userAnswer"
            :answer="questionData.answer"
          />
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
  import RadioComp from './QuestionTypeComp/RadioComp.vue';
  import CheckboxComp from './QuestionTypeComp/CheckboxComp.vue';
  import FillComp from './QuestionTypeComp/FillComp.vue';
  import MaterialComp from './QuestionTypeComp/MaterialComp.vue';
  import SketchComp from './QuestionTypeComp/SketchComp.vue';
  import QuestionAnalysis from './QuestionAnalysis.vue';

  export default {
    name: 'QuestionComp',
    components: {
      RadioComp,
      FillComp,
      CheckboxComp,
      MaterialComp,
      SketchComp,
      QuestionAnalysis,
    },
    props: {
      questionData: {
        type: Object,
        default: () => ({
          type: 0,
        }),
      },
      optionName: {
        type: String,
        default: 'option',
      },
      valueName: {
        type: String,
        default: 'value',
      },
      height: {
        type: String,
        default: '70vh',
      },
    },
    data() {
      return {};
    },
    computed: {
      showAnalysis() {
        return this.$store.getters.getShowType == 1;
      },
    },
    onLoad() {},
    methods: {},
  };
</script>
<style lang="scss" scoped>
  @import '@/common/css/rushQuestion.scss';
  .px-32 {
    padding: 48rpx 32rpx;
  }
  /* #ifdef H5 */
  .question-scroll-bottom {
    padding-bottom: 150rpx;
  }
  /* #endif */
</style>
