<template>
  <view
    class="tab-box"
    :style="{ backgroundColor: pageTabList.style ? `${pageTabList.style.bgc}` : '' }"
  >
    <view
      class="tab-one"
      v-for="(item, index) in pageTabList.tabList"
      :key="index"
      @tap="handleSwitch(item.url, index)"
    >
      <img :src="currentTab == index ? item.iconActive : item.icon" class="icon-img" />
      <view :class="currentTab == index ? 'text-common text-active' : 'text-common text-no-active'"
        >{{ item.text }}
      </view>
    </view>
  </view>
</template>
<script>
  import { getNavInfo } from '@/api/modules/common/index';
  import { bottomNavTo } from '@/utils/common.js';
  export default {
    name: 'CustomTab',
    components: {},
    data() {
      return {
        tabList: [],
        channelId: '',
        thirdAppId: '',
      };
    },
    computed: {
      currentTab() {
        let currentTab = this.$store.getters.getCurrentTab;
        /* #ifdef H5 */
        currentTab = window.localStorage.getItem('currentTab');
        /* #endif */
        return currentTab;
      },
      pageTabList() {
        return this.$store.getters.getPageTabList;
      },
      projectId() {
        return this.$store.getters.getProjectId;
      },
    },
    watch: {
      projectId: {
        handler(newVal, oldVal) {
          console.log(newVal, oldVal, '项目id');
          // if (newVal != oldVal ) {
          //   if (this.$store.getters.getPageTabList?.tabList?.length > 0 && !oldVal) {
          //     // console.log(this.$store.getters.getPageTabList, '项目id-list');
          //     console.log('项目id-error');
          //   } else {
          //     this.getInfo();
          //   }
          // } else if(!newVal) {
          //   this.getInfo()
          //   console.log('项目id-error-2');
          // } else
          this.getInfo();
        },
        deep: true,
        immediate: true,
      },
    },
    // created() {
    //   this.getInfo();
    // },
    methods: {
      handleSwitch(url, index) {
        // uni.reLaunch({ url });
        bottomNavTo(url, 2);
        this.$store.commit('setCurrentTab', index);
      },
      async getInfo() {
        const res = await getNavInfo({
          pageCode: 'navigation',
          id: this.projectId,
        });
        if (res.body) {
          const config = JSON.parse(res.body.pageJson);
          let resultList = [];
          // console.log(config.action.config, 'config.action.config');
          config.action.config.map((item) => {
            if (item.isShow) {
              resultList.push({
                text: item.name,
                icon: item.default,
                iconActive: item.selected,
                pageId: item?.pageId,
                isHomePage: item?.isHomePage ? 1 : 0,
                type: item.type,
                url:
                  item.type == 'home'
                    ? '/pages/realHome/index'
                    : item.type == 'myCenter'
                    ? '/pages/mine/index'
                    : item.type == 'myCourse'
                    ? '/pages/newCourse/index'
                    : `/pages/wPage/index?pageId=${item.pageId}`,
              });
            }
          });
          // console.log(resultList, 'resultListresultList');
          let height = '',
            bgc = '';
          config.style.map((item) => {
            if (item.attr == 'height') {
              height = item.val + item.unit;
            }
            if (item.attr == 'background-color') {
              bgc = item.val;
            }
          });
          // 如果没有设置初始页 第一个页面为初始页
          let flag = false;
          resultList.map((item) => {
            if (item.isHomePage == 1) {
              flag = true;
            }
          });
          if (!flag) {
            resultList[0].isHomePage = 1;
          }
          // console.log(resultList, 'resultListresultList');
          // 此处根据首页切换顺序
          this.$store.commit('setPageTabList', {
            tabList: resultList,
            style: { height, bgc },
          });
          uni.setStorageSync('pageTabList', {
            tabList: resultList,
            style: { height, bgc },
          });
          // this.$store.commit('setCurrentTab', startPageTab);
          // 增加获取的数据 与原数据相同时 不重新刷新渲染的判断 true--相同 false--不相同
          // const compareResult = this.compareFun(resultList, this.$store.getters.getPageTabList);
          // if (!compareResult) {
          //   this.$store.commit('setPageTabList', {
          //     tabList: resultList,
          //     style: { height, bgc },
          //   });
          // }
        }
      },
      // 比较新旧数据 防止反复刷新
      compareFun(newData, oldData) {
        if (oldData?.tabList?.length > 0) {
          if (JSON.stringify(newData) == JSON.stringify(oldData.tabList)) {
            return true;
          } else {
            return false;
          }
        }
        return false;
      },
    },
  };
</script>
<style lang="scss" scoped>
  .tab-box {
    height: 120rpx;
    width: 750rpx;
    // padding: 20rpx 90rpx;
    padding: 20rpx 0;
    background-color: #ffffff;
    border-top: 1rpx solid #f2f3f5;
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .text-common {
      font-size: 24rpx;
      color: #c9cdd4;
      font-weight: 500;
      margin-top: 5rpx;
      text-align: center;
    }
    .text-no-active {
      color: '#C9CDD4';
    }
    .text-active {
      color: #e51600;
    }
  }
  .tab-one {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .icon-img {
    height: 40rpx;
    width: 40rpx;
    margin: 0 auto;
  }
</style>
