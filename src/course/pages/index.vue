<template>
  <view class="course-center-outwrap">
    <u-tabs-swiper
      ref="tabs"
      :current="current"
      @change="onChange"
      :list="tabs"
      :is-scroll="false"
    ></u-tabs-swiper>
    <view v-if="current == 0">
      <Recommend />
    </view>
    <view v-if="current == 1">
      <MyCourse />
    </view>
    <image
      class="course-exam-plan"
      src="@/static/img/exam-plan.png"
      mode="scaleToFill"
      @click="openPlanWindow"
    />
    <view class="course-wrap" v-if="isShow">
      <view class="course-section1">
        <view class="course-section2">
          <image
            class="self-end image"
            @click="close"
            src="https://app.static.wangxiao.cn/miniprogram/images/close.png"
          />
        </view>
        <view class="course-pop-wrap">
          <view class="flex-col section_3">
            <text class="self-start text">{{ projectInfo.projectName }}</text>
            <view class="flex-col items-center group space-y-8">
              <text class="font_1 text_2">免费获取考试通关规划</text>
              <text class="text_3">加微信：{{ projectInfo.wechatCode }}</text>
            </view>
            <view class="flex-col justify-start items-center button"
              ><text class="font_1 text_4" @click="receiveCourse">立即领取</text></view
            >
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import Recommend from './comps/recommend.vue';
  import MyCourse from './comps/myCourse.vue';
  import { fetchWxInfo } from '@/api/modules/course/index';

  export default {
    name: 'home',
    components: {
      Recommend,
      MyCourse,
    },
    data() {
      return {
        isShow: false,
        projectInfo: {},
        list: [],
        current: 0,
        tabs: [
          {
            name: '推荐',
          },
          {
            name: '我的课程',
          },
        ],
      };
    },
    computed: {
      projectId() {
        return this.$store.getters.getProjectId;
      },
    },
    methods: {
      receiveCourse() {
        uni.navigateTo({
          url: '/course/pages/addWechat',
        });
      },
      close() {
        this.isShow = false;
      },
      // 备考计划弹框
      async openPlanWindow() {
        const result = await fetchWxInfo({
          projectId: this.projectId,
          location: 4,
        });
        console.log('111--', result);
        this.projectInfo = result.body || {};
        this.isShow = true;
      },
      onChange(index) {
        this.current = index;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .course-center-outwrap {
    position: relative;
  }
  .course-exam-plan {
    width: 146rpx;
    height: 146rpx;
    position: fixed;
    right: 40rpx;
    bottom: 80rpx;
  }
  .course-wrap {
    background-color: rgba(0, 0, 0, 0.6);
    transform: scale(1, 1);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10075;
    overflow: hidden;
    transition: all 0.25s linear 0s;
    opacity: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .course-section2 {
    display: flex;
    justify-content: flex-end;
  }
  .course-pop-wrap {
    width: 580rpx;
    height: auto;
    z-index: 10075;
    margin-top: 20rpx;
    border-radius: 40rpx;
    overflow: hidden;

    min-width: 72rpx;
    min-height: 72rpx;
    display: block;
    position: relative;
    background-color: #fff;
  }
  .section_3 {
    padding: 72rpx 44rpx 48rpx;
    background-image: url('https://app.static.wangxiao.cn/miniprogram/images/wx_add_bg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .text {
    color: #714736;
    font-size: 44rpx;
    font-family: PingFang SC;
    font-weight: 600;
    line-height: 41rpx;
  }
  .group {
    margin-top: 180rpx;
  }
  .space-y-8 > view:not(:first-child),
  .space-y-8 > text:not(:first-child),
  .space-y-8 > image:not(:first-child) {
    margin-top: 16rpx;
  }
  .font_1 {
    font-size: 36rpx;
    font-family: PingFang SC;
    line-height: 34rpx;
    font-weight: 600;
  }
  .text_2 {
    color: #fb5e1f;
    display: flex;
    justify-content: center;
  }
  .text_3 {
    color: #9ea1a3;
    font-size: 28rpx;
    font-family: PingFang SC;
    line-height: 26rpx;
    display: flex;
    justify-content: center;
  }
  .button {
    margin: 56rpx 24rpx 0;
    padding: 28rpx 0;
    background-image: linear-gradient(270deg, #ffce94 0%, #ffe2be 100%);
    border-radius: 45rpx;
  }
  .text_4 {
    color: #714736;
    line-height: 33rpx;
    display: flex;
    justify-content: center;
  }
  .items-center {
    display: flex;
    flex-direction: column;
  }
  .self-end {
    margin-right: 10px;
    width: 15px;
    height: 15px;
  }
</style>
