<!--
* @desc 考试答题报告
* @author daisitin
* @date 2022年06月16日
-->
<template>
  <view class="common-bg">
    <!-- 个人纪录 start  -->
    <view class="report-msg">
      <image :src="avatar" mode="aspectFill" />
      <p class="text-size-main common-text-700">
        {{ paper.title }}
      </p>
      <p class="text-size-sn product-name-box"> 考试科目: {{ paper.subject }} </p>
      <p class="text-size-lg common-black">
        {{ paper.score }} <text class="text-size-sn common-text-400"> 分</text>
      </p>
      <view class="flex-center-box score-box common-tip text-size-xxs">
        <text>总分: {{ Number(paper.totalScore).toFixed(1) }}分</text>
        <text>及格分: {{ Number(paper.passLine).toFixed(1) }}分</text>
      </view>
      <view class="score-msg-box flex-center-box">
        <view>
          <p class="text-size-main common-text-700">{{ paper.top }}</p>
          <p class="text-size-xxs common-tip common-text-400">全站最高分</p>
        </view>
        <view>
          <p class="text-size-main common-text-700">{{ paper.avg }}</p>
          <p class="text-size-xxs common-tip common-text-400">全站平均分</p>
        </view>
        <view>
          <p class="text-size-main common-text-700">{{ paper.myTop }}</p>
          <p class="text-size-xxs common-tip common-text-400">我的最高分</p>
        </view>
      </view>
      <p class="text-size-xxs common-tip">交卷时间: {{ paper.submitTime }}</p>
    </view>
    <!-- 个人纪录 end  -->
    <!-- 历史得分记录折线图 start -->
    <view class="block-box">
      <view class="flex mb-30">
        <image src="../static/score-icon.png" mode="scaleToFill" />
        <p class="text-size-main common-text-700">历史得分记录</p>
      </view>
      <qiun-data-charts
        type="area"
        :eopts="{ seriesTemplate: { areaStyle: { opacity: 0.2 } } }"
        :chartData="chartsDataLine"
        :echartsH5="true"
        :echartsApp="true"
      />
    </view>
    <!-- 历史得分记录折线图 end  -->
    <!-- 答题卡 start  -->
    <view class="block-box">
      <view class="flex">
        <image src="../static/sheet-icon.png" mode="scaleToFill" />
        <p class="text-size-main common-text-700">答题卡</p>
      </view>
      <scroll-view :scroll-y="true" class="anwser-sheept">
        <view v-for="(data, key) in bottomList" :key="key">
          <p>{{ data.groupName }}</p>
          <view class="flex-wrap flex">
            <view
              v-for="(item, index) in data.list"
              :key="index"
              class="answer-box flex-center"
              :class="
                item.choose == true
                  ? 'option-right-plain'
                  : item.choose == false
                  ? 'option-error-plain'
                  : ''
              "
              @tap="goRouteTo('答题卡', item)"
              >{{ item.name }}</view
            >
          </view>
        </view>
      </scroll-view>
    </view>
    <!-- 答题卡 end  -->
    <!-- 提升建议 start  -->
    <view class="block-box suggest-box">
      <view class="flex">
        <image src="../static/up-icon.png" mode="scaleToFill" />
        <p class="text-size-main common-text-700">提升建议</p>
      </view>
      <view class="common-message tip-box">{{ paper.adviceTitle }}</view>
      <p class="text-size-xxs common-text-400">{{ paper.advice }}</p>
    </view>

    <view style="height: 180rpx" />
    <!-- 底部按钮 -->
    <cover-view class="bottom-btn-box flex-center">
      <button class="btn" @tap="goRouteTo('错题重做')">错题重做</button>
      <button class="analysis-btn" @tap="goRouteTo('查看解析')">查看解析</button>
    </cover-view>
  </view>
</template>
<script>
  import { getAnalysis } from '@/api/modules/question/exam.ts';

  export default {
    name: 'paperReport',
    data() {
      return {
        paper: {
          paperName: '2022年二级建造师模拟考试',
          product: '工程经济学',
          score: 64,
          sumScore: 120,
          paperDate: '2022-05-13 14:52',
        },
        option: {},
        chartsDataLine: {},
        bottomList: [], // 分题型显示
      };
    },
    computed: {
      avatar() {
        return this.$store.getters.getAvatar || '../../static/img/mine/default-Avatar.png';
      },
      code() {
        return this.$store.getters.getExamCode;
      },
      cardString() {
        return JSON.stringify(this.bottomList);
      },
      cardAllList() {
        return JSON.stringify(this.paper.cardGroup);
      },
    },
    onLoad() {
      this.getReport();
    },
    methods: {
      async getReport() {
        const data = await getAnalysis({ code: this.code });
        this.paper = data.body;
        let list = [];
        this.paper.cardGroup.forEach((item, index, arr) => {
          if (index === 0 || item.groupName !== arr[index - 1].groupName) {
            list.push({ groupName: item.groupName, list: [] });
          }
          const choose = item.choose === undefined ? null : item.choose;
          list[list.length - 1].list.push({ choose, index, name: item.key });
        });
        this.bottomList = list;
        let arr = [];
        //渲染echats satrt
        this.paper.history.map(() => {
          arr.push('');
        });
        this.chartsDataLine = {
          categories: arr,
          series: [{ name: '成绩', data: this.paper.history }],
        };
        //渲染echats end
      },
      goRouteTo(index, item) {
        switch (index) {
          case '答题卡':
            uni.navigateTo({
              url: `/page_mockExam/paperContent/index?analysis=true&card=${this.cardString}&index=${item.index}&cardAllList=${this.cardString}`,
            });
            break;
          case '错题重做':
            uni.navigateTo({
              url: '/business/myRecords/index?activeNum=0',
            });
            break;
          case '查看解析':
            uni.navigateTo({
              url: `/page_mockExam/paperContent/index?analysis=true&card=${this.cardString}&index=0&cardAllList=${this.cardAllList}`,
            });
            break;
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
  @import '@/common/css/rushQuestion.scss';
  .common-bg {
    padding: 64rpx 0;
  }
  .block-box {
    background-color: #ffffff;
    padding: 24rpx;
    margin: 24rpx 24rpx 0 24rpx;
    border-radius: 24rpx;
    line-height: 1.5;
    image {
      width: 48rpx;
      height: 48rpx;
      margin-right: 16rpx;
    }
    .tip-box {
      border-radius: 16rpx;
      background-color: #f5f6fa;
      margin: 48rpx 0 16rpx 0;
      height: 76rpx;
      line-height: 76rpx;
      text-align: center;
    }
  }
  .report-msg {
    background-color: #ffffff;
    padding: 90rpx 24rpx 48rpx 24rpx;
    margin: 0 24rpx;
    border-radius: 24rpx;
    position: relative;
    text-align: center;
    image {
      width: 128rpx;
      height: 128rpx;
      border-radius: 50%;
      border: 4rpx solid #ffffff;
      position: absolute;
      top: -64rpx;
      left: calc(50% - 64rpx);
    }
    .product-name-box {
      margin-top: 16rpx;
      margin-bottom: 42rpx;
    }
    .score-box {
      padding: 0 150rpx;
      margin-bottom: 42rpx;
      text {
        flex-shrink: 0;
      }
    }
    .score-msg-box {
      background-color: #f5f6fa;
      margin-bottom: 42rpx;
      border-radius: 16rpx;
      padding: 32rpx;
      view {
        text-align: center;
        display: flex;
        flex-flow: column;
        align-items: center;
      }

      .text-size-xxs {
        flex-shrink: 0;
      }
    }
  }
  .anwser-sheept {
    width: 100%;
    height: 600rpx;
    padding: 0;
    margin: 20rpx 0rpx;
    p {
      margin-left: 16rpx;
      margin-top: 24rpx;
    }
  }
  .bottom-btn-box {
    width: 100%;
    position: fixed;
    bottom: 0;
    height: 180rpx;
    background: #ffffff;
    box-shadow: 0 -6px 8px 0 #e9e9e9;
    z-index: 9999;
    .btn {
      width: 320rpx;
      padding: 10rpx;
      border-radius: 24rpx;
      margin-right: 26rpx;
      font-size: 32rpx;
      font-weight: 700;
      background-color: #f5f6fa;
      color: #5b648d;
      margin-left: 48rpx;
    }
    .analysis-btn {
      width: 320rpx;
      padding: 10rpx;
      border-radius: 24rpx;
      font-size: 32rpx;
      font-weight: 700;
      background-color: #475ffd;
      color: #ffffff;
      margin-right: 48rpx;
    }
  }
  .mb-30 {
    margin-bottom: 30rpx;
  }
</style>
