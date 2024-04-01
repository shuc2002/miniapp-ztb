<template>
  <view class="wrap-question flex flex-column">
    <view class="topbar"> </view>
    <view class="flex-item topbox">
      <!-- #ifndef MP-BAIDU -->
      <view class="iconfont icon-return" @tap="toReturn"></view>
      <!-- #endif -->
      <view class="title-day">错题记录</view>
    </view>
    <view class="question-box">
      <view class="text-size-sn">{{ subjectName }}</view>
      <view class="text-size-sn common-text">
        <p class="text-size-xxs">
          <text class="text-size-xl common-blue common-text-700">{{ currentIndex + 1 }}</text>
          <text class="text-size-sn common-text-400">/</text>{{ total }}
        </p>
      </view>
    </view>
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
    <view class="bottom-box between-box" v-if="activeNum == 0">
      <view class="answer-btn flex-column-center" @tap="handleDelete()">
        <view class="t-icon t-icon-shanchu image-style" />
        <view class="common-text text-size-xxs common-text-400">移除</view>
      </view>
      <!-- #ifdef MP-BAIDU -->
      <view class="answer-btn flex-column-center" @tap="toReturn()">
        <view class="t-icon image-style iconfont icon-power exit-icon" />
        <view class="common-text text-size-xxs common-text-400">退出</view>
      </view>
      <!-- #endif -->
      <view
        class="flex-column-center collect-btm"
        @tap="handleFavorite()"
        v-if="list[currentIndex] && !list[currentIndex].isCollected"
      >
        <view class="t-icon t-icon-icon_collect image-style" />
        <view class="common-text text-size-xxs common-text-400">收藏</view>
      </view>
      <view
        class="flex-column-center"
        @tap="cancelFavorite()"
        v-if="list[currentIndex] && list[currentIndex].isCollected"
      >
        <view class="t-icon t-icon-aixin image-style" />
        <view class="common-text text-size-xxs common-text-400">取消收藏</view>
      </view>
    </view>
    <view class="bottom-box flex-center" v-if="activeNum == 1">
      <view class="flex-column-center" @tap="cancelFavorite()">
        <view class="t-icon t-icon-aixin image-style" />
        <view class="common-text text-size-xxs common-text-400">取消收藏</view>
      </view>
    </view>
    <view class="order-content" v-if="showModal" @tap.stop="cancel()">
      <cover-view class="order-box" @tap.stop>
        <cover-view class="text-size-main common-text-700 text-item">是否移除此错题</cover-view>
        <cover-view class="nav-btn">
          <button class="cancel-btn" @tap.stop="cancel()">下次再说</button>
          <button class="success-btn" @tap.stop="handleSuccess()">移除</button>
        </cover-view>
      </cover-view>
    </view>
    <!-- 返回的时候的提醒弹窗 -->
    <ReturnModal ref="returnModal" @toExit="toExit()" @toContinue="toContinue()" />
  </view>
</template>
<script>
  import {
    getWrongQuestion,
    getFavoriteQuestion,
    removeWrong,
    favoriteWrong,
    removeFavorite,
    saveWrong,
  } from '@/api/modules/user/aggregate.ts';
  import QuestionSwiper from '@/components/QuestionSwiper/QuestionSwiper.vue';
  import QuestionComp from '@/components/QuestionSwiper/QuestionComp.vue';
  import ReturnModal from '@/business/brushQuestions/comps/ReturnModal.vue';
  export default {
    name: 'wrongOrCollection',
    components: { QuestionSwiper, QuestionComp, ReturnModal },
    onLoad(options) {
      this.activeNum = parseInt(options.activeNum);
      this.subjectId = options.subjectId;
      this.subjectName = options.subjectName;
      this.getQuestion();
      //监听改变单选选项
      uni.$on('changeRadio', (item) => {
        // { userAnswer, id, index }
        this.update = false;
        this.$set(this.list[this.currentIndex], 'userAnswer', item.userAnswer);
        this.$set(this.list[this.currentIndex], 'needAnalysis', true);
        this.record(item);
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
      uni.$on('turnLast', (item) => {
        this.update = false;
        this.$set(this.list[this.currentIndex], 'needAnalysis', true);
        this.$forceUpdate();
        this.record(item);
        this.$nextTick(() => {
          this.update = true;
        });
      });
    },
    onUnload() {
      uni.$off();
    },
    data() {
      return {
        activeNum: 0,
        showModal: false,
        currentIndex: 0,
        page: 0,
        total: 0,
        subjectId: '',
        subjectName: '',
        list: [],
        update: true, // 用于h5刷新视图
        saveList: [], //已做的题目记录
      };
    },
    methods: {
      // 题目数据获取
      async getQuestion() {
        this.$store.commit('setShowType', 0);
        let res = '';
        if (this.activeNum == 0) {
          res = await getWrongQuestion({ subjectId: this.subjectId, index: this.page, row: 10 });
        } else {
          res = await getFavoriteQuestion({ subjectId: this.subjectId, index: this.page, row: 10 });
        }
        let data = res.body;
        data.map((item) => {
          item.needAnalysis = false;
          // if (item.userAnswer) {
          //   item.needAnalysis = true;
          // } else {
          if (item.type == 3) {
            item.userAnswer = [];
            item.judge.map((_) => {
              item.userAnswer.push('');
            });
          } else {
            item.userAnswer = [];
          }
          // }
        });
        if (this.list.length == 0) {
          this.list = data;
          this.total = res.page.total;
        } else if (this.list.length > 0) {
          this.list.push(...data);
        }
        if (res.body.length == 10) {
          this.page++;
          this.getQuestion();
        }
      },
      // 切换
      change(currentIndex) {
        this.currentIndex = currentIndex;
      },
      // 点击删除icon
      handleDelete() {
        this.showModal = true;
      },
      // 确定按钮
      async handleSuccess() {
        const res = await removeWrong({
          questionId: this.list[this.currentIndex].id,
          index: this.list[this.currentIndex].index,
        });
        if (res.code === 1000) {
          this.showModal = false;
          this.list.splice(this.currentIndex, 1);
          this.total -= 1;
          if (this.currentIndex + 1 > this.total) {
            this.currentIndex--;
          }
          if (this.total == 0) {
            uni.navigateBack();
          }
        }
      },
      // 收藏
      async handleFavorite() {
        const res = await favoriteWrong({
          questionId: this.list[this.currentIndex].id,
          index: this.list[this.currentIndex].index,
        });
        if (res.code === 1000) {
          this.$set(this.list[this.currentIndex], 'isCollected', true);
          uni.showToast({
            title: '收藏成功',
            icon: 'none',
          });
        } else {
          uni.showToast({
            title: '收藏失败',
            icon: 'none',
          });
        }
      },
      // 取消收藏
      async cancelFavorite() {
        const res = await removeFavorite({
          questionId: this.list[this.currentIndex].id,
          index: this.list[this.currentIndex].index,
        });
        if (res.code === 1000) {
          this.$set(this.list[this.currentIndex], 'isCollected', false);
          if (this.activeNum == 1) {
            this.list.splice(this.currentIndex, 1);
            this.total -= 1;
            if (this.total == 0) {
              uni.navigateBack();
            }
          }
          uni.showToast({
            title: '取消收藏成功',
            icon: 'none',
          });
        }
      },
      // 关闭弹窗
      cancel() {
        this.showModal = false;
      },
      // 中途返回
      toReturn() {
        this.$refs.returnModal.showModal = true;
      },
      // 退出
      async toExit() {
        console.log(this.saveList, 'userAnserlist');
        // return;
        if (this.saveList.length === 0) {
          uni.navigateBack();
        } else {
          let params = {
            code: '3001',
            answers: this.saveList,
          };
          const res = await saveWrong(params);
          if (res.code === 1000) {
            uni.navigateBack();
          }
        }
      },
      // 继续做题
      toContinue() {
        this.$refs.returnModal.showModal = false;
      },
      //记录已做的错题
      record(item) {
        const { id, userAnswer: answer, index, supplierId = '' } = item;
        // 先暂存
        if (this.saveList.length == 0) {
          this.saveList.push({
            id,
            supplierId,
            index,
            answer,
          });
        } else {
          let indexZ = -1;
          this.saveList.map((item, index) => {
            if (item.id == id) {
              indexZ = index;
            }
          });
          if (indexZ != -1) {
            this.saveList[indexZ] = {
              id,
              supplierId,
              index,
              answer,
            };
          } else {
            this.saveList.push({
              id,
              supplierId,
              index,
              answer,
            });
          }
        }
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
      height: 10rpx;
      padding-top: 68rpx;
      padding-left: 32rpx;
      // background: linear-gradient(143.4deg, #ff6f66ff 0%, #ff3e3eff 100%);
    }
    .topbox {
      position: relative;
      height: 40px;
      .icon-return {
        position: absolute;
        left: 32rpx;
        top: 56rpx;
        color: #333333;
        font-size: 32rpx;
      }
      .title-day {
        text-align: center;
        width: 100%;
        margin-top: 56rpx;
        font-size: 32rpx;
        color: #333333;
        font-family: Medium;
      }
    }
  }
  .question-box {
    padding: 48rpx 40rpx;
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 8rpx solid #ededf2;
  }
  .bottom-box {
    // width: 558rpx;
    width: 100%;
    height: 134rpx;
    background-color: white;
    position: fixed;
    bottom: 0;
    padding: 23rpx 96rpx;
    box-shadow: 0 -6px 8px 0 #f5f6fa;
    .image-style {
      width: 40rpx;
      height: 40rpx;
      margin-bottom: 12rpx;
    }
  }
  .between-box {
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    .collect-btm {
      margin-right: 24rpx;
    }
  }
  .order-content {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99;
    .order-box {
      width: 602rpx;
      height: 240rpx;
      border-radius: 24rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 64rpx;
      background: #ffffff;
      .text-item {
        margin-bottom: 16rpx;
        color: #2c364e;
      }
      .nav-btn {
        display: flex;
        margin-top: 48rpx;
        .cancel-btn {
          width: 244rpx;
          height: 88rpx;
          border-radius: 24rpx;
          background: #ecedf1;
          color: #5b648d;
          font-size: 32rpx;
          font-weight: 700;
          margin-right: 18rpx;
          &:active {
            opacity: 0.8;
          }
        }
        .success-btn {
          width: 244rpx;
          height: 88rpx;
          border-radius: 24rpx;
          background: #475ffd;
          color: #ffffff;
          font-size: 32rpx;
          font-weight: 700;
          &:active {
            opacity: 0.8;
          }
        }
      }
    }
  }
  .comps-box {
    height: 100%;
    overflow-y: scroll;
  }
</style>
