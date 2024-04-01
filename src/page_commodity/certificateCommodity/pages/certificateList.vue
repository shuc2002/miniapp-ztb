<!--
* @desc 证书商品列表(题库)
-->
<template>
  <view class="bg-gray">
    <u-tabs-swiper
      ref="tabs"
      :current="current"
      active-color="#E51600"
      @change="onChange"
      :list="tabs"
      :is-scroll="false"
    ></u-tabs-swiper>
    <view class="certificate-box">
      <view v-for="(item, index) in tabData" :key="index">
        <certificate-item :item="item" :clickable="true" />
      </view>
    </view>
  </view>
</template>
<script>
  import certificateItem from '../comps/certificateItem';
  import { fetchCertificateList } from '@/api/modules/certificate/index';
  export default {
    name: 'certificate-list',
    components: {
      certificateItem,
    },
    data() {
      return {
        isShow: false,
        projectInfo: {},
        list: [],
        current: 0,
        tabs: [
          {
            name: '全部',
            id: 0,
          },
          {
            name: '未获得',
            id: 2,
          },
          {
            name: '已获得',
            id: 1,
          },
        ],
        tabData: [],
      };
    },
    computed: {
      projectId() {
        return this.$store.getters.getProjectId;
      },
    },
    onLoad() {
      this.getCertificateList();
    },
    onShow() {},
    methods: {
      async getCertificateList() {
        const res = await fetchCertificateList({ issuanceStatus: this.tabs[this.current].id });
        this.tabData = res.body;
      },
      onChange(index) {
        this.current = index;
        this.getCertificateList();
      },
    },
    // 转发页面
    async onShareAppMessage() {
      return {
        path: '/page_commodity/certificateCommodity/pages/certificateList',
        // imageUrl: 'https://app.static.wangxiao.cn/ykmf/images/zuduishuati.png',
      };
    },
  };
</script>
<style lang="scss" scoped>
  .bg-gray {
    position: fixed;
    background: #f6f6f6;
    left: 0;
    width: 100%;
    top: 0;
    height: 100%;
    /* #ifdef H5 */
    padding-top: 84rpx;
    /* #endif */
  }
  .certificate-box {
    overflow-y: auto;
    padding: 0 30rpx 100rpx;
    width: 100%;
    height: 100%;
  }
</style>
