<template>
  <div class="flex-col page">
    <div class="flex-col flex-auto group_2" v-if="dataLoaded">
      <div class="flex-col">
        <div class="flex-col space-y-16">
          <div class="flex-col group_5">
            <div class="flex-col relative list space-y-16">
              <div
                class="flex-row items-center list-item space-x-10"
                v-for="item in courseList"
                :key="item.k"
                @click="() => handleNavgation(item)"
              >
                <!-- 考核标记 -->
                <img src="@/static/svgs/examlogo.svg" alt="" class="exam_tit" v-if="item.hasExam" />
                <img
                  class="shrink-0 image_5"
                  src="https://acc.wangxiao.cn/image/certificate/expired_course.png"
                  v-if="item.isExpired === 2"
                />
                <img
                  class="shrink-0 image_5"
                  src="https://acc.wangxiao.cn/image/certificate.png"
                  v-else-if="item.isExpired === 1 && item.certificateId"
                />
                <img
                  class="shrink-0 image_5"
                  src="https://app.static.wangxiao.cn/miniprogram/images/course_thumbnail.png"
                  v-else
                />
                <div class="course-list flex-col flex-auto space-y-10">
                  <div class="font_2 text_7">{{ item.v }}</div>
                  <view v-if="item.isExpired == 2" class="expired-Btn flex-center">已过期</view>
                  <div class="course-limit-date self-start font_3" v-if="item.isExpired != 2">{{
                    item.useTime
                  }}</div>
                </div>
                <span
                  class="icon iconfont icon-chevron-right"
                  style="color: #C7CBDE;margin-left: 6px;"
                  v-if="item.isExpired === 1"
                ></span>
              </div>
            </div>
            <div style="height:165rpx"></div>
          </div>
        </div>
      </div>
    </div>
    <PopupWindow ref="detail" height="340rpx" title="温馨提示">
      <view class="text-size-main">您的课程已过期，详情请咨询客服</view>
    </PopupWindow>
    <PopupWindow ref="force" height="340rpx" title="温馨提示">
      <view class="text-size-main">请在{{ day }}天后再使用</view>
    </PopupWindow>
  </div>
</template>

<script>
  import { getMySkuLessons } from '@/api/modules/course/index';
  import PopupWindow from '@/components/PopupComp/PopupWindow.vue';
  export default {
    name: 'CommodityCourse',
    components: {
      PopupWindow,
    },
    // props: ['courseList'],
    data() {
      return {
        day: 0,
        courseList: [],
        examList: [],
        ifScroll: 0,
        dataLoaded: false,
      };
    },
    computed: {
      projectId() {
        return this.$store.getters.getProjectId;
      },
    },
    onLoad(options) {
      Promise.all([this.getMyCourseList(options.skuId)])
        .then(() => {
          this.dataLoaded = true; // 所有数据加载完成
        })
        .catch((error) => {
          console.error('Error loading data:', error);
          this.dataLoaded = true;
        });
    },
    methods: {
      // // 获取我的课程数据
      async getMyCourseList(skuId) {
        const { body } = await getMySkuLessons({ skuId });
        this.courseList = body || [];
      },
      // 处理课程跳转
      handleNavgation(item) {
        const { isExpired, day, k, certificateId } = item;
        // 过期
        if (isExpired === 2) {
          this.$refs.detail.showModal = true;
          return;
        }
        // 未生效
        if (isExpired === 0) {
          this.day = day;
          this.$refs.force.showModal = true;
          return;
        }
        // 跳转到课程详情
        this.commonFun.routeTo(
          `/page_commodity/courseList/courseDetail?productId=${k}&certId=${certificateId || ''}`
        );
        // this.commonFun.routeTo(`/page_commodity/courseList/liveCourseDetail?productId=${k}`);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .flex-row {
    display: flex;
    flex-direction: row;
  }

  .flex-col {
    display: flex;
    flex-direction: column;
  }

  .justify-start {
    justify-content: flex-start;
  }

  .justify-end {
    justify-content: flex-end;
  }

  .justify-center {
    justify-content: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  .justify-around {
    justify-content: space-around;
  }

  .justify-evenly {
    justify-content: space-evenly;
  }

  .items-start {
    align-items: flex-start;
  }

  .items-end {
    align-items: flex-end;
  }

  .items-center {
    align-items: center;
  }

  .items-baseline {
    align-items: baseline;
  }

  .items-stretch {
    align-items: stretch;
  }

  .self-start {
    align-self: flex-start;
  }

  .self-end {
    align-self: flex-end;
  }

  .self-center {
    align-self: center;
  }

  .self-baseline {
    align-self: baseline;
  }

  .self-stretch {
    align-self: stretch;
  }

  .flex-1 {
    flex: 1 1 0%;
  }

  .flex-auto {
    flex: 1 1 auto;
  }

  .grow {
    flex-grow: 1;
  }

  .grow-0 {
    flex-grow: 0;
  }

  .shrink {
    flex-shrink: 1;
  }

  .shrink-0 {
    flex-shrink: 0;
  }

  .relative {
    position: relative;
  }
  .page {
    // background-color: #f8f9fa;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    height: 100vh;
    background-color: #f6f6f6;
  }
  .header {
    padding-bottom: 10px;
    background-color: #ffffff;
    height: 72px;
  }
  .section {
    padding: 18px 15px 14px 34px;
    background-color: #ffffff;
  }
  .group {
    line-height: 10.5px;
    height: 10.5px;
  }
  .font_1 {
    font-size: 14px;
    font-family: SF Pro Text;
    line-height: 11px;
    font-weight: 600;
    color: #000000;
  }
  .text {
    word-break: break-all;
  }
  .text_2 {
    line-height: 10.5px;
  }
  .text_3 {
    line-height: 10px;
  }
  .tips {
    font-size: 14px;
    color: #9fa1a4;
    text-align: center;
  }
  .space-x-6 > *:not(:first-child) {
    margin-left: 6px;
  }
  .image {
    width: 17px;
    height: 11px;
  }
  .image_2 {
    width: 15px;
    height: 11px;
  }
  .image_3 {
    width: 24px;
    height: 11px;
  }
  .text_4 {
    margin-left: 16px;
    color: #2e2e2e;
    font-size: 22px;
    font-family: PingFang SC;
    font-weight: 600;
    line-height: 20px;
  }
  .group_2 {
    overflow-y: auto;
  }
  .image-wrapper {
    padding-top: 9px;
    background-color: #ffffff;
  }
  .image_4 {
    border-radius: 10px;
    width: 345px;
    height: 116px;
  }
  .section_2 {
    padding: 26px 78px 3px;
    background-image: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
    border-bottom: solid 1px #e5e6eb4d;
  }
  .group_3 {
    padding: 3px 0 6px 24px;
  }
  .text_6 {
    color: #4e5969;
    font-size: 14px;
    font-family: PingFang SC;
    line-height: 13px;
  }
  .text_5 {
    color: #e51600;
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: 600;
    line-height: 16.5px;
  }
  .section_3 {
    margin-right: 30px;
    background-color: #e51600;
    border-radius: 1px;
    width: 15px;
    height: 2px;
  }
  .group_5 {
    padding-left: 15px;
    padding-right: 15px;
    // height: 414px;
  }
  .image_9 {
    margin-left: 64px;
    // margin-top: 306px;
    width: 16px;
    height: 16px;
  }
  .list-item {
    margin-top: 16px;
    padding: 16px;
    background-color: #ffffff;
    border-radius: 12px;
    position: relative;
  }
  .exam-content {
    margin: 24px 14px 0 14px;
    padding: 10px 8px;
    background-color: #fdf3f2;
    border-radius: 12px;
    border: 2rpx solid #f7b2aa;
    position: relative;
  }
  .space-x-10 > *:not(:first-child) {
    margin-left: 10px;
  }
  .exam_tit {
    position: absolute;
    width: 33px;
    height: 19px;
    right: 0;
    top: 0;
  }
  .image_5 {
    width: 56px;
    height: 56px;
  }
  .certs-img {
    width: 100px;
    height: 56px;
  }
  .space-y-10 > *:not(:first-child) {
    margin-top: 10px;
  }
  .course-list {
    height: 100%;
    flex: 1;
    margin-left: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 3px 0px;
  }
  .font_2 {
    font-size: 16px;
    font-family: PingFang SC;
    line-height: 15px;
    font-weight: 600;
    color: #323949;
  }
  .text_7 {
    line-height: 24px;
  }
  .font_3 {
    font-size: 12px;
    font-family: PingFang SC;
    line-height: 9px;
    color: #989ead;
  }
  .course-limit-date {
    margin-top: 10px;
  }
  .image_6 {
    width: 20px;
    height: 20px;
  }
  .group_6 {
    margin-left: 12px;
  }
  .image_7 {
    margin-left: 20px;
  }
  .space-x-12 > *:not(:first-child) {
    margin-left: 12px;
  }
  .section_4 {
    background-image: linear-gradient(180deg, #fe9f62 0%, #ff8d54 100%);
    border-radius: 8px;
    width: 56px;
    height: 56px;
  }
  .expired-Btn {
    width: 76rpx;
    height: 36rpx;
    border-radius: 8rpx;
    background: #989ead;
    font-size: 20rpx;
    color: #ffffff;
    margin-right: 16rpx;
  }
  .section_5 {
    padding: 47px 0 8px;
    background-image: url('https://codesign-v2-1258344706.cos.ap-guangzhou.myqcloud.com/codefun///16853269383634192203.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    width: 56px;
  }
  .section_6 {
    margin-left: 8px;
    background-color: #ffffff;
    border-radius: 1.5px;
    width: 7px;
    height: 1.5px;
  }
  .group_7 {
    width: 48.5px;
  }
  .pos_2 {
    position: absolute;
    right: 0;
    top: 20px;
  }
  .image_8 {
    border-radius: 0px 0px 8px 0px;
    width: 36px;
    height: 36px;
  }
  .font_5 {
    font-size: 7px;
    font-family: Resource Han Rounded CN;
    line-height: 5.5px;
    font-weight: 700;
    color: transparent;
  }
  .text_9 {
    background-image: linear-gradient(
      180deg,
      #ffffff00 0%,
      #ffffff99 12%,
      #ffffff99 77.1%,
      #ffffff2b 100%
    );
    -webkit-background-clip: text;
  }
  .pos_3 {
    position: absolute;
    left: 0;
    top: 7.5px;
  }
  .font_4 {
    font-size: 14px;
    font-family: Resource Han Rounded CN;
    line-height: 12.5px;
    font-weight: 700;
    color: transparent;
  }
  .text_8 {
    background-image: linear-gradient(
      180deg,
      #ffffff00 0%,
      #ffffff 12%,
      #ffffff 77.1%,
      #ffffff47 100%
    );
    -webkit-background-clip: text;
  }
  .pos {
    position: absolute;
    left: 7.5px;
    top: 9.5px;
  }
  .group_8 {
    margin-top: 16px;
  }
  .section_7 {
    margin-right: 3px;
    padding: 16px 4px 0 16px;
    background-color: #ffffff;
    border-radius: 12px;
  }
  .pos_6 {
    position: absolute;
    right: 0;
    top: 20px;
  }
  .pos_7 {
    position: absolute;
    left: 0;
    top: 7.5px;
  }
  .pos_5 {
    position: absolute;
    left: 7.5px;
    top: 9.5px;
  }
  .group_9 {
    margin-left: 12px;
    margin-top: 10px;
  }
  .space-y-16 > *:not(:first-child) {
    margin-top: 16px;
  }
  .image_11 {
    margin-left: 20px;
    width: 73px;
    height: 73px;
  }
  .image_10 {
    width: 23px;
    height: 23px;
  }
  .pos_4 {
    position: absolute;
    right: 0;
    top: 4px;
  }
  .section_8 {
    margin: 0 15px;
    padding: 16px 0 5px;
    background-color: #ffffff;
    border-radius: 12px;
  }
  .image-wrapper_2 {
    margin-left: 16px;
    background-image: linear-gradient(180deg, #fe9f62 0%, #ff8d54 100%);
    border-radius: 8px;
    width: 56px;
  }
  .section_9 {
    padding: 4px 0 8px;
    background-color: #ffffff;
    border-top: solid 1px #f2f3f599;
  }
  .pos_8 {
    position: absolute;
    left: 0;
    right: 0;
    top: 26px;
  }
  .equal-division {
    width: 274.5px;
  }
  .space-y-4 > *:not(:first-child) {
    margin-top: 4px;
  }
  .image_12 {
    width: 24px;
    height: 24px;
  }
  .font_6 {
    font-size: 12px;
    font-family: PingFang SC;
    line-height: 11px;
    color: #c9cdd4;
  }
  .pos_9 {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
  }
  .text_10 {
    color: #e51600;
  }
  .pos_10 {
    position: absolute;
    right: 0;
    top: 0;
  }

  .nodata_group_4 {
    padding: 65px 0 40px;
  }
  .nodata_space-y-28 > *:not(:first-child) {
    margin-top: 28px;
  }
  .nodata_image_5 {
    width: 172px;
    height: 172px;
  }
  .nodata_text_7 {
    color: #9ea1a3;
    line-height: 13.5px;
  }
  .nodata_group_5 {
    padding-left: 79px;
    padding-right: 12px;
  }
  .nodata_space-y-8 {
    margin-top: 28px;
  }
  .nodata_button {
    margin-left: 28px;
    padding: 14px 0;
    background-color: #e51600;
    border-radius: 36px;
    width: 160px;
  }
  .nodata_text_8 {
    color: #ffffff;
    font-weight: 600;
  }
  .nodata_image_6 {
    width: 16px;
    height: 16px;
  }
</style>
