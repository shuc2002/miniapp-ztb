<!--
* @desc 我的记录组件
* @author 江玉龙
* @date 2022年06月13日
-->
<template>
  <view class="container999">
    <!--导航栏标题  start-->
    <view class="nav">
      <navTab ref="navTab" :tabTitle="tabTitle" @changeTab="changeTab" />
    </view>
    <!-- 导航栏标题  end-->
    <SwiperRecord :currentTab="currentTab" :list="list" @swiperTab="swiperTab" v-if="ifLoad" />
  </view>
</template>

<script>
  import NavTab from '@/components/NavTab/NavTab.vue';
  import SwiperRecord from './comps/SwiperRecord.vue';
  import { getWrongList, getFavoriteList } from '@/api/modules/user/aggregate';
  export default {
    name: 'myRecords',
    components: { NavTab, SwiperRecord },
    data() {
      return {
        currentTab: 0, //sweiper所在页 题目类型 0-错题 1-收藏
        tabTitle: ['错题', '收藏'], //导航栏格式
        list: [[], []], //数据格式
        ifShow: false,
        ifLoad: false,
      };
    },
    onLoad(option) {
      if (option.activeNum == '1') {
        this.$nextTick(() => {
          this.currentTab == 1;
          this.$refs.navTab.longClick(1);
        });
      } else {
        this.changeTab(0);
      }
    },
    onShow() {
      if (this.ifShow) {
        this.reFresh();
      }
    },
    computed: {
      projectId() {
        return this.$store.getters.getProjectId;
      },
    },
    methods: {
      async reFresh() {
        this.ifLoad = false;
        this.getOrderList();
      },
      // 点击tab栏
      changeTab(index) {
        this.currentTab = index;
        if (this.list[this.currentTab].length == 0) {
          this.ifLoad = false;
          this.getOrderList();
        }
        this.ifShow = true;
      },
      // swiper 滑动
      swiperTab(e) {
        let index = e.detail.current; //获取索引
        this.$refs.navTab.longClick(index);
      },
      // 列表获取
      async getOrderList() {
        let res = '';
        if (this.currentTab == 0) {
          res = await getWrongList({ id: this.projectId });
        } else {
          res = await getFavoriteList({ id: this.projectId });
        }
        this.list[this.currentTab] = res.body;
        this.ifLoad = true;
        this.$forceUpdate();
      },
      // 转发页面
      async onShareAppMessage() {
        return {
          path: '/business/learnGroup/index',
          // imageUrl: 'https://app.static.wangxiao.cn/ykmf/images/zuduishuati.png',
        };
      },
    },
  };
</script>

<style lang="scss">
  .container999 {
    width: 100vw;
    min-height: 100vh;
    overflow: hidden;
    position: relative;
    background-color: #f5f6fa;
  }
  .nav {
    position: fixed;
    left: 0;
    top: var(--window-top);
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    background-color: #f5f6fa;
    z-index: 996;
  }
  .card-box {
    width: calc(100% - 112rpx);
    padding: 32rpx;
    height: 196rpx;
    margin: 0 auto 24rpx auto;
    background: #ffffff;
    border-radius: 24rpx;
    position: relative;
    .card-data-box {
      display: flex;
      image {
        width: 112rpx;
        height: 112rpx;
        border-radius: 8rpx;
        margin-right: 24rpx;
      }
    }
  }
</style>
