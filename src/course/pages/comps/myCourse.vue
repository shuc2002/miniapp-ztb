<template>
  <view>
    <view class="my-course-wrap" v-for="item in courseList" :key="item.k">
      <view class="my-course-icon">
        <img src="@/pages/newCourse/images/course.png" alt="课程" />
      </view>
      <view class="my-course-content">
        <text>{{ item.v }}</text>
        <text>{{ item.useTime }}</text>
      </view>
      <view class="my-course-arrow">
        <span class="iconfont icon-more_large"></span>
      </view>
    </view>
  </view>
</template>

<script>
  import { fetchMyCourseList } from '@/api/modules/course/index';
  export default {
    name: 'Recommend',
    components: {},
    data() {
      return {
        courseList: [],
      };
    },
    onReady() {
      this.getMyCourseList();
    },
    methods: {
      async getMyCourseList() {
        const courseRes = await fetchMyCourseList();
        this.courseList = courseRes.body || [];
      },
    },
  };
</script>

<style lang="scss" scoped>
  .my-course-wrap {
    display: flex;
    justify-content: space-evenly;
    height: 204rpx;
    .my-course-icon {
      display: flex;
      justify-content: center;
      flex-direction: column;
      img {
        width: 112rpx;
        height: 112rpx;
      }
    }
    .my-course-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .my-course-arrow {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
</style>
