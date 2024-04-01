<template>
  <view>
    <view
      class="flex-center-box tab-box"
      v-if="commodityData.type != 3"
      :class="{ is_fixed: isfixed }"
    >
      <p
        @tap="handleTap(0)"
        class="common-tip text-size-sn common-text-700"
        v-if="commodityData.activityType !== 4"
        :class="activeNum === 0 ? 'click-text text-size-main' : ''"
        >详情</p
      >
      <p
        @tap="handleTap(1)"
        class="common-tip text-size-sn common-text-700"
        :class="activeNum === 1 ? 'click-text text-size-main' : ''"
        >内容</p
      >
      <p
        @tap="handleTap(2)"
        class="common-tip text-size-sn common-text-700"
        :class="activeNum === 2 ? 'click-text text-size-main' : ''"
        >老师</p
      >
    </view>
    <view v-html="htmlStyle" v-show="activeNum === 0" class="intro-box" />
    <!-- <view class="gif-box" v-show="activeNum === 0 && commodityData.detailPageQrCode">
      <image :src="commodityData.detailPageQrCode" class="qrcode" :show-menu-by-longpress="true" />
    </view> -->
    <view v-show="activeNum === 1" class="product-box">
      <RecursionLevelList
        :list="list"
        :statics="statics"
        v-show="commodityData.activityType !== 4"
        :commodityId="commodityData.id"
        :showSpeed="true"
        :defaultExpan="true"
      />
      <RecursionLevelListLive
        :list="handlerData(commodityData.products)"
        v-show="commodityData.activityType == 4"
      />
    </view>
    <view
      v-show="activeNum === 2"
      class="teacher-box"
      v-for="(item, index) in commodityData.teachers"
      :key="index"
    >
      <view class="teacher-content">
        <view class="teacher-tit">
          <image :src="item.photo" />
          <view>{{ item.name }}</view>
        </view>
        <view class="teacher-intro" v-html="item.introduce"></view>
      </view>
    </view>
  </view>
</template>
<script>
  import RecursionLevelList from '@/components/ChapterCourse/RecursionLevelList';
  import { flatList, getProductIds } from '@/course/chapter/utils/index';
  import RecursionLevelListLive from '@/components/ChapterCourse/RecursionLevelListLive';
  import { fetchGetStudyStat } from '@/api/modules/common/index';

  export default {
    name: 'bankCatalogue',
    components: {
      RecursionLevelListLive,
      RecursionLevelList,
    },
    props: {
      commodityData: {
        type: Object,
      },
      htmlStyle: {
        type: String,
        default: '',
      },
      isFixed: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        activeNum: 0,
        isfixed: false,
        list: [],
        statics: [],
      };
    },
    // 如果是直播商品 需有新的样式
    watch: {
      commodityData: {
        deep: true,
        async handler(val) {
          let constructs = val?.productTrees;
          // 利用缓存重新组织树结构
          const productIds = getProductIds(constructs, 'P');
          const statics = await fetchGetStudyStat({ productIds });
          // constructs = assembleData(constructs, statics.body);
          let originList = flatList(constructs);
          this.list = originList;
          this.statics = statics.body;
          if (val.activityType === 4) {
            this.activeNum = 1;
          }
        },
        /* #ifdef MP-TOUTIAO */
        immediate: true,
        /* #endif */
      },
      isFixed: {
        deep: true,
        handler(val) {
          if (val) {
            this.isfixed = true;
          } else {
            this.isfixed = false;
          }
        },
        /* #ifdef MP-TOUTIAO */
        immediate: true,
        /* #endif */
      },
    },
    methods: {
      // 切换富文本和产品树
      handleTap(key) {
        this.activeNum = key;
        this.$emit('showTit', key);
      },
      // 树节点点击
      handleTree(key, index, sign) {
        this.$emit('treeClick', key, index, sign);
      },
      // 直播商品树
      handlerData(arr) {
        if (arr && arr.length > 0) {
          arr.forEach((item) => {
            item.children = flatList(item.constructs);
          });
          return arr;
        } else {
          return [];
        }
      },
      // handlenav(item) {
      //   uni.navigateTo({
      //     url: `/page_commodity/order/pages/entityOrder?commodityList=${JSON.stringify(
      //       this.goodsCart
      //     )}`,
      //   });
      // },
    },
  };
</script>
<style lang="scss" scoped>
  .tab-box {
    height: 110rpx;
    width: 100vw;
    background-color: #ffffff;
    // 分割线的颜色
    border-bottom: 1px solid #f2f3f5;
    border-top: 10px solid #f6f6f6;
    p {
      line-height: 90rpx;
      width: 50%;
    }
    .click-text {
      position: relative;
      color: #323949;
      &:after {
        content: '';
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 0;
        width: 40rpx;
        height: 8rpx;
        border-radius: 4rpx;
        // background-color: #475ffd;
        background-color: #e51600;
      }
    }
  }
  .intro-box {
    width: 100vw;
    background-color: #ffffff;
  }
  .product-box {
    width: 100vw;
    min-height: 400rpx;
    overflow-x: hidden;
    background-color: #ffffff;
    padding: 20rpx 30rpx 160rpx 30rpx;
    .for-box {
      margin-bottom: 24rpx;
      .first-item {
        min-height: 48rpx;
        background: linear-gradient(270deg, #ffffff 0%, #f7fafe 69%, #ebf1fd 100%);
        padding: 40rpx 24rpx;
        p {
          width: 588rpx;
          margin-left: 16rpx;
        }
      }
      .second-item {
        min-height: 48rpx;
        padding: 32rpx 0;
        margin: 0 24rpx;
        border-bottom: 2rpx solid #f5f6fa;
        p {
          width: 588rpx;
          margin-left: 16rpx;
        }
      }
      .three-item {
        min-height: 48rpx;
        padding: 32rpx 24rpx 32rpx 32rpx;
        p {
          width: 588rpx;
          margin-left: 16rpx;
        }
      }
    }
  }
  .gif-box {
    position: relative;
    .gif {
      height: 232rpx;
      margin: 36rpx 98rpx;
    }
    .qrcode {
      width: 166rpx;
      height: 166rpx;
      position: absolute;
      top: 58rpx;
      left: 132rpx;
    }
  }
  .teacher-box {
    width: 100%;
    background: #fff;
    .teacher-content {
      padding: 34rpx 30rpx;

      .teacher-tit {
        display: flex;
        align-items: center;
        height: 80rpx;
        font-size: 32rpx;
        font-weight: 500;
        color: #333333;
        margin-bottom: 16rpx;
        image {
          width: 80rpx;
          height: 80rpx;
          border-radius: 50%;
          border: 0 solid #eeeeee;
          margin-right: 24rpx;
        }
      }
      .teacher-intro {
        line-height: 34rpx;
        font-size: 24rpx;
        color: #9fa1a4;
        font-family: 'PingFang SC';
        text-align: left;
        font-weight: 500;
      }
    }
  }
  .is_fixed {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 99;
  }
</style>
