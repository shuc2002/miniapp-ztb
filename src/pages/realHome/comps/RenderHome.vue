<!-- 根据配置渲染首页 -->
<!--
* @desc 每日一练
* @author daisitin
* @date 2022年04月24日
-->
<template>
    <view>
      <view class="wrap-question flex flex-column">
        <view>
          <!-- 顶部广告信息 -->
          <view v-show="vipId">
            <MessageBox />
          </view>
          <!-- 题目栏 -->
          <QuestionTab
            :questionNum="currentIndex + 1"
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
            <view class="comps-box">
              <QuestionComp :questionData="item" height="calc(100vh - 160px)" />
            </view>
            <!-- #endif -->
          </template>
          <!-- #endif -->
        </QuestionSwiper>
        <!-- 底部栏 -->
      </view>
      <PopupWindow
        ref="question"
        height="620rpx"
        :confirmTitle="timeDown > 0 ? timeDown + 's' : '已长按关注'"
        @success="handleSuccess()"
        :cancelShow="false"
        :canClose="false"
        :setConfirm="false"
      >
        <p class="title-modal"><span>长按二维码，</span>关注公众号继续做题</p>
        <view class="body-modal flex-center">
          <image src="@/business/static/fingerprint.png" />
          <image
            src="@/business/static/yikao.jpg"
            v-if="appletLogo == 'YIKAO'"
            :show-menu-by-longpress="true"
          />
          <image src="@/business/static/qr-code.png" v-else :show-menu-by-longpress="true" />
        </view>
      </PopupWindow>
    </view>
  </template>
  <script>
    import { getBrushContent } from '@/api/modules/question/exercise.ts';
    import { questionRecord } from '@/api/modules/question/index.ts';
  
    import MessageBox from './comps/MessageBox.vue';
    import QuestionTab from './comps/QuestionTab.vue';
    import ProgressLine from './comps/ProgressLine.vue';
  
    import QuestionSwiper from '@/components/QuestionSwiper/QuestionSwiper.vue';
    import QuestionComp from '@/components/QuestionSwiper/QuestionComp.vue';
    import { throttle } from '@/page_commodity/courseList/util';
    import PopupWindow from '@/components/PopupComp/PopupWindow.vue';
    import { getOfficialAccount } from '@/api/modules/register/index';
    import baseInfo from '@/build/index';
  
    export default {
      name: 'examination',
      components: {
        QuestionSwiper,
        QuestionComp,
        MessageBox,
        QuestionTab,
        ProgressLine,
        PopupWindow,
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
      },
      onLoad(options) {
        /* #ifdef MP-WEIXIN */
        this.handleMark();
        /* #endif */
        this.code = options.code;
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
      methods: {
        /* #ifdef MP-WEIXIN */
        // 关注公众号
        async handleMark() {
          if (this.timer) {
            clearInterval(this.timer);
          }
          const res = await getOfficialAccount();
          if (res.body == false) {
            this.timeDown = 5;
            this.timer = setInterval(() => {
              this.timeDown -= 1;
              if (this.timeDown < 1) {
                clearInterval(this.timer);
              }
            }, 1000);
            this.$refs.question.showModal = true;
          } else {
            this.$refs.question.showModal = false;
          }
        },
        // 已确认关注
        async handleSuccess() {
          if (this.timeDown < 1) {
            this.handleMark();
          }
        },
        /* #endif */
        //获取每日一练列表
        async getUnit() {
          const res = await getBrushContent({ code: this.code });
          this.list = res.body;
          this.itemLength = res.body.length;
          this.lineLength = Math.floor(((this.currentIndex + 1) / this.itemLength) * 100);
        },
        //切换题目号
        change(currentIndex) {
          this.currentIndex = currentIndex;
          if (this.list.length > 0) {
            this.lineLength = Math.floor(((this.currentIndex + 1) / this.list.length) * 100);
          }
        },
        async record(questionId, answer, index) {
          await questionRecord({ questionId, code: this.code, answer: answer, index });
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
            url: `/business/report/index?code=${this.code}&userAnswerList=${JSON.stringify(
              this.userAnswerList
            )}`,
          });
        }, 1000),
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
  </style>
  