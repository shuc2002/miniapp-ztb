<template>
  <view>
    <view class="course-center-outwrap" v-if="!liveShow">
      <u-tabs-swiper
        ref="tabs"
        :current="current"
        active-color="#E51600"
        @change="onChange"
        :list="tabs"
        :is-scroll="false"
      >
      </u-tabs-swiper>
      <view v-if="current == 0" style="border-top: 1px solid #eeeff0">
        <Recommend />
      </view>
      <view v-if="current == 1">
        <MyCourse />
      </view>
      <!-- <image
      class="course-exam-plan"
      src="@/static/img/exam-plan.png"
      mode="scaleToFill"
      @click="openPlanWindow"
    /> -->
      <view class="course-wrap" v-if="isShow">
        <view class="course-section1">
          <view class="course-section2">
            <image
              class="self-end image"
              @click="close"
              src="https://codesign-v2-1258344706.cos.ap-guangzhou.myqcloud.com/codefun///16850884614676830440.png"
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
    <view v-else>
      <MyCourse />
    </view>
    <CustomTab />
  </view>
</template>

<script>
  import Recommend from './comps/recommend.vue';
  import MyCourse from './comps/myCourse.vue';
  import CustomTab from '../../customTab';
  import { getUrlValue } from '@/utils/urlValue.js';
  import { fetchWxInfo } from '@/api/modules/course/index';

  export default {
    name: 'home',
    components: {
      Recommend,
      MyCourse,
      CustomTab,
    },
    data() {
      return {
        isShow: false,
        projectInfo: {},
        list: [],
        current: 1,
        tabs: [
          {
            name: '课程',
          },
          {
            name: '我的课程',
          },
        ],
        liveShow: false, // 是否是通过分享直播进的页面 是则隐藏相应内容
      };
    },
    computed: {
      projectId() {
        return this.$store.getters.getProjectId;
      },
    },
    onLoad() {},
    // onLoad() {
    //   // const currentProp = uni.getStorageSync('current');
    //   // console.log(currentProp,'ccccccc');
    //   // if (currentProp) {
    //   //   this.current = currentProp;
    //   // }
    // },
    onShow() {
      const isLive = uni.getStorageSync('liveShow');

      var currentIndex = uni.getStorageSync('current');
      /* #ifdef H5 */
      currentIndex = getUrlValue('current');
      /* #endif */
      if (currentIndex) {
        this.current = currentIndex;
      }
      uni.removeStorageSync('current');
      if (isLive) {
        this.liveShow = true;
        uni.hideTabBar();
      } else {
        this.liveShow = false;
        uni.showTabBar();
        uni.removeStorageSync('liveShow');
      }
      uni.hideTabBar();
    },
    // onHide() {
    //   uni.removeStorageSync('liveShow');
    // },
    // onUnload() {
    //   uni.removeStorageSync('liveShow');
    // },
    // 转发页面
    async onShareAppMessage() {
      return {
        path: '/pages/newCourse/index',
        // imageUrl: 'https://app.static.wangxiao.cn/ykmf/images/zuduishuati.png',
      };
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
    min-height: 100vh;
    background-color: #f6f6f6;
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
    background-image: url('https://codesign-v2-1258344706.cos.ap-guangzhou.myqcloud.com/codefun///16850884614681255758.png');
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
    color: #fc5242;
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
