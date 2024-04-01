<!--
* @desc 查看解析
* @author 江玉龙
* @date 2022年05月31日
-->
<template>
  <view>
    <scroll-view :scroll-y="true" class="ques-analysis-scroll">
      <view class="analysis-scroll-bottom">
        <view v-for="(item, key) in list" :key="key">
          <view class="question-bg">
            <!-- 题干 -->
            <DataTextarea
              :showType="true"
              :textData="item.vignette"
              :keyNum="key"
              :showNum="true"
              class="text-size-sn common-text"
            />
            <!-- 选项 start -->
            <view v-for="(data, index) in item.options" :key="index" class="option-box flex-start">
              <view
                class="text-size-sn question-optionName flex-center"
                :class="
                  item.answer && item.answer.indexOf(data.option) > -1
                    ? 'option-right'
                    : item.userAnswer && item.userAnswer.indexOf(data.option) > -1
                    ? 'option-error'
                    : ''
                "
              >
                {{ data.option }}
              </view>
              <OptionTextarea
                :optionType="data.value.type"
                :optionValue="data.value.content"
                class="text-size-sn common-text"
              />
            </view>
            <!-- 选项 end -->
            <view class="answer-text">
              <span class="text-size-sn common-text-500 common-text">正确答案：</span>
              <span class="success-item">{{ item.answer }}</span>
              <span class="text-size-sn common-text-500 common-text">你的答案：</span>
              <span class="common-blue">{{
                item.userAnswer ? handleSort(item.userAnswer) : ''
              }}</span>
            </view>
            <span class="common-text common-text-400 text-size-sn">【解析】</span>
            <!-- 题干 -->
            <DataTextarea
              :showType="true"
              :textData="item.analysis"
              class="text-size-sn common-text"
            />
            <button class="collection-btn flex-center" @tap="handleCol(item.id, item.index, key)">
              <view class="img-style t-icon t-icon-icon_collect" v-if="!item.isCollected" />
              <span class="text-size-sn common-text-500 common-message" v-if="!item.isCollected"
                >收藏该题</span
              >
              <view class="img-style t-icon t-icon-aixin" v-if="item.isCollected" />
              <span class="text-size-sn common-text-500 common-message" v-if="item.isCollected"
                >已收藏该题</span
              >
            </button>
          </view>
          <!-- 广告位 -->
          <view v-if="key == 4 && advertList.length != 0">
            <swiper
              class="banner-swiper"
              :indicator-dots="true"
              :autoplay="true"
              :interval="2000"
              :duration="500"
              indicator-active-color="#98ADFF"
              indicator-color="#EAEEFF"
            >
              <swiper-item v-for="(item, idx) in advertList" :key="idx">
                <image
                  class="swiper-item"
                  :src="advertList[idx].imgUrl"
                  @tap="clickAdvert(item)"
                  mode="scaleToFill"
                />
              </swiper-item>
            </swiper>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>
<script>
  import DataTextarea from '@/components/QuestionSwiper/DataTextarea.vue';
  import OptionTextarea from '@/components/QuestionSwiper//OptionTextarea.vue';
  import { addRecord, getAdvertList } from '@/api/modules/user/index';
  import { getCommodityStatus } from '@/api/modules/commodity/index';

  export default {
    name: 'quesAnalysis',
    components: {
      DataTextarea,
      OptionTextarea,
    },
    props: {
      list: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        //广告列表
        advertList: [],
      };
    },
    computed: {
      projectId() {
        return this.$store.getters.getProjectId;
      },
      tenantId() {
        return this.$store.getters.getTenantId;
      },
    },
    methods: {
      //获取广告
      async getAdvertLists() {
        const data = await getAdvertList({
          type: 5,
          productId: this.projectId,
          tenantId: this.tenantId,
        });
        if (data && data.length > 0) this.advertList = data;
      },
      // 点击广告
      async clickAdvert(data) {
        // 记录点击广告
        if (data.id) {
          await addRecord({ advertId: data.id });
          if (data.jumpType == 2) {
            //跳转链接
            uni.setClipboardData({
              data: data.jumpPage,
              success: () => {
                uni.hideToast();
                this.$nextTick(() => {
                  uni.showToast({
                    title: '链接已复制，请在浏览器打开',
                    icon: 'none',
                  });
                });
              },
            });
          } else {
            const status = await getCommodityStatus({ id: data.jumpPage });
            //跳转商品当type:1
            if (status.body == false) {
              uni.navigateTo({
                url: `/page_commodity/commodity/pages/commodityBank?id=${data.jumpPage}`,
              });
            } else if (status.body == true) {
              uni.navigateTo({
                url: `/page_commodity/courseList/index?id=${data.jumpPage}&isOrder=true`,
              });
            }
          }
        }
      },
      handleCol(id, index, key) {
        this.$emit('handleCol', { id, index, key });
      },
      // 答案排序
      handleSort(arr) {
        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < arr.length; j++) {
            if (arr[j] > arr[j + 1]) {
              let tmp = arr[j];
              arr[j] = arr[j + 1];
              arr[j + 1] = tmp;
            }
          }
        }
        return arr.toString().replace(/,/g, '');
      },
    },
  };
</script>
<style lang="scss" scoped>
  .ques-analysis-scroll {
    height: calc(100vh - 320rpx);
  }
  /* #ifdef H5 */
  .analysis-scroll-bottom {
    padding-bottom: 220rpx;
  }
  /* #endif */

  .question-bg {
    margin: 0 24rpx 24rpx 24rpx;
    padding: 24rpx;
    background-color: #ffffff;
    .option-box {
      display: flex;
      align-items: center;
      margin-top: 16rpx;
      &:first-child {
        margin-top: 20rpx;
      }
      .question-optionName {
        width: 48rpx;
        height: 48rpx;
        border-radius: 24rpx;
        background: #f5f6fa;
        margin-right: 24rpx;
        margin-top: 15rpx;
        flex-shrink: 0;
      }
    }
  }
  .answer-text {
    margin-top: 32rpx;
  }
  .option-right {
    background: #5cc9a5 !important;
    color: #fff;
  }
  .option-error {
    background: #ff6c56 !important;
    color: #fff;
  }
  .success-item {
    font-size: 28rpx;
    font-weight: 500;
    color: #5cc9a5;
    margin-right: 48rpx;
  }
  .wrong-item {
    font-size: 28rpx;
    font-weight: 500;
    color: #ff6c56;
  }
  .collection-btn {
    width: 296rpx;
    height: 80rpx;
    margin: auto;
    margin-top: 32rpx;
    background: #f5f6fa;
    border-radius: 16rpx;
    &:active {
      opacity: 0.8;
    }
    .img-style {
      width: 40rpx;
      height: 40rpx;
      margin-right: 16rpx;
    }
  }
  .banner-swiper {
    margin: 24rpx auto;
    height: 200rpx;
    padding: 0 24rpx;
    /* #ifndef MP-WEIXIN */
    width: calc(100% - 96rpx);
    margin: 24rpx;
    /* #endif */
    .swiper-item {
      height: 100%;
      width: 100%;
      border-radius: 24rpx;
    }
  }
</style>
