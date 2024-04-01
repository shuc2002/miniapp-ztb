<!--
* @desc 我的粉丝页面
* @author 江玉龙
* @date 2022年08月10日
-->
<template>
  <view class="page-bg">
    <view class="title-head">
      <Probably margin="0 32rpx 16rpx 32rpx" />
      <NavTab ref="navTab" :tabTitle="tabTitle" @changeTab="changeTab" />
    </view>
    <!-- 占位容器 -->
    <view :id="'top' + listIndex" style="width: 100%; height: 250rpx" />
    <SwiperPeople
      :showBottom="showBottom"
      :currentTab="currentTab"
      :list="list"
      @swiperTab="swiperTab"
    />
  </view>
</template>
<script>
  import NavTab from '@/components/NavTab/NavTab.vue';
  import SwiperPeople from './comps/SwiperPeople.vue';
  import Probably from '@/components/Probably/Probably.vue';
  export default {
    name: 'message',
    components: { NavTab, SwiperPeople, Probably },
    onLoad() {
      this.getPhoto();
    },
    data() {
      return {
        currentTab: 0,
        tabTitle: ['全部', '同事'], //导航栏格式
        list: [[], []], //数据格式
        ifShow: false,
        photoList: [],
      };
    },
    methods: {
      // 点击tab栏
      changeTab(index) {
        this.currentTab = index;
        this.ifShow = true;
      },
      // swiper 滑动
      swiperTab(e) {
        var index = e.detail.current; //获取索引
        this.$refs.navTab.longClick(index);
      },
      // 分享按钮
      async onShareAppMessage() {
        return {
          path: '/pages/home/index',
          imageUrl: 'https://app.static.wangxiao.cn/ykmf/images/zuduishuati.png',
          /* #ifdef MP-TOUTIAO */
          templateId: '5ut6pnse3qmp687qh4',
          /* #endif */
        };
      },
    },
  };
</script>
<style lang="scss" scoped>
  .page-bg {
    padding-top: 16rpx;
  }
  .title-head {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 999;
  }
</style>
