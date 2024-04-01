<!--
* @desc 模拟考试做题页
* @author daisitin
* @date 2022年06月14日
-->
<template>
  <view class="wrap-question flex flex-column">
    <view class="topbar"> </view>
    <view class="flex-item topbox">
      <!-- #ifndef MP-BAIDU -->
      <view class="iconfont icon-return" @tap="toReturn"></view>
      <!-- #endif -->
      <view class="title-day">{{ appName }}</view>
    </view>
    <view class="trial-container" v-if="isPurchase == 'false'">
      <view class="trial-progress">
        <text>试学进度</text>
        <text>{{ currentIndex + 1 }}/{{ limit }}</text>
      </view>
      <view class="trial-tip">
        <text class="iconfont icon-confirm icon-free"></text>
        <text class="trial-tip-title">该产品支持试学</text>
      </view>
    </view>
    <!-- 头部栏 -->
    <headTab
      ref="headTab"
      :questionNum="currentIndex + 1"
      :sumNumber="sumNumber"
      :time="time"
      @finish="onFinish"
    />
    <!-- 做题轮播图 -->
    <QuestionSwiper ref="swiper" :list="list" :dataIndex="currentIndex" @change="changeNum">
      <!-- #ifndef MP-TOUTIAO -->
      <template v-slot:default="{ item }">
        <!-- #ifdef H5 -->
        <view class="comps-box" v-if="update">
          <QuestionComp :questionData="item" height="calc(100vh - 200px)" />
        </view>
        <!-- #endif -->
        <!-- #ifndef H5 -->
        <view class="comps-box">
          <QuestionComp :questionData="item" height="calc(100vh - 200px)" />
        </view>
        <!-- #endif -->
      </template>
      <!-- #endif -->
    </QuestionSwiper>
    <!-- 底部栏 -->
    <BottomTab
      ref="bottomTab"
      :list="answerSheet"
      :isAnalysis="list[currentIndex].isCollected"
      :isDisabled="isDisabled"
      :checked="checked"
      @analysisItem="analysisItem"
      @changeNum="changeNum"
      @submit="submit"
      @isReturn="goReturn"
      @switchChange="switchChange"
    />
    <PopupWindow
      ref="over"
      title="考试结束"
      :canClose="false"
      confirmTitle="交卷"
      @confirm="submit"
    >
      <view class="text-size-main">本场考试时间已到，请您提交试卷</view>
    </PopupWindow>
    <!-- 返回的时候的提醒弹窗 -->
    <ReturnModal ref="returnModal" @toExit="toExit()" @toContinue="toContinue()" />
    <!-- 试用结束 -->
    <PopupWindow
      ref="limited"
      title="您的试学已结束"
      :canClose="false"
      :cancelShow="true"
      cancelTitle="再看看"
      confirmTitle="去购买"
      @confirm="gotoHome"
    >
      <view class="text-size-main" :style="{ padding: '0 80rpx' }"
        >如果觉得体验不错，可购买进行完整学习</view
      >
    </PopupWindow>
  </view>
</template>
<script>
  import headTab from '../comps/HeadTab.vue';
  import BottomTab from '../comps/BottomTab.vue';
  import QuestionSwiper from '@/components/QuestionSwiper/QuestionSwiper.vue';
  import QuestionComp from '@/components/QuestionSwiper/QuestionComp.vue';
  import PopupWindow from '@/components/PopupComp/PopupWindow.vue';
  import { getUnitList, getAnalysisList } from '@/api/modules/question/exam.ts';
  import { doCollect } from '@/api/modules/question/index.ts';
  import { removeFavorite } from '@/api/modules/user/aggregate.ts';
  import { submitQuestion } from '@/api/modules/question/index.ts';
  import ReturnModal from '../comps/ReturnModal.vue';
  import { getChannelMsg } from '@/api/modules/user/index.ts';
  export default {
    name: 'paperContent',
    components: {
      headTab,
      BottomTab,
      QuestionSwiper,
      QuestionComp,
      PopupWindow,
      ReturnModal,
    },
    data() {
      return {
        currentIndex: 0,
        dataLength: 0,
        time: 0,
        list: [],
        limit: [],
        isPurchase: false,
        sumNumber: 0,
        answerSheet: [],
        card: [],
        allList: [],
        wrongList: [],
        checked: false,
        cardTypeList: [], // 分题型的底部弹窗数据
        recordGroup: [], // 未分题型的原始数据
        update: true, // 用于h5刷新视图
        saveList: [],
        appName: '', //应用名称
      };
    },
    async onUnload() {
      uni.$off();
    },
    computed: {
      code() {
        return this.$store.getters.getExamCode;
      },
      isDisabled() {
        return this.wrongList.length == 0;
      },
    },
    async onLoad(options) {
      const { body } = await getChannelMsg();
      this.appName = body.appName;
      console.log('123---', options);
      const { code } = options;
      this.code = code;
      this.list = [];
      if (options.analysis) {
        this.card = JSON.parse(options.card);
        this.answerSheet = this.card;
        this.currentIndex = Number(options.index);
        this.getAnalysis(JSON.parse(options.cardAllList));
        this.$store.commit('setShowType', 1);
      } else {
        this.getUnit(code);
        this.$store.commit('setShowType', 0);
        this.isPurchase = options.isPurchase;
      }
      //监听改变单选选项
      uni.$on('changeRadio', ({ userAnswer, id, index }) => {
        this.update = false;
        this.$set(this.list[this.currentIndex], 'userAnswer', userAnswer);
        this.record(id, userAnswer, index);
        this.$nextTick(() => {
          this.update = true;
        });
      });
      //监听改变多选选项
      uni.$on('changeCheckbox', ({ userAnswer }) => {
        this.$set(this.list[this.currentIndex], 'userAnswer', userAnswer);
      });
      //监听改变填空
      uni.$on('changeFill', ({ userAnswer }) => {
        this.$set(this.list[this.currentIndex], 'userAnswer', userAnswer);
      });
      // 翻页监听
      uni.$on('turnLast', ({ userAnswer, id, index }) => {
        this.update = false;
        this.record(id, userAnswer, index);
        this.$nextTick(() => {
          this.update = true;
        });
      });
    },
    methods: {
      //获取学习单元题目列表
      async getUnit(code) {
        const res = await getUnitList({ code });
        const { questions, limit } = res.body;
        this.list = questions;
        this.limit = limit;
        this.list.map((item) => {
          if (!item.userAnswer && item.type == 3) {
            item.userAnswer = [];
            item.judge.map((_) => {
              item.userAnswer.push('');
            });
          }
        });
        setTimeout(() => {
          this.currentIndex = res.body.index;
        }, 300);
        this.time = res.body.time != 0 ? res.body.time * 1000 : (res.body.time + 1) * 1000;
        this.sumNumber = res.body.questions.length;
        this.recordGroup = res.body.recordGroup;
        let recordList = [];
        this.recordGroup.forEach((item, index, arr) => {
          if (index === 0 || item.groupName !== arr[index - 1].groupName) {
            recordList.push({ groupName: item.groupName, list: [] });
          }
          const choose = item.choose === undefined ? null : item.choose;
          recordList[recordList.length - 1].list.push({ choose, index, name: item.key });
        });
        this.answerSheet = recordList;
      },
      //解析列表
      async getAnalysis(cardAllList) {
        const res = await getAnalysisList({ code: this.code });
        this.list = res.body;
        this.list.map((item) => {
          item.needAnalysis = true;
        });
        this.list.map((item) => {
          if (!item.userAnswer && item.type == 3) {
            item.userAnswer = [];
            item.judge.map((_) => {
              item.userAnswer.push('');
            });
          } else if (!item.userAnswer && item.type == 2) {
            item.userAnswer = [''];
          } else if (!item.userAnswer) {
            item.userAnswer = [];
          }
        });
        this.allList = res.body;
        //只获取错题
        this.wrongList = [];
        let wrongType = [];
        cardAllList.map((item, index) => {
          if (!item.choose) {
            this.wrongList.push(this.list[index]);
            wrongType.push(item);
          }
        });
        let recordList = [];
        wrongType.forEach((item, index, arr) => {
          if (index === 0 || item.groupName !== arr[index - 1].groupName) {
            recordList.push({ groupName: item.groupName, list: [] });
          }
          const choose = item.choose === undefined ? null : item.choose;
          recordList[recordList.length - 1].list.push({ choose, index, name: item.key });
        });
        this.cardTypeList = recordList;
        this.sumNumber = res.body.length;
      },
      // 中途返回
      toReturn() {
        console.log(3333, this.saveList);
        if (this.saveList?.length > 0) {
          this.$refs.returnModal.showModal = true;
        } else {
          uni.navigateBack();
        }
      },
      goReturn() {
        this.toReturn();
      },
      // 继续做题
      toContinue() {
        this.$refs.returnModal.showModal = false;
      },
      // 退出
      async toExit() {
        // return;
        const tag = this.limit > 0 && this.isPurchase.toString() == 'false';
        if (this.saveList.length === 0) {
          uni.navigateBack();
        } else {
          let params = {
            code: this.code,
            answers: this.saveList,
            interrupt: tag ? false : true,
          };
          const res = await submitQuestion(params);

          if (res.code === 1000) {
            uni.navigateBack();
          }
        }
      },
      //翻页或修改
      changeNum(num) {
        // 试学题目数量判断
        if (num > this.limit - 1 && this.isPurchase.toString() == 'false') {
          this.onLimited();
          return;
        }
        this.currentIndex = num;
      },
      //去购买
      async gotoHome() {
        const tag = this.limit > 0 && this.isPurchase.toString() == 'false';
        let params = {
          code: this.code,
          answers: this.saveList,
          interrupt: tag ? false : true,
        };
        await submitQuestion(params);
        const commodityId = uni.getStorageSync('chapterCommodityId');
        uni.navigateTo({
          url: `/page_commodity/commodity/pages/commodityBank?id=${commodityId}`,
        });
      },
      async onLimited() {
        this.$refs.limited.showModal = true;
      },
      //完成后打开答题卡弹窗
      onFinish() {
        this.$refs.over.showModal = true;
      },
      //做题记录
      async record(questionId, answer, index) {
        this.$set(this.recordGroup[this.currentIndex], 'choose', true);
        let recordList = [];
        this.recordGroup.forEach((item, index, arr) => {
          if (index === 0 || item.groupName !== arr[index - 1].groupName) {
            recordList.push({ groupName: item.groupName, list: [] });
          }
          const choose = item.choose === undefined ? null : item.choose;
          recordList[recordList.length - 1].list.push({ choose, index, name: item.key });
        });
        this.answerSheet = recordList;
        this.saveRecords(questionId, answer, index);
        // await questionRecord({ questionId, code: this.code, answer, index });
        if (this.currentIndex < this.list.length - 1) {
          //试学
          if (this.currentIndex >= this.limit - 1 && this.isPurchase.toString() == 'false') {
            this.onLimited();
            return;
          }
          this.currentIndex++;
        } else {
          //答题结束
          this.$refs.bottomTab.showPopup = true;
        }
      },
      //暂存数据
      saveRecords(questionId, answer, index) {
        if (this.saveList.length == 0) {
          this.saveList.push({
            id: questionId,
            index: index,
            answer: answer,
          });
        } else {
          let indexZ = -1;
          this.saveList.map((item, index) => {
            if (item.id == questionId) {
              indexZ = index;
            }
          });
          if (indexZ != -1) {
            this.saveList[indexZ] = {
              id: questionId,
              index: index,
              answer: answer,
            };
          } else {
            this.saveList.push({
              id: questionId,
              index: index,
              answer: answer,
            });
          }
        }
      },
      async submit() {
        this.userAnswerList = [];
        //获取答案list
        this.list.map((item) => {
          // 修改答案格式，多选题需处理
          this.userAnswerList.push({
            id: item.id,
            index: item.index,
            answer: item.userAnswer ? item.userAnswer : [''],
          });
        });
        const res = await submitQuestion({ code: this.code, answers: this.userAnswerList });
        if (res.code == 1000) {
          uni.redirectTo({
            url: '/page_mockExam/paperReport/index',
          });
        }
      },
      //收藏状态改变
      async analysisItem(val) {
        if (val) {
          await removeFavorite({
            questionId: this.list[this.currentIndex].id,
            index: this.list[this.currentIndex].index,
          });
        } else {
          await doCollect({
            id: this.list[this.currentIndex].id,
            index: this.list[this.currentIndex].index,
            code: this.code,
          });
          uni.showToast({
            title: '收藏成功',
            icon: 'none',
          });
        }
        this.$set(this.list[this.currentIndex], 'isCollected', !val);
      },
      // 只查看错题
      switchChange(val) {
        this.answerSheet = [];
        if (val) {
          this.list = this.wrongList;
          this.answerSheet = this.cardTypeList;
          this.checked = true;
        } else {
          this.list = this.allList;
          this.answerSheet = this.card;
          this.checked = false;
        }
        this.currentIndex = 0;
        this.sumNumber = this.list.length;
      },
    },
  };
</script>
<style lang="scss" scoped>
  .comps-box {
    height: 100%;
    overflow-y: scroll;
  }
  .wrap-question {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    font-size: 32rpx;
    .topbar {
      width: 100%;
      height: 88rpx;
      padding-top: 68rpx;
      padding-left: 32rpx;
      // background: linear-gradient(143.4deg, #ff6f66ff 0%, #ff3e3eff 100%);
    }
    .topbox {
      position: relative;

      .icon-return {
        position: absolute;
        left: 32rpx;
        top: -20rpx;
        color: #333333;
        font-size: 32rpx;
      }
      .title-day {
        text-align: center;
        width: 100%;
        margin-top: -20rpx;
      }
    }
    .trial-container {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      background-color: #e5e6eb;
      height: 34px;
      padding: 0 15px;
      align-items: center;
      .trial-progress {
        display: flex;
        align-items: center;
        border-radius: 18px;
        opacity: 1;
        background: #5b648d;
        color: #ffffff;
        font-size: 10px;
        font-weight: 500;
        height: 18px;
        padding: 0 8px;
      }
      .trial-tip {
        display: flex;
        align-items: center;
        .trial-tip-title {
          color: #4e5969;
          font-size: 11px;
          font-weight: 400;
        }
        .icon-free {
          color: #4e5969;
          font-size: 11px;
          margin-top: 2.5px;
          margin-right: 3px;
        }
      }
    }
  }
</style>
