<!--
* @desc 查看解析头部组件
* @author 江玉龙
* @date 2022年05月31日
-->
<template>
  <view>
    <view class="flex wrong-box">
      <!-- 解析标题 -->
      <view class="project-box">
        <p class="common-text-700 text-size-main common-text project-name">{{ projectName }}</p>
        <p class="common-text-400 common-tip common-text text-size-sn">第 {{ total }} 天</p>
      </view>
      <!-- 是否只看错题 -->
      <view class="flex-center" @tap="handleWrong()" v-show="hasWrong">
        <view :class="showWrong ? 'tick t-icon t-icon-a-Group10525' : 'choose-wrong'" />
        <span class="text-size-sn common-text-400 common-blue">只看错题</span>
      </view>
      <view class="text-size-sn common-text-400 common-tip" v-show="!hasWrong">全答对了</view>
    </view>
  </view>
</template>
<script>
  export default {
    name: 'analysisTop',
    props: {
      showWrong: {
        type: Boolean,
        default: false,
      },
      //能否点击
      hasWrong: {
        type: Boolean,
        default: false,
      },
      total: {
        type: Number,
      },
    },
    computed: {
      projectName() {
        return this.$store.getters.getProjectName;
      },
    },
    methods: {
      // 点击查看错题
      handleWrong() {
        this.$emit('handleWrong', !this.showWrong);
      },
    },
  };
</script>
<style lang="scss" scoped>
  .wrong-box {
    width: 660rpx;
    height: 96rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 32rpx 40rpx;
    .project-box {
      padding: 12rpx 12rpx;
      .project-name {
        width: 400rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: 12rpx;
      }
    }
    .choose-wrong {
      width: 24rpx;
      height: 24rpx;
      border-radius: 8rpx;
      border: 2rpx solid #475ffd;
      margin-right: 8rpx;
    }
    .tick {
      width: 24rpx;
      height: 24rpx;
      border-radius: 8rpx;
      border: 2rpx solid #ecedf1;
      margin-right: 8rpx;
    }
  }
</style>
