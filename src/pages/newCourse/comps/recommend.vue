<template>
  <view class="course-recommend-outwrap">
    <!-- 使用 dataLoaded 控制内容的显示 -->
    <view v-if="dataLoaded">
      <view style="min-height:73vh" v-if="recommendList.length">
        <NewCourseList :list="recommendList" @handleItem="handleItem" />
      </view>
      <view class="no-more" v-if="recommendList.length > 4">
        已经到底啦
      </view>
      <view class="ss" v-if="recommendList.length != 0" style="height:100rpx; background-color: #f6f6f6;"></view>
      <view class="noOrder" v-else>
        <image class="nodata_image_5"
          src="https://app.static.wangxiao.cn/miniprogram/images/no_course.png"
          mode="scaleToFill" />
        <p class="common-tip">老师正在产出，去看看其他练习吧~</p>
        <view class="nodata_button" @tap="gotoHome">
          <span class="font_2 nodata_text_8">去首页看看</span>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import NewCourseList from './NewCourseList.vue';
  import { fetchRecommendListNew } from '@/api/modules/course/index';
  import { bottomNavTo } from '@/utils/common.js';
  export default {
    name: 'Recommend',
    components: {
      NewCourseList,
    },
    data() {
      return {
        dataLoaded: false,
        recommendList: [],
      };
    },
    mounted() {
      this.getRecommendList();
    },
    computed: {
      projectId() {
        return this.$store.getters.getProjectId;
      },
    },
    methods: {
      gotoHome() {
        // uni.switchTab({
        //   url: '/pages/home/index',
        // });
        bottomNavTo('/pages/realHome/index', 1);
      },
      // 处理点击列表数据
      handleItem(item) {
        uni.navigateTo({
          url: `/page_commodity/commodity/pages/commodityBank?id=${item.id}`,
        });
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
        const recommendList = await fetchRecommendListNew({
          projectId: this.projectId,
          type: 1,
          index: 0,
          row: 10,
        });
        this.recommendList = recommendList.body || [];
        this.dataLoaded = true;
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
    padding-top: 12rpx;
  }
  .no-more {
    font-size: 24rpx;
    font-weight: 400;
    text-align: center;
    width: 100%;
    height: 100upx;
    color: #9fa1a4;
    line-height: 50upx;
  }
  .noOrder {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 16px;
    font-family: PingFang SC;
    line-height: 15px;
    font-weight: 600;
    // justify-content: center;
    background: #fff;
    padding: 65px 0 40px;
    .nodata_image_5 {
      width: 172px;
      height: 172px;
    }
    .nodata_button {
      margin-top: 28px;
      font-size: 16px;
      padding: 14px 0;
      background-color: #e51600;
      border-radius: 36px;
      width: 160px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ffffff;
      font-weight: 600;
    }
  }
</style>
