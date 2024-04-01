<template>
  <view>
    <view v-if="currentPageUrl == '/pages/realHome/index'">
      <RealHome />
    </view>
    <view v-if="currentPageUrl == '/pages/newCourse/index'">
      <MyCourse />
    </view>
    <view v-if="currentPageUrl == '/pages/mine/index'">
      <Mine />
    </view>
    <view v-if="currentPageUrl == `/pages/wPage/index?pageId=${pageId}`">
      <WPage :pageId="pageId" />
    </view>
    <CustomTab />
  </view>
</template>

<script>
  import RealHome from '../realHome/index.vue';
  import MyCourse from '../newCourse/index.vue';
  import Mine from '../mine/index.vue';
  import WPage from '../wPage/index.vue';
  import CustomTab from '../../customTab';
  // import { getPayRedicrtUrl } from '@/utils/payUrl.js';
  import { getUrlValue } from '@/utils/urlValue.js';

  // import { bottomNavTo } from '@/utils/common.js';
  export default {
    name: 'home',
    components: {
      RealHome,
      MyCourse,
      Mine,
      WPage,
      CustomTab,
    },
    data() {
      return {
        a: 1,
        currentPageUrl: '',
        pageId: '',
      };
    },
    computed: {
      pageTabList() {
        return this.$store.getters.getPageTabList;
      },
    },
    watch: {
      pageTabList: {
        handler(nv) {
          if (nv?.tabList?.length > 0) {
            const currentData = nv.tabList.filter((item) => {
              return item.isHomePage == 1;
            });
            // console.log(currentData, 'currentDatacurrentData');
            this.currentPageUrl = currentData[0].url;
            // console.log(this.currentPageUrl, 'currentPageUrl');
            if (currentData[0]?.pageId) {
              this.pageId = currentData[0].pageId;
            }
            uni.setStorageSync('pageId', this.pageId);
            // 处理自适应首页
            let startPageTab = 0;
            nv.tabList.map((item, index) => {
              if (item.isHomePage == 1) {
                startPageTab = index;
              }
            });
            // 此处根据首页切换顺序
            this.$store.commit('setCurrentTab', startPageTab);
          }
          uni.hideTabBar();
        },
        immediate: false,
        deep: true,
      },
      currentPageUrl: {
        handler(val) {
          if (val == '/pages/realHome/index') {
            uni.setNavigationBarColor({
              frontColor: '#ffffff', // 导航栏标题颜色，只能是'black'或'white'
              backgroundColor: '#e51600', // 导航栏背景颜色
            });
          } else if (val == '/pages/newCourse/index') {
            uni.setNavigationBarTitle({
              title: '课程',
            });
          } else if (val == '/pages/mine/index') {
            uni.setNavigationBarTitle({
              title: '',
            });
            uni.setNavigationBarColor({
              frontColor: '#ffffff', // 导航栏标题颜色，只能是'black'或'white'
              backgroundColor: '#f9f9f9', // 导航栏背景颜色
            });
          }
        },
        immediate: true,
        deep: true,
      },
    },
    onLoad() {
      uni.hideTabBar();
      /* #ifdef H5 */
      this.isWxOrAli();
      /* #endif */
    },
    methods: {
      async isWxOrAli() {
        var ua = window.navigator.userAgent.toLowerCase();
        //判断是不是微信
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
          const openId = getUrlValue('openId');
          if (openId) {
            uni.setStorageSync('openId', openId);
          } else {
            // const baseUrl = getPayRedicrtUrl();
            // const originUrl = window.location.origin;
            // const EncodeUrl = `page_commodity/order/pages/redirctPage?state=${originUrl}&payOrign=${originUrl}`;
            // const redirectUrl = baseUrl + EncodeUrl;
            // window.location.href = redirectUrl;
          }
        }
      },
    },
  };
</script>
