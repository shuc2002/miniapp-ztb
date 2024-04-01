<!--
* @desc 首页资讯
* @author 江玉龙
* @date 2022年08月04日
-->
<template>
  <view class="info-box">
    <view v-for="(item, key) in list" :key="key">
      <view
        class="info-item"
        v-if="list.length > 0"
        @tap="commonFun.routeTo(`/page_commodity/information/index?id=${item.id}`)"
      >
        <image :src="item.coverPic" class="image-style" mode="aspectFit" />
        <view class="name-box">
          <view class="text-size-main common-text-700 common-text truncate-style">{{
            item.title
          }}</view>
          <view class="flex-center text-size-xxs common-text-400 common-tip">
            <p>{{ item.publishTime }}</p>
            <view class="t-icon t-icon-book-open-copy icon-style" />
            <p>{{ item.readingAmount ? item.readingAmount : 0 }}</p>
          </view>
        </view>
      </view>
    </view>
    <view class="no-card flex-column-center" v-if="list.length === 0">
      <image src="@/static/img/empty/order.png" mode="scaleToFill" />
      <p class="text-size-sn common-text-400 common-tip">暂无资讯</p>
    </view>
  </view>
</template>
<script>
  import { getInfoList } from '@/api/modules/commodity/index';
  export default {
    name: 'infoList',
    data() {
      return {
        list: [],
      };
    },
    computed: {
      projectId() {
        return this.$store.getters.getProjectId;
      },
      displayDimensions() {
        return this.$store.getters.getDisplayDimensions;
      },
    },
    onLoad() {
      this.getInfoList();
    },
    methods: {
      // 根据项目获取对应资讯列表
      async getInfoList() {
        const res = await getInfoList({
          projectId: this.projectId,
          displayDimensions: this.displayDimensions,
        });
        this.list = res.body;
      },
    },
  };
</script>
<style lang="scss" scoped>
  .info-box {
    background-color: #f5f6fa;
    padding: 32rpx 24rpx;
    border-radius: 24rpx;
    height: 100vh;
    .info-item {
      display: flex;
      padding: 36rpx 32rpx;
      margin-bottom: 24rpx;
      background-color: #ffffff;
      border-radius: 24rpx;
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
  .image-style {
    width: 198rpx;
    height: 148rpx;
    margin-right: 24rpx;
    border-radius: 8rpx;
  }
  .no-card {
    position: absolute;
    top: 24%;
    left: 0;
    right: 0;
    background-color: #f5f6fa;
    image {
      width: 344rpx;
      height: 344rpx;
    }
  }
</style>
