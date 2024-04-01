<!--
* @desc 首页商品
* @author 江玉龙
* @date 2022年4月19日
-->
<template>
  <view class="commodity-box" v-if="list.length > 0">
    <view class="trade-item">
      <image src="@/static/img/home/com-hot.png" class="img-icon" />
      <span class="text-size-xl common-text-700 common-text">商品</span>
    </view>
    <view v-for="(item, key) in list" :key="key">
      <view
        class="commodity-item"
        @tap="
          item.isBought
            ? commonFun.routeTo(`/page_commodity/courseList/index?id=${item.id}&isOrder=true`)
            : toProduct(item.id)
        "
      >
        <view>
          <view class="image-pay" v-if="item.isBought">已购买</view>
          <image :src="item.thumbnail" class="image-style" mode="aspectFit" />
        </view>

        <view class="price-box">
          <view style="width: 100%">
            <view class="text-size-main common-text-400 truncate-style">{{ item.name }}</view>
          </view>
          <view v-if="system">IOS暂不支持购买</view>
          <view class="price-inte" v-else>
            <view>
              <span class="text-size-sn common-price common-text-700"
                >到手价<span class="text-size-xl">￥{{ item.price }}</span></span
              ><span
                class="text-size-xxs common-tip across-line common-text-400"
                v-if="item.linePrice"
                >￥{{ item.linePrice }}</span
              >
            </view>
            <!-- #ifdef MP-WEIXIN -->
            <button class="btn-collage flex-center" v-if="item.activityType == 2">拼团</button>
            <!-- #endif -->
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
  export default {
    name: 'HomeCommodity',
    components: {},
    props: {
      list: {
        type: Array,
        default: () => [],
      },
    },
    computed: {
      system() {
        return this.$store.getters.getSystem;
      },
    },
    methods: {
      //去商品页面
      toProduct(id) {
        uni.navigateTo({
          url: `/page_commodity/commodity/pages/commodityBank?id=${id}`,
        });
      },
    },
  };
</script>
<style lang="scss" scoped>
  .commodity-box {
    background-color: white;
    padding: 32rpx;
    border-radius: 24rpx;

    .img-icon {
      margin-right: 16rpx;
    }
    .commodity-item {
      display: flex;
      height: 212rpx;
      padding: 36rpx 0;
      margin-bottom: 16rpx;
      &:first-child {
        margin-top: 8rpx;
      }
    }
  }
  .truncate-style {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  .image-style {
    width: 160rpx;
    height: 212rpx;
    margin-right: 32rpx;
    border-radius: 12rpx;
    object-fit: cover;
  }
  .image-pay {
    position: absolute;
    background-color: #fff1be;
    color: #ff9f10;
    font-size: 24rpx;
    padding: 6rpx;
    border-bottom-right-radius: 20rpx;
    z-index: 10;
  }
  .price-box {
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
    width: 100%;
  }
  .trade-item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    image {
      width: 48rpx;
      height: 48rpx;
    }
  }
  .price-inte {
    display: flex;
    justify-content: space-between;
    width: 100%;
    .integral-price {
      display: flex;
      align-items: flex-end;
      .integral {
        display: flex;
        margin-top: 16rpx;
        align-items: center;
        image {
          width: 32rpx;
          height: 32rpx;
          margin-right: 8rpx;
        }
      }
    }

    .btn-collage {
      width: 128rpx;
      height: 64rpx;
      border-radius: 68rpx;
      background-color: #f0522f;
      color: #ffffff;
      font-size: 28rpx;
      font-weight: 400;
      margin-right: 0;
    }
  }
</style>
