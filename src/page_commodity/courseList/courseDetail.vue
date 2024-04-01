<!--
* @desc 课程树
* @author 江玉龙
* @date 2022年06月14日
-->
<template>
  <view class="wrap">
    <RecursionLevelList
      :list="list"
      :showSpeed="true"
      :statics="statics"
      :certId="certId"
      @goSign="showSignModal"
      :defaultExpan="true"
      @callback="handleNavigate"
      :isCallback="true"
    />
    <AgreementModal ref="agreement" @confirm="goToSign" />
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
  import RecursionLevelList from '@/components/ChapterCourse/RecursionLevelList';
  import { getConstructs } from '@/api/modules/user/index.ts';
  import { flatList, getProductIds } from '@/course/chapter/utils/index';
  import { fetchGetStudyStat } from '@/api/modules/common/index';
  import {
    certCourseRegistration,
    certCoursePopRecord,
    getApplicationStatus,
  } from '@/api/modules/certificateCourse/index';
  import AgreementModal from '@/components/Agreement/AgreementModal.vue';
  import PopupWindow from '@/components/PopupComp/PopupWindow.vue';
  import { BaseFormUrl } from '@/enums/envEnum';
  import baseInfo from '@/build/index';
  import { getAuthorizeAndSign } from '@/api/modules/user/index.ts';
  import { getUnitList } from '@/api/modules/question/exam.ts';
  import { getCommodityDetail } from '@/api/modules/commodity/index';
  import { getUnitDetail } from '@/api/modules/course/index.ts';
  export default {
    name: 'courseDetail',
    components: {
      RecursionLevelList,
      AgreementModal,
      PopupWindow,
    },
    computed: {
      socketMsg() {
        return this.$store.getters.getSocketMsg;
      },
    },
    watch: {
      socketMsg: {
        handler(nv) {
          this.socketMsgs = JSON.parse(nv);
          this.$refs.integral.showModal = true;
        },
        immediate: false,
        deep: true,
      },
    },
    data() {
      return {
        list: [],
        statics: [],
        productId: '',
        ifShow: false,
        socketMsgs: {},
        title: '', // 产品名字
        projectName: '', //项目名字
        remindInfo: {}, // 直播提醒条
        certId: '', //证书课程id
        contractInfo: {}, //产品协议信息
        contractInfoList: [],
        auditStatus: 0,
      };
    },
    async onLoad(options) {
      console.log('options---', options);
      this.productId = options.productId;
      this.certId = options.certId;
      this.getConstructsList(this.productId);
      if (options.certId && options.formId) {
        this.formId = options.formId;
        certCourseRegistration({ certificateId: options.certId, formRecordId: this.formId });
      }
      if ((options.certId && options.certId != 'undefined' ) || (options.certificateId && options.certificateId != 'undefined')) {
        const result = await getApplicationStatus({ certificateId: options.certId });
        const { registrationStatus, notice = 0 } = result.body;
        if (registrationStatus === 1) {
          this.auditStatus = 1;
          if (notice == 0) {
            this.$refs.force.showModal = true;
          }
        }
      }
    },
    onShow() {
      if (this.ifShow) {
        this.getConstructsList(this.productId);
      }
    },
    methods: {
      async handleNavigate(item, productId) {
        const _this = this;
        const curProductId = productId ? productId : item.productId;
        if (this.certId != 'undefined') {
          console.log('coco1');
          const result = this.handleCertificateCourse(this.certId, curProductId);
          if (!result) {
            return false;
          }
        }
        if (this.freezeBtn) {
          return;
        }
        const {
          type,
          id: unitId,
          // name,
          preview = false,
          isPurchase = false,
          downloadable,
          handouts,
        } = item;
        if (isPurchase || preview) {
          // 暂时不支持试读
          const res = await getAuthorizeAndSign({ productId: curProductId, unitId: unitId });
          const { code, errCode, contractInfoList } = res.body;
          if (errCode === 2352) {
            this.$emit('goSign', contractInfoList);
            return;
          }
          // if (res.code === 2064) {
          //   uni.showToast({
          //     title: '考试剩余次数不足',
          //     icon: 'none',
          //   });
          //   return;
          // }
          // 做题的时候会用到
          this.$store.commit('setExamCode', code);
          // 购买后 0 资料, 1 视频 , 2 考试练习 ,4直播
          let data = {};
          let detail = {};
          // 存储一下当前的商品id
          uni.setStorageSync('chapterCommodityId', this.commodityId);
          switch (type) {
            case 0: {
              // 资料
              detail = await getUnitDetail({ code });
              const limit = detail.body.limit;
              uni.navigateTo({
                url: `/page_commodity/courseList/skipTo?src=${detail.body.material}&code=${code}&limit=${limit}`,
              });
              break;
            }
            case 1: // 视频
              detail = await getUnitDetail({ code });
              // console.log(detail,'detail');
              // return;
              if (isPurchase) {
                uni.navigateTo({
                  url: `/page_commodity/courseList/skipTo?productId=${curProductId}&pdf=${detail.body.material}&commodityId=${this.commodityId}&unit=${unitId}&downloadable=${downloadable}&handouts=${handouts}&vid=${detail.body.videoId}&code=${code}`,
                });
              } else {
                uni.navigateTo({
                  url: `/page_commodity/courseList/skipTo?productId=${curProductId}&pdf=${detail.body.material}&commodityId=${this.commodityId}&unit=${unitId}&downloadable=${downloadable}&handouts=${handouts}&vid=${detail.body.videoId}&isTest=true`,
                });
              }
              break;
            case 2: // 考试练习
              uni.navigateTo({
                url: `/page_commodity/courseList/trialPracticeQuestions?code=${code}&isPurchase=${isPurchase}`,
              });
              break;
            case 3: // 考试
              uni.navigateTo({
                url: `/page_mockExam/paperExam/index?code=${code}&isPurchase=${isPurchase}`,
              });
              break;
            case 4: // 直播
              data = await getUnitList({ code });
              uni.navigateTo({
                url: `/page_commodity/courseList/skipTo?indexUrl=${encodeURIComponent(
                  JSON.stringify(data.body.indexUrl)
                )}`,
              });
              break;
          }
        } else {
          // 产品模式购买跳转
          if (this.mode === 1) {
            const result = await getCommodityDetail({ id: this.commodityId });
            if (result.body) {
              // 判断有无规格
              if (result.body.skuList.length > 0) {
                uni.setStorageSync('commodityData', result.body);
                uni.navigateTo({
                  url: '/page_commodity/commodity/comps/BuySkuList',
                });
              }
            }
          } else if (this.mode == 2) {
            // 协议模式购买跳转
            const data = await getCommodityDetail({ id: this.commodityId });
            uni.setStorageSync('commodityData', data.body);
            uni.navigateTo({
              url: `/page_commodity/commodity/pages/goArgeement?url=${data.body.contract.url}`,
            });
          } else {
            uni.navigateTo({
              url: `/page_commodity/commodity/pages/commodityBank?id=${this.commodityId}`,
            });
          }
        }
        // this.$emit('callback', curr);
      },
      async handleCertificateCourse(certificateId, curProductId) {
        console.log('aaaa');
        if (certificateId) {
          // 证书课程先看是否需要填用户表单
          // signUpFormLimit  0-无限制，1-填写表单    registrationStatus 0-待审核 1-审核通过 2-已经驳回 3-未填写表单

          const result = await getApplicationStatus({ certificateId });
          const {
            signUpFormLimit,
            registrationStatus,
            answerUrl2,
            formId = '',
            checkTime,
            formRecordId = '',
            notice = 0,
          } = result.body;
          let clientOrigin = '';
          /* #ifdef H5 */
          clientOrigin = window.location.origin;
          /* #endif */
          // 去学习，去报名都调用/util/certificate/sign/up报名一次
          await certCourseRegistration({
            certificateId: certificateId,
            formRecordId: formRecordId,
          });
          if (signUpFormLimit === 1 && checkTime === 1 && registrationStatus != 4) {
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
            }
            if (registrationStatus === 3) {
              // 跳转到表单填写
              const baseUrl = BaseFormUrl[baseInfo.ENV];
              const uri = encodeURIComponent(
                `${baseUrl}/form${answerUrl2}&token=${uni.getStorageSync('token')}&channelId=${
                  this.channelId
                }&clientOrigin=${clientOrigin}&platform=${
                  uni.getSystemInfoSync().uniPlatform
                }&formId=${formId}&formRecordId=${formRecordId}&productId=${curProductId}&certId=${certificateId}&redirectUrl=/page_commodity/courseList/courseDetail`
              );
              const url = `/page_common/iframe/index?uri=${uri}`;
              uni.navigateTo({
                url,
              });
              return false;
            }
          } else {
            return true;
          }
        } else {
          return true;
        }
      },
      // 签署协议提醒弹窗
      showSignModal(info) {
        this.contractInfoList = info;
        this.$refs.agreement.showModal = true;
      },
      goToSign() {
        const uri = encodeURIComponent(
          `/page_material/agreement/agreementDetail?fileUrl=${this.contractInfoList[0].contractUrl}&recordId=${this.contractInfoList[0].contractHistoryId}&productId=${this.productId}&isSigned=0&isOrder=true&goodsId=${this.commodityId}&redirectUrl=/page_commodity/courseList/courseDetail`
        );
        uni.navigateTo({
          url: uri,
        });
      },
      // 获取课程的产品结构
      async getConstructsList(id) {
        let res = await getConstructs({ id });
        const constructs = res.body ? [res.body] : [];
        // 利用缓存重新组织树结构
        const productIds = getProductIds(constructs, 'P');
        const statics = await fetchGetStudyStat({ productIds });
        // constructs = assembleData(constructs, statics.body);
        let originList = flatList(constructs);
        this.statics = statics.body;
        this.list = originList;
      },
      //表单填写完成弹窗
      handlePop(info) {
        console.log(1111);
        this.auditStatus = info;
        this.$refs.force.showModal = true;
      },
      async goBuy() {
        if (this.auditStatus === 0) {
          this.$refs.force.showModal = false;
        } else if (this.auditStatus === 1) {
          console.log('ddddd');
          await certCoursePopRecord({ certificateId: this.certId });
          this.$refs.payRef.handleBuy();
          // this.$ref.recursionLevelList.
        } else if (this.auditStatus === 2) {
          const res = await getApplicationStatus({
            certificateId: this.commodityData.certificateId,
          });
          let clientOrigin = '';
          /* #ifdef H5 */
          clientOrigin = window.location.origin;
          /* #endif */
          const { formId = '', answerUrl2, formRecordId = '' } = res.body;
          await certCourseRegistration({
            certificateId: this.commodityData.certificateId,
            formRecordId: formRecordId,
          });
          const baseUrl = BaseFormUrl[baseInfo.ENV];
          const uri = encodeURIComponent(
            `${baseUrl}/form${answerUrl2}&token=${uni.getStorageSync('token')}&channelId=${
              this.channelId
            }&clientOrigin=${clientOrigin}&platform=${
              uni.getSystemInfoSync().uniPlatform
            }&formId=${formId}&formRecordId=${formRecordId}&id=${
              this.commodityData.id
            }&redirectUrl=/page_commodity/commodity/pages/commodityBank`
          );
          const url = `/page_common/iframe/index?uri=${uri}`;
          // console.log(url, 'url----');
          uni.navigateTo({
            url,
          });
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .wrap {
    padding-bottom: 16px;
    padding-left: 12px;
    padding-right: 12px;
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
