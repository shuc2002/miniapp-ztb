<!--
* @desc 证书考试成绩单
-->
<template>
  <view class="certificate-score bg-gray">
    <!-- 头部信息 -->
    <view class="score-header">
      <!-- <image class="image-box" :src="`${baseStatic}/certificate/score-bg.png`"></image> -->
      <!-- #ifdef MP-WEIXIN -->
      <view class="iconfont icon-return goBack" @tap="navigateBack"></view>
      <!-- #endif -->
      <!-- #ifdef MP-TOUTIAO -->
      <view class="iconfont icon-return goBack" @tap="navigateBack"></view>
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <view class="iconfont icon-return goBack" @tap="navigateBack"></view>
      <!-- #endif -->
      <image
        class="image-box"
        src="https://acc.wangxiao.cn/image/passExam.png"
        v-if="examStatus === 0"
      ></image>
      <image class="image-box" src="https://acc.wangxiao.cn/image/approvedExam.png" v-else></image>
      <!-- <img src="@/static/svgs/passExam.svg" alt="" class="image-box" /> -->
      <view class="status-Info">
        <text class="status-tit">{{ statusInfo[examStatus].cName }}</text>
        <view class="en-info pass" v-if="examStatus === 0"
          >`恭喜您成功通过考试<br />请稍后通过“我的-我的证书”进行证书查询`</view
        >
        <view class="en-info failed" v-if="examStatus === 1">很遗憾，您未通过本证书考试'</view>
        <view class="en-info failed" v-if="examStatus === 2"
          >很遗憾，您暂未通过考试<br />请继续学习课程后，再次申请考试</view
        >
      </view>
    </view>
    <!-- 分数信息 -->
    <view class="score-content">
      <text class="title-font">{{ certificateName }}</text>
      <text class="time-font">交卷时间：{{ turnaroundTime }}</text>
      <text class="name">姓名：{{ realName }}</text>
      <!-- <u-table class="tab-box" :th-style="{ fontWeight: 'normal' }">
        <u-tr class="u-tr">
          <u-th class="u-th" style="font-weight: normal;">考试</u-th>
          <u-th class="u-th" style="font-weight: normal;">分数</u-th>
          <u-th class="u-th" style="font-weight: normal;">是否合格</u-th>
        </u-tr>
        <u-tr class="u-tr" v-for="(item, index) in examInfo" :key="index">
          <u-td class="u-td">{{ item.examName }}</u-td>
          <u-td class="u-td">{{ item.score }}</u-td>
          <u-td class="u-td">{{ item.isPassedExam === 0 ? '不合格' : '合格' }}</u-td>
        </u-tr>
      </u-table> -->
      <tabList class="tab-box" :columns="tabColumns" :data="examInfo" />
    </view>
  </view>
</template>
<script>
  import { baseStatic } from '@/api/config/index';
  import { getExamReports } from '@/api/modules/certificateCourse/index';
  import tabList from '../comps/tabList';
  export default {
    name: 'certificate-Report',
    data() {
      return {
        baseStatic: baseStatic,
        examStatus: 0,
        tabColumns: [
          { name: '考试', key: 'examName', rowSpan: 12 },
          { name: '分数', key: 'score', rowSpan: 6 },
          { name: '是否合格', key: 'status', rowSpan: 6 },
        ],
        statusInfo: [
          {
            cName: '恭喜您通过所有考试',
            enName: '恭喜您成功通过考试<br/>请稍后通过“我的-我的证书”进行证书查询',
          },
          {
            cName: '未通过考试',
            enName: '很遗憾，您未通过本证书考试',
          },
          {
            cName: '未通过考试',
            enName: '很遗憾，您暂未通过考试 请继续学习课程后，再次申请考试',
          },
        ],
        examInfo: [],
        realName: '',
        turnaroundTime: '',
        certificateName: '',
      };
    },
    components: {
      tabList,
    },
    onLoad(options) {
      this.getExamReports(options.id);
    },
    methods: {
      async getExamReports(certificateId) {
        const res = await getExamReports({ certificateId });
        const {
          assessmentStatus,
          reexamination,
          examInfo,
          realName,
          certificateName,
          turnaroundTime,
        } = res.body;

        if (assessmentStatus === 1) {
          //考核通过
          this.examStatus = 0;
        } else if (assessmentStatus === 2) {
          //0为考核未通过 不允许重考 1未考核未通过 允许重考
          this.examStatus = reexamination === 0 ? 1 : 2;
        }
        this.examInfo = examInfo.map((item) => {
          item.status = item.isPassedExam === 0 ? '不合格' : '合格';
          return item;
        });
        console.log(examInfo, '-----');
        this.realName = realName;
        this.certificateName = certificateName;
        this.turnaroundTime = turnaroundTime;
        this.realName = realName;
      },
      //返回
      navigateBack() {
        uni.navigateBack();
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
    width: 100%;
    padding-bottom: 180rpx;
    overflow-y: auto;
    .score-header {
      position: relative;
      margin-top: -64rpx;
      width: 100%;
      height: 332px;
      position: relative;
      .status-Info {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 282rpx;
        color: #ffffff;
        font-size: 48rpx;
        font-weight: 600;
        text-align: center;
        .en-info {
          margin-top: 12px;
          font-size: 24rpx;
          font-weight: 500;
          text-align: center;
          line-height: 19px;
        }
        .pass {
          color: #abfbb3;
        }
        .failed {
          color: #ffd9c1;
        }
        .status-tit {
          text-align: center;
          font-family: 'PingFang SC';
          font-size: 24px;
          font-style: normal;
          font-weight: 600;
        }
      }
      .goBack {
        position: absolute;
        top: 74px;
        left: 14px;
        color: #fff;
      }
    }
    .image-box {
      width: 100%;
      height: 332px;
    }
    .score-content {
      position: relative;
      margin: -96rpx 24rpx;
      z-index: 9;
      display: flex;
      padding: 32px 40rpx;
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
        font-style: normal;
        line-height: 25.2px;
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
    .topbox {
      position: relative;

      .icon-return {
        position: absolute;
        left: 32rpx;
        top: -20rpx;
        color: #fff;
      }
    }
  }
</style>
