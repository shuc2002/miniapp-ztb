<!-- 章节课组件 -->
<template>
  <view class="chapter-index-wrap" :style="[config.style]">
    <text class="chapter-class">{{ title }}</text>
    <view :style="{ display: !noData ? 'none' : 'block' }" class="chapter-inter-wrap">
      <view class="chpater-no-data">
        <image
          class="no-data-image"
          src="https://app.static.wangxiao.cn/miniprogram/images/nodata.png"
        />
        <text class="no-data-tip font_5 text_9">老师正在辛苦产出中...</text>
      </view>
    </view>
    <view :style="{ display: noData ? 'none' : 'block' }">
      <view class="tabs-border-container" v-if="list.length > 1">
        <u-tabs
          :list="list"
          :current="current"
          @change="change"
          :is-scroll="false"
          active-color="#E51600"
          :show-bar="false"
        ></u-tabs>
      </view>
      <LearnInfo
        :courseInfo="courseInfo"
        :currentTabIndex="currentType"
        :currentSubName="currentSubName"
      />
      <div class="recursion-container">
        <RecursionLevelList
          :list="courseList"
          :statics="statics"
          :supplierId="supplierId"
          :showSpeed="true"
          :commodityId="commodityId"
          :defaultExpan="true"
        />
      </div>
    </view>

    <!-- <view class="course-info-wrap">
      <view class="course-info">
        <view class="course-info-deital">
          <view class="course-info-deital-wrap">
            <text class="course-info-title">{{ subjectInfoStr }}</text
            >/
            <text class="course-info-num">{{ courseInfo.num || 0 }}</text>
          </view>
          <view class="course-info-intro-wrap">
            <text class="course-info-intro">{{ courseInfo.productIntro.name || '' }}</text>
          </view>
        </view>
        <view class="learn-more">
          <u-button type="primary" shape="square" hover-class="none" @click="gotoCourse">
            <text class="start-learn-title">开始学习</text>
          </u-button>
        </view>
      </view>
    </view> -->
  </view>
</template>

<script>
  // import ChapterCourse from '@/components/ChapterCourse/ChapterCourse.vue';
  import { fetchCourseInfo } from '@/api/modules/chapterCourse/index';
  import { fetchGetStudyStat } from '@/api/modules/common/index';
  import RecursionLevelList from '@/components/ChapterCourse/RecursionLevelList';
  import LearnInfo from '@/components/ChapterCourse/LearnInfo.vue';
  import { flatList, getProductIds } from '@/course/chapter/utils/index';
  export default {
    name: 'ChapterIndex',
    components: {
      LearnInfo,
      RecursionLevelList,
      // ChapterCourse,
    },

    props: {
      projectId: {
        type: String,
        default: '',
      },
      subjectId: {
        type: String,
        default: '',
      },
      // 章节课配置
      chapterConfig: { type: Object, default: () => {} },
      config: { type: Object, default: () => {} },
      currentSubName: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        current: 0,
        courseInfo: {},
        first: false,
        noData: false,
        titleMap: {
          0: '总学时',
          1: '总资料数',
          2: '总直播数',
          3: '总习题数',
        },
        list: [
          // {
          //   name: '视频',
          // },
          // {
          //   name: '资料',
          // },
          // {
          //   name: '直播',
          // },
          // {
          //   name: '题库',
          // },
        ],
        courseList: [],
        statics: [],
        commodityId: '',
        supplierId: '', // 供应商id
        currentType: 0, //当前章节课类型
      };
    },
    mounted() {
      this.first = true;
      this.getCourseInfo(this.first);
    },
    watch: {
      projectId(val) {
        this.projectId = val;
        // this.getCourseInfo();
      },
      subjectId(val) {
        this.subjectId = val;
        this.getCourseInfo(this.first);
      },

      currentSubName(val) {
        this.currentSubName = val;
      },
    },
    computed: {
      // 陈列区id
      displayAreaId() {
        try {
          return this.chapterConfig?.action?.config?.href[1];
        } catch (error) {
          return '';
        }
      },
      title() {
        return this.config?.action?.config?.title || '章节课';
      },
      subjectInfoStr() {
        // {{ titleMap }} / {{ courseInfo.num || 0 }}
        return `${this.titleMap[this.current]}`;
      },
    },
    methods: {
      change(index) {
        this.current = index;
        this.currentType = this.list[index].value;
        this.getCourseInfo();
      },
      async getCourseInfo(first) {
        const result = await fetchCourseInfo({
          projectId: this.projectId,
          subjectId: this.subjectId,
          displayAreaId: this.displayAreaId,
          isDetail: true,
          type: first ? '' : this.currentType,
          // type: 2,
        });

        this.courseInfo = result.body;
        this.noData = this.courseInfo ? false : true;
        const { commodityId = '', types = [], typeProductTrees = [], supplierId = '', productTrees = [] } = result.body || {};
        this.commodityId = commodityId;
        this.supplierId = supplierId; // 供应商id

        if (first) {
          const tabs = types;
          this.list = [];
          tabs.map((item) => {
            switch (item) {
              case 0:
                this.list.push({ name: '资料', value: 0 });
                break;
              case 1:
                this.list.push({ name: '视频', value: 1 });
                break;
              case 2:
                this.list.push({ name: '练习', value: 2 });
                break;
              case 3:
                this.list.push({ name: '考试', value: 3 });
                break;
              case 4:
                this.list.push({ name: '直播', value: 4 });
                break;
            }
          });
          const firstTab = tabs[0];
          this.currentType = this.list[0].value;
          let constructs = typeProductTrees[firstTab] || [];
          // 利用缓存重新组织树结构
          const productIds = getProductIds(constructs, 'P');
          const statics = await fetchGetStudyStat({ productIds });
          // constructs = assembleData(constructs, statics.body);
          let originList = flatList(constructs);
          this.statics = statics.body;
          
          this.courseList = originList;
        } else {
          // this.courseInfo = result.body;
          let constructs = productTrees || [];
          // 利用缓存重新组织树结构
          const productIds = getProductIds(constructs, 'P');
          const statics = await fetchGetStudyStat({ productIds });
          // constructs = assembleData(constructs, statics.body);
          let originList = flatList(constructs);
          this.statics = statics.body;
          this.courseList = originList;
        }
      },
      gotoCourse() {
        uni.navigateTo({
          url: `/course/chapter/index?projectId=${this.projectId}&subjectId=${this.subjectId}&displayAreaId=${this.displayAreaId}&type=${this.current}`,
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .chapter-index-wrap {
    background: var(--white, #fff);
  }
  .recursion-container {
    overflow: auto;
    // height: 100vh;
  }
  .chapter-class {
    color: #333333;
    font-size: 36rpx;
    font-weight: 500;
  }
  .tabs-border-container {
    border-bottom: 1rpx solid #f1f1f1;
    margin-bottom: 32rpx;
  }
  .course-info-wrap {
    display: flex;
    justify-content: center;
    .course-info {
      margin-top: 50rpx;
      width: 690rpx;
      height: 196rpx;
      background: #f7f8fa;
      border-radius: 32rpx;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .course-info-deital {
        display: flex;
        flex-direction: column;
        .course-info-deital-wrap {
          padding-bottom: 20rpx;
        }
        .course-info-title {
          color: #4b538aff;
          font-size: 24rpx;
          font-weight: 400;
          text-align: center;
        }
        .course-info-num {
          color: #323949ff;
          font-size: 32rpx;
          font-weight: 600;
          text-align: left;
        }
        .course-info-intro-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 168rpx;
          height: 40rpx;
          border-radius: 8rpx;
          background: #4b538aff;
          .course-info-intro {
            opacity: 1;
            color: #ffffffff;
            font-size: 12px;
            font-weight: 500;
            font-family: 'PingFang SC';
            text-align: left;
            line-height: 16.8px;
          }
        }
      }
      .learn-more {
        // width: 280rpx;
        // height: 96rpx;
        ::v-deep button {
          width: 280rpx;
          height: 96rpx;
          border-radius: 72rpx;
          opacity: 1;
          background: #e51600;
        }
        .start-learn-title {
          color: #ffffffff;
          font-size: 32rpx;
          font-weight: 600;
          text-align: left;
          line-height: 24px;
        }
      }
    }
  }
  .chapter-inter-wrap {
    display: flex;
    flex-direction: column;

    .chapter-title {
      align-self: flex-start;
      color: #333333;
      line-height: 16.5p;
    }
    .chpater-no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 20px 0;

      .no-data-image {
        width: 172px;
        height: 172px;
      }
      .no-data-tip {
        font-size: 14px;
        line-height: 13px;
        color: #989ead;
        margin-top: 4px;
      }
    }
  }
</style>
