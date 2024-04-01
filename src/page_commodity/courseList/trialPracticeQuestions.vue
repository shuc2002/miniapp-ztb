<!--
* @desc 每日一练
* @author daisitin
* @date 2022年04月24日
-->
<template>
  <view>
    <u-mask :show="show" @click="show = false" :custom-style="{ background: 'rgba(0,0,0,0.6)' }">
      <view class="mask-box">
        <img
          src="https://acc.wangxiao.cn/image/certificate/swiperImg.png"
          alt=""
          class="tips-img"
        />
        <view class="tips-text">左右滑动可切换题目</view>
      </view>
      <!-- <img src="" alt="" /> -->
    </u-mask>
    <view class="wrap-question flex flex-column" @tap.stop>
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
      <view>
        <!-- 题目栏 -->
        <view class="question-box">
          <view class="text-size-sn common-text">{{ projectName }}</view>
          <!-- 题目信息 start  -->
          <view>
            <text class="text-size-xl common-blue common-text-700">{{ currentIndex + 1 }}</text>
            <text class="text-size-xxs common-message common-text-400">/</text>
            <text class="text-size-sn common-message common-text-400">{{ itemLength }}</text>
          </view>
        </view>
      </view>
      <!-- 做题轮播图 -->
      <QuestionSwiper
        class="main"
        ref="swiper"
        :list="list"
        :dataIndex="currentIndex"
        @change="change"
      >
        <!-- #ifndef MP-TOUTIAO -->
        <template v-slot:default="{ item }">
          <!-- #ifdef H5 -->
          <view class="comps-box" v-if="update">
            <QuestionComp :questionData="item" height="calc(100vh - 160px)" />
          </view>
          <!-- #endif -->
          <!-- #ifndef H5 -->
          <view class="comps-box">
            <QuestionComp :questionData="item" height="calc(100vh - 160px)" />
          </view>
          <!-- #endif -->
        </template>
        <!-- #endif -->
      </QuestionSwiper>
      <view class="bottom-box" v-if="list[currentIndex] && list[currentIndex].needAnalysis">
        <view
          class="flex-center"
          @tap="!list[currentIndex].isCollected ? handleFavorite() : cancelFavorite()"
        >
          <view
            class="t-icon image-style"
            :class="!list[currentIndex].isCollected ? 't-icon-icon_collect' : 't-icon-aixin'"
          />
          <view class="common-text text-size-xxs common-text-400">{{
            !list[currentIndex].isCollected ? '收藏' : '取消收藏'
          }}</view>
        </view>
        <!-- #ifdef MP-BAIDU -->
        <view class="flex-center" @tap="toReturn()">
          <view class="t-icon image-style iconfont icon-power exit-icon" />
          <view class="common-text text-size-xxs common-text-400">退出</view>
        </view>
        <!-- #endif -->
      </view>
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
      <!-- 返回的时候的提醒弹窗 -->
      <ReturnModal ref="returnModal" @toExit="toExit()" @toContinue="toContinue()" />
    </view>
  </view>
</template>

<script>
  import QuestionSwiper from '@/components/QuestionSwiper/QuestionSwiper.vue';
  import QuestionComp from '@/components/QuestionSwiper/QuestionComp.vue';
  // import { getUnitList } from '@/api/modules/question/exam.ts';
  import { addFavorite, removeFavorite } from '@/api/modules/user/aggregate.ts';
  import { getTrialPractice } from '@/api/modules/question/exercise.ts';
  import { submitQuestion } from '@/api/modules/question/index.ts';
  import PopupWindow from '@/components/PopupComp/PopupWindow.vue';
  import ReturnModal from '../courseList/comps/ReturnModal.vue';
  import { getChannelMsg } from '@/api/modules/user/index.ts';
  // import {
  //   questionRecord,
  //   getUnitListByType,
  //   getExamineQuestion,
  // } from '@/api/modules/question/index.ts';
  export default {
    name: 'courseQuestion',
    components: {
      QuestionSwiper,
      QuestionComp,
      PopupWindow,
      ReturnModal,
    },
    computed: {
      projectName() {
        return this.$store.getters.getProjectName;
      },
    },
    data() {
      return {
        currentIndex: 0, //当前题目位置
        itemLength: 0, // 题目长度
        list: [],
        index: [], // 试学到哪一题了
        limit: [], // 可试学总数
        isPurchase: false,
        update: true, // 用于h5刷新视图
        code: '', // 存储访问凭证 用于接口的新改动
        saveList: [], //点击退出暂存的数据
        show: true, //遮罩层是否展示
        appName: '', //应用名称
      };
    },
    onUnload() {
      uni.$off();
    },
    async onLoad(options) {
      const { body } = await getChannelMsg();
      this.appName = body.appName;
      console.log('options--', options);
      const { code } = options;

      this.code = code;
      this.isPurchase = options.isPurchase;
      console.log('isPurchase--', this.isPurchase);
      // 获取试学练习信息
      // this.getExamineQuestion();
      this.getUnitList({ code });
      //监听改变单选选项
      uni.$on('changeRadio', ({ id, userAnswer, index }) => {
        this.update = false;
        this.$set(this.list[this.currentIndex], 'userAnswer', userAnswer);
        this.$set(this.list[this.currentIndex], 'needAnalysis', true);
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
      // 确认回答
      uni.$on('turnLast', ({ id, userAnswer, index }) => {
        this.update = false;
        this.$set(this.list[this.currentIndex], 'needAnalysis', true);
        this.$set(this.list[this.currentIndex], 'userAnswer', userAnswer);
        this.$forceUpdate();
        this.record(id, userAnswer, index);
        this.$nextTick(() => {
          this.update = true;
        });
      });
    },
    methods: {
      // 切换
      change(currentIndex) {
        console.log('111--', currentIndex, this.isPurchase, this.limit);
        if (currentIndex > this.limit - 1 && this.isPurchase.toString() == 'false') {
          this.onLimited();
          this.currentIndex = this.limit - 1;
          return;
        }
        this.currentIndex = currentIndex;
      },
      //做题记录
      // async record(questionId, answer, index) {
      //   await questionRecord({ questionId, code: this.code, answer, index });
      // },
      async record(questionId, answer, index) {
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
        //await questionRecord({ questionId, code: this.code, answer, index });
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
      // 获取做题
      async getUnitList(params) {
        this.$store.commit('setShowType', 0);
        // const data = await getUnitList({ code });
        const { body } = await getTrialPractice(params);
        const { questions, index, limit } = body;
        this.list = questions;
        this.currentIndex = index;
        this.limit = limit;
        // 如果是抖音 不做定位处理
        /* #ifndef MP-TOUTIAO */
        // this.currentIndex = body.index;
        /* #endif */
        //  this.currentIndex = data.body.index;
        //填空题做特殊处理，且有答案的题目加上判断是否显示解析
        this.list.map((item) => {
          if (!item.userAnswer) {
            item.needAnalysis = false;
            if (item.type == 3) {
              item.userAnswer = [];
              item.judge.map((_) => {
                item.userAnswer.push('');
              });
            }
          } else {
            if (item.userAnswer.toString() != '') {
              item.needAnalysis = true;
            } else {
              item.needAnalysis = false;
            }
          }
        });
        this.itemLength = this.list.length;
      },
      // 收藏
      async handleFavorite() {
        await addFavorite({
          id: this.list[this.currentIndex].id,
          code: this.code,
          index: this.list[this.currentIndex].index,
        });
        this.$set(this.list[this.currentIndex], 'isCollected', true);
      },
      // 取消收藏
      async cancelFavorite() {
        await removeFavorite({
          questionId: this.list[this.currentIndex].id,
          index: this.list[this.currentIndex].index,
        });
        this.$set(this.list[this.currentIndex], 'isCollected', false);
      },
      // 退出
      async toExit() {
        console.log(this.saveList, 'userAnserlist');

        const tag = this.limit > 0 && this.isPurchase.toString() == 'false';
        console.log(tag, '练习');
        // return;
        if (this.saveList?.length === 0 || this.saveList == undefined) {
          console.log(11);
          uni.navigateBack();
        } else {
          console.log(22);
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
      // 中途返回
      toReturn() {
        this.show = false;
        this.$refs.returnModal.showModal = true;
      },
      // 继续做题
      toContinue() {
        this.$refs.returnModal.showModal = false;
      },
    },
  };
</script>
<style lang="scss" scoped>
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
  .question-box {
    padding: 48rpx 40rpx;
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2rpx solid #f5f6fa;
  }
  .comps-box {
    height: 100%;
    overflow-y: scroll;
  }
  .bottom-box {
    width: 100vw;
    height: 134rpx;
    padding-top: 30rpx;
    background-color: white;
    position: fixed;
    bottom: 0;
    box-shadow: 0 -6px 8px 0 #f5f6fa;
    .image-style {
      width: 36rpx;
      height: 36rpx;
      margin-right: 20rpx;
    }
  }
  .mask-box {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100%;
    .tips-img {
      width: 277px;
      height: 46px;
      margin-bottom: 36px;
    }
    .tips-text {
      color: #ffffff;
      font-family: 'PingFang SC';
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
    }
  }
</style>
