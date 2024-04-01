<!--
* @desc 全部商品
* @author lwx
* @date 2023年10月19日
-->
<template>
  <view class="page-com">
    <view style="height:32rpx"></view>
    <view v-for="(item, index) in dataList" :key="index" @tap="toDetail(item)">
      <ListItem :title="item.name" :imgUrl="item.thumbnail" :price="item.price" />
    </view>
  </view>
</template>

<script>
  import ListItem from './comps/ListItem.vue';
  import { getCommodityInfoByIds } from '@/api/modules/common/index';
  export default {
    name: 'commodityAlll',
    components: { ListItem },
    data() {
      return {
        dataList: [],
      };
    },
    onLoad(options) {
      uni.setNavigationBarTitle({
        title: options.title,
      });
      this.getDataList(JSON.parse(options.ids));
    },
    methods: {
      async getDataList(ids) {
        const res = await getCommodityInfoByIds({
          commodityIdList: ids,
          index: 0,
          row: 9999,
        });
        if (res.body) {
          this.dataList = res.body;
        }
      },
      // 去往商品详情页
      toDetail(item) {
        const { id, supplierId } = item;
        this.$store.commit('setSupplierId', supplierId || '');
        uni.navigateTo({
          url: `/page_commodity/commodity/pages/commodityBank?id=${id}`,
        });
      },
      // 转发页面
      async onShareAppMessage() {
        return {
          path: '/business/information/index',
          // imageUrl: 'https://app.static.wangxiao.cn/ykmf/images/zuduishuati.png',
        };
      },
    },
  };
</script>

<style lang="scss" scoped>
  .page-com {
    min-height: 100vh;
    background-color: #f5f6fa;
  }
</style>
