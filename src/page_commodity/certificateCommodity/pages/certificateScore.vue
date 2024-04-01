<!--
* @desc 单科成绩单 
-->
<template>
  <view class="certificate-score bg-gray">
    <!-- 头部信息 -->
    <view class="score-header">
      <!-- #ifdef MP-WEIXIN -->
      <view class="iconfont icon-return goBack" @tap="navigateBack"></view>
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <view class="iconfont icon-return goBack" @tap="navigateBack"></view>
      <!-- #endif -->
      <!-- #ifdef MP-TOUTIAO -->
      <view class="iconfont icon-return goBack" @tap="navigateBack"></view>
      <!-- #endif -->
      <image class="image-box" :src="`${baseStatic}/certificate/score-bg.png`"></image>
      <view class="status-Info">
        <text>{{ statusInfo[examInfo.isPassed].cName }}</text>
        <text class="en-info">{{ statusInfo[examInfo.isPassed].enName }}</text>
      </view>
    </view>
    <!-- 分数信息 -->
    <view class="score-content">
      <text class="title-font">{{ examInfo.examName }}</text>
      <text class="time-font" v-if="examInfo.turnaroundTime">{{
        `交卷时间：${examInfo.turnaroundTime}`
      }}</text>
      <text class="name">姓名：{{ examInfo.name }}</text>
      <!-- <u-table class="tab-box">
        <u-tr class="u-tr">
          <u-th class="u-th">科目</u-th>
          <u-th class="u-th">分数</u-th>
          <u-th class="u-th">是否合格</u-th>
        </u-tr>
        <u-tr class="u-tr">
          <u-td class="u-td">{{ examInfo.examName }}</u-td>
          <u-td class="u-td">{{ examInfo.score ? examInfo.score : '-' }}</u-td>
          <u-td class="u-td">{{
            examInfo.isPassed == 1 ? '合格' : examInfo.isPassed == 2 ? '-' : '不合格'
          }}</u-td>
        </u-tr>
      </u-table> -->
      <tabList class="tab-box" :columns="tabColumns" :data="tabDaTa" />
    </view>
    <!-- 答题卡 -->
    <view class="score-card" v-if="examInfo.hasResult == 0 && examInfo.isPassed != 2">
      <examCard :bottomList="bottomList" :paper="paper" />
    </view>
    <!-- 底部操作 -->
    <view class="score-buttom" v-if="examInfo.isPassed != 2">
      <view class="score-button" v-if="examInfo.redoWrongQuestion" @tap="gotoErrdo">错题重做</view>
      <view
        class="score-button redo-button"
        v-if="examInfo.reexamination && examInfo.isPassed === 0"
        @tap="gotoRedo"
        >重新考试</view
      >
    </view>
  </view>
</template>
<script>
  import { baseStatic } from '@/api/config/index';
  import examCard from '../comps/examCard';
  import tabList from '../comps/tabList';
  import { fetchExamAnalysis } from '@/api/modules/certificate/index';
  // import { bottomNavTo } from '@/utils/common.js';
  export default {
    name: 'certificate-list',
    components: {
      examCard,
      tabList,
    },
    data() {
      return {
        tabColumns: [
          { name: '考试', key: 'examName', rowSpan: 12 },
          { name: '分数', key: 'score', rowSpan: 6 },
          { name: '是否合格', key: 'status', rowSpan: 6 },
        ],
        baseStatic: baseStatic,
        statusInfo: [
          {
            cName: '考试未通过',
            enName: 'FAILED THE EXAM',
          },
          {
            cName: '考试通过',
            enName: 'PASS THE EXAM',
          },
          {
            cName: '考试成绩计算中',
            enName: 'CALCULATING SCORES',
          },
        ],
        examInfo: {},
        paper: {},
        bottomList: [],
        certId: '', //暂存证书id
        tabDaTa: [],
      };
    },
    onLoad(options) {
      console.log(options, 'options');
      if (options.examName) {
        // 计算中
        this.examInfo = {
          examName: options.examName,
          name: options.realName,
          isPassed: 2,
        };
        this.tabDaTa = [{ examName: options.examName, score: '-', status: '-' }];
      } else {
        this.getExamAnalysis(options.code);
      }
    },
    methods: {
      async getExamAnalysis(code) {
        let res = await fetchExamAnalysis({ code: code });
        if (res.body?.analysisPageVO) {
          this.$store.commit('setExamCode', code);
          this.paper = res.body.analysisPageVO;
          let list = [];
          this.paper.cardGroup.forEach((item, index, arr) => {
            if (index === 0 || item.groupName !== arr[index - 1].groupName) {
              list.push({ groupName: item.groupName, list: [] });
            }
            const choose = item.choose === undefined ? null : item.choose;
            list[list.length - 1].list.push({ choose, index, name: item.key });
          });
          this.bottomList = list;
        }
        const {
          examName,
          name,
          score,
          turnaroundTime,
          isPassed,
          hasResult,
          redoWrongQuestion,
          reexamination,
          productId,
          examId,
        } = res.body;
        this.examInfo = {
          examName,
          name,
          score,
          turnaroundTime,
          isPassed,
          hasResult,
          reexamination,
          redoWrongQuestion,
          productId,
          examId,
        };
        this.tabDaTa = [
          {
            examName,
            score,
            status: isPassed == 1 ? '合格' : isPassed == 2 ? '-' : '不合格',
          },
        ];
        if (res?.body.certificateId) {
          this.certId = res.body.certificateId;
        }
      },
      gotoErrdo() {
        uni.navigateTo({
          url: '/business/myRecords/index?activeNum=0',
        });
      },
      gotoRedo() {
        // 跳转考试页
        uni.navigateTo({
          url: `/page_mockExam/paperCover/index?id=${this.examInfo.examId}&productId=${this.examInfo.productId}&isBought=true&certId=${this.certId}&cerType=1`,
        });
      },
      //返回 --返回个人中心页面
      navigateBack() {
        const id = uni.getStorageSync('certCourseRecordId');
        this.commonFun.routeTo(
          `/page_commodity/certificateCommodity/pages/certificateDetail?id=${id}`
        );
        // bottomNavTo('/pages/mine/index', 2);
        // uni.navigateBack({ delta: 1 });
      },
    },
  };
</script>
<style lang="scss" scoped>
  .bg-gray {
    position: fixed;
    background: #f5f6fa;
    left: 0;
    width: 100%;
    top: 0;
    height: 100%;
  }
  .certificate-score {
    padding-bottom: 180rpx;
    overflow-y: auto;
    .score-header {
      position: relative;
      margin-top: -64rpx;
      .status-Info {
        display: flex;
        flex-direction: column;
        position: absolute;
        left: 64rpx;
        bottom: 198rpx;
        color: #ffffff;
        font-size: 48rpx;
        font-weight: 600;
        .en-info {
          margin-top: 8rpx;
          font-size: 24rpx;
          font-weight: 500;
        }
      }
      .goBack {
        position: absolute;
        top: 128rpx;
        left: 34rpx;
        color: #fff;
        z-index: 9999;
      }
    }
    .image-box {
      width: 100%;
    }
    .score-content {
      position: relative;
      margin: -174rpx 24rpx;
      z-index: 9;
      display: flex;
      padding: 64rpx 40rpx;
      flex-direction: column;
      align-items: center;
      border-radius: 24rpx;
      background: #ffffff;
      .title-font {
        width: 100%;
        text-align: center;
        color: #333333;
        font-size: 36rpx;
        font-weight: 600;
        margin-bottom: 12rpx;
      }
      .time-font {
        width: 100%;
        text-align: center;
        color: #9fa1a4;
        font-size: 24rpx;
        font-weight: 400;
        padding-bottom: 32rpx;
        border-bottom: 1px solid #f6f6f6;
        margin-bottom: 50rpx;
      }
      .name {
        color: #4b538a;
        font-size: 28rpx;
        font-weight: 500;
        margin-bottom: 32rpx;
      }
      .tab-box {
        width: 100%;
        margin: 0 24rpx;
      }
    }
    .score-card {
      position: relative;
      margin: 198rpx 24rpx 32rpx;
    }
    .score-buttom {
      position: fixed;
      z-index: 99;
      bottom: 0;
      left: 0;
      display: flex;
      width: 100%;
      height: 180rpx;
      background: #ffffff;
      justify-content: space-around;
      padding: 0 32rpx;
      .score-button {
        margin-top: 32rpx;
        display: flex;
        height: 96rpx;
        width: 320rpx;
        justify-content: center;
        align-items: center;
        border-radius: 48rpx;
        background: #f5f6fa;
        color: #4e5969;
        font-size: 32rpx;
        font-weight: 600;
      }
      .redo-button {
        background: #586989;
        color: #ffffff;
      }
    }
  }
</style>
