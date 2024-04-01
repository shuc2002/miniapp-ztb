<!--
* @desc 订单商品数据
* @author 江玉龙
* @date 2022年04月22日
-->
<template>
  <view class="flex-box">
    <view>
      <image
        :src="
          !isCollage
            ? commodityData.url
              ? commodityData.url
              : ''
            : commodityData.image
            ? commodityData.image
            : ''
        "
        class="img-style"
        mode="aspectFit"
      />
    </view>
    <view class="price-box">
      <view class="text-size-main common-text-400 truncate-style">
        {{
          !isCollage
            ? commodityData.name
              ? commodityData.name
              : ''
            : commodityData.commodityName
            ? commodityData.commodityName
            : ''
        }}
      </view>
      <view>
        <view class="text-size-sn price-item" v-if="!ifIntegral && !isCollage">
          <span class="common-text-700 money-style"
            >￥{{ commodityData.price ? commodityData.price : '' }}</span
          >
          <view
            class="text-size-sn common-tip across-line amount-item"
            v-if="showAmount && commodityData.linePrice"
            >￥{{ commodityData.linePrice }}</view
          >
          <view class="order-count">x {{ commodityData.number }}</view>
        </view>
        <view class="text-size-sn" v-if="ifIntegral && !isCollage">
          <span class="common-text-700 money-style">
            <image src="@/home/static/img/shop/integral.png" />
            <span>{{ commodityData.integralPrice ? commodityData.integralPrice : '' }}</span>
          </span>
        </view>
        <view class="flex-center" v-if="isCollage">
          <view class="common-text-700 text-size-xl common-price"
            >￥{{ commodityData.amount ? commodityData.amount : '' }}</view
          >
          <!-- <view class="common-text-400 common-tip text-size-xxs text-collage">已拼10万件</view> -->
        </view>
      </view>
    </view>
  </view>
</template>
<script>
  export default {
    name: 'commodityData',
    components: {},
    props: {
      commodityData: {
        type: Object,
      },
      showAmount: {
        type: Boolean,
        default: true,
      },
      isCollage: {
        type: Boolean,
        default: false,
      },
      ifIntegral: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>
<style lang="scss" scoped>
  .flex-box {
    display: flex;
    height: 112rpx;
    justify-content: space-between;
  }
  .price-box {
    display: flex;
    // flex-wrap: wrap;
    align-content: space-around;
    // padding: 12rpx 12rpx;
    flex: 1;
    text-align: left;
  }
  .price-item {
    text-align: right;
  }
  .truncate-style {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    width: 100%;
  }
  .amount-item {
    font-size: 24rpx;
    color: #9fa1a4;
    // margin-bottom: 20rpx;
  }
  .order-count {
    margin-left: 12rpx;
    font-size: 24rpx;
    color: #9fa1a4;
  }
  .img-style {
    width: 200rpx;
    height: 112rpx;
    margin-right: 16rpx;
    border-radius: 12rpx;
    object-fit: cover;
  }
  .money-style {
    margin-left: 12rpx;
    image {
      width: 32rpx;
      height: 32rpx;
      margin-right: 8rpx;
      margin-bottom: -4rpx;
    }
  }
  .text-collage {
    margin-left: 16rpx;
  }
</style>
