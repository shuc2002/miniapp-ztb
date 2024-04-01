<!--
* @desc 全部资讯
* @author lwx
* @date 2023年10月23日
-->
<template>
  <view class="page-bg-allInfo">
    <view class="nav-tab">
      <NavTab ref="navTab" :tabTitle="getNavName(tabList)" @changeTab="changeTab" />
    </view>
    <view class="info-content" v-if="infoList.length > 0">
      <view
        v-for="(item, index) in infoList"
        :key="index"
        class="content-one"
        @tap="goDetail(item.id)"
      >
        <img :src="item.coverPic" class="content-img" />
        <view class="content-right">
          <view class="red-dot" v-if="!item.isRead"></view>
          <view class="content-title truncate-two">{{ item.title }}</view>
          <view class="content-bottom">
            <view class="bottom-text">{{ item.publishTime }}</view>
            <view class="read-icon bottom-text  iconfont icon-a-studentID"></view>
            <view class="read-time bottom-text">{{ item.readingAmount }}</view>
          </view>
        </view>
      </view>
    </view>
    <view v-else>
      <EmptyInfo text="暂无资讯" />
    </view>
  </view>
</template>
<script>
  import EmptyInfo from './comps/EmptyInfo.vue';
  import NavTab from './comps/NavTab.vue';
  // import NavTab from '@/components/PublicSmallCom/selfCom/NavTab.vue';
  import { getInfoList } from '@/api/modules/home/index';
  export default {
    name: 'infomation',
    components: {
      NavTab,
      EmptyInfo,
    },
    data() {
      return {
        current: 0,
        tabList: [],
        infoList: [],
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

    onLoad(options) {
      // console.log(options, 'options');
      this.current = options.current;
      this.tabList = JSON.parse(options.tabList);
      this.getInfoList(
        this.tabList[this.current].id,
        this.tabList[this.current].sizes > 0 ? this.tabList[this.current].sizes : 0
      );
      if (options?.title) {
        uni.setNavigationBarTitle({
          title: options.title,
        });
      }
    },
    onShow() {
      this.getInfoList(
        this.tabList[this.current].id,
        this.tabList[this.current].sizes > 0 ? this.tabList[this.current].sizes : 0
      );
    },
    methods: {
      getNavName(arr) {
        let result = [];
        arr.map((item) => {
          result.push(item.name);
        });
        return result;
      },
      changeTab(index) {
        this.current = index;
        this.getInfoList(
          this.tabList[this.current].id,
          this.tabList[this.current].sizes > 0 ? this.tabList[this.current].sizes : 0
        );
      },
      async getInfoList(id, num) {
        const res = await getInfoList({
          projectId: this.projectId,
          classifyId: id,
          index: 0,
          row: num,
          displayDimensions: this.displayDimensions,
        });
        if (res?.body) {
          this.infoList = res.body;
        }
      },
      // 转发页面
      async onShareAppMessage() {
        return {
          path: '/business/information/index',
          // imageUrl: 'https://app.static.wangxiao.cn/ykmf/images/zuduishuati.png',
        };
      },
      goDetail(id) {
        uni.navigateTo({ url: `/page_commodity/information/index?id=${id}` });
      },
    },
  };
</script>
<style lang="scss" scoped>
  .page-bg-allInfo {
    padding-left: 30rpx;
    // width: 100vw;
  }
  .nav-tab {
    height: 84rpx;
    // width: 100%;
    margin-top: 24rpx;
  }
  .content-one {
    display: flex;
    justify-content: flex-start;
    border-bottom: 1rpx solid #f2f3f5;
  }
  .content-img {
    width: 198rpx;
    height: 148rpx;
    margin-top: 32rpx;
  }
  .content-right {
    margin-left: 32rpx;
    margin-top: 36rpx;
    padding-bottom: 32rpx;
    position: relative;
  }
  .content-title {
    height: 88rpx;
    width: 460rpx;
    color: #323949;
    font-size: 32rpx;
    font-weight: 700;
  }
  .content-bottom {
    display: flex;
    margin-top: 24rpx;
  }
  .red-dot {
    position: absolute;
    width: 12rpx;
    height: 12rpx;
    top: -12rpx;
    left: -10rpx;
    border-radius: 50% 50%;
    z-index: 999;
    background: var(--, #f0522f);
  }
  .bottom-text {
    color: #9fa1a4;
    font-size: 24rpx;
  }
  .read-icon {
    margin-left: 34rpx;
    margin-right: 4rpx;
    margin-top: 6rpx;
    width: 24rpx;
    height: 24rpx;
    font-size: 24rpx;
    // background-color: skyBlue;
  }
</style>
