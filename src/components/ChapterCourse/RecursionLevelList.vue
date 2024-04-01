<template>
  <div class="leve-container">
    <div v-for="(item, index) in list" :key="index">
      <!-- 第一层start -->
      <div>
        <!-- 判断几级展示不同UI -->
        <div v-if="item.next && item.next.length > 0">
          <div
            class="row-first row-pad0"
            @click="openClose"
            :data-id="item.name"
            v-show="item.nodeType != 'J'"
          >
            <!-- <span
              :class="
                index !== list.length - 1 || hasPreClickId(preClickIdArr, item.name) ? 'line' : ''
              "
            ></span> -->
            <div style="display: flex;">
              <text
                class="tree__bottom iconfont"
                :class="
                  hasPreClickId(preClickIdArr, item.name)
                    ? 'icon-expand_1_1 ioncont-level-1'
                    : 'icon-expand_1_2 ioncont-level-1'
                "
              ></text>
              <div class="title truncate-two">{{ item.name }}</div
              ><div v-if="assembleData(item, statics).preview" class="previewtext">试学</div>
            </div>

            <!-- <span class="btn" :data-chapterid="item.name" catchtap="goQuest">查看</span> -->
            <div class="progress-content">
              <div class="progress">
                <div class="progress-left" v-if="showSpeed">
                  <div class="percent-line">
                    <div
                      class="percent-red"
                      :style="{
                        width: Number(assembleData(item, statics).speedRate * 100).toFixed(1) + '%',
                      }"
                    ></div>
                  </div>
                  <div class="percent-number">{{
                    Number(assembleData(item, statics).speedRate * 100).toFixed(1) + '%'
                  }}</div>
                </div>
                <div class="progress-text">
                  <span>{{ assembleData(item, statics).spnum }}人已学习</span>
                </div>
              </div>
              <div
                v-if="item.isUnit"
                :data-sectionid="item.name"
                :data-chapterid="chapterid"
                :class="item.isPurchase || item.preview ? 'btn' : 'lock-btn'"
                @click="$emit('callback', item, productId)"
              >
                <text v-if="item.isPurchase || item.preview" class="iconfont to-study">练习</text>
                <text v-else class="iconfont icon-lock"></text>
              </div>
            </div>
          </div>
          <div
            class="row-first-subject"
            @click="openClose"
            :data-id="item.name"
            v-show="item.nodeType == 'J'"
          >
            <!-- <span
              :class="
                index !== list.length - 1 || hasPreClickId(preClickIdArr, item.name) ? 'line' : ''
              "
            ></span> -->
            <div class="subject-box" style="display: flex;">
              <text
                class="tree__bottom-subject iconfont"
                :class="
                  hasPreClickId(preClickIdArr, item.name)
                    ? 'icon-chevron-down ioncont-level-1-subject'
                    : 'icon-chevron-up ioncont-level-1-subject'
                "
              ></text>
              <div class="title-left-icon"></div>
              <div class="title-subject truncate-two">{{ item.name }}</div>
              <!-- <div v-if="item.preview" class="previewtext">试学</div> -->
            </div>

            <!-- <span class="btn" :data-chapterid="item.name" catchtap="goQuest">查看</span> -->
            <!-- <div class="progress-content">
              <div class="progress">
                <div class="progress-left" v-if="showSpeed">
                  <div class="percent-line">
                    <div
                      class="percent-red"
                      :style="{
                        width: Number(assembleData(item, statics).speedRate * 100).toFixed(1) + '%',
                      }"
                    ></div>
                  </div>
                  <div class="percent-number">{{
                    Number(assembleData(item, statics).speedRate * 100).toFixed(1) + '%'
                  }}</div>
                </div>
                <div class="progress-text">
                  <span>{{ assembleData(item, statics).spnum }}人已关注</span>
                </div>
              </div>
              <div
                v-if="item.isUnit"
                :data-sectionid="item.name"
                :data-chapterid="chapterid"
                :class="item.isPurchase || item.preview ? 'btn' : 'lock-btn'"
                @click="$emit('callback', item, productId)"
              >
                <text v-if="item.isPurchase || item.preview" class="iconfont to-study">练习</text>
                <text v-else class="iconfont icon-lock"></text>
              </div>
            </div> -->
          </div>
          <!-- 大于二级进行递归 -->
          <RecursionLevelChildren
            :list="item.next"
            :statics="statics"
            v-if="hasPreClickId(preClickIdArr, item.name)"
            :chapterid="item.name"
            :current="current"
            :productId="item.productId"
            :showSpeed="showSpeed"
            :defaultExpan="defaultExpan"
            @callback="
              (currItem, productId) =>
                isCallback
                  ? $emit('callback', assembleData(currItem, statics), productId)
                  : handleNavigate(currItem, productId)
            "
          />
        </div>
        <!-- 当前为1级 -->
        <div v-else>
          <div class="row-first">
            <span class="line line-first"></span>
            <span class="tree_last"></span>
            <span class="title-first">{{ item.name }}</span>
            <!-- <span class="btn" :data-chapterid="item.name" catchtap="goQuest">查看</span> -->
            <div class="progress">
              <div class="progress-text">
                <span>{{ item.questionCount }}</span>
                <!-- <text></text> -->
              </div>
              <!-- <progress
                percent="{{item.studyCount/item.questionCountInt*100}}"
                class="progress__line"
                border-radius="10"
                stroke-width="3"
                activeColor="#FC8118"
              ></progress> -->
            </div>
          </div>
        </div>
      </div>
      <!-- 第一层end -->
      <!-- 第二层start -->
      <!-- 第二层end -->
    </div>
  </div>
</template>

<script>
  import RecursionLevelChildren from './RecursionLevelChildren.vue';
  import { getAuthorizeAndSign } from '@/api/modules/user/index.ts';
  import { getUnitList } from '@/api/modules/question/exam.ts';
  import { getCommodityDetail } from '@/api/modules/commodity/index';
  import { assembleData } from '@/course/chapter/utils/index';
  import { getUnitDetail } from '@/api/modules/course/index.ts';
  import {
    getApplicationStatus,
    certCourseRegistration,
  } from '@/api/modules/certificateCourse/index';
  import { BaseFormUrl } from '@/enums/envEnum';
  import baseInfo from '@/build/index';
  export default {
    name: 'RecursionLevelList',
    // props: ['list', 'current', 'commodityId', 'freezeBtn', 'showSpeed'],
    props: {
      list: {
        type: Array,
        default: () => [],
      },
      current: {
        type: Number,
        default: 0,
      },
      commodityId: {
        type: String,
        default: '',
      },
      // 分销商id
      supplierId: {
        type: String,
        default: '',
      },
      freezeBtn: {
        //是否冻结点击
        type: Boolean,
        default: false,
      },
      showSpeed: {
        type: Boolean,
        default: false,
      },
      mode: {
        type: Number,
        default: 0,
      },
      defaultExpan: {
        type: Boolean,
        default: false,
      },
      statics: {
        type: Array,
        default: () => [],
      },
      callback: {
        type: Function,
        default: () => [],
      },
      certId: {
        type: String,
        default: '',
      },
      isCallback: {
        type: Boolean,
        default: false,
      },
    },
    components: {
      RecursionLevelChildren,
    },
    data() {
      return {
        preClickIdArr: [],
        assembleData,
      };
    },

    watch: {
      data() {
        const arr = [];
        this.list.forEach((item) => {
          if (item.spread) {
            arr.push(item.name);
          }
        });
        this.preClickIdArr = arr;
      },
      /* #ifndef H5 */
      // list: {
      //   deep: true,
      //   handler(val) {
      //     val.forEach((item) => {
      //       item['preview'] = false;
      //       if (item.next) {
      //         item.next.forEach((data) => {
      //           if (data.preview) {
      //             item.preview = true;
      //           }
      //           if (data.next) {
      //             data.next.forEach((last) => {
      //               if (last.preview) {
      //                 item.preview = true;
      //               }
      //             });
      //           }
      //         });
      //       }
      //     });
      //   },
      //   immediate: true,
      //   /* #ifdef MP-TOUTIAO */
      //   immediate: true,
      //   /* #endif */
      // },
      /* #endif */
      isPreview: {
        /* #ifndef H5 */
        immediate: true,
        /* #endif */
        handler(n) {
          if (n.list && n.defaultExpan) {
            this.justOpen(n.list[0]);
          }
        },
      },
    },
    computed: {
      isPreview() {
        let list = this.list;
        let defaultExpan = this.defaultExpan;
        return { list, defaultExpan };
      },
      channelId() {
        return this.$store.getters.getChannelId;
      },
    },
    methods: {
      async handleNavigate(item, productId) {
        console.log(item, 'xxxxx');
        // 种下供应商商id
        this.$store.commit('setSupplierId', this.supplierId || '');
        const curProductId = productId ? productId : item.productId;
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
          skuId = '',
        } = item;
        console.log('当前点击的单元', item, this.mode);
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
                  data.body.indexUrl
                )}`,
              });
              break;
          }
        } else if (skuId && skuId != '') {
          // 章节课带有skuId跳转购买
          const res = await getCommodityDetail({ id: this.commodityId });
          const commodityData = res.body;
          const orderContractId = '';
          const ifShowArgee = commodityData.contract ? true : false;
          const skuObj = commodityData.skuList.find((item) => item.skuId == skuId);
          const goodsData = [
            {
              id: commodityData.id,
              skuCode: skuObj.skuCode,
              subName: this.skuCodeToName(skuObj.skuCode, commodityData),
              number: 1,
              name: commodityData.name,
              price: skuObj.price,
              amount: skuObj.price,
              linePrice: skuObj.linePrice,
              thumbnail: commodityData.thumbnail,
              commodityType: commodityData.type,
              certificateId:
                commodityData.certificateId && commodityData.type === 1
                  ? commodityData.certificateId
                  : null,
              number: 1,
            },
          ];
          if (commodityData.type == 3) {
            uni.navigateTo({
              url: `/page_commodity/order/pages/entityOrder?commodityList=${JSON.stringify(
                goodsData
              )}&isCollage=false&ifActivity=false&first=true`,
            });
          } else if (commodityData.type == 1) {
            uni.navigateTo({
              url: `/page_commodity/order/pages/collageOrder?commodityList=${JSON.stringify(
                goodsData
              )}&isCollage=false&ifActivity=false&contract=${JSON.stringify(
                commodityData.contract
              )}&orderContractId=${orderContractId}&first=true&ifShowArgee=${ifShowArgee}`,
            });
          }
        } else {
          // 产品模式购买跳转
          if (this.mode == 1) {
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
            // 判断一下在当前页面不用跳转
            //eslint-disable-next-line no-undef
            let pages = getCurrentPages();
            if (
              pages[pages.length - 1].$page.fullPath.includes(
                '/page_commodity/commodity/pages/commodityBank'
              )
            ) {
              return;
            } else {
              uni.navigateTo({
                url: `/page_commodity/commodity/pages/commodityBank?id=${this.commodityId}`,
              });
            }
          }
        }
        // this.$emit('callback', curr);
      },

      skuCodeToName(skuCode, commodityData) {
        let skuName = '';
        let arr = skuCode.split(':');
        console.log(arr, 999);
        commodityData.skuOptions.forEach((item, index) => {
          const levelIndex = arr[index];
          skuName = index == 0 ? item.values[levelIndex] : `${skuName},${item.values[levelIndex]}`;
        });
        console.log(skuName, 999);
        return skuName;
      },
      async handleCertificateCourse(certificateId, curProductId) {
        console.log('aaaa');
        if (certificateId && certificateId != 'undefined') {
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
          if (signUpFormLimit === 1 && checkTime === 1) {
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
      handleItem(item) {
        const { next = [], units = [] } = item;
        return next ? (units ? next.concat(units) : next) : [];
      },
      hasPreClickId(arrData, id) {
        if (arrData.indexOf(id) == -1) {
          return false;
        } else {
          return true;
        }
      },
      openClose(e) {
        let currentId = e.currentTarget.dataset.id,
          preClickIdArr = JSON.parse(JSON.stringify(this.preClickIdArr));
        if (preClickIdArr.indexOf(currentId) == -1) {
          preClickIdArr.push(currentId);
        } else {
          preClickIdArr.splice(preClickIdArr.indexOf(currentId), 1);
        }
        this.preClickIdArr = preClickIdArr;
      },
      justOpen(item) {
        const currentVal = item.name;
        let preClickIdArr2 = JSON.parse(JSON.stringify(this.preClickIdArr));
        if (preClickIdArr2.indexOf(currentVal) === -1) {
          preClickIdArr2.push(currentVal);
        }
        this.preClickIdArr = preClickIdArr2;
      },
    },
  };
</script>

<style lang="scss">
  .leve-container {
    margin: 50rpx 0;
  }
  .row {
    position: relative;
    min-height: 40px;
    padding-left: 20px;
  }
  .previewtext {
    width: 30px;
    height: 15px;
    background: #fe5548;
    border-radius: 7px 7px 7px 0;
    font-size: 10px;
    text-align: center;
    line-height: 15px;
    color: #fff;
    // display: inline;
  }

  .line {
    position: absolute;
    width: 1px;
    top: 3px;
    bottom: 0;
    left: 6px;
    background-color: blue;
  }
  .line-first {
    top: 213px;
    bottom: -15px;
  }

  .row-first {
    position: relative;
    min-height: 25px;
    padding: 10px 0 5px 20px;
  }
  .row-first-subject {
    position: relative;
    // padding: 10px 0 10px 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: -25rpx;
    width: 750rpx;
    // min-height: 96rpx;
    background: #f2f3f5;
    // line-height: 96rpx;
    padding-top: 28rpx;
    padding-bottom: 28rpx;
    margin-bottom: 34rpx;
  }
  .row-pad0 {
    padding-top: 1px;
  }
  .tree__bottom {
    position: absolute;
    left: -1px;
    top: 5px;
    width: 18rpx;
    height: 18rpx;
  }
  .tree__bottom-subject {
    position: absolute;
    right: 42rpx;
    top: 17px;
    width: 18rpx;
    height: 18rpx;
  }

  .tree_add {
    position: absolute;
    left: 0;
    top: 14px;
    width: 12px;
    height: 12px;
  }
  .tree_add_S {
    position: absolute;
    left: -14rpx;
    top: 14px;
    width: 12px;
    height: 12px;
    color: #333333;
  }

  .tree_last {
    position: absolute;
    left: 5px;
    top: 16px;
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: #fc8118;
  }

  .title {
    // display: inline-block;
    // overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
    margin-right: 4px;
    max-width: 588rpx;
    // width: 225px;
    color: #4e4e4e;
    font-size: 32rpx;
    font-weight: 700;
    margin-left: 15rpx;
  }
  .title-left-icon {
    width: 8rpx;
    height: 32rpx;
    border-radius: 6rpx;
    background: #e51600;
    margin-left: 22rpx;
    margin-top: 7rpx;
  }
  .title-subject {
    // display: inline-block;
    // overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
    margin-right: 4px;
    max-width: 648rpx;
    // width: 225px;
    color: #4e4e4e;
    font-size: 32rpx;
    margin-left: 10rpx;
  }
  // .title-first {
  //   // width: 225px;
  // }

  .btn {
    float: right;
    width: 70px;
    height: 23px;
    font-size: 14px;
    text-align: center;
    color: #fc8118;
    line-height: 23px;
    border: 1rpx solid #fc8118;
    border-radius: 15px;
  }

  .progress {
    margin-top: 8px;
    width: 225px;
  }

  .progress-text {
    font-size: 12px;
    color: #9a9a9a;
  }

  .progress__line {
    margin-top: 5px;
  }

  .progress-text > text {
    margin-right: 40px;
  }

  .share {
    display: inline;
    padding: 0;
    margin: 0;
    line-height: normal;
    background-color: transparent;
    border: none;
  }

  .share::after {
    border: none;
  }
  .chapter-two {
    padding-left: 10rpx;
    .row-two {
      position: relative;
      min-height: 25px;
      padding: 10px 10px 10px 20px;
      .top-box {
        display: flex;
        height: 10rpx;
        align-items: center;
        font-size: 32rpx;
      }
    }
    .row-two-nopadding {
      padding-left: 0px;
    }
  }
  .progress-content {
    height: 34px;
    justify-content: space-between;
    align-items: center;
    .progress {
      // margin-top: 15px;
      width: 225px;
      display: flex;
      .progress-left {
        display: flex;
        margin-right: 8px;
        margin-left: 8px;
      }
      .percent-line {
        width: 40px;
        height: 6px;
        border-radius: 4px;
        margin-right: 8px;
        background: #e5e6eb;
        line-height: 6px;
        margin-top: 6px;
      }
      .percent-red {
        background: #e51600;
        height: 6px;
        border-radius: 4px;
      }
      .percent-number {
        font-size: 12px;
        color: #9a9a9a;
      }
      .progress-text {
        font-size: 12px;
        color: #9a9a9a;
      }
    }
  }
  .ioncont-level-1 {
    font-size: 40rpx;
    margin-top: -8rpx;
  }
  .ioncont-level-1-subject {
    font-size: 40rpx;
    margin-top: -8rpx;
  }
</style>
