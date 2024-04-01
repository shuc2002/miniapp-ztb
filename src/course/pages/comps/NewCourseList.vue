<template>
  <view>
    <view class="course-recommend-wrap" v-for="item in list" :key="item.id" @click="callback(item)">
      <view class="course-recommend-title">{{ item.name }}</view>
      <view class="course-recommend-desc">{{ item.sellingPoint }}</view>
      <view class="course-recommend-content">
        <view v-for="teacher in item.teachers" :key="teacher.id">
          <view class="course-recommend-avators">
            <image :src="teacher.photo" />
            <!-- <img :src="teacher.photo" alt="" /> -->
            <text>{{ teacher.name }}</text>
          </view>
        </view>
        <view class="recommend-remain-wrap">
          <view class="recommend-price">
            <text class="recommend-line-price">¥{{ item.linePrice }}起</text>
            <text class="recommend-real-price">¥{{ item.discountAmount || item.price }}起</text>
          </view>
          <view v-if="item.remainderTime" class="course-recommend-remain"
            >剩余{{ formatTime(item.remainderTime) }}后恢复原价</view
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import { fetchRecommendList } from '@/api/modules/course/index';
  export default {
    name: 'Recommend',
    props: ['list', 'callback'],
    components: {},
    methods: {
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
            timer = setTimeout(function () {
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
              setTimeout(function () {
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
  .course-recommend-wrap {
    margin: 30rpx 30rpx;
    padding: 40rpx 30rpx;
    border-radius: 16rpx;
    background-color: #ffffff;
    .course-recommend-title {
      font-size: 32rpx;
      font-weight: 500;
      color: #333333;
    }
    .course-recommend-desc {
      margin-top: 8rpx;
    }
    .course-recommend-content {
      margin-top: 60rpx;
      display: flex;
      justify-content: space-between;
      .course-recommend-avators {
        display: flex;
        flex-direction: column;
        image {
          width: 60rpx;
          height: 60rpx;
        }
      }
      .recommend-remain-wrap {
        .recommend-price {
          display: flex;
          justify-content: flex-end;
          .recommend-line-price {
            color: #999eb5ff;
            font-weight: 500;
            text-decoration: line-through;
          }
          .recommend-real-price {
            color: #fc5242ff;
            font-weight: 600;
            font-size: 32rpx;
          }
        }
      }
    }
  }
</style>
