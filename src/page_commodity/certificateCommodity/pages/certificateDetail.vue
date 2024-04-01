<!--
* @desc 证书商品详情(题库)
-->
<template>
  <view class="certificate-detail">
    <view class="bg-gray"></view>
    <!-- 头部信息 -->
    <view class="detail-header">
      <image class="image-box" :src="`${baseStatic}/certificate/detail-bg.png`"></image>
      <view class="status-info">
        <view class="flex-item-center">
          <view v-if="issuanceStatus == 1" class="pass-tag iconfont icon-succeed"></view>
          <text>{{ ceStatusInfo[issuanceStatus].status }}</text>
        </view>
        <text class="en-info">{{ ceStatusInfo[issuanceStatus].info }}</text>
      </view>
    </view>
    <!-- 课程信息 -->
    <view class="crouse-content">
      <certificateItem :item="courseInfo" v-if="courseInfo" :clickable="false" />
    </view>
    <!-- 报名信息 -->
    <view class="mr-content" v-if="registrationInfo && registrationInfo.signUpFormLimit != 0"
      ><applicationInfo :applicationInfo="registrationInfo"
    /></view>
    <!-- 学习信息 -->
    <view class="mr-content" v-if="learnInfo && learnInfo.examCondition != 0">
      <studyInfo :studyItem="learnInfo" />
    </view>
    <!-- 考试信息 -->
    <view class="mr-content">
      <examInfo :examInfo="examInfo" v-if="examInfo && examInfo.hasExam != 0" />
    </view>
    <!-- 证书信息 -->
    <view class="mr-content">
      <certificateInfo :item="certificateInfo" @showShare="showMask" v-if="certificateInfo" />
    </view>
    <WxShare
      ref="WxShare"
      title="浏览器打开可下载证书到本地"
      subTitle="点击屏幕右上角选择在浏览器打开"
    />
  </view>
</template>
<script>
  import certificateItem from '../comps/certificateItem';
  import applicationInfo from '../comps/applicationInfo';
  import studyInfo from '../comps/studyInfo';
  import examInfo from '../comps/examInfo';
  import certificateInfo from '../comps/certificateInfo';
  import { baseStatic } from '@/api/config/index';
  import { fetchCertificateDetail } from '@/api/modules/certificate/index';
  import { certCourseRegistration } from '@/api/modules/certificateCourse/index';
  import WxShare from '@/components/WxShare/WxShare.vue';
  export default {
    name: 'certificate-list',
    components: { certificateItem, applicationInfo, studyInfo, examInfo, certificateInfo, WxShare },
    data() {
      return {
        baseStatic: baseStatic,
        ceStatusInfo: [
          {
            status: '暂未获得',
            info: '暂未获得证书，快去学习课程吧~',
            type: 0,
          },
          {
            status: '已获得证书',
            info: '恭喜您，已经获取证书',
            type: 1,
          },
          {
            status: '证书录入中',
            info: '恭喜您，已经获得证书，证书录入中，请耐心等待',
            type: 1,
          },
          {
            status: '证书生成中',
            info: '恭喜您，已经获得证书，证书生成中，请耐心等待',
            type: 1,
          },
          // 发放失败
          {
            status: '证书生成中',
            info: '恭喜您，已经获得证书，证书生成中，请耐心等待',
            type: 1,
          },
        ],
        courseInfo: null, //课程信息
        issuanceStatus: 0, //证书状态，
        registrationInfo: null, //报名信息，
        learnInfo: null, //学习信息
        examInfo: null, //考试信息
        certificateInfo: null, //证书信息
      };
    },
    onLoad(options) {
      uni.setStorageSync('certCourseRecordId', options.id);
      if (options.formId) {
        // 报名表单回调需要调用立即报名接口
        this.getReloadDetail(options.id, options.certId, options.formId);
      } else {
        this.getCertificateDetail(options.id);
      }
    },
    methods: {
      async getCertificateDetail(id) {
        const res = await fetchCertificateDetail({ id });
        const {
          certCourseRecordId,
          certificateId,
          name,
          commodityName,
          thumbnail,
          issuanceStatus,
          registrationInfo,
          learnInfo,
          examInfo,
          certificateInfo,
        } = res.body;
        this.issuanceStatus = issuanceStatus;
        this.courseInfo = {
          certCourseRecordId,
          certificateId,
          name,
          commodityName,
          thumbnail,
        };
        this.registrationInfo = {
          ...registrationInfo,
          certCourseRecordId,
          certificateId,
          name,
          learningStatus: learnInfo.learningStatus,
          assessmentStatus: examInfo.assessmentStatus,
        };
        this.learnInfo = {
          ...learnInfo,
          registrationStatus: registrationInfo.registrationStatus,
          checkTime: registrationInfo.checkTime,
          certificateId,
        };
        this.examInfo = {
          ...examInfo,
          registrationStatus: registrationInfo.registrationStatus,
          signUpFormLimit: registrationInfo.signUpFormLimit,
          learningStatus: learnInfo.learningStatus,
          certificateId,
        };
        const curCeStatusInfo = this.ceStatusInfo[issuanceStatus];
        this.certificateInfo = {
          ...certificateInfo,
          ...curCeStatusInfo,
          certificateId,
          certCourseRecordId,
        };
      },
      async getReloadDetail(certificateId, certId, formRecordId) {
        await certCourseRegistration({ certificateId: certId, formRecordId: formRecordId });
        this.getCertificateDetail(certificateId);
      },
      showMask() {
        this.$refs.WxShare.showModal = true;
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
  .certificate-detail {
    padding-bottom: 32rpx;
    overflow-y: auto;
    overflow-x: hidden;
    .detail-header {
      position: relative;
      margin-top: -64rpx;
      .status-info {
        display: flex;
        flex-direction: column;

        position: absolute;
        /*  #ifdef  H5  */
        position: relative;
        /*  #endif  */

        color: #643b27;
        font-size: 40rpx;
        font-weight: 700;
        left: 50rpx;
        bottom: 280rpx;
        .en-info {
          margin-top: 8rpx;
          color: #643b27;
          font-size: 28rpx;
          font-weight: 400;
        }
        .pass-tag {
          width: 37rpx;
          height: 37rpx;
          color: '#643b27';
          margin-right: 12rpx;
        }
      }
    }
    .crouse-content {
      position: relative;
      margin: -254rpx 30rpx 0rpx;
    }
    .mr-content {
      margin: 32rpx 30rpx 0rpx;
    }
    .image-box {
      width: 100%;
    }
  }
</style>
