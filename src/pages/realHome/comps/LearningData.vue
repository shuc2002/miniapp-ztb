<!--
* @desc 首页学习资料
* @author 江玉龙
* @date 2022年6月15日
-->
<template>
  <view class="learn-box">
    <view class="trade-item">
      <image src="@/static/img/home/order-data.png" />
      <span class="text-size-xl common-text-700 common-text">学习资料</span>
    </view>
    <scroll-view scroll-x="true" scroll-with-animation class="x-tab">
      <view class="tab-item">
        <view
          class="text-item"
          v-for="(value, index) in tabList"
          :key="index"
          :class="activeNum == index ? 'common-blue' : 'common-tip'"
          @tap="handleTap(value, index)"
          >{{ value.v }}</view
        >
      </view>
    </scroll-view>
    <view v-for="(item, key) in list" :key="key">
      <view
        class="learn-item"
        @tap="
          item.isBought
            ? handlePdf(item.productId, item.unitId)
            : commonFun.routeTo(
                `/page_material/learnData/index?id=${item.id}&subjectId=${item.subjectId}`
              )
        "
      >
        <view class="text-size-main common-text common-text-400 truncate">{{ item.name }}</view>
        <view class="flex read-item">
          <view class="tab-free flex-center" v-if="item.price == 0">限时免费</view>
          <view class="text-size-xxs common-tip common-text-400" v-if="item.readingAmount"
            >阅读：{{ item.readingAmount }}</view
          >
        </view>
      </view>
    </view>
    <view v-if="list.length <= 0" class="empty-box">
      <image src="@/home/static/img/empty/empty.png" class="empty-img" />
      <p class="text-size-sn common-text-400 common-tip">老师正在辛苦产出中...</p>
    </view>
    <PopupWindow ref="detail" height="340rpx" title="温馨提示">
      <view class="text-size-main">您的课程已过期，详情请咨询客服</view>
    </PopupWindow>
    <PopupWindow ref="force" height="340rpx" title="温馨提示">
      <view class="text-size-main">请在{{ day }}天后再使用</view>
    </PopupWindow>
  </view>
</template>
<script>
  import PopupWindow from '@/components/PopupComp/PopupWindow.vue';
  import { getAuthorize } from '@/api/modules/user/index.ts';
  import { getUnitList } from '@/api/modules/question/exam.ts';
  export default {
    name: 'learningData',
    components: {
      PopupWindow,
    },
    props: {
      list: {
        type: Array,
        default: () => [],
      },
      tabList: {
        type: Array,
        default: () => [],
      },
      activeNum: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        day: 0,
      };
    },
    methods: {
      // 点击科目
      handleTap(value, index) {
        this.$emit('handleSub', value.k, index);
      },
      // 已购买逻辑
      async handlePdf(productId, unitId) {
        const res = await getAuthorize({ productId, unitId });
        const data = await getUnitList({ code: res.body });
        if (data.body.isExpired == 1) {
          // uni.showLoading({
          //   title: '加载中',
          //   mask: true,
          // });
          uni.navigateTo({
            url: `/page_commodity/courseList/skipTo?src=${data.body.material}`,
          });
          // uni.downloadFile({
          //   url: data.body.material,
          //   success: (val) => {
          //     uni.openDocument({
          //       filePath: val.tempFilePath,
          //       success: async () => {
          //         uni.hideLoading();
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
        } else if (data.body.isExpired == 0) {
          this.day = data.body.day;
          this.$refs.force.showModal = true;
        } else {
          this.$refs.detail.showModal = true;
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
  .learn-box {
    background-color: white;
    padding: 32rpx;
    border-radius: 24rpx;
    margin-top: 24rpx;
    .learn-item {
      padding: 32rpx 0;
      .tab-free {
        width: 96rpx;
        height: 36rpx;
        border-radius: 8rpx;
        color: #ff9f10;
        border: 2rpx solid #fff1be;
        background: #fffcec;
        font-size: 20rpx;
        font-weight: 400;
        margin-right: 16rpx;
      }
      .read-item {
        margin-top: 18rpx;
      }
    }
  }
  .trade-item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    image {
      width: 48rpx;
      height: 48rpx;
      margin-right: 16rpx;
    }
  }
  .x-tab {
    margin-top: 24rpx;
    padding: 10rpx 0;
    width: 84vw;
    height: 40rpx;
    .tab-item {
      display: flex;
      flex-wrap: nowrap;
      .text-item {
        flex-shrink: 0;
        margin-right: 32rpx;
        font-size: 28rpx;
        font-weight: 400;
      }
    }
  }
  .empty-box {
    display: flex;
    flex-flow: column;
    align-items: center;
    .empty-img {
      width: 344rpx;
      height: 344rpx;
    }
    p {
      margin-bottom: 64rpx;
    }
  }
</style>
