<!--
* @desc 课程树子节点
* @author 江玉龙
* @date 2022年06月14日
-->
<template>
  <view>
    <view class="children-item" @tap="handleUnit()">
      <view>
        <view class="chapter-box">
          <image src="@/static/svgs/practice.svg" class="img-style" v-if="treeData.type == 0" />
          <image src="@/static/svgs/videocast.svg" class="img-style" v-if="treeData.type == 1" />
          <image src="@/static/svgs/practice.svg" class="img-style" v-if="treeData.type == 2" />
          <image src="@/static/svgs/exams.svg" class="img-style" v-if="treeData.type == 3" />
          <image src="@/static/svgs/live.svg" class="img-style" v-if="treeData.type == 4" />
          <view class="text-size-sn common-text-400 common-text name-text truncate">{{
            treeData.name
          }}</view>
        </view>
        <view class="text-size-xxs common-text-400 common-tip">
          <view v-if="treeData.type == 0">
            <!-- <span class="span-text">{{ 16 + ' ' + '页' }}</span> -->
            <!-- <span>{{ treeData.hasRecord ? '已查看' : '' }}</span> -->
          </view>
          <view v-if="treeData.type == 1">
            <!-- <span class="span-text">{{ 16 + ' ' + '分钟' }}</span> -->
            <span v-if="treeData.lastPlay">{{
              '上次观看到' + Math.floor(treeData.lastPlay / 60) + '分'
            }}</span>
          </view>
          <view
            v-if="treeData.type == 2 || treeData.type == 0 || treeData.type == 3"
            class="progress-content"
          >
            <div class="percent-line">
              <div class="progress">
                <div class="progress-left">
                  <div class="percent-line">
                    <div
                      class="percent-red"
                      :style="{ width: Number(treeData.speedRate * 100).toFixed(1) + '%' }"
                    ></div>
                  </div>

                  <div class="percent-number" v-if="treeData.type === 1">{{
                    treeData.done + '/' + (treeData.total / 60).toFixed(0) + '分钟'
                  }}</div>
                  <div class="percent-number" v-if="treeData.type === 4 && treeData.status === 2">{{
                    treeData.done + '/' + (treeData.total / 60).toFixed(0) + '分钟'
                  }}</div>
                  <div class="percent-number" v-else
                    >{{ treeData.done + '/' + treeData.total
                    }}<span>{{ treeData.type === 0 ? '页' : '道' }}</span></div
                  >
                </div>
                <div class="progress-text">
                  <span>{{ treeData.spnum }}人已关注</span>
                </div>
              </div>
            </div>
            <!-- <view class="text-size-xxs common-tip common-text-400 text-name"
              >{{ '刷题数：' + treeData.total + '/' + treeData.num }} <span>|</span
              >{{ '正确率：' + treeData.rate + '%' }}
            </view> -->
          </view>
          <view v-if="treeData.type == 3">
            <view class="text-size-xxs common-tip common-text-400 text-name" v-if="treeData.times"
              >{{ treeData.times + '次考试' }}<span>|</span>{{ '平均' + treeData.avg + '分'
              }}<span>|</span>{{ '上次' + treeData.last + '分' }}</view
            >
          </view>
          <view v-if="treeData.type == 4">
            <view class="progress-content">
              <div class="percent-line" v-if="treeData.status === 2">
                <div class="progress">
                  <div class="progress-left">
                    <div class="percent-line">
                      <div
                        class="percent-red"
                        :style="{ width: Number(treeData.speedRate * 100).toFixed(1) + '%' }"
                      ></div>
                    </div>
                    <div class="percent-number">{{
                      treeData.done + '/' + (treeData.total / 60).toFixed(0) + '分钟'
                    }}</div>
                  </div>
                  <div class="span-text" v-if="treeData.status === 2"> 已结束</div>
                </div>
              </div>
              <span
                class="span-text"
                :class="treeData.status == 1 || treeData.status === 0 ? 'common-blue' : ''"
                >{{ treeData.status > 2 ? '已关闭' : statusList[treeData.status] }}</span
              >
              <span class="span-text" v-if="treeData.status < 2">
                {{ treeData.liveStartTime }} 直播</span
              >
            </view>
          </view>
        </view>
      </view>
      <view class="flex-end">
        <!-- <button class="live-btn flex-center" v-if="treeData.status == 1">观看直播</button> -->
        <!-- <view class="t-icon t-icon-chevron-right analysis-icon" /> -->
        <text class="btn" v-if="treeData.type === 0">查看</text>
        <text class="btn" v-if="treeData.type === 2">练习</text>
        <text class="btn" v-if="treeData.type === 3">考试</text>
        <text class="btn" v-if="treeData.type === 1">播放</text>
        <text class="btn" v-if="treeData.type === 4 && treeData.status === 1">播放</text>
        <text class="btn" v-if="treeData.type === 4 && treeData.status === 2">回放</text>
      </view>
    </view>
    <PopupWindow
      ref="question"
      title="做题记录"
      height="368rpx"
      :cancelShow="true"
      @confirm="startDo()"
      @cancel="reStart()"
      cancelTitle="重新答题"
      confirmTitle="继续做题"
    >
      <view class="text-size-main">是否继续做题 </view>
    </PopupWindow>
    <AgreementModal ref="agreementRef" @confirm="goToSign" />
  </view>
</template>
<script>
  import PopupWindow from '@/components/PopupComp/PopupWindow.vue';
  import { throttle } from '@/page_commodity/courseList/util';
  import { getReplay, getAuthorizeAndSign } from '@/api/modules/user/index.ts';
  import { submitQuestion } from '@/api/modules/question/index.ts';
  import { getUnitList } from '@/api/modules/question/exam.ts';
  import AgreementModal from '@/components/Agreement/AgreementModal.vue';
  export default {
    name: 'courseTree',
    props: {
      treeData: {
        type: Object,
      },
      productId: {
        type: String,
        default: '',
      },
      certId: {
        type: String,
        default: '',
      },
    },
    components: {
      PopupWindow,
      AgreementModal,
    },
    computed: {
      token() {
        return this.$store.getters.getToken;
      },
    },
    data() {
      return {
        pdf: '',
        lastPoint: '',
        videoId: '',
        vc: '',
        code: '',
        statusList: ['待直播', '直播中'],
        contractInfoList: [],
      };
    },
    methods: {
      //重新开始答题
      async reStart() {
        // 清空答题卡历史记录
        await submitQuestion({
          code: this.code,
          answers: [{ index: -1, id: '-1', answer: ['0'] }],
        });
        const res = await getAuthorizeAndSign({
          productId: this.productId,
          unitId: this.treeData.id,
        });
        // uni.navigateTo({
        //   url: `/page_commodity/courseList/questionType?productId=${this.productId}&unit=${this.treeData.id}&code=${res.body}`,
        // });
        uni.navigateTo({
          url: `/page_commodity/courseList/courseQuestion?productId=${this.productId}&unit=${this.treeData.id}&code=${res.body.code}&questionType=10&count=-1&recordType=0`,
        });
      },
      //继续做题
      startDo() {
        // uni.navigateTo({
        //   url: `/page_commodity/courseList/courseQuestion?productId=${this.productId}&unit=${this.treeData.id}&code=${this.code}`,
        // });
        uni.navigateTo({
          url: `/page_commodity/courseList/courseQuestion?productId=${this.productId}&unit=${this.treeData.id}&code=${this.code}&questionType=10&count=-1&recordType=0`,
        });
      },
      // 点击学习单元
      handleUnit: throttle(async function() {
        const res = await getAuthorizeAndSign({
          productId: this.productId,
          unitId: this.treeData.id,
        });
        const { code, errCode, contractInfoList } = res.body;

        if (errCode === 2352) {
          this.contractInfoList = contractInfoList;
          this.$refs.agreementRef.showModal = true;
          return;
        }
        // if (res.code === 2064) {
        //   uni.showToast({
        //     title: '考试剩余次数不足',
        //     icon: 'none',
        //   });
        //   return;
        // }
        let data = {};
        switch (this.treeData.type) {
          // 资料
          case 0:
            data = await getUnitList({ code: code });
            uni.navigateTo({
              url: `/page_commodity/courseList/skipTo?src=${data.body.material}&code=${code}`,
            });
            // uni.showLoading({
            //   title: '加载中',
            //   mask: true,
            // });
            // uni.downloadFile({
            //   url: encodeURI(data.body.material),
            //   success: (val) => {
            //     uni.openDocument({
            //       filePath: val.tempFilePath,
            //       success: async () => {
            //         uni.hideLoading();
            //         await setPdfData({ code: res.body, index: 0 });
            //       },
            //       fail: () => {
            //         uni.hideLoading();
            //         uni.showToast({
            //           icon: 'none',
            //           title: '打开失败',
            //         });
            //       },
            //     });
            //   },
            //   fail: () => {
            //     uni.hideLoading();
            //     uni.showToast({
            //       icon: 'none',
            //       title: '加载失败',
            //     });
            //   },
            // });
            break;
          // 视频
          case 1:
            uni.navigateTo({
              url: `/page_commodity/courseList/skipTo?productId=${this.productId}&unit=${this.treeData.id}&code=${code}`,
            });
            break;
          // 练习
          case 2:
            this.code = res.body.code;
            if (this.treeData.first) {
              // uni.navigateTo({
              //   url: `/page_commodity/courseList/courseQuestion?productId=${this.productId}&unit=${this.treeData.id}&code=${this.code}`,
              // });
              uni.navigateTo({
                url: `/page_commodity/courseList/questionType?productId=${this.productId}&unit=${this.treeData.id}&code=${this.code}`,
              });
            } else {
              this.$refs.question.showModal = true;
            }
            break;
          // 考试
          case 3:
            uni.reLaunch({
              url: `/page_mockExam/paperCover/index?id=${this.treeData.id}&productId=${this.productId}&isBought=true&certId=${this.certId}`,
            });
            break;
          case 4:
            data = await getUnitList({ code: res.body.code });
            if (this.treeData.status > 1) {
              let res = await getReplay({
                productId: this.productId,
                liveRoomId: data.body.liveRoomId,
              });
              if (res.body.length === 0 && data.body.status !== 2) {
                uni.navigateTo({
                  url: `/page_commodity/courseList/skipTo?indexUrl=${encodeURIComponent(
                    JSON.stringify(data.body.indexUrl)
                  )}&code=${this.code}`,
                });
              } // 新加的回放为空时 且已结束 则去往转码中的界面
              else if (res.body.length === 0 && data.body.status == 2) {
                uni.navigateTo({
                  url: '/page_commodity/courseList/noReplay',
                });
              } else if (res.body.length == 1) {
                uni.navigateTo({
                  url: `/page_commodity/courseList/skipTo?indexUrl=${encodeURIComponent(
                    JSON.stringify(res.body[0].playUrl)
                  )}`,
                });
              } else {
                uni.navigateTo({
                  url: `/page_commodity/courseList/playback?list=${encodeURIComponent(
                    JSON.stringify(res.body)
                  )}`,
                });
              }
            } else {
              uni.navigateTo({
                url: `/page_commodity/courseList/skipTo?indexUrl=${encodeURIComponent(
                  JSON.stringify(data.body.indexUrl)
                )}&code=${code}&roomId=${data.body.liveRoomId}`,
              });
            }
            break;
        }
      }),
      goToSign() {
        uni.navigateTo({
          url: `/page_material/agreement/agreementDetail?fileUrl=${this.contractInfoList[0].contractUrl}&recordId=${this.contractInfoList[0].contractHistoryId}&isSigned=0&isOrder=true`,
        });
      },
    },
  };
</script>
<style lang="scss" scoped>
  .children-item {
    margin: 24rpx;
    padding: 32rpx;
    display: flex;
    justify-content: space-between;
    background-color: #f8f8f9;
    border-radius: 16rpx;
    .chapter-box {
      margin-bottom: 8rpx;
      display: flex;
      align-items: center;
    }
    .span-text {
      margin-right: 32rpx;
    }
    .text-name {
      span {
        margin: 0 16rpx;
        font-size: 18rpx;
      }
    }
    .img-style {
      width: 32rpx;
      height: 32rpx;
      margin-right: 16rpx;
      margin-top: 4rpx;
    }
  }
  .name-text {
    width: 440rpx;
    text-align: start;
  }
  .live-btn {
    width: 144rpx;
    height: 48rpx;
    border-radius: 28rpx;
    background: #e2e9ff;
    color: #475ffd;
    font-size: 24rpx;
    font-weight: 500;
  }
  .btn {
    float: right;
    font-size: 12px;
    text-align: center;
    line-height: 22px;
    border-radius: 15px;
    color: #e51600;
    background-color: #fde8e6;
    border: 1px solid #f7b2aa;
    width: 56px;
    height: 24px;
  }
  .progress-content {
    display: flex;
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
        // margin-left: 8px;
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
      .progress-status {
        font-size: 12px;
        color: #e51600;
      }
    }
  }
  .common-blue {
    font-size: 12px;
    color: #e51600;
  }
  .flex-end {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
