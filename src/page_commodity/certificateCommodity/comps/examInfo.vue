<template>
  <view class="info-box exam-info-box">
    <text class="info-header">考试信息</text>
    <view class="flex-item-center">
      <text class="info-tips warn-tips" :class="{ 'pass-tips': curInfo.isPass }">{{
        curInfo.info
      }}</text>
    </view>
    <view class="info-from" v-if="item.startExamTime">
      <text>考试时间</text>
      <text class="info-val">{{ timeText }}</text>
    </view>
    <view class="info-action" v-if="showAction">
      <view
        class="info-button"
        v-if="curInfo.showExam"
        :class="{ 'info-active-button': curInfo.activeBnt, 'disable-button': disableComp }"
        @tap="gotoExam"
        >查看考试</view
      >
      <view class="info-button" v-if="curInfo.showScore" @tap="gotoScroe">查看成绩单</view>
    </view>
  </view>
</template>
<script>
  export default {
    name: 'exam-info',
    props: {
      examInfo: {
        type: Object,
      },
    },
    data() {
      return {
        infoList: [
          { info: '很抱歉，已过考试日期，暂时不能申请考试~', showExam: true },
          { info: '考核条件无限制', showScore: false, showExam: true },
          { info: '恭喜你，考试全部通过~', showScore: true, showExam: true, isPass: true },
          { info: '很抱歉，本次证书考试未通过~', showScore: true, showExam: true },
          { info: '很抱歉，考试未通过，您可以参与重考~', showScore: true, showExam: true },
          { info: '完成阶段性课时，才可以申请考试哦~', showScore: false, showExam: false },
          { info: '完成所有课时学习，才可以申请考试哦~', showScore: false, showExam: false },
          {
            info: '已经满足考核条件，快去申请考试~',
            showExam: true,
            showScore: false,
            activeBnt: true,
          },
        ],
        item: {},
      };
    },
    computed: {
      projectId() {
        return this.$store.getters.getProjectId;
      },
      showAction() {
        let show = false;
        //报名信息无限制，或报名信息审核通过
        if (this.item.signUpFormLimit == 0 || this.item.registrationStatus == 1) {
          show = true;
        }
        if (this.item.endExamTime && this.dataComp(this.item.endExamTime)) {
          // 考试已过期
          show = false;
        }
        if (
          this.item.assessmentStatus == 0 &&
          this.item.examCondition == 1 &&
          this.item.learningStatus == 0
        ) {
          // 考试未考核，考试有学习考核，未满足条件
          show = false;
        }
        return show;
      },
      timeText() {
        let text = this.item.startExamTime;
        if (this.item.endExamTime) {
          text = text + '-' + this.item.endExamTime;
        }
        return text;
      },
      curInfo() {
        let info = this.infoList[6];
        if (this.item.assessmentStatus == 0) {
          // 考试未考核
          if (this.item.endExamTime && this.dataComp(this.item.endExamTime)) {
            // 考试已过期
            info = this.infoList[0];
            return info;
          }
          if (this.item.examCondition == 0) {
            // 考试无学习考核
            info = this.infoList[1];
          } else {
            // 考试有学习考核
            if (this.item.learningStatus == 1) {
              // 满足学习条件
              info = this.infoList[7];
            } else {
              // 不满足判断是部分还是全部
              info = this.item.examCondition == 1 ? this.infoList[6] : this.infoList[5];
            }
          }
        } else if (this.item.assessmentStatus == 1) {
          // 考试考核已通过
          info = this.infoList[2];
        } else if (this.item.assessmentStatus == 2) {
          // 考试考核未通过
          if (this.item.assessmentStatus == 1 && this.item.reexamination == 1) {
            info = this.infoList[4];
          } else {
            info = this.infoList[3];
          }
        }

        return info;
      },
      disableComp() {
        let flag = false;
        if (this.item.startExamTime && !this.dataComp(this.item.startExamTime)) {
          flag = true;
        }
        return flag;
      },
    },
    mounted() {
      this.item = this.examInfo;
    },
    watch: {
      examInfo: {
        handler(val) {
          this.item = val;
        },
        immediate: false,
        deep: true,
      },
    },
    methods: {
      gotoExam() {
        if (this.disableComp) {
          uni.showToast({
            title: '暂未到考试日期',
            icon: 'none',
          });
        } else {
          this.commonFun.routeTo(
            `/page_commodity/certificateCommodity/pages/certificateExam?id=${this.item.certificateId}`
          );
        }
      },
      gotoScroe() {
        this.commonFun.routeTo(
          `/page_commodity/certificateCommodity/pages/certificateReport?id=${this.item.certificateId}`
        );
      },
      dataComp(date1, date2) {
        let obj1 = new Date(date1.replace('-', '/'));
        let obj2 = date2 ? new Date(date2.replace('-', '/')) : new Date();
        if (obj1.getTime() < obj2.getTime()) {
          return true;
        } else {
          return false;
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
  @import './info.scss';
  .exam-info-box {
    position: relative;
  }
</style>
