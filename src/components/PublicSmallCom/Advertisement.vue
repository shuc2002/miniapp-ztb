<!-- 广告位组件 -->
<template>
  <view class="advertiseBox" :style="[advStyle]">
    <!-- #ifndef H5 -->
    <img
      class="advertImg"
      :src="config.val"
      @tap="adClick"
      mode="widthFix"
      :style="{ height: imgHeight + 'px' }"
      @load="onImgLoad"
    />
    <!-- #endif -->
    <!-- #ifdef H5 -->
    <img class="advertImg" :src="config.val" @tap="adClick" mode="widthFix" />
    <!-- #endif -->
  </view>
</template>
<script>
  // import { getQueryCertificateUrl } from '@/utils/payUrl.js';
  // import { bottomNavTo } from '@/utils/common.js';
  export default {
    name: 'Advertisement',
    props: {
      config: {
        type: Object,
        default: () => {},
      },
      advStyle: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        imgHeight: 0,
      };
    },
    computed: {
      projectId() {
        return this.$store.getters.getProjectId;
      },
      currentSubjectId() {
        return this.$store.getters.getCurrentSubjectId;
      },
      subjectList() {
        return this.$store.getters.getSubjectList;
      },
    },
    methods: {
      // 图片自适应
      onImgLoad(e) {
        // 当图片加载完成后，获取图片的原始宽度和高度，并根据宽度计算出高度
        const { width, height } = e.mp.detail;
        this.imgHeight = (height / width) * 100; // 高度 = 原始高度 / 原始宽度 * 100
        // console.log(this.imgHeight,'this.imgHeight');
      },
      adClick() {
        console.log(this.config.click, 'this.config.click');
        const type = this.config.click.href[0];
        const href = this.config.click.href[1];
        switch (type) {
          case '功能链接':
            this.goPageByFunc(href);
            break;
          case '商品陈列':
            this.goPageByGoodDisplay(href);
            break;
          case '微页面':
            this.goPageByWPage(href);
            break;
          case '超链接':
            this.goPageByLink();
            break;
          case '商品链接':
            this.goPageByGood();
            break;
        }
      },
      getCurrent() {
        let result = 0;
        this.subjectList.map((item, index) => {
          if ((item.k = this.currentSubjectId)) {
            result = index;
          }
        });
        return result;
      },
      goPageByFunc(href) {
        switch (href) {
          case '错题集':
            uni.navigateTo({
              url: '/business/myRecords/index?activeNum=0',
            });
            break;
          case '收藏':
            uni.navigateTo({
              url: '/business/myRecords/index?activeNum=1',
            });
            break;
          case '会员中心':
            uni.navigateTo({
              url: '/page_material/member/index',
            });
            break;
          case '每日一练':
            this.$emit('handleDailyExercise');
            break;
          case '查询证书':
            this.goQueryCertificate();
            break;
        }
      },
      goPageByGoodDisplay(href) {
        let areaId = href;
        let single = this.config.click.single;
        let mode = this.config.click.mode;
        let current = this.getCurrent(); // 计算current
        uni.navigateTo({
          url: `/page_commodity/commodityList/index?projectId=${
            this.projectId
          }&areaId=${areaId}&current=${current}&single=${single}&mode=${mode}&subjectId=${
            this.currentSubjectId
          }&subjectList=${JSON.stringify(this.subjectList)}`,
        });
      },
      goPageByWPage(href) {
        uni.navigateTo({
          url: `/page_commodity/wPage/index?pageId=${href}`,
        });
      },
      goPageByLink() {
        console.log(this.config.click.hyperLink);
        uni.navigateTo({
          url: `/page_material/outLinkPage/index?url=${this.config.click.hyperLink}`,
        });
      },
      goPageByGood() {
        let id = this.config.click.goods.val[0].id;
        uni.navigateTo({
          url: `/page_commodity/commodity/pages/commodityBank?id=${id}`,
        });
      },
      goQueryCertificate() {
        const goUrl = encodeURIComponent(
          this.config.click.hyperLink +
            `/h5/#/queryCertificate?platform=${uni.getSystemInfoSync().uniPlatform}`
        );
        const url = `/page_common/iframe/index?uri=${goUrl}`;
        uni.navigateTo({
          url,
        });
      },
    },
  };
</script>
<style lang="scss" scoped>
  .advertiseBox {
    width: 750rpx;
    // height: auto;
    // height: 296rpx;
    margin-bottom: 32rpx;
    // overflow: hidden;
  }
  .advertImg {
    // max-width: 750rpx;
    // width: 100vw;
    width: 100%;
    height: auto;
    // height: 100%;
    // max-height: 296rpx;
  }
</style>
