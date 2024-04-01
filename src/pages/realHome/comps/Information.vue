<!--
* @desc 首页资讯
* @author 江玉龙
* @date 2022年08月04日
-->
<template>
  <view class="info-box" v-if="list.length > 0">
    <view class="trade-item">
      <image src="@/static/img/home/info-list.png" class="img-icon" />
      <span class="text-size-xl common-text-700 common-text">资讯</span>
    </view>
    <view v-for="(item, key) in list" :key="key">
      <view
        class="info-item"
        @tap="commonFun.routeTo(`/page_commodity/information/index?id=${item.id}`)"
      >
        <image :src="item.coverPic" class="image-style" mode="aspectFit" />
        <view class="name-box">
          <view class="text-size-main common-text truncate-style">{{ item.title }}</view>
          <view class="flex-center text-size-xxs common-text-400 common-tip">
            <p>{{ item.publishTime }}</p>
            <view class="t-icon t-icon-book-open-copy icon-style" />
            <p>{{ item.readingAmount ? item.readingAmount : 0 }}</p>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
  export default {
    name: 'information',
    components: {},
    props: {
      list: {
        type: Array,
        default: () => [],
      },
    },
    methods: {},
  };
</script>
<style lang="scss" scoped>
  .info-box {
    background-color: white;
    padding: 32rpx;
    border-radius: 24rpx;
    margin-top: 24rpx;

    .img-icon {
      margin-right: 16rpx;
    }
    .info-item {
      display: flex;
      padding: 32rpx 0;
      margin-bottom: 16rpx;
      &:first-child {
        margin-top: 8rpx;
      }
    }
  }
  .name-box {
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
    width: 100%;
    .icon-style {
      width: 24rpx;
      height: 24rpx;
      margin-left: 32rpx;
      margin-right: 8rpx;
    }
    .truncate-style {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      width: 100%;
    }
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
  .image-style {
    width: 198rpx;
    height: 148rpx;
    margin-right: 24rpx;
    border-radius: 8rpx;
  }
</style>
