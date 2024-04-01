<!-- 资讯组件 -->
<template>
  <view class="informationBox" :style="[style]">
    <view class="info-top">
      <view class="info-title">{{ showTitle ? title : '' }}</view>
      <view class="more-btn" v-show="showMore" @tap="lookMore">查看更多 ></view>
    </view>
    <view class="nav-tab">
      <NavTab ref="navTab" :tabTitle="getNavName(tabList)" @changeTab="changeTab" />
    </view>
    <view class="info-content" v-if="currentData.length > 0">
      <view
        v-for="(item, index) in currentData"
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
            <view class="read-icon bottom-text iconfont icon-a-studentID "></view>
            <view class="read-time bottom-text">{{ item.readingAmount }}</view>
          </view>
        </view>
      </view>
    </view>
    <view v-else>
      <EmptyList text="暂无资讯" />
    </view>
  </view>
</template>
<script>
  import NavTab from './selfCom/NavTab.vue';
  import EmptyList from './selfCom/EmptyList.vue';
  import { getInfoList } from '@/api/modules/home/index';
  export default {
    name: 'Information',
    components: {
      NavTab,
      EmptyList,
    },
    data() {
      return {
        current: 0,
        title: '',
        currentData: [], // 当前data
        showNum: 10, // 最大条数
        tabList: [], // 分类数组
        showTitle: true,
        showMore: true,
      };
    },
    props: {
      content: {
        type: Array,
        default: () => [],
      },
      style: {
        type: Object,
        default: () => {},
      },
    },
    computed: {
      projectId() {
        return this.$store.getters.getProjectId;
      },
      displayDimensions() {
        return this.$store.getters.getDisplayDimensions;
      },
    },
    watch: {
      content: {
        handler(val) {
          if (val?.length > 0) {
            val.map((item) => {
              if (item.attr == 'showTitle') {
                this.showTitle = item.val;
              }
              if (item.attr == 'showMore') {
                this.showMore = item.val;
              }
              if (item.attr == 'showNum') {
                this.showNum = item.val;
              }
              if (item.attr == 'infoClass') {
                this.tabList = item.val;
              }
              if (item.attr == 'title') {
                this.title = item.val;
              }
              if (item.attr == 'showByProject') {
                this.$store.commit('setDisplayDimensions', item.val ? 1 : 0);
              }
            });
            // 进行第一次获取数据
            this.getInfoList(
              this.tabList[0].id,
              this.getMinNum(this.showNum, this.tabList[0]?.sizes > 0 ? this.tabList[0].sizes : 0)
            );
          }
        },
        immediate: true,
        deep: true,
      },
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
          this.getMinNum(this.showNum, this.tabList[0]?.sizes > 0 ? this.tabList[0].sizes : 0),
          this.displayDimensions
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
          this.currentData = res.body;
        }
      },
      lookMore() {
        uni.navigateTo({
          url: `/business/information/index?current=${this.current}&projectId=${
            this.projectId
          }&title=${this.title}&tabList=${JSON.stringify(this.tabList)}`,
        });
      },
      // 取最小值
      getMinNum(num1, num2) {
        if (num1 <= num2) {
          return num1;
        } else {
          return num2;
        }
      },
      goDetail(id) {
        uni.navigateTo({
          url: `/page_commodity/information/index?id=${id}`,
        });
      },
    },
  };
</script>
<style lang="scss" scoped>
  .informationBox {
    background: var(--white, #fff);
  }
  .info-top {
    display: flex;
    justify-content: space-between;
  }
  .info-title {
    color: #333333;
    font-size: 36rpx;
    font-weight: 500;
  }
  .more-btn {
    color: #9fa1a4;
    font-size: 28rpx;
    font-weight: 400;
    margin-top: 10rpx;
  }
  .nav-tab {
    height: 84rpx;
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
