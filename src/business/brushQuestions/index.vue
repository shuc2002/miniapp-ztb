<!--
* @desc 每日一练
* @author daisitin
* @date 2022年04月24日
-->
<template>
  <view>
    <view class="wrap-question flex flex-column">
      <view class="topbar"> </view>
      <view class="flex-item topbox">
        <!-- #ifndef MP-BAIDU -->
        <view class="iconfont icon-return" @tap="toReturn"></view>
        <!-- #endif -->
        <view class="title-day">每日一练</view>
      </view>
      <view>
        <!-- 顶部广告信息 -->
        <view v-show="vipId">
          <MessageBox />
        </view>
        <!-- 题目栏 -->
        <QuestionTab
          :questionNum="parseInt(currentIndex) + 1"
          :length="itemLength"
          :projectName="projectName"
        />
        <!-- 做题进度条 -->
        <ProgressLine :lineWidth="lineLength" />
      </view>

      <!-- 做题轮播图 -->
      <QuestionSwiper
        class="main"
        ref="swiper"
        :list="list"
        :dataIndex="currentIndex"
        @sumbitAll="toOver"
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
          <!-- #ifdef MP-BAIDU -->
          <view class="comps-box">
            <QuestionComp :questionData="item" height="calc(100vh - 340px)" />
          </view>
          <!-- #endif -->
          <!-- #ifndef MP-BAIDU -->
          <view class="comps-box">
            <QuestionComp :questionData="item" height="calc(100vh - 160px)" />
          </view>
          <!-- #endif -->
          <!-- #endif -->
        </template>
        <!-- #endif -->
      </QuestionSwiper>
      <!-- #ifdef MP-BAIDU -->
      <view class="submit-btn-box-3">
        <view class="exit-box" @tap="toReturn">
          <view class="iconfont icon-power exit-icon " />
          <view class="exit-title">退出</view>
        </view>
      </view>
      <!-- #endif -->
    </view>
    <NewPopupWindow
      ref="question"
      :height="step == 1 ? '696rpx' : step == 2 ? '640rpx' : '696rpx'"
      :confirmTitle="
        step == 1
          ? '立即关注'
          : step == 2 && timeDown > 0
          ? timeDown + 's'
          : step == 2
          ? '已长按关注'
          : '继续答题'
      "
      @success="handleSuccess()"
      :cancelShow="false"
      :canClose="false"
      :setConfirm="false"
      :step="step"
    >
      <view
        class="close-qr iconfont icon-close"
        v-if="step == 1 || step == 3"
        @tap="cancelModal"
      ></view>
      <view v-if="step == 1">
        <p class="step-1-title">关注公众号</p>
        <view class="step-1-line"></view>
        <img class="step-1-qr" src="@/business/static/qr-code.png" />
        <p class="step-1-bottom">关注公众号继续做题</p>
      </view>
      <view v-if="step == 2">
        <view class="step-2-title">
          <span class="step-2-red-text">长按二维码</span>,关注公众号继续做题</view
        >
        <view class="step-2-code-box">
          <img class="figure-img" src=@/business/static/identify.png />
          <view class="step-2-qr-box">
            <img
              class="step-2-qr"
              src="@/business/static/qr-code.png"
              :show-menu-by-longpress="true"
            />
          </view>
        </view>
      </view>
      <view v-if="step == 3">
        <p class="step-1-title">关注公众号</p>
        <view class="step-1-line"></view>
        <view class="step-3-logo iconfont icon-succeed " />
        <view class="step-3-text-1">关注成功</view>
        <view class="step-3-text-2">恭喜您，已成功关注公众号</view>
      </view>
      <!-- <p class="title-modal"><span>长按二维码，</span>关注公众号继续做题</p>
      <view class="body-modal flex-center">
        <image src="@/business/static/fingerprint.png" />
        <image
          src="@/business/static/yikao.jpg"
          v-if="appletLogo == 'YIKAO'"
          :show-menu-by-longpress="true"
        />
        <image src="@/business/static/qr-code.png" v-else :show-menu-by-longpress="true" />
      </view> -->
    </NewPopupWindow>
    <!-- 返回时候的提醒弹窗 -->
    <ReturnModal ref="returnModal" @toExit="toExit()" @toContinue="toContinue()" />
  </view>
</template>
<script>
  import { getBrushContent, saveDailyExercise } from '@/api/modules/question/exercise.ts';
  // import { questionRecord } from '@/api/modules/question/index.ts';

  import MessageBox from './comps/MessageBox.vue';
  import QuestionTab from './comps/QuestionTab.vue';
  import ProgressLine from './comps/ProgressLine.vue';
  import ReturnModal from './comps/ReturnModal.vue';
  import QuestionSwiper from '@/components/QuestionSwiper/QuestionSwiper.vue';
  import QuestionComp from '@/components/QuestionSwiper/QuestionComp.vue';
  import { throttle } from '@/page_commodity/courseList/util';
  import NewPopupWindow from './comps/NewPopipWindow.vue';
  import { getOfficialAccount } from '@/api/modules/register/index';
  import baseInfo from '@/build/index';
  import { bottomNavTo } from '@/utils/common.js';
  export default {
    name: 'examination',
    components: {
      QuestionSwiper,
      QuestionComp,
      MessageBox,
      QuestionTab,
      ProgressLine,
      NewPopupWindow,
      ReturnModal,
    },
    data() {
      return {
        dataLength: 0,
        list: [], //题目列表
        itemLength: 0, // 题目长度
        lineLength: 0, // 线长度
        currentIndex: 0, //当前题目位置
        code: '',
        userAnswerList: [],
        timeDown: 5,
        timer: null,
        appletLogo: '',
        ifSkip: true,
        update: true, // 用于h5刷新视图
        step: 1, //引导关注的三步
        saveList: [], //点退出暂存的数据
        subjectId: '', //科目id
      };
    },
    onUnload() {
      uni.$off();
    },
    computed: {
      projectName() {
        return this.$store.getters.getProjectName;
      },
      vipId() {
        return uni.getStorageSync('vipId');
      },
      isTryOut() {
        return uni.getStorageSync('isTryOut');
      },
    },
    onLoad(options) {
      /* #ifdef MP-WEIXIN */
      if (this.isTryOut) {
        console.log('1');
      } else {
        //  this.handleMark();
      }
      // this.handleMark();
      /* #endif */
      this.code = options.code;
      if (options.currentIndex) {
        this.currentIndex = options.currentIndex;
      }
      if (options.subjectId) {
        this.subjectId = options.subjectId;
      }
      this.appletLogo = baseInfo.CHANNEL;
      this.getUnit();
      //监听改变单选选项
      uni.$on('changeRadio', ({ userAnswer, id, index }) => {
        this.update = false;
        this.$set(this.list[this.currentIndex], 'userAnswer', userAnswer);
        if (this.currentIndex < this.list.length - 1) {
          if (this.ifSkip) {
            this.ifSkip = false;
            setTimeout(() => {
              this.currentIndex++;
              this.ifSkip = true;
            }, 200);
          }
        } else {
          this.toOver();
        }
        this.record(id, userAnswer, index);
        this.$nextTick(() => {
          this.update = true;
        });
      });
      //监听改变多选选项
      uni.$on('changeCheckbox', ({ userAnswer }) => {
        this.$set(this.list[this.currentIndex], 'userAnswer', userAnswer);
      });

      // 翻页监听
      uni.$on('turnLast', ({ userAnswer, id, index }) => {
        this.update = false;
        if (this.currentIndex < this.list.length - 1) {
          this.currentIndex++;
        } else {
          this.toOver();
        }
        this.record(id, userAnswer, index);
        this.$nextTick(() => {
          this.update = true;
        });
      });
    },
    // onUnload() {
    //   this.$refs.returnModal.showModal = true;
    // },
    methods: {
      /* #ifdef MP-WEIXIN */
      // 关注公众号
      async handleMark() {
        if (this.timer) {
          clearInterval(this.timer);
        }
        //检查是否关注公众号
        const res = await getOfficialAccount();
        if (res.body == false) {
          this.timeDown = 5;
          this.timer = setInterval(() => {
            this.timeDown -= 1;
            if (this.timeDown < 1) {
              clearInterval(this.timer);
            }
          }, 1000);
          // this.$refs.question.showModal = true;
          if (this.step == 1) {
            this.$refs.question.showModal = true;
          }
        } else {
          // this.$refs.question.showModal = false;
          //区分是最开始就关注了  还是第二步的时候没关注
          if (this.step == 1) {
            this.$refs.question.showModal = false;
          }
          if (this.step == 2) {
            this.step = 3;
          }
        }
      },

      // 确认按钮
      handleSuccess() {
        if (this.step == 1) {
          this.step = this.step + 1;
          return;
        } else if (this.step == 2) {
          // 此处需检查是否真的关注了
          if (this.timeDown < 1) {
            this.handleMark();
            return;
          }
        } else {
          this.$refs.question.showModal = false;
          this.step = 1;
        }
        // if (this.step == 3) {
        //   // this.handleMark();
        //   this.$refs.question.showModal = false;
        //   this.step = 1;
        // } else {
        //   this.step = this.step + 1;
        // }
        // if (this.timeDown < 1) {
        //   this.handleMark();
        // }
      },
      /* #endif */
      //获取每日一练列表
      async getUnit() {
        const res = await getBrushContent({ code: this.code });
        this.list = res.body;
        this.itemLength = res.body.length;
        this.lineLength = Math.floor(((this.currentIndex + 1) / this.itemLength) * 100);
        // 将已有的答案进行存储
        this.list.map((item) => {
          if (item.userAnswer) {
            this.saveList.push({
              id: item.id,
              index: item.index,
              answer: item.userAnswer,
            });
          }
        });
      },
      //切换题目号
      change(currentIndex) {
        this.currentIndex = currentIndex;
        if (this.list.length > 0) {
          this.lineLength = Math.floor(((this.currentIndex + 1) / this.list.length) * 100);
        }
      },
      async record(questionId, answer, index) {
        // 先暂存
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
        // await questionRecord({ questionId, code: this.code, answer: answer, index });
      },
      //答题结束
      toOver: throttle(async function() {
        this.userAnswerList = [];
        this.list.map((item) => {
          // 修改答案格式，多选题需处理
          this.userAnswerList.push({
            id: item.id,
            index: item.index,
            answer: item.userAnswer ? item.userAnswer : [''],
          });
        });
        uni.redirectTo({
          url: `/business/report/index?code=${this.code}&subjectId=${
            this.subjectId
          }&userAnswerList=${JSON.stringify(this.userAnswerList)}`,
        });
      }, 1000),

      //关闭弹窗 返回首页
      cancelModal() {
        this.$refs.question.showModal = false;
        this.step = 1;
        // uni.switchTab({
        //   url: '/pages/home/index',
        // });
        bottomNavTo('/pages/realHome/index', 1);
      },

      // 中途返回
      toReturn() {
        this.$refs.returnModal.showModal = true;
      },
      // 退出
      async toExit() {
        // return;
        if (this.saveList.length === 0) {
          uni.navigateBack();
        } else {
          let params = {
            code: this.code,
            answers: this.saveList,
          };
          const res = await saveDailyExercise(params);
          if (res.body) {
            uni.navigateBack();
          }
        }
      },
      // 继续做题
      toContinue() {
        this.$refs.returnModal.showModal = false;
      },
    },
    // 页面销毁时结束
    beforeDestroy() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
  };
</script>
<style lang="scss" scoped>
  .wrap-question {
    width: 100%;
    height: 100%;
    .topbar {
      width: 100%;
      height: 122rpx;
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
    background-color: #ffffff;
    font-size: 32rpx;
  }
  .comps-box {
    height: 100%;
    overflow-y: scroll;
  }
  .title-modal {
    font-size: 32rpx;
    font-weight: 700;
    color: #323949;
    margin-top: 48rpx;
    margin-bottom: 24rpx;
    span {
      color: #475ffd;
    }
  }
  .body-modal {
    background-color: #ecedf1;
    padding: 48rpx;
    border-radius: 16rpx;
    image:first-child {
      width: 146rpx;
      height: 146rpx;
      margin-right: 44rpx;
    }
    image:last-child {
      width: 220rpx;
      height: 220rpx;
      border-radius: 16rpx;
    }
  }

  .close-qr {
    // width: 29.99rpx;
    // height: 29.99rpx;
    font-size: 30rpx;
    // background-color: red;
    position: fixed;
    margin-top: -40rpx;
    right: 66rpx;
  }
  .step-1-title {
    height: 112rpx;
    color: #222222ff;
    font-size: 32rpx;
    font-weight: 600;
    font-family: 'PingFang SC';
    text-align: center;
    line-height: 112rpx;
  }
  .step-1-line {
    width: 620rpx;
    height: 2rpx;
    background: #eeeeeeff;
  }
  .step-1-qr {
    height: 294rpx;
    width: 294rpx;
    margin-top: 40rpx;
    margin-left: 163rpx;
  }
  .step-1-bottom {
    margin-top: 16rpx;
    color: #9fa1a4ff;
    font-size: 28rpx;
    font-weight: 400;
    font-family: 'PingFang SC';
    text-align: center;
    line-height: 28rpx;
  }
  .step-2-title {
    margin-top: 48rpx;
    text-align: center;
    color: #333333ff;
    font-size: 32rpx;
    font-weight: 600;
    font-family: 'PingFang SC';
    line-height: 32rpx;
  }
  .step-2-red-text {
    color: #e51600;
  }
  .step-2-code-box {
    width: 506rpx;
    height: 316rpx;
    border-radius: 16rpx;
    background: #f6f6f6ff;
    display: flex;
    margin: 38rpx auto 0rpx;
    .figure-img {
      width: 146rpx;
      height: 146rpx;
      margin-left: 48rpx;
      margin-top: 85rpx;
    }
    .step-2-qr-box {
      width: 220rpx;
      height: 220rpx;
      border-radius: 16rpx;
      opacity: 1;
      background: #ffffffff;
      margin-top: 48rpx;
      margin-left: 44rpx;
      .step-2-qr {
        width: 190rpx;
        height: 190rpx;
        margin: 15rpx;
      }
    }
  }
  .step-3-logo {
    font-size: 120rpx;
    margin-top: 72rpx;
    margin-left: 250rpx;
    color: red;
  }
  .step-3-text-1 {
    color: #333333ff;
    font-size: 42rpx;
    font-weight: 500;
    font-family: 'PingFang SC';
    text-align: center;
    line-height: 42rpx;
    margin-top: 32rpx;
  }
  .step-3-text-2 {
    color: #9fa1a4ff;
    font-size: 26rpx;
    font-weight: 400;
    font-family: 'PingFang SC';
    text-align: center;
    line-height: 26rpx;
    margin-top: 25rpx;
  }
  .submit-btn-box-3 {
    position: absolute;
    bottom: 0;
    height: 180rpx;
    width: 750rpx;
    background-color: #ffffff;
    box-shadow: 0 -6rpx 8rpx 0 #e9e9e940;
    margin: 0 auto;
    // display: flex;
    // justify-content: center;
    .exit-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      .exit-icon {
        font-size: 40rpx;
        margin-top: 24rpx;
        margin-bottom: 8rpx;
        height: 40rpx;
        width: 40rpx;
      }
      .exit-title {
        color: #333333;
        font-size: 24rpx;
        text-align: center;
      }
    }
    .submit-btn {
      width: 654rpx;
      height: 96rpx;
      margin-top: 16rpx;
      border-radius: 72rpx;
      border: 2rpx solid #ecedf1;
      background: #e5e6eb;
      color: #4e5969;
      font-size: 32rpx;
      text-align: center;
      line-height: 96rpx;
    }
  }
</style>
