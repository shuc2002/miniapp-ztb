<template>
  <view class="course-recommend-outwrap">
    <NewCourseList :list="recommendList" @handleItem="handleItem" />
  </view>
</template>

<script>

  import NewCourseList from './NewCourseList.vue';
  import { fetchRecommendList } from '@/api/modules/course/index';
  export default {
    name: 'Recommend',
    components: {
      NewCourseList,
    },
    data() {
      return {
        recommendList: [],
      };
    },
    onReady() {
      this.getRecommendList();
    },
    computed: {
      projectId() {
        return this.$store.getters.getProjectId;
      },
    },
    methods: {
      // 处理点击列表数据
      handleItem(item) {
        console.log('222--', item);
      },
      formatTime(timeLeft) {
        if (!timeLeft) return '';
        let seconds = Math.floor(timeLeft / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        let days = Math.floor(hours / 24);
        seconds %= 60;
        minutes %= 60;
        hours %= 24;
        return `${days}天${hours}小时${minutes}分钟${seconds}秒`;
      },
      handleMiaosha(time) {
        return this.miaosha(time * 1000);
      },
      async getRecommendList() {
        const recommendList = await fetchRecommendList({ projectId: this.projectId });
        this.recommendList = recommendList.body || {};
      },
      miaosha(leftTime) {
        const timeFormat = (leftTime) => {
          var timer = null;
          function fix(num, length) {
            return num.toString() < length ? '0' + num : num;
          }
          // 计算距离秒杀结束的时分秒
          var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10);
          var hours = parseInt((leftTime / 1000 / 60 / 60) % 24, 10);
          var minutes = parseInt((leftTime / 1000 / 60) % 60, 10);
          var seconds = parseInt((leftTime / 1000) % 60, 10);

          // 格式化输出时分秒
          days = fix(days, 2);
          hours = fix(hours, 2);
          minutes = fix(minutes, 2);
          seconds = fix(seconds, 2);

          // 倒计时结束时清除定时器并提示用户
          if (seconds < 0) {
            clearTimeout(timer);
          } else {
            // 递归调用，直到倒计时结束
            timer = setTimeout(function() {
              days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10);
              hours = parseInt((leftTime / 1000 / 60 / 60) % 24, 10);
              minutes = parseInt((leftTime / 1000 / 60) % 60, 10);
              seconds = parseInt((leftTime / 1000) % 60, 10);
              days = fix(days, 2);
              hours = fix(hours, 2);
              minutes = fix(minutes, 2);
              seconds = fix(seconds, 2);
              // 在控制台输出倒计时信息
              console.log(
                '距离秒杀结束还有 ' +
                  days +
                  ' 天 ' +
                  hours +
                  ' 小时 ' +
                  minutes +
                  ' 分钟 ' +
                  seconds +
                  ' 秒'
              );
              // 递归调用自己
              setTimeout(function() {
                leftTime -= 1000;
                timeFormat(leftTime);
              }, 1000);
            }, 1000);
          }
        };

        timeFormat(leftTime);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .course-recommend-outwrap {
    background-color: #f6f6f6;
    padding-top: 32rpx;
  }
</style>
