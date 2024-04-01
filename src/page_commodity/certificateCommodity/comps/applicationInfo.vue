<template>
  <view class="info-box application-info-box">
    <text class="info-header">报名信息</text>
    <view class="info-from">
      <text>报名表单</text>
      <text class="info-val">{{ item.formName }}</text>
    </view>
    <view class="info-from">
      <text>审核状态</text>
      <text class="info-val">{{ currentInfo.statuInfo }}</text>
    </view>
    <view class="info-action" v-if="currentInfo.action" @tap="goAction()">
      <view class="info-button info-active-button">{{ currentInfo.action }}</view>
    </view>
  </view>
</template>
<script>
  import { BaseFormUrl } from '@/enums/envEnum';
  import baseInfo from '@/build/index';
  import { certCourseRegistration } from '@/api/modules/certificateCourse/index';
  export default {
    name: 'application-info',
    props: {
      applicationInfo: {
        type: Object,
      },
    },
    data() {
      return {
        infoList: [
          {
            statu: '审核中',
            statuInfo: '报名信息审核中，请耐心等候~',
          },
          {
            statu: ' 审核通过',
            statuInfo: '报名信息已经审核通过~',
          },
          {
            statu: '审核驳回',
            statuInfo: '报名审核审核驳回，原因：xxxx',
            action: '修改报名信息',
          },
          {
            statu: '未提交',
            statuInfo: '请填写报名信息~',
            action: '去报名',
          },
          {
            statu: '未提交',
            statuInfo: '待满足考试标准后，方可填写报名信息；',
          },
        ],
        item: null,
      };
    },
    computed: {
      channelId() {
        return this.$store.getters.getChannelId;
      },
      projectId() {
        return this.$store.getters.getProjectId;
      },
      currentInfo() {
        // registrationStatus 0-待审核 1-审核通过 2-已经驳回 3-未填写表单
        // checkTime 0-报名前，1-学习前，2-考核前
        // learningStatus 0-未达标 1已达标
        // assessmentStatus 0-未考核 1考核已通过 2考核未通过
        let info = this.infoList[3];
        if (this.item) {
          if (this.item.registrationStatus == 0) {
            info = this.infoList[0];
          } else if (this.item.registrationStatus == 1) {
            info = this.infoList[1];
          } else if (this.item.registrationStatus == 2) {
            info = this.infoList[2];
            info.statuInfo = `报名审核审核驳回，原因：${this.item.rejectReason}`;
          } else if (this.item.registrationStatus == 3) {
            // 未提交
            if (this.item.checkTime == 1) {
              // 学习前
              info = this.infoList[3];
            } else if (this.item.checkTime == 2) {
              // 考核前
              if (this.item.learningStatus == 1 && this.item.assessmentStatus == 0) {
                //满足考试条件且未考试
                info = this.infoList[4];
              }
            }
          }
        }

        return info;
      },
    },
    mounted() {
      this.item = this.applicationInfo;
    },
    watch: {
      applicationInfo: {
        handler(val) {
          this.item = val;
        },
        immediate: false,
        deep: true,
      },
    },
    methods: {
      async goAction() {
        console.log(this.item);
        const { formId = '', answerUrl2, formRecordId = '' } = this.item;
        const baseUrl = BaseFormUrl[baseInfo.ENV];
        await certCourseRegistration({
          certificateId: this.item.certificateId,
          formRecordId: formRecordId,
        });
        // eslint-disable-next-line no-case-declarations
        let clientOrigin = '';
        /* #ifdef H5 */
        clientOrigin = window.location.origin;
        /* #endif */
        const uri = encodeURIComponent(
          `${baseUrl}/form${answerUrl2}&token=${uni.getStorageSync('token')}&channelId=${
            this.channelId
          }&clientOrigin=${clientOrigin}&platform=${
            uni.getSystemInfoSync().uniPlatform
          }&formId=${formId}&formRecordId=${formRecordId}&id=${
            this.item.certCourseRecordId
          }&certId=${
            this.item.certificateId
          }&redirectUrl=/page_commodity/certificateCommodity/pages/certificateDetail`
        );
        // eslint-disable-next-line no-case-declarations
        const url = `/page_common/iframe/index?uri=${uri}`;
        uni.navigateTo({
          url,
        });
      },
    },
  };
</script>
<style lang="scss" scoped>
  @import './info.scss';
  .application-info-box {
    position: relative;
  }
</style>
