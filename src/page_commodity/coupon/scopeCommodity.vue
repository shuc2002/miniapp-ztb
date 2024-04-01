<!--
* @desc 优惠券适用商品
* @author 江玉龙
* @date 2022年08月18日
-->
<template>
  <view class="commodity-bg" v-if="ifLoad">
    <view class="commodity-box" v-if="list.length > 0">
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
            <view class="price-inte">
              <view class="integral-price">
                <span class="text-size-sn common-price common-text-700"
                  >到手价<span class="text-size-xl">￥{{ item.price }}</span></span
                >
                <span
                  class="text-size-xxs common-tip across-line common-text-400"
                  v-if="item.linePrice"
                  >￥{{ item.linePrice }}</span
                >
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="noCard" v-if="list.length == 0">
      <image src="@/static/img/empty/order.png" mode="scaleToFill" />
      <p class="text-size-sn common-text-400 common-tip">当前无适用商品，请联系客服</p>
    </view>
  </view>
</template>
<script>
  import { getRelevantCommodity } from '@/api/modules/coupon/index';
  export default {
    name: 'scopeCommodity',
    onLoad(options) {
      this.getRelevantCommodity(options.id);
    },
    data() {
      return {
        list: [],
        usableRange: -1,
        ifLoad: false,
      };
    },
    computed: {
      projectId() {
        return this.$store.getters.getProjectId;
      },
      channelId() {
        return this.$store.getters.getChannelId;
      },
    },
    methods: {
      async getRelevantCommodity(id) {
        const res = await getRelevantCommodity({
          id,
          channelId: this.channelId,
        });
        this.usableRange = res.body.usableRange;
        this.list = res.body.commodities;
        this.ifLoad = true;
      },
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
  .commodity-bg {
    min-height: 100vh;
    background-color: #f5f6fa;
    padding: 24rpx;
  }
  .commodity-box {
    background-color: white;
    padding: 32rpx;
    border-radius: 24rpx;
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
  .price-inte {
    display: flex;
    justify-content: space-between;
    width: 100%;
    .integral-price {
      display: flex;
      align-items: flex-end;
    }
  }
  .noCard {
    position: absolute;
    top: 31%;
    left: 50%;
    transform: translate(-50%);
    text-align: center;
    image {
      width: 344rpx;
      height: 344rpx;
    }
  }
</style>
