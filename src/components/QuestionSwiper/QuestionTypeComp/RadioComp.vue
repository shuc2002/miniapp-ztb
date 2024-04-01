<!--
* @desc 做题--单选题
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
    <!-- 选项 start -->
    <view
      v-for="(data, key) in questionData.options"
      :key="key"
      class="option-box flex-start"
      @tap="showAnalysis || questionData.needAnalysis ? '' : selectOption(data)"
      :class="radioClass[key]"
    >
      <view class="text-size-main radio-optionName flex-center">
        {{ data[optionName] }}
      </view>
      <OptionTextarea :optionType="data[valueName].type" :optionValue="data[valueName].content" />
    </view>
    <!-- 选项 end -->
  </view>
</template>
<script>
  import DataTextarea from '../DataTextarea.vue';
  import OptionTextarea from '../OptionTextarea.vue';

  export default {
    name: 'RadioComp',
    components: {
      DataTextarea,
      OptionTextarea,
    },
    props: {
      questionData: {
        type: Object,
      },
      optionName: {
        type: String,
        default: 'option',
      },
      valueName: {
        type: String,
        default: 'value',
      },
    },
    computed: {
      showAnalysis() {
        return this.$store.getters.getShowType == 1;
      },
      radioClass() {
        let list = [];
        this.questionData.options &&
          this.questionData.options.map((data) => {
            let item = !this.showAnalysis
              ? this.questionData.userAnswer
                ? this.questionData.userAnswer.indexOf(data[this.optionName]) > -1
                  ? 'radio'
                  : 'no-select'
                : 'no-select'
              : this.questionData.answer.indexOf(data[this.optionName]) > -1
              ? 'option-right'
              : this.questionData.userAnswer.indexOf(data[this.optionName]) > -1
              ? 'option-error'
              : 'no-select';
            list.push(item);
          });
        return list;
      },
    },
    data() {
      return {};
    },
    methods: {
      selectOption(data) {
        // 单选题进行答案处理
        uni.$emit('changeRadio', {
          id: this.questionData.id,
          supplierId: this.questionData.supplierId,
          userAnswer: [data[this.optionName]],
          index: this.questionData.index,
        });
      },
    },
  };
</script>
<style lang="scss" scoped>
  @import '@/common/css/rushQuestion.scss';
</style>
