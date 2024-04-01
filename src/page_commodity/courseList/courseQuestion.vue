<!--
* @desc 每日一练
* @author daisitin
* @date 2022年04月24日
-->
<template>
  <view class="wrap-question flex flex-column">
    <view class="topbar"> </view>
    <view class="flex-item topbox">
      <!-- #ifndef MP-BAIDU -->
      <view class="iconfont icon-return" @tap="toReturn"></view>
      <!-- #endif -->
      <view class="title-day">练习模式</view>
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
    <view
      class="bottom-box flex-between"
      v-if="list[currentIndex] && list[currentIndex].needAnalysis"
    >
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
    <!-- 返回的时候的提醒弹窗 -->
    <ReturnModal ref="returnModal" @toExit="toExit()" @toContinue="toContinue()" />
  </view>
</template>

<script>
  import QuestionSwiper from '@/components/QuestionSwiper/QuestionSwiper.vue';
  import QuestionComp from '@/components/QuestionSwiper/QuestionComp.vue';
  // import { getUnitList } from '@/api/modules/question/exam.ts';
  import { addFavorite, removeFavorite } from '@/api/modules/user/aggregate.ts';
  import { submitQuestion, getUnitListByType } from '@/api/modules/question/index.ts';
  import ReturnModal from './comps/ReturnModal.vue';

  export default {
    name: 'courseQuestion',
    components: { QuestionSwiper, QuestionComp, ReturnModal },
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
        update: true, // 用于h5刷新视图
        code: '', // 存储访问凭证 用于接口的新改动
        saveList: [], //点击退出暂存的数据
        showmodal: true,
      };
    },
    onUnload() {
      uni.$off();
    },
    onLoad(options) {
      console.log('options---', options);
      // {"productId":"PROD100000345","unit":"UNIT10204730","code":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiI1MTIwMTQ1ODgiLCJ1bml0IjoiVU5JVDEwMjA0NzMwIiwicHJvamVjdElkIjoiMTAwNzgiLCJzdWJqZWN0SWQiOiIxMDA4MCIsInByb2R1Y3RJZCI6IlBST0QxMDAwMDAzNDUiLCJub25jZSI6Inkya2E4aDRtdmw5cWhsdW8iLCJwcmV2aWV3TnVtIjowfQ.0E5E0_Nyohu0rENhqD7kWZgfUUYrWW2a94znA2XRW4w","questionType":"10","count":"30","recordType":"0"}
      // this.code = options.code;
      // this.questionType = options.questionType;
      // this.recordType = options.recordType,
      // this.count = options.count,
      // this.cord = options.code;
      this.code = options.code;
      let params = {
        questionType: options.questionType,
        recordType: options.recordType,
        count: options.count,
        code: options.code,
      };
      // this.getUnitList(options.code);
      this.getUnitList(params);
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
        this.currentIndex = currentIndex;
      },
      //做题记录
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
      // 获取做题
      async getUnitList(params) {
        this.$store.commit('setShowType', 0);
        // const data = await getUnitList({ code });
        const data = await getUnitListByType(params);
        this.list = data.body.questions;
        // 如果是抖音 不做定位处理
        /* #ifndef MP-TOUTIAO */
        this.currentIndex = data.body.index;
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
      // 退出
      async toExit() {
        console.log(this.saveList, 'userAnserlist');
        // return;
        if (this.saveList.length === 0) {
          uni.navigateBack();
        } else {
          let params = {
            code: this.code,
            answers: this.saveList,
            interrupt: true,
          };
          const res = await submitQuestion(params);
          if (res.code === 1000) {
            uni.navigateBack();
          }
        }
      },
      // 中途返回
      toReturn() {
        this.$refs.returnModal.showModal = true;
      },
      // 继续做题
      toContinue() {
        this.$refs.returnModal.showModal = false;
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
    .flex-between {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>
