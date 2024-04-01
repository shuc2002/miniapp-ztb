<!--
* @desc 我的粉丝swiper组件
* @author 江玉龙
* @date 2022年08月10日
-->
<template>
  <view>
    <!-- swiper切换 swiper-item表示一页 scroll-view表示滚动视窗 -->
    <swiper style="min-height: 90vh" :current="currentTab" @change="swiperTab">
      <swiper-item v-for="(listItem, listIndex) in list" :key="listIndex">
        <scroll-view
          style="height: 100%"
          scroll-y="true"
          scroll-with-animation
          :scroll-into-view="toView"
        >
          <view class="content" v-if="listItem.length > 0">
            <!-- 订单列表 -->
            <view v-for="(item, key) in listItem" :key="key">
              <view class="list-box">
                <view class="flex-center">
                  <image src="@/static/img/empty/order.png" />
                  <view>
                    <view class="flex-item-center">
                      <p class="text-size-sn common-text">刘华</p>
                      <view class="relation">同事</view>
                    </view>
                    <p class="address">朝阳凌和望京医院</p>
                  </view>
                </view>
                <view class="follow-btn flex-center" :class="check ? 'done' : 'no-done'"
                  >互相关注</view
                >
              </view>
            </view>
          </view>
          <view class="no-card flex-column-center" v-if="listItem.length === 0">
            <image src="@/static/img/empty/integral.png" mode="scaleToFill" />
            <p class="text-size-sn common-text-400 common-tip">暂无好友关注</p>
            <button class="address-btn flex-center" open-type="share">邀请好友关注</button>
          </view>
          <!-- 占位容器 -->
          <view style="width: 100%; height: 50upx; opacity: 0" />
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>
<script>
  export default {
    name: 'swiperRecord',
    props: {
      currentTab: {
        type: Number,
        default: 0,
      },
      list: {
        type: Array,
        default: () => [],
      },
      toView: {
        type: String,
        default: '',
      },
    },
    data() {
      return {};
    },
    methods: {
      // 轮播图切换
      swiperTab(e) {
        this.$emit('swiperTab', e);
      },
    },
  };
</script>
<style lang="scss" scoped>
  .content {
    width: 100%;
  }
  .no-card {
    position: absolute;
    top: 10%;
    left: 0;
    right: 0;
    image {
      width: 324rpx;
      height: 316rpx;
    }
    .address-btn {
      border-radius: 24rpx;
      background-color: #eef2ff;
      width: 528rpx;
      height: 96rpx;
      font-size: 32rpx;
      font-weight: 700;
      color: #475ffd;
      margin-top: 48rpx;
    }
  }
  .list-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 32rpx 32rpx 32rpx;
    image {
      width: 96rpx;
      height: 96rpx;
      border: 2px solid #ffffff;
      margin-right: 32rpx;
    }
    .relation {
      padding: 4rpx 12rpx;
      margin-left: 8rpx;
      background-color: #ffee83;
      border-radius: 36rpx;
      font-size: 20rpx;
      color: #8c513e;
    }
    .address {
      font-size: 24rpx;
      font-weight: 400;
      color: #989ead;
      margin-top: 8rpx;
    }
    .follow-btn {
      width: 128rpx;
      height: 56rpx;
      border-radius: 56rpx;
      font-size: 24rpx;
    }
    .done {
      color: #d2daf5;
      border: 2rpx solid #d2daf5;
    }
    .no-done {
      color: #475ffd;
      border: 2rpx solid #475ffd;
    }
  }
</style>
