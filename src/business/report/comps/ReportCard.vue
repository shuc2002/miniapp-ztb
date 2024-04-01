<!--
* @desc 学习报告卡片
* @author daisitin
* @date 2022年04月25日
-->
<template>
  <view class="report-card" :class="isFull ? 'full-bg' : 'unfull-bg'">
    <view
      :class="['report-tip', 'text-size-xxl common-text-700', isFull ? 'full-tip' : 'unfull-tip']"
      >{{ sloganText }}</view
    >

    <DcjProgress :proportion="proportion" />
    <view class="text-size-xxs common-tip common-text-400">{{ tipText }}</view>
  </view>
</template>
<script>
  import DcjProgress from './Progress.vue';

  export default {
    name: 'progressLine',
    props: {
      tipText: {
        type: String,
        default: '',
      },
      proportion: {
        type: Number,
        default: 0,
      },
      sloganText: {
        type: String,
        default: '',
      },
    },
    components: { DcjProgress },
    computed: {
      isFull() {
        return this.proportion === 100;
      },
    },
    data() {
      return {};
    },
    methods: {},
  };
</script>
<style lang="scss" scoped>
  .report-card {
    width: calc(100% - 64rpx);
    height: 724rpx;
    // height: 456rpx;
    // margin: 16rpx 32rpx;
    text-align: center;
    .report-tip {
      // padding-top: 80rpx;
      padding-top: 208rpx;
    }
    .full-tip {
      color: #5cc9a5;
    }
    .unfull-tip {
      color: #475ffd;
    }
    .text-size-xxs {
      padding: 0 112rpx;
      line-height: 40rpx;
    }
  }

  .full-bg {
    // background-image: url('https://app.static.wangxiao.cn/ztb/fullReport0621.png');
    background-image: url('https://acc.wangxiao.cn/image/100.png');
    background-size: 100% 100%;
    margin: 16rpx 32rpx 32rpx 32rpx;
  }
  .unfull-bg {
    // background-image: url('https://app.static.wangxiao.cn/ztb/unfullReport0621.png');
    background-image: url('https://acc.wangxiao.cn/image/20.png');
    background-size: 100% 100%;
    margin: 16rpx 32rpx 20rpx 32rpx;
  }
</style>
