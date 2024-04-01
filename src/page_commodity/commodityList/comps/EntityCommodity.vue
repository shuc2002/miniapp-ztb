<!--
* @desc 实体订单商品数据
* @author 江玉龙
* @date 2023年02月15日
-->
<template>
  <view>
    <view v-for="(list, listIndex) in commodityData" :key="listIndex" class="entity-box">
      <view
        @tap="
          commonFun.routeTo(
            `/page_commodity/commodity/pages/commodityBank?id=${list.id}&single=${single}&mode=${mode}`
          )
        "
        class="list-box"
      >
        <!-- <view>{{ list }}</view> -->
        <view class="img-box">
          <image :src="list.thumbnail" class="img-commodity" mode="aspectFit" />
        </view>
        <view class="price-box">
          <view class="text-size-main common-text-400 truncate-style">{{ list.name }} </view>
          <view class="flex-item">
            <view class="text-size-sn common-text-700 money-style">
              <span>￥{{ list.price }}起</span>
              <!-- <span v-if="ifIntegral">{{ list.integralPrice }}积分</span> -->
            </view>
            <view
              class="shopbutton"
              @tap="
                commonFun.routeTo(
                  `/page_commodity/commodity/pages/commodityBank?id=${list.id}&single=true&mode=2`
                )
              "
              >购买</view
            >
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
      // commodityData: {
      //   type: Object,
      // },
      commodityData: {
        type: Array,
        default: () => [],
      },
      ifIntegral: {
        type: Boolean,
        default: false,
      },
      single: {
        type: Boolean,
      },
      mode: {
        type: Number,
      },
    },
  };
</script>
<style lang="scss" scoped>
  .entity-box {
    margin: 0rpx 30rpx;
  }
  .list-box {
    margin-bottom: 32rpx;
    background: #fff;
    width: 690rpx;
    height: 264rpx;
    padding: 32rpx 20rpx;
    display: flex;
    border-radius: 24rpx;
  }
  .img-box {
    width: 200rpx;
    height: 112rpx;
  }
  .img-commodity {
    width: 200rpx;
    height: 112rpx;
    margin-right: 24rpx;
    border-radius: 16rpx;
    object-fit: cover;
  }
  .price-box {
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
    padding: 12rpx 12rpx;
    flex: 1;
    .truncate-style {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      font-size: 32rpx;
      -webkit-line-clamp: 2;
      width: 100%;
    }
    .money-style {
      font-size: 24rpx;
      color: #f0522f;

      // margin-left: 12rpx;
    }
    .flex-item {
      width: 100%;
    }
    .shopbutton {
      width: 128rpx;
      height: 64rpx;
      line-height: 64rpx;
      text-align: center;
      background: #f0522f;
      color: #fff;
      border-radius: 68rpx;
    }
  }
</style>
