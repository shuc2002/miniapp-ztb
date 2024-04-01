<!--
* @desc 滑动下拉刷新
* @author 戴聪杰
* @date 2022年04月22日
-->
<template>
  <view>
    <!-- swiper切换 swiper-item表示一页 scroll-view表示滚动视窗 -->
    <swiper :style="{ minHeight: height }" :current="currentTab" @change="swiperTab">
      <swiper-item v-for="(listItem, listIndex) in list" :key="listIndex">
        <scroll-view
          :style="{ height: height }"
          scroll-y="true"
          @scrolltolower="handleToLower"
          scroll-with-animation
          :scroll-into-view="toView"
        >
          <!-- 占位容器 -->
          <view class="content" v-if="listItem.length > 0">
            <view class="item-box flex-center-box" v-for="(item, index) in listItem" :key="index">
              <view class="detail-list-item text-left">
                <view class="text-size-sn truncate common-text">{{ item.brief }}</view>
                <view class="common-tip text-size-xxs">{{ item.date }}</view>
              </view>
              <view class="common-price">{{ currentTab == 0 ? '-' : '+' }}{{ item.integral }}</view>
            </view>
          </view>
          <view class="empty-box" v-if="listItem.length < 1">
            <image src="@/static/img/empty/integral.png" mode="scaleToFill" />
            <view class="empty-box-text text-size-sn common-tip common-text-400">{{
              listIndex == 0 ? '暂无积分支出记录哦~' : '暂无积分收入记录哦'
            }}</view>
            <view
              class="empty-box-btn flex-center text-size-sn common-main common-text-400"
              @tap="listIndex == 0 ? toShopping() : goback()"
              >{{ listIndex == 0 ? '去消费积分' : '去获取积分' }}</view
            >
          </view>
          <!-- 占位容器 -->
          <view
            class="flex-center my-10 text-size-xxs common-tip"
            v-show="!hasMore[currentTab] && listItem.length > 6"
            ><view>这是我的底线了~</view></view
          >
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>
<script>
  import { throttle } from './util';
  export default {
    name: 'SwiperScroll',
    props: {
      currentTab: {
        type: Number,
        default: 1,
      },
      list: {
        type: Array,
        default: () => [],
      },
      hasMore: {
        type: Array,
        default: () => [],
      },
      toView: {
        type: String,
        default: '',
      },
      height: {
        type: String,
        default: '100%',
      },
    },
    data() {
      return {};
    },
    watch: {
      list: {
        handler() {},
        immediate: false,
        deep: true,
      },
    },
    methods: {
      swiperTab(e) {
        this.$emit('swiperTab', e);
      },
      handleToLower: throttle(function() {
        this.$emit('handleToLower');
      }, 300),
      goback() {
        uni.navigateBack();
      },
      toShopping() {
        uni.switchTab({ url: '/home/shopping/index' });
      },
    },
  };
</script>
<style lang="scss">
  .content {
    width: 100%;
  }

  .empty-box {
    text-align: center;
    image {
      width: 300rpx;
      height: 300rpx;
    }
    .empty-box-text {
      margin-bottom: 16rpx;
    }
    .empty-box-btn {
      margin: auto;
      width: 188rpx;
      height: 64rpx;
      border-radius: 68rpx;
      background: rgba(71, 95, 253, 1);
    }
  }
  .item-box {
    padding: 32rpx 32rpx 16rpx 32rpx;
    .detail-list-item {
      width: 550rpx;
    }
  }
  .my-10 {
    margin: 20rpx 0;
  }
</style>
