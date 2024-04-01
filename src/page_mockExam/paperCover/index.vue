<!--
* @desc 题库科目列表
* @author daisitin
* @date 2022年04月22日
-->
<template>
  <view class="paper-bg">
    <!-- 试卷 start -->
    <view class="paper-box bg-color-white flex-center">
      <view class="paper-left-msg">
        <view class="paper-left-box text-size-min">
          <view>姓名：{{ nickName }}</view>
          <view>准考证号：1001</view>
          <view>考场号：001</view>
          <view>试卷号：001</view>
        </view>
      </view>
      <!-- 右侧试卷基础信息 start  -->
      <view class="paper-content">
        <p class="common-text text-size-xl common-text-700 flex-center">{{ paper.name }}</p>
        <view class="flex-center base-data-box text-size-xxs">
          <p>总分：{{ paper.score }}分</p>
          <view class="line" />
          <p>及格分：{{ paper.passLine }}分</p>
          <view class="line" />
          <p>时间：{{ paper.time }}分</p>
        </view>
        <!-- 表格 -->
        <!-- 表格th  -->
        <view class="table-title text-size-xxs">
          <view class="flex-center-box">
            <view class="table-tr-type table-th flex-center">题型</view>
            <view class="table-tr-value table-th flex-center">数量</view>
          </view>
        </view>
        <view class="table-box text-size-xxs">
          <!-- 表格td  -->
          <view class="flex-center-box" v-for="(item, index) in paper.info" :key="index">
            <view class="table-tr-type table-td flex-center">{{ item.title }}</view>
            <view class="table-tr-value table-td flex-center">{{ item.num }}</view>
          </view>
        </view>
        <!-- 表格 end  -->
        <p class="text-size-sn exam-subject-name" v-if="paper.subject"
          >考试科目：{{ paper.subject }}</p
        >
        <view v-if="!certId">
          <p class="text-size-xxs common-tip exam-waring-tip">注意事项：</p>
          <p class="text-size-xxs common-tip">1. 提交试卷答题卡后，显示分数及答案解析。</p>
          <p class="text-size-xxs common-tip"
            >2. 每天只能进行一次模拟考试，中途退出会保留做题记录。</p
          ></view
        >
        <!-- 按钮 start  -->
        <view class="botton-box">
          <view
            class="common-button flex-center text-size-main"
            @tap="
              paper.times == 0 && !paper.continued && cerType != 1
                ? getCode()
                : isBought == 'true'
                ? getVoucher()
                : toBuy()
            "
            >{{
              paper.times == 0 && !paper.continued && cerType != 1
                ? '查看考试结果'
                : paper.continued
                ? '继续考试'
                : '开始考试'
            }}</view
          >
          <view
            class="text-size-xxs flex-center common-message"
            v-show="isCard != 'true' && cerType != 1"
            >今日剩余考试次数: <text class="common-price">{{ paper.times }}</text
            >次</view
          >
        </view>

        <!-- 按钮 end  -->
      </view>
      <!-- 右侧试卷基础信息 end  -->
    </view>
    <!-- 试卷 end  -->
    <PopupWindow
      ref="toVip"
      height="664rpx"
      title="模拟考场仅限VIP题库用户使用"
      confirmTitle="了解一下"
      :cancelShow="true"
      @confirm="
        commonFun.redirectTo(`/page_commodity/commodity/pages/commodityBank?id=${commodityId}`)
      "
    >
      <view class="text-size-sn pop-content-box">
        <p>{{ commodityInfo.name }}</p>
        <p
          >包含 <text class="common-blue">{{ commodityInfo.subjectNum }}</text> 个科目</p
        >
        <p
          ><text class="common-blue">{{ commodityInfo.questionNum }}</text> 道精编考题</p
        >
        <p
          >今日优惠价<text class="common-price">￥{{ commodityInfo.todayPrice }}</text> 原价{{
            commodityInfo.originalPrice
          }}元</p
        >
        <view class="flex-center-box common-blue">
          <view class="flex-center">
            <view class="t-icon t-icon-a-Group10525 icon-style" />
            <view class="mr-70">免费更新</view>
          </view>
          <view class="flex-center">
            <view class="t-icon t-icon-a-Group10525 icon-style" />
            <view class="mr-70">自选科目做题</view>
          </view>
          <view class="flex-center">
            <view class="t-icon t-icon-a-Group10525 icon-style" />
            <view>专业解析</view>
          </view>
        </view>
      </view>
    </PopupWindow>
    <PopupWindow
      ref="force"
      height="308px"
      :confirmTitle="
        auditStatus === 0 ? '我知道了' : auditStatus === 1 ? '立即报名' : '修改报名信息'
      "
      @confirm="goBuy"
      class="popbox"
    >
      <img src="@/static/svgs/approved.svg" alt="" class="audit-status" v-if="auditStatus === 1" />
      <img src="@/static/svgs/rejection.svg" alt="" class="audit-status" v-if="auditStatus === 0" />
      <img src="@/static/svgs/toexamine.svg" alt="" class="audit-status" v-if="auditStatus === 2" />
      <view class="statusTit">{{
        auditStatus === 0 ? '审核中' : auditStatus === 1 ? '审核通过' : '审核驳回'
      }}</view>
      <view class="info" v-if="auditStatus === 0">您提交的报名信息正在审核中<br />请耐心等待</view>
      <view class="info" v-if="auditStatus === 1">您已审核通过，快去报名吧</view>
      <view class="info" v-if="auditStatus === 2">您提交的报名信息有误<br />请修改后重新提交</view>
    </PopupWindow>
  </view>
</template>
<script>
  import PopupWindow from '@/components/PopupComp/PopupWindow.vue';
  import {
    getVoucher,
    getExamInfo,
    getExamCode,
    getTouristCode,
  } from '@/api/modules/question/exam.ts';
  import { getDesc } from '../../api/modules/commodity';
  import { touristSign } from '@/api/modules/register/index';
  import baseInfo from '@/build/index';
  import { BaseFormUrl } from '@/enums/envEnum';
  import {
    getApplicationStatus,
    certCourseRegistration,
    certCoursePopRecord,
  } from '@/api/modules/certificateCourse/index';
  export default {
    name: 'paperCover',
    components: { PopupWindow },
    data() {
      return {
        unitId: '',
        commodityId: '',
        productId: '',
        isBought: false,
        subjectName: '',
        commodityInfo: {},
        isCard: 'false',
        paper: {
          name: '2022年二级建筑师模拟考试',
          sumScore: 120,
          jigeScore: 60,
          time: 120,
          questionType: [
            { type: 0, num: 60 },
            { type: 1, num: 60 },
            { type: 2, num: 60 },
          ],
          subject: '工程经济学',
          examTime: 1,
        },
        certId: '', // 存储证书id
        auditStatus: 0, //弹窗状态
        cerType: 0, // 判断是证书学习0-还是证书考核1
        formId: '',
      };
    },
    computed: {
      nickName() {
        return this.$store.getters.getNickName;
      },
      tourist() {
        return uni.getStorageSync('tourist');
      },
      channelId() {
        return this.$store.getters.getChannelId;
      },
    },
    onLoad(options) {
      if (options.iscard == 'true') {
        this.getToken();
        this.unitId = options.unitId;
        this.productId = options.productId;
        this.isCard = options.iscard;
        this.isBought = 'true';
        this.$store.commit('setIsCard', true);
      } else {
        this.commodityId = options.commodityId;
        this.unitId = options.id;
        this.isBought = options.isBought;
        this.productId = options.productId;
      }
      // 存在证书id--获取code时需带证书id
      if (options.certId && options.certId != 'undefined') {
        console.log('laielaielaielaiel', options);
        this.certId = options.certId;
      } else {
        this.certId = '';
      }
      if (options?.cerType == 1) {
        this.cerType = 1;
      }
      if (options.formId) {
        this.formId = options.formId;
        certCourseRegistration({ certificateId: options.certId, formRecordId: this.formId });
      }

      // this.$store.commit('setProjectId', 1111);
    },
    onShow() {
      if (this.isCard != 'true') {
        this.getExam();
      }
    },
    methods: {
      //游客
      async getToken() {
        this.$store.commit('setToken', '');
        const res = await touristSign();
        uni.setStorageSync('tourist', true);
        this.$store.commit('setNickName', '游客');
        this.$store.commit('setToken', res.body.accessToken);
        if (res.body.accessToken) {
          this.getExam();
        }
      },
      //获取游客信息的数据
      async getTouristCode() {
        const res = await getTouristCode({ unitId: this.unitId, productId: this.productId });
        this.$store.commit('setExamCode', res.body);
        uni.navigateTo({ url: '/page_mockExam/paperContent/index' });
      },
      //获取code
      async getVoucher() {
        if (this.formId) {
          const res = await certCourseRegistration({
            certificateId: this.certId,
            formRecordId: this.formId,
          });
          const { registrationStatus } = res.body;
          switch (registrationStatus) {
            case 0:
              this.auditStatus = 0;
              this.$refs.force.showModal = true;
              break;
            case 1:
              this.auditStatus = 1;
              this.$refs.force.showModal = true;
              break;
            case 2:
              this.auditStatus = 2;
              this.$refs.force.showModal = true;
              break;
          }
        } else if (this.certId && this.cerType == 1) {
          // 证书课程并且为考核的时候
          this.getCertsStatus(this.certId);
        } else {
          this.goExam();
        }
      },
      async goExam() {
        if (this.isCard == 'true') {
          await this.getToken();
          this.getTouristCode();
        } else {
          let params = {};
          if (this.certId) {
            params = {
              unitId: this.unitId,
              productId: this.productId,
              certificateId: this.certId,
              cerType: this.cerType == 1 ? this.cerType : 0,
            };
          } else {
            params = { unitId: this.unitId, productId: this.productId };
          }
          const res = await getVoucher(params);
          if (res.code === 2064) {
            uni.showToast({
              title: '今日没有考试次数了',
              icon: 'none',
            });
          } else {
            if (this.certId && this.cerType == 1) {
              uni.navigateTo({ url: '/page_mockExam/paperContent/index?isCert=true' });
            } else {
              uni.navigateTo({ url: '/page_mockExam/paperContent/index' });
            }
            this.$store.commit('setExamCode', res.body);
          }
        }
      },
      //直接查看报告
      async getCode() {
        const res = await getExamCode({ id: this.unitId, productId: this.productId });
        uni.redirectTo({ url: '/page_mockExam/paperReport/index' });
        this.$store.commit('setExamCode', res.body);
      },
      //去获取考试信息
      async getExam() {
        if (this.certId) {
          const res = await getExamInfo({
            id: this.unitId,
            productId: this.productId,
            certificateId: this.certId,
            cerType: this.cerType,
          });
          this.paper = res.body;
          this.$store.commit('setProjectId', this.paper.projectId);
          this.$store.commit('setSubject', this.paper.subjectId);
        } else {
          const res = await getExamInfo({ id: this.unitId, productId: this.productId });
          this.paper = res.body;
          this.$store.commit('setProjectId', this.paper.projectId);
          this.$store.commit('setSubject', this.paper.subjectId);
        }
      },
      //去购买
      async toBuy() {
        const res = await getDesc({ commodityId: this.commodityId });
        this.commodityInfo = res.body;
        this.$refs.toVip.showModal = true;
      },
      //查询证书表单状态
      async getCertsStatus(certificateId) {
        const res = await getApplicationStatus({
          certificateId,
        });
        const {
          signUpFormLimit,
          checkTime,
          registrationStatus = null,
          formId = '',
          answerUrl2,
          formRecordId = '',
          notice = 0,
        } = res.body;
        if (signUpFormLimit === 1) {
          let clientOrigin = '';
          /* #ifdef H5 */
          clientOrigin = window.location.origin;
          /* #endif */
          const baseUrl = BaseFormUrl[baseInfo.ENV];
          // 报名表单限制为填写表单
          if (checkTime === 2) {
            switch (registrationStatus) {
              case 0:
                this.auditStatus = 0;
                this.$refs.force.showModal = true;
                break;
              case 1:
                this.auditStatus = 1;
                if (notice == 0) {
                  this.$refs.force.showModal = true;
                }
                break;
              case 2:
                this.auditStatus = 2;
                this.$refs.force.showModal = true;
                break;
              case 3:
                await certCourseRegistration({ certificateId, formRecordId: formRecordId });
                // eslint-disable-next-line no-case-declarations
                const uri = encodeURIComponent(
                  `${baseUrl}/form${answerUrl2}&token=${uni.getStorageSync('token')}&channelId=${
                    this.channelId
                  }&clientOrigin=${clientOrigin}&platform=${
                    uni.getSystemInfoSync().uniPlatform
                  }&formId=${formId}&formRecordId=${formRecordId}&id=${this.unitId}&productId=${
                    this.productId
                  }&isBought=true&certId=${this.certId}&redirectUrl=/page_mockExam/paperCover/index`
                );
                // eslint-disable-next-line no-case-declarations
                const url = `/page_common/iframe/index?uri=${uri}`;
                uni.navigateTo({
                  url,
                });
                break;
            }
          } else {
            //无需填写表单
            // uni.navigateTo({ url: '/page_mockExam/paperContent/index?isCert=true' });
            this.goExam();
          }
        } else {
          this.goExam();
          // uni.navigateTo({ url: '/page_mockExam/paperContent/index?isCert=true' });
        }
      },
      //弹窗状态跳转
      async goBuy() {
        if (this.auditStatus === 0) {
          this.$refs.force.showModal = false;
        } else if (this.auditStatus === 1) {
          //跳转去考试
          await certCoursePopRecord({ certificateId: this.certId });
          uni.navigateTo({ url: '/page_mockExam/paperContent/index?isCert=true' });
        } else if (this.auditStatus === 2) {
          const res = await getApplicationStatus({
            certificateId: this.certId,
          });
          const { formId = '', answerUrl2, formRecordId = '' } = res.body;
          await certCourseRegistration({ certificateId: this.certId, formRecordId: formRecordId });
          let clientOrigin = '';
          /* #ifdef H5 */
          clientOrigin = window.location.origin;
          /* #endif */
          const baseUrl = BaseFormUrl[baseInfo.ENV];
          const uri = encodeURIComponent(
            `${baseUrl}/form${answerUrl2}&token=${uni.getStorageSync('token')}&channelId=${
              this.channelId
            }&clientOrigin=${clientOrigin}&platform=${
              uni.getSystemInfoSync().uniPlatform
            }&formId=${formId}&formRecordId=${formRecordId}&id=${this.unitId}&productId=${
              this.productId
            }&isBought=true&certId=${this.certId}&redirectUrl=/page_mockExam/paperCover/index`
          );
          // eslint-disable-next-line no-case-declarations
          const url = `/page_common/iframe/index?uri=${uri}`;
          uni.navigateTo({
            url,
          });
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
  .paper-bg {
    background-color: #f5f6fa !important;
    font-size: 32rpx;
    min-width: 0;
    padding: 24rpx 32rpx 64rpx 32rpx;
  }
  .paper-box {
    position: relative;
    border-radius: 16rpx;
    // #ifdef H5
    height: calc(100vh - 170rpx);
    // #endif
    // #ifndef H5
    height: calc(100vh - 88rpx);
    // #endif
    .paper-left-msg {
      width: 62rpx;
      height: 100%;
      // #ifdef H5
      .paper-left-box {
        position: absolute;
        width: calc(100vh - 320rpx);
        display: flex;
        justify-content: space-between;
        padding: 10rpx 40rpx;
        border-bottom: 1rpx solid #dae2ff;
        color: #dae2ff;
        transform: rotate(270deg);
        transform-origin: 0% 0%;
        top: calc(100vh - 200rpx);
      }
      // #endif
      // #ifndef H5
      .paper-left-box {
        position: fixed;
        width: calc(100vh - 230rpx);
        display: flex;
        justify-content: space-between;
        padding: 10rpx 40rpx;
        border-bottom: 1rpx solid #dae2ff;
        color: #dae2ff;
        transform: rotate(270deg);
        transform-origin: 0% 0%;
        top: calc(100vh - 100rpx);
      }
      // #endif
    }

    .paper-content {
      padding: 48rpx;
      height: calc(100% - 96rpx);
      position: relative;
      .base-data-box {
        margin-top: 22rpx;
        .line {
          margin: 0 16rpx;
          width: 2rpx;
          height: 16rpx;
          border-radius: 2rpx;
          background: rgba(236, 237, 241, 1);
        }
      }
    }
    .table-title {
      width: 520rpx;
      margin-top: 50rpx;
    }
    .table-box {
      width: 520rpx;
      height: 24%;
      overflow-y: scroll;
    }
    .table-tr-value {
      border: 1rpx solid #ecedf1;
      border-right: none;
      border-left: none;
      width: 210rpx;
    }
    .table-tr-type {
      border: 1rpx solid #ecedf1;
      border-left: none;
      width: 310rpx;
    }
    .table-th {
      background-color: #ecedf1;
      height: 64rpx;
    }
    .table-td {
      height: 56rpx;
    }
    .exam-subject-name {
      margin-top: 80rpx;
      margin-bottom: 48rpx;
      text-align: center;
    }
    .exam-waring-tip {
      margin-bottom: 30rpx;
    }
    .botton-box {
      position: absolute;
      bottom: 40rpx;
      width: calc(100% - 62rpx);
      .common-button {
        margin-bottom: 20rpx;
      }
    }
  }
  .pop-content-box {
    margin: 32rpx 0 16rpx 0;
    line-height: 2;
    text-align: center;
    .flex-center-box {
      margin-top: 48rpx;
      .icon-style {
        width: 24rpx;
        height: 24rpx;
        margin-right: 8rpx;
      }
      .mr-70 {
        margin-right: 38rpx;
      }
    }
  }

  .audit-status {
    width: 80px;
    height: 80px;
    padding-top: 32px;
    margin-bottom: 5px;
  }
  .statusTit {
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: 26px;
  }
  .info {
    color: #9fa1a4;
    text-align: center;
    font-family: 'PingFang SC';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    margin-top: 4px;
  }
</style>
