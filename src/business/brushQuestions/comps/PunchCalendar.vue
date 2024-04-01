<!--
* @desc 日历组件
* @author 江玉龙
* @date 2022年05月31日
-->
<template>
  <view class="sign-calendar">
    <view style="height: 48rpx" />
    <!-- 日历标题 -->
    <view>
      <span class="text-size-main common-text-700 common-text text-center">
        {{ y + '年' + (m + 1) + '月' }}
      </span>
      <image src="@/static/img/prompt.png" class="img-style" @tap="handleHelp()" />
    </view>
    <!-- 星期几 -->
    <view class="week">
      <view v-for="(item, index) in weekDay" :key="index" class="week-day">
        {{ item }}
      </view>
    </view>
    <!-- 日历显示样式 -->
    <view class="content" :style="{ height: height }">
      <view class="days">
        <view v-for="(item, index) in dates" :key="index" class="item">
          <view
            class="day t-icon"
            :class="{
              nolm: !item.lm,
              't-icon-riqi sion': isSigned(item.year, item.month, item.date),
              miss:
                !isSigned(item.year, item.month, item.date) &&
                !hasPast(item.year, item.month, item.date),
            }"
            @click="
              isSigned(item.year, item.month, item.date)
                ? ''
                : hasPast(item.year, item.month, item.date + 1)
                ? ''
                : selectOne(item)
            "
          >
            <view>
              {{ isToday(item.year, item.month, item.date) ? '今' : item.date }}
            </view>
          </view>
        </view>
      </view>
    </view>
    <view style="height: 36rpx" />
  </view>
</template>

<script>
  export default {
    name: 'punchCalendar',
    props: {
      // 第一列星期几
      weekstart: {
        type: Number,
        default: 7,
      },
      // 已经签到的日期
      signeddates: {
        type: Array,
        default: () => [],
      },
      //有练习的日期
      hasDaysList: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        text: {
          year: '年',
          month: '月',
          week: ['一', '二', '三', '四', '五', '六', '日'],
          today: '今',
        },
        y: new Date().getFullYear(), // 年
        m: new Date().getMonth(), // 月
        dates: [], // 当前月日期集合
        choose: '',
      };
    },
    computed: {
      // 顶部星期栏目
      weekDay() {
        return this.text.week
          .slice(this.weekstart - 1)
          .concat(this.text.week.slice(0, this.weekstart - 1));
      },
      height() {
        return (this.dates.length / 7) * 80 + 'upx';
      },
    },
    created() {
      this.dates = this.monthDay(this.y, this.m);
    },
    mounted() {
      let date = new Date();
      let y = date.getFullYear();
      let m = date.getMonth();
      let d = date.getDate();
      this.choose = `${y}/${m + 1}/${d}`;
    },
    methods: {
      // 帮助图片按钮
      handleHelp() {
        this.$emit('handleHelp');
      },
      cleanDate() {
        let date = new Date();
        let y = date.getFullYear();
        let m = date.getMonth();
        let d = date.getDate();
        this.choose = `${y}/${m + 1}/${d}`;
      },
      // 获取当前月份天数
      monthDay(y, m) {
        let firstDayOfMonth = new Date(y, m, 1).getDay(); // 当月第一天星期几
        let lastDateOfMonth = new Date(y, m + 1, 0).getDate(); // 当月最后一天
        let lastDayOfLastMonth = new Date(y, m, 0).getDate(); // 上一月的最后一天
        let dates = []; // 所有渲染日历
        let weekstart = this.weekstart == 7 ? 0 : this.weekstart; // 方便进行日期计算，默认星期从0开始
        let startDay = (() => {
          // 周初有几天是上个月的
          if (firstDayOfMonth == weekstart) {
            return 0;
          } else if (firstDayOfMonth > weekstart) {
            return firstDayOfMonth - weekstart;
          } else {
            return 7 - weekstart + firstDayOfMonth;
          }
        })();
        let endDay = 7 - ((startDay + lastDateOfMonth) % 7); // 结束还有几天是下个月的
        for (let i = 1; i <= startDay; i++) {
          dates.push({
            date: lastDayOfLastMonth - startDay + i,
            day: weekstart + i - 1 || 7,
            month: m - 1 >= 0 ? m - 1 : 12,
            year: m - 1 >= 0 ? y : y - 1,
          });
        }
        for (let j = 1; j <= lastDateOfMonth; j++) {
          dates.push({
            date: j,
            day: (j % 7) + firstDayOfMonth - 1 || 7,
            month: m,
            year: y,
            lm: true,
          });
        }
        for (let k = 1; k <= endDay; k++) {
          dates.push({
            date: k,
            day: (lastDateOfMonth + startDay + weekstart + k - 1) % 7 || 7,
            month: m + 1 <= 11 ? m + 1 : 0,
            year: m + 1 <= 11 ? y : y + 1,
          });
        }
        return dates;
      },
      hasDays(y, m, d) {
        let status = true;
        const date = `${y}/${m}/${d}`;
        for (let i = 0; i < this.hasDaysList.length; i++) {
          if (this.hasDaysList[i].replace(/-/g, '/') == date) {
            status = false;
            break;
          }
        }
        return status && d <= new Date().getDate();
      },
      // 判断今天是否大于这个有练习日期
      hasClick(y, m, d) {
        let status = true;
        const date = `${y}/${m}/${d}`;
        for (let i = 0; i < this.hasDaysList.length; i++) {
          if (this.hasDaysList[i].replace(/-/g, '/') == date) {
            status = false;
            break;
          }
        }
        return status;
      },
      // 已经签到处理
      isSigned(y, m, d) {
        let status = false;
        let date = new Date();
        if (y == date.getFullYear() && m == date.getMonth() && this.signeddates[d - 1] == true) {
          status = true;
        }
        return status;
      },
      // 是否是今天
      isToday(y, m, d) {
        let date = new Date();
        return y == date.getFullYear() && m == date.getMonth() && d == date.getDate();
      },
      // 是否是大于今天的本月的日
      hasPast(y, m, d) {
        let status = true;
        let date = new Date();
        if (y <= date.getFullYear() && m <= date.getMonth() && d <= date.getDate()) {
          status = false;
        }
        return status;
      },
      // 点击回调
      selectOne(item) {
        this.$emit('handleRepair', item);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .sign-calendar {
    color: #fff;
    font-size: 26rpx;
    text-align: center;
    background: #ffffff;
    padding: 20rpx 0;
    color: #2c364e;
    border-bottom-left-radius: 40rpx;
    border-bottom-right-radius: 40rpx;
    .img-style {
      width: 32rpx;
      height: 32rpx;
      right: 36rpx;
      position: absolute;
      margin-top: 10rpx;
    }
    .top-bar {
      font-size: 26rpx;
      height: 80upx;
      line-height: 80upx;
      border-bottom: 1upx solid rgba(255, 255, 255, 0.3);
      color: #5b648d;
      display: flex;
      view {
        flex: 1;
      }
    }

    .week {
      display: flex;
      align-items: center;
      height: 80upx;
      line-height: 80upx;
      border-bottom: 1upx solid rgba(255, 255, 255, 0.2);
      margin-top: 20upx;
      view {
        flex: 1;
      }
    }

    .content {
      position: relative;
      overflow: hidden;
      transition: height 0.4s ease;
      .days {
        transition: top 0.3s;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        position: relative;
        .item {
          position: relative;
          display: block;
          height: 80upx;
          line-height: 80upx;
          width: calc(100% / 7);
          margin: 12rpx 0;
          .day {
            font-style: normal;
            display: inline-block;
            vertical-align: middle;
            width: 58rpx;
            height: 58rpx;
            line-height: 58rpx;
            border-radius: 24rpx;
            &.nolm {
              color: #a2a6b9;
              opacity: 0.8;
            }
            &.sion {
              width: 70rpx;
              height: 70rpx;
              margin-top: 18rpx;
            }
            &.miss {
              width: 56rpx;
              height: 56rpx;
              border-radius: 24rpx;
              color: #323949;
              background-color: #f5f6fa;
              position: relative;
            }
          }
          .sign {
            width: 56rpx;
            height: 56rpx;
            border-radius: 24rpx;
            color: #323949;
            background-color: #f5f6fa;
            position: relative;
            &:before {
              position: absolute;
              bottom: 0;
              right: 0;
              width: 20rpx;
              height: 20rpx;
              content: '';
              display: block;
              background: #ffffff;
              background-size: cover;
            }
          }
          .today-text {
            position: absolute;
            font-size: 20upx;
            font-weight: normal;
            width: 20upx;
            height: 20upx;
            line-height: 20upx;
            right: 0;
            top: 10upx;
            color: #fff;
          }
        }
      }
    }
  }

  .open-box {
    width: 100%;
    height: 50px;
    .common-open {
      margin-top: 30rpx;
    }
  }
</style>
