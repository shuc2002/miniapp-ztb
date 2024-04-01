<!--
* @desc 资料商品
* @author 江玉龙
* @date 2022年07月07日
-->
<template>
  <view class="commodity-box">
    <view class="commodity-item">
      <image :src="data.thumbnail" class="image-style" mode="aspectFit" lazy-load="true" />
      <view class="price-space">
        <view style="width: 100%">
          <view class="text-size-main common-text-400 truncate-style">{{ data.name }}</view>
        </view>
        <view>
          <view class="price-box">
            <!-- 价格 -->
            <view class="price-item">
              <view>
                <span class="text-size-sn common-text-400">限时优惠</span>
                <span class="common-text text-size-sn">￥</span>
                <span class="common-text text-size-sn common-text-700">{{ data.price }}</span>
              </view>
              <view class="flex">
                <image src="@/home/static/img/shop/integral.png" />
                <view class="text-size-xl common-text common-text-700">{{ data.integral }}</view>
              </view>
            </view>
            <view class="line-price-box" v-if="data.linePrice">
              <p class="text-size-xxs common-text-400 common-price">(</p>
              <NewCountdown
                :showBox="false"
                textColor="#F0522F"
                hourUnit="时"
                minuteUnit="分"
                :remain="timeData"
              />
              <p class="text-size-xxs common-text-400 common-price"
                >秒后恢复原价￥{{ data.linePrice }})</p
              >
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="divider" />
    <view class="click-tip">
      <image
        :src="data.images[0]"
        class="img-style"
        v-if="data.images.length > 0"
        mode="aspectFill"
        lazy-load="true"
      />
      <view class="expend-box" v-if="data.images.length > 0">
        <view class="check-btn flex-center" @tap="handleCheck()">
          <view class="text-size-main common-text-600">查看全文</view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
  import NewCountdown from '@/components/Countdown/NewCountdown.vue';
  export default {
    name: 'dataDetail',
    components: {
      NewCountdown,
    },
    props: {
      data: {
        type: Object,
      },
      timeData: {
        type: Number,
        default: 0,
      },
    },
    methods: {
      // 点击查看更多
      handleCheck() {
        this.$emit('handleCheck');
      },
    },
  };
</script>
<style lang="scss" scoped>
  .commodity-box {
    background-color: white;
    padding: 32rpx 24rpx;
    border-radius: 24rpx;
    margin: 24rpx;
    .commodity-item {
      display: flex;
      padding: 36rpx 0;
      margin-bottom: 16rpx;
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
  .price-space {
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
  }
  .price-box {
    height: 76rpx;
    margin-top: 24rpx;
    .price-item {
      display: flex;
      justify-content: space-between;
      width: 420rpx;
    }
  }
  .divider {
    width: 654rpx;
    height: 2rpx;
    background-color: #f5f6fa;
    margin-bottom: 32rpx;
  }
  .click-tip {
    position: relative;
    .img-style {
      width: 100%;
    }
    .expend-box {
      width: 702rpx;
      height: 208rpx;
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.9) 56%,
        #ffffff 100%
      );
      padding-bottom: 34rpx;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      position: absolute;
      left: -24rpx;
      bottom: 0;
      border-radius: 24rpx;
      image {
        width: 48rpx;
        height: 48rpx;
        margin-right: 16rpx;
      }
    }
  }
  .price-box {
    height: 76rpx;
  }
  .price-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    image {
      width: 40rpx;
      height: 40rpx;
      margin-top: 6rpx;
      margin-right: 8rpx;
    }
  }
  .line-price-box {
    display: flex;
    align-items: center;
  }
  .check-btn {
    width: 606rpx;
    height: 88rpx;
    border-radius: 24rpx;
    background: #475ffdff;
    color: #ffffff;
  }
</style>
