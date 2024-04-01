<template>
  <view>
    <view
      class="course-recommend-wrap"
      v-for="item in list"
      :key="item.id"
      @click="handleItem(item)"
    >
      <view class="flex-content"
        ><img
          src="@/static/svgs/certificate.svg"
          alt=""
          class="logos"
          v-if="item.certificateId"
        /><view class="course-recommend-title">{{ item.name }}</view>
      </view>
      <view class="course-recommend-desc">{{ item.sellingPoint }}</view>
      <view class="course-recommend-content">
        <template v-for="(teacher, index) in item.teachers">
          <view class="teacher-content" v-if="index < 3" :key="teacher.id">
            <view class="course-recommend-avators">
              <image :src="teacher.photo" class="teacher-photo" />
              <!-- <img :src="teacher.photo" alt="" /> -->
              <text class="teacher-name">{{ teacher.name }}</text>
            </view>
          </view>
        </template>
        <view v-if="!item.teachers" class="empty"></view>
        <view class="recommend-remain-wrap">
          <view
            :class="
              item.remainderTime && item.remainderTime > 0 ? 'recommend-price' : 'recommend-price-2'
            "
          >
            <view class="recommend-line-price">
              <!-- <span style="font-size: 21rpx;">¥</span> {{ item.linePrice }}
              <span style="font-size: 21rpx;">起</span> -->
              <view style="font-size: 21rpx;">¥</view>{{ item.linePrice }}
              <view style="font-size: 21rpx;">起</view>
            </view>
            <view class="recommend-real-price">
              <!-- <span style="font-size: 21rpx;">¥</span>{{ item.discountAmount || item.price}}<span style="font-size: 21rpx;">起</span> -->
              <view style="font-size: 21rpx;">¥</view>{{ item.discountAmount || item.price
              }}<view style="font-size: 21rpx;">起</view>
            </view>
          </view>
          <view v-if="item.remainderTime && item.remainderTime > 0" class="course-recommend-remain"
            >剩余
            <NewCountdown
              backgroundColor="#ffffff"
              textColor="#989EAD"
              :remain="parseInt(item.remainderTime)"
              :showBox="false"
            />后恢复原价</view
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import { fetchRecommendList } from '@/api/modules/course/index';
  import NewCountdown from './CountDown.vue';
  export default {
    name: 'Recommend',
    props: ['list'],
    components: { NewCountdown },
    computed: {
      system() {
        return this.$store.getters.getSystem;
      },
    },
    methods: {
      // 处理单条数据
      handleItem(item) {
        console.log('supplierId111---', item.supplierId);
        this.$store.commit('setSupplierId', item.supplierId || '');
        this.$emit('handleItem', item);
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
              // console.log(
              //   '距离秒杀结束还有 ' +
              //     days +
              //     ' 天 ' +
              //     hours +
              //     ' 小时 ' +
              //     minutes +
              //     ' 分钟 ' +
              //     seconds +
              //     ' 秒'
              // );
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
  .no-more {
    font-size: 28rpx;
    font-weight: 400;
    text-align: center;
    width: 100%;
    height: 100upx;
    color: #989ead;
    line-height: 50upx;
  }
  .course-recommend-wrap:first-of-type {
    margin: 24rpx 30rpx 30rpx 30rpx;
  }
  .course-recommend-wrap {
    margin: 30rpx 30rpx;
    padding: 40rpx 30rpx;
    border-radius: 16rpx;
    background-color: #ffffff;
    .flex-content {
      display: flex;
      align-items: center;
    }
    .logos {
      width: 38px;
      height: 18px;
    }
    .course-recommend-title {
      font-size: 32rpx;
      font-weight: 500;
      color: #333333;
      margin-left: 0px;
      font-weight: bold;
      font-family: Medium;
    }
    .course-recommend-desc {
      margin-top: 8rpx;
      font-size: 24rpx;
      color: #9fa1a4;
      font-family: Regular;
    }
    .course-recommend-content {
      margin-top: 60rpx;
      display: flex;
      justify-content: space-between;
      .teacher-content {
        margin-right: 18px;
      }
      .course-recommend-avators {
        display: flex;
        flex-direction: column;
        text-align: center;
        align-items: center;
        justify-content: center;
        image {
          width: 60rpx;
          height: 60rpx;
          margin: 0 auto;
          border-radius: 50%;
          border: 1px solid #f6f6f6;
          margin-bottom: 16rpx;
        }
      }
      .recommend-remain-wrap {
        flex: 1;
        .recommend-price {
          display: flex;
          justify-content: flex-end;
          .recommend-line-price {
            color: #999eb5ff;
            font-weight: 500;
            text-decoration: line-through;
            font-size: 24rpx;
            padding-right: 12rpx;
            // margin-top: 8rpx;
          }
          .recommend-real-price {
            color: #fc695b;
            font-weight: 600;
            font-size: 32rpx;
          }
        }
        .recommend-price-2 {
          display: flex;
          justify-content: flex-end;
          margin-top: 68rpx;
          .recommend-line-price {
            color: #999eb5ff;
            font-weight: 500;
            text-decoration: line-through;
            // margin-top: 4rpx;
            padding-top: 5rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24rpx;
          }
          .recommend-real-price {
            color: #fc695b;
            font-weight: 600;
            font-size: 32rpx;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        .course-recommend-remain {
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
      }
    }
  }
  .teacher-photo {
    height: 60rpx;
    width: 60rpx;
    border-radius: 50% 50%;
  }
  .teacher-name {
    font-size: 20rpx;
    color: #9fa1a4;
    text-align: center;
  }
</style>
