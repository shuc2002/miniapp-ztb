<!--
* @desc 做题--简述题
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
    <view class="textarea-box" v-if="!showAnalysis && !questionData.needAnalysis">
      <textarea
        v-model="inputValue"
        placeholder="请输入答案"
        placeholder-class="textarea-placeholder"
        @blur="changeData(inputValue)"
      ></textarea>
    </view>
    <view v-else class="text-size-sn mt-34">
      <view class="common-tip">我的答案</view>
      <view class="common-text">
        {{ inputValue }}
      </view></view
    >
    <button
      v-show="!showAnalysis && !questionData.needAnalysis"
      :class="inputValue == '' ? 'confirm-btn bg-color-unactive' : 'confirm-btn bg-color-blue'"
      @tap="inputValue == '' ? '' : handleAccept()"
      >确认回答</button
    >
  </view>
</template>
<script>
  import DataTextarea from '../DataTextarea.vue';
  export default {
    name: 'SkerchComp',
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
        inputValue: this.questionData.userAnswer ? this.questionData.userAnswer[0] : '',
      };
    },
    watch: {
      'questionData.userAnswer': {
        handler(nv) {
          this.inputValue = nv ? nv.toString() : '';
        },
        deep: true,
      },
    },
    onLoad() {},
    computed: {
      showAnalysis() {
        return this.$store.getters.getShowType == 1;
      },
    },
    methods: {
      // 确认按钮
      handleAccept() {
        uni.$emit('turnLast', {
          userAnswer: [this.inputValue],
          id: this.questionData.id,
          type: this.questionData.type,
          index: this.questionData.index,
        });
      },
      changeData(data) {
        uni.$emit('changeFill', { userAnswer: [data] });
      },
    },
  };
</script>
<style lang="scss" scoped>
  @import '@/common/css/rushQuestion.scss';
  .textarea-box {
    margin-top: 32rpx;
    padding: 32rpx;
    min-height: 256rpx;
    border-radius: 16rpx;
    background: rgba(245, 246, 250, 1);
  }
  .mt-34 {
    margin-top: 34rpx;
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
