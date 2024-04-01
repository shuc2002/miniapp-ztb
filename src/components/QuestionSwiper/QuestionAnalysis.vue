<!--
* @desc  题目文本组件
* @author 戴聪杰
* @date 2021年12月22日
-->
<template>
  <view class="questionAnalysis-box">
    <view class="analysis-mask" />
    <view class="flex">
      <view class="common-text-700 text-size-main"
        >正确答案：<text class="common-green">{{
          questionType === 6 && childType === 6 ? '参考解析' : answer
        }}</text></view
      >
      <view
        class="common-text-700 text-size-main"
        v-if="childType != 6 && childType != 3 && questionType != 6 && questionType != 3"
        >你的答案：<text class="common-blue">{{
          userAnswer ? handleSort(userAnswer) : ''
        }}</text></view
      >
    </view>
    <view class="analysis-box-class text-size-sn">
      <view v-for="(item, index) in textData" :key="index">
        <text v-show="index == 0">【解析】</text>
        <!-- 富文本 -->
        <!-- <view
          v-if="item.type == 4"
          class="my-20 text-align-left"
          v-html="item.content"
          :class="textSize"
        ></view> -->
        <view v-if="item.type == 4" class="my-20 text-align-left" :class="textSize">
          <rich-text :nodes="item.content"></rich-text>
        </view>
        <!-- 文本 -->
        <text v-if="item.type == 3" class="my-20 text-align-left" :class="textSize">
          {{ item.content }}
        </text>
        <!-- 公式 -->
        <view v-if="item.type == 2" class="my-20">
          <image class="gsImg" :src="item.content" mode="widthFix" />
        </view>
        <!-- 图片 -->
        <view v-if="item.type == 1" class="my-20">
          <image class="photoImg" :src="item.content" mode="widthFix" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'data-textare',
    props: {
      type: {
        type: Number,
        default: 0,
      },
      textData: {
        type: Array,
        default: () => [],
      },
      userAnswer: {
        type: Array,
        default: () => [],
      },
      answer: {
        type: String,
        default: '',
      },
      questionType: {
        type: Number,
        default: 0,
      },
      childType: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        typeList: ['单项选择题', '多项选择题', '材料题', '填空题', '判断题', '配伍题', '简述题'],
      };
    },
    computed: {
      textSize() {
        return this.$store.getters.getTextSize;
      },
    },
    methods: {
      handleSort(arr) {
        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < arr.length; j++) {
            if (arr[j] > arr[j + 1]) {
              let tmp = arr[j];
              arr[j] = arr[j + 1];
              arr[j + 1] = tmp;
            }
          }
        }
        return arr.toString().replace(/,/g, '');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .analysis-box-class {
    line-height: 1.5;
    margin-top: 15rpx;
  }
  .questionAnalysis-box {
    padding: 48rpx;
    height: 100%;
    bottom: 0;
    left: 0;
    overflow-y: scroll;
    position: relative;
    .analysis-mask {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }
    &:before {
      content: '';
      width: 0;
      height: 0;
      top: 0;
      right: 80rpx;
      border-width: 15rpx 20rpx 0;
      border-style: solid;
      border-color: #ffffff transparent transparent; /*灰 透明 透明 */
      position: absolute;
    }
    .text-size-main {
      margin-right: 30rpx;
    }
  }
  .gsImg {
    height: 100rpx;
  }
  .photoImg {
    width: 656rpx;
  }
</style>
