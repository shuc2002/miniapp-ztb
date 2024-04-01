<!--
* @desc 实体订单商品数据
* @author 江玉龙
* @date 2023年02月15日
-->
<template>
  <view>
    <view v-for="(item, index) in commodityData" :key="index" @tap="goCommodityDetail(item)">
      <view class="flex flex-box">
        <view class="img-box">
          <image :src="item.url" class="img-commodity" mode="aspectFit" />
        </view>
        <view class="price-box">
          <view class="text-size-main common-text-400 truncate-style">{{ item.name }} </view>
          <p class="price" v-if="!ifIntegral">￥{{ item.price }}</p>
          <view class="flex-item">
            <view class="text-size-sn common-text-700 money-style">
              <p v-if="ifIntegral">{{ item.integralPrice }}积分</p>
              <p class="sku-name">{{ item.skuName ? item.skuName : '' }}</p>
            </view>
            <view class="common-text-600">x {{ item.number }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
  export default {
    name: 'entityCommodityData',
    components: {},
    props: {
      commodityData: {
        type: Array,
      },
      ifIntegral: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      // 去往商品详情页面
      goCommodityDetail(val) {
        uni.navigateTo({
          url: `/page_commodity/commodity/pages/commodityBank?id=${val.id}`,
        });
      },
    },
  };
</script>
<style lang="scss" scoped>
  .flex-box {
    margin-top: 32rpx;
  }
  .img-box {
    width: 200rpx;
    height: 112rpx;
    margin-right: 22rpx;
  }
  .img-commodity {
    width: 200rpx;
    height: 112rpx;
    border-radius: 12rpx;
    object-fit: cover;
  }
  .price-box {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 12rpx 12rpx;
    flex: 1;

    .text-size-main {
      flex: 1;
    }

    .price {
      flex: 0 0 auto;
    }
    .truncate-style {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      width: 100%;
      font-size: 24rpx;
    }
    .money-style {
      // margin-left: 12rpx;
      display: flex;
      .sku-name {
        margin-left: 20rpx;
        max-width: 350rpx;
        font-size: 24rpx;
        font-weight: 400;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #9fa1a4;
        line-height: 38rpx;
      }
    }
    .flex-item {
      width: 100%;
      margin-top: 10px;
    }
  }
</style>
