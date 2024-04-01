<template>
  <view class="block-box">
    <view class="flex p-relative">
      <!-- <image src="@/page_mockExam/static/certificate/sheet-icon.png" mode="scaleToFill" /> -->
      <image :src="`${baseStatic}/certificate/sheet-icon.png`" mode="scaleToFill"></image>
      <p class="text-size-main common-text-700">答题卡</p>
      <view class="anwser-analysis" @tap="goRouteTo('查看解析')"
        >查看解析 <view class="more iconfont icon-more_small_3"></view
      ></view>
    </view>
    <scroll-view :scroll-y="true" class="anwser-sheept">
      <view v-for="(data, key) in bottomList" :key="key">
        <p>{{ data.groupName }}</p>
        <view class="flex-wrap flex">
          <view
            v-for="(item, index) in data.list"
            :key="index"
            class="answer-box flex-center"
            :class="
              item.choose == true
                ? 'option-right-plain'
                : item.choose == false
                ? 'option-error-plain'
                : ''
            "
            @tap="goRouteTo('答题卡', item)"
            >{{ item.name }}</view
          >
        </view>
      </view>
    </scroll-view>
  </view>
</template>
<script>
  import { baseStatic } from '@/api/config/index';
  export default {
    name: 'exam-card',
    components: {},
    data() {
      return {
        baseStatic: baseStatic,
        // paper: {},
        // bottomList: [
        //   {
        //     groupName: '选择题',
        //     list: [
        //       { choose: true, name: 1 },
        //       { choose: false, name: 2 },
        //       { choose: null, name: 3 },
        //     ],
        //   },
        // ],
      };
    },
    props: {
      bottomList: {
        type: Array,
      },
      paper: {
        type: Object,
      },
    },
    computed: {
      projectId() {
        return this.$store.getters.getProjectId;
      },
      avatar() {
        return this.$store.getters.getAvatar || '../../static/img/mine/default-Avatar.png';
      },
      cardString() {
        return JSON.stringify(this.bottomList);
      },
      cardAllList() {
        return JSON.stringify(this.paper.cardGroup);
      },
    },
    onLoad() {},
    onShow() {},
    methods: {
      goRouteTo(index, item) {
        switch (index) {
          case '答题卡':
            uni.navigateTo({
              url: `/page_mockExam/paperContent/index?analysis=true&card=${this.cardString}&index=${item.index}&cardAllList=${this.cardString}`,
            });
            break;
          case '错题重做':
            uni.navigateTo({
              url: '/business/myRecords/index?activeNum=0',
            });
            break;
          case '查看解析':
            uni.navigateTo({
              url: `/page_mockExam/paperContent/index?analysis=true&card=${this.cardString}&index=0&cardAllList=${this.cardAllList}`,
            });
            break;
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
  @import '@/common/css/rushQuestion.scss';
  .block-box {
    background-color: #ffffff;
    padding: 24rpx;
    // margin: 24rpx 24rpx 0 24rpx;
    border-radius: 24rpx;
    line-height: 1.5;
    image {
      width: 48rpx;
      height: 48rpx;
      margin-right: 16rpx;
    }
    .tip-box {
      border-radius: 16rpx;
      background-color: #f5f6fa;
      margin: 48rpx 0 16rpx 0;
      height: 76rpx;
      line-height: 76rpx;
      text-align: center;
    }
  }
  .p-relative {
    position: relative;
  }
  .anwser-analysis {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0rpx;
    top: 0rpx;
    color: #9fa1a4;
    font-size: 28rpx;
    font-weight: 400;
    .more {
      display: flex;
      align-items: center;
      margin-left: 5rpx;
      margin-top: 2rpx;
      font-size: 22rpx;
      color: #9fa1a4;
    }
  }
  .anwser-sheept {
    width: 100%;
    height: 600rpx;
    padding: 0;
    margin: 20rpx 0rpx;
    p {
      margin-left: 16rpx;
      margin-top: 24rpx;
    }
  }
</style>
