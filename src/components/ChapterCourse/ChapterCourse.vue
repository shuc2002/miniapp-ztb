<template>
  <view v-if="list.length > 0">
    <u-tabs
      :list="list"
      :current="currentTabIndex"
      @change="change"
      active-color="#E51600"
      :show-bar="false"
    ></u-tabs>
    <LearnInfo :currentTabIndex="currentTabIndex" :courseInfo="courseInfo" />
  </view>
</template>

<script>
  import LearnInfo from './LearnInfo.vue';
  import { getCourseList } from '@/api/modules/chapterCourse/index';

  export default {
    name: 'ChapterCourse',
    components: {
      LearnInfo,
    },
    data() {
      return {
        currentTabIndex: 0,
        courseInfo: {
          percent: 70,
          learnedProgress: '70%',
          chapterTitle: '建筑经济学(视频)',
          learnedDuration: '00时00分',
          totalDuration: '16时00分',
        },
        list: [
          {
            name: '视频',
            key: 'video',
          },
          {
            name: '资料',
            key: 'data',
          },
          {
            name: '直播',
            key: 'live',
          },
          {
            name: '题库',
            key: 'topic',
          },
        ],
      };
    },
    onReady() {
      // this.getCourseList({ id: 'MER00000015', type: 4 });
    },
    // 分享逻辑
    methods: {
      async getCourseList(index) {
        const result = await getCourseList(index);
        if (result.body) {
          const { courseInfo } = result.body;
          this.courseInfo = courseInfo;
        }
      },
      change(index) {
        this.currentTabIndex = index;
        this.$emit('currentChapterIndex', index);
        const result = this.getCourseList({ index });
        if (result.body) {
          const { courseInfo, list } = result.body;
          this.courseInfo = courseInfo;
          this.list = list;
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .chapter-class {
    color: #333333;
    font-size: 36rpx;
    font-weight: 500;
  }
  .chapter-content-wrap {
    display: flex;
    justify-content: space-around;
  }
  .chapter-right-content-wrap {
    width: 360rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .chapter-detail-title {
      font-size: 32rpx;
      font-weight: 500;
      color: #4e4e4e;
    }
    .chapter-bottom-content-wrap {
      display: flex;
      justify-content: space-between;
      .chapter-learned-status {
        display: flex;
        flex-direction: column;
      }
      .chapter-middle-line {
        border-left: 1px solid #eeeeee;
      }
      .chapter-learned-duration {
        display: flex;
        flex-direction: column;
      }
    }
  }
  .more-learned-knowledge {
    margin-top: 48rpx;
    display: flex;
    justify-content: center;
    ::v-deep button {
      width: 480rpx;
      height: 96rpx;
      border-radius: 72rpx;
      opacity: 1;
      background: #e51600;
    }
    .more-learned-detail {
      font-size: 32rpx;
      font-weight: 600;
    }
  }

  .u-progress-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .u-progress-info {
    font-size: 28rpx;
    padding-left: 16rpx;
    letter-spacing: 2rpx;
  }
</style>
