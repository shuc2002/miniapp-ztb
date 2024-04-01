<!--
* @desc  题目文本组件
* @author 戴聪杰
* @date 2021年12月22日
-->
<template>
  <view class="flex questionStem-box">
    <view v-for="(item, index) in textData" :key="index" class="type-box" style="width: 100%;">
      <text v-show="showNum && index == 0" class="common-tip common-text-700 text-size-sn">{{
        keyNum + 1 + '.'
      }}</text>
      <text class="text-box flex-center" v-if="!showType && index == 0" :class="textSize">{{
        alias ? alias : typeList[type]
      }}</text>
      <!-- 富文本 -->
      <!-- <view
        v-if="item.type == 4"
        class="my-20 text-align-left"
        :class="textSize"
        v-html="item.content"
      >
      </view> -->
      <view
        v-if="item.type == 4"
        class="my-20 text-align-left"
        :class="textSize"
        style="width: 100%;"
      >
        <rich-text :nodes="item.content | formatRichText"></rich-text>
      </view>
      <!-- 文本 -->
      <text v-if="item.type == 3" class="my-20 text-align-left" :class="textSize">
        {{ item.content }}
      </text>
      <!-- 公式 -->
      <view v-if="item.type == 2" class="my-20">
        <image :src="item.content" mode="aspectFit" />
      </view>
      <!-- 图片 -->
      <view v-if="item.type == 1" class="my-20">
        <image :src="item.content" mode="aspectFit" />
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
      alias: {
        type: String,
        default: '',
      },
      textData: {
        type: Array,
        default: () => [],
      },
      showType: {
        type: Boolean,
        default: false,
      },
      showNum: {
        type: Boolean,
        default: false,
      },
      keyNum: {
        type: Number,
        default: 0,
      },
    },
    computed: {
      textSize() {
        return this.$store.getters.getTextSize;
      },
    },
    data() {
      return {
        typeList: ['单项选择题', '多项选择题', '材料题', '填空题', '判断题', '配伍题', '论述题'],
      };
    },
    methods: {},
    filters: {
      formatRichText(html) {
        //控制小程序中图片大小
        let newContent = html.replace(/<img[^>]*>/gi, function(match) {
          match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
          match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
          match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
          return match;
        });
        newContent = newContent.replace(/style="[^"]+"/gi, function(match) {
          match = match
            .replace(/width:[^;]+;/gi, 'max-width:100%;')
            .replace(/width:[^;]+;/gi, 'max-width:100%;');
          return match;
        });
        newContent = newContent.replace(/<br[^>]*\/>/gi, '');

        newContent = newContent.replace(
          /<img/gi,
          '<img style="max-width:100%;height:auto;display:inline-block;margin:10rpx auto;"'
        );
        return newContent;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .questionStem-box {
    flex-wrap: wrap;
    align-items: center;
    .common-tip {
      margin-right: 16rpx;
    }

    .text-box {
      margin-top: 8rpx;
      margin-right: 16rpx;
      padding: 0 8rpx;
      height: 32rpx;
      color: #475ffd;
      font-size: 20rpx;
      font-weight: 400;
      border-radius: 8rpx;
      border: 2rpx solid #dae2ff;
    }
    .text-align-left {
      line-height: 1.5;
    }
  }
  .question-first {
    display: none;
    &:first-child {
      display: block;
    }
  }
  .type-box {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
  }
</style>
