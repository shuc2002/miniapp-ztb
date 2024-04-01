<!-- 商品组件 -->
<template>
  <view class="commodityBox" :style="[style]">
    <!-- 共有的顶部标题 -->
    <view class="com-top">
      <view class="com-title">{{ showTitle ? title : '' }}</view>
      <view class="com-btn" @tap="lookMore" v-show="showMore">查看更多 ></view>
    </view>

    <!-- 大图模式 -->
    <view class="type-img" v-if="showType == 0">
      <view
        class="type-img-one"
        v-for="(item, index) in dataList"
        :key="index"
        @tap="toDetail(item)"
      >
        <img :src="item.thumbnail" class="type-img-big" mode="aspectFill" />
        <view class="img-title truncate-two" v-show="showContent.indexOf('name') != -1">{{
          item.name
        }}</view>
        <view class="img-bottom">
          <view class="img-price" v-show="showContent.indexOf('price') != -1"
            >￥{{ item.price }}</view
          >
          <!-- <img src="https://acc.wangxiao.cn/image/dpzx/shoppingCart.png" class="img-icon" /> -->
        </view>
      </view>
    </view>
    <!-- 一行两个模式 -->
    <view v-if="showType == 1">
      <view v-for="(item, index) in dataList2" :key="index">
        <view class="type-row">
          <view
            v-if="item[0]"
            class="type-row-one"
            @tap="toDetail(item[0])"
            :class="index % 2 == 0 ? 'row-right' : 'row-no-right'"
          >
            <view class="row-img-box">
              <img :src="item[0].thumbnail" class="row-img" mode="aspectFit" />
            </view>
            <view class="row-title truncate-two" v-show="showContent.indexOf('name') != -1">{{
              item[0].name
            }}</view>
            <view class="row-bottom">
              <view class="row-price" v-show="showContent.indexOf('price') != -1"
                >￥{{ item[0].price }}</view
              >
              <!-- <img src="https://acc.wangxiao.cn/image/dpzx/shoppingCart.png" class="row-icon" /> -->
            </view>
          </view>
          <view class="center-space"></view>
          <view
            v-if="item[1]"
            class="type-row-one"
            @tap="toDetail(item[1])"
            :class="index % 2 == 0 ? 'row-right' : 'row-no-right'"
          >
            <!-- <img :src="item[1].thumbnail" class="row-img"   mode="aspectFit"/> -->
            <view class="row-img-box">
              <img :src="item[1].thumbnail" class="row-img" mode="aspectFit" />
            </view>
            <view class="row-title truncate-two" v-show="showContent.indexOf('name') != -1">{{
              item[1].name
            }}</view>
            <view class="row-bottom">
              <view class="row-price" v-show="showContent.indexOf('price') != -1"
                >￥{{ item[1].price }}</view
              >
              <!-- <img src="https://acc.wangxiao.cn/image/dpzx/shoppingCart.png" class="row-icon" /> -->
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 列表模式 -->
    <view class="type-list" v-if="showType == 2">
      <view
        class="type-list-one"
        v-for="(item, index) in dataList"
        :key="index"
        @tap="toDetail(item)"
      >
        <img class="list-img" :src="item.thumbnail" mode="aspectFit" />
        <view class="list-right">
          <view class="list-title truncate-two" v-show="showContent.indexOf('name') != -1">{{
            item.name
          }}</view>
          <view class="list-bottom">
            <view class="list-price" v-show="showContent.indexOf('price') != -1"
              >￥{{ item.price }}</view
            >
            <!-- <img src="https://acc.wangxiao.cn/image/dpzx/shoppingCart.png" class="list-icon" /> -->
          </view>
        </view>
      </view>
    </view>
    <!-- 横向滑动模式 -->
    <view class="type-slide" v-if="showType == 3">
      <scroll-view
        :scroll-x="true"
        :scroll-y="false"
        scroll-with-animation="true"
        class="scroll-view"
      >
        <view
          v-for="(item, index) in dataList"
          :key="index"
          class="slide-one"
          @tap="toDetail(item)"
        >
          <image class="slide-img" :src="item.thumbnail" mode="aspectFit" />
          <view class="slide-title truncate-two " v-show="showContent.indexOf('name') != -1">{{
            item.name
          }}</view>
          <view class="slide-bottom">
            <view class="slide-price" v-show="showContent.indexOf('price') != -1"
              >￥{{ item.price }}</view
            >
            <!-- <img src="https://acc.wangxiao.cn/image/dpzx/shoppingCart.png" class="slide-icon" /> -->
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>
<script>
  import { getCommodityInfoByIds } from '@/api/modules/common/index';
  export default {
    name: 'Commodity',
    data() {
      return {
        current: 0,
        title: '',
        showNum: 10, // 展示条数
        ids: [], // id数组
        showType: 0, // 展示模式 0-大图 1-一行两个 2-列表模式 3-横向滑动
        showTitle: true,
        showMore: true,
        dataList: [], //商品数据
      };
    },
    props: {
      style: {
        type: Object,
        default: () => {},
      },
      content: {
        type: Array,
        default: () => [],
      },
    },
    computed: {
      dataList2() {
        const dataList = this.dataList;
        const result = [];
        for (let i = 0; i < dataList.length; i = i + 2) {
          result.push([dataList[i], dataList[i + 1]]);
        }
        console.log('result---', result);
        return result;
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
              if (item.attr == 'title') {
                this.title = item.val;
              }
              if (item.attr == 'dataList') {
                this.ids = item.val.map((child) => {
                  return child.id;
                });
              }
              if (item.attr == 'fields') {
                this.showContent = item.val;
              }
              if (item.attr == 'layout') {
                this.showType = item.val;
              }
            });
            // 进行第一次获取数据
            this.getComdityInfoList(this.ids, this.showNum);
          }
        },
        immediate: true,
        deep: true,
      },
    },
    methods: {
      // 根据商品id列表获取商品信息列表
      async getComdityInfoList(ids, showNum) {
        const res = await getCommodityInfoByIds({
          commodityIdList: ids,
          index: 0,
          row: showNum,
        });
        if (res.body) {
          this.dataList = res.body;
        }
      },
      // 查看更多
      lookMore() {
        uni.navigateTo({
          url: `/page_commodity/commodityAll/index?ids=${JSON.stringify(this.ids)}&title=${
            this.title
          }`,
        });
      },
      // 去往商品详情页
      toDetail(item) {
        const { id, supplierId } = item;
        this.$store.commit('setSupplierId', supplierId || '');
        uni.navigateTo({
          url: `/page_commodity/commodity/pages/commodityBank?id=${id}`,
        });
      },
    },
  };
</script>
<style lang="scss" scoped>
  .com-top {
    display: flex;
    justify-content: space-between;
    height: 50rpx;
    margin-bottom: 20rpx;
  }
  .com-title {
    color: #333333;
    font-size: 36rpx;
    font-weight: 700;
  }
  .com-btn {
    color: #9fa1a4;
    font-size: 28rpx;
    margin-top: 8rpx;
  }
  // 列表模式样式
  .type-list-one {
    display: flex;
    width: 690rpx;
    // height: 208rpx;
    border-radius: 24rpx;
    margin-bottom: 32rpx;
    background: var(--white, #fff);
  }
  .list-img {
    width: 256rpx;
    height: 144rpx;
    border-radius: 16rpx;
    margin-left: 24rpx;
    margin-top: 24rpx;
  }
  .list-right {
    margin-top: 24rpx;
    margin-left: 32rpx;
    margin-bottom: 24rpx;
    width: 354rpx;
    height: 144rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .list-title {
    width: 354rpx;
    font-size: 32rpx;
  }
  .list-bottom {
    // background:red;
    display: flex;
    justify-content: space-between;
  }
  .list-price {
    color: #e51600;
    font-size: 28rpx;
    line-height: 30rpx;
  }
  .list-icon {
    width: 32rpx;
    height: 32rpx;
  }

  // 大图模式样式
  .type-img-one {
    width: 690rpx;
    background: var(--white, #fff);
    margin-bottom: 32rpx;
    padding-bottom: 32rpx;
  }
  .type-img-big {
    width: 690rpx;
    height: 388rpx;
    border-radius: 24rpx 24rpx 0 0;
  }
  .img-title {
    width: 626rpx;
    color: #333333;
    font-size: 36rpx;
    margin-left: 32rpx;
    margin-top: 24rpx;
  }
  .img-bottom {
    display: flex;
    width: 626rpx;
    justify-content: space-between;
    height: 48rpx;
    margin-left: 32rpx;
    margin-top: 32rpx;
  }
  .img-price {
    color: #e51600;
    font-size: 40rpx;
    line-height: 40rpx;
  }
  .img-icon {
    width: 48rpx;
    height: 48rpx;
  }
  // 一行两个模式样式
  .type-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .type-row-one {
    // width: 330rpx;
    // width: 330rpx;
    width: 48%;
    height: 388rpx;
    margin-bottom: 32rpx;
    border-radius: 24rpx;
    background: var(--white, #fff);
    overflow: hidden;
    // background-color: #333333;
  }
  .center-space {
    // width: 30rpx;
    width: 2%;
    height: 30rpx;
  }
  .row-right {
    // margin-right: 30rpx;
  }
  .row-img-box {
    width: 100%;
    height: 186rpx;
    display: flex;
    justify-content: center;
  }
  .row-img {
    // width: 330rpx;
    // width: 100%;
    // // width: 330rpx;
    height: 186rpx;
    border-radius: 24rpx 24rpx 0rpx 0rpx;
  }
  .row-title {
    color: #333333;
    font-size: 32rpx;
    // width: 282rpx;
    // width: 100%;
    height: 88rpx;
    margin-left: 24rpx;
    margin-top: 24rpx;
  }
  .row-bottom {
    display: flex;
    justify-content: space-between;
    // width: 282rpx;
    width: 100%;
    height: 34rpx;
    margin-left: 24rpx;
    margin-top: 32rpx;
  }
  .row-price {
    color: #e51600;
    font-size: 28rpx;
  }
  .row-icon {
    width: 29.01rpx;
    height: 26.35rpx;
    margin-top: 7rpx;
  }
  // 横向滑动样式
  .type-slide {
    // display:flex;
  }
  .scroll-view {
    width: 750rpx;
    // display: flex;
    // flex-wrap:nowrap;
    display: flex;
    white-space: nowrap;
  }
  .slide-one {
    width: 200rpx;
    height: 256rpx;
    display: inline-block;
    margin-right: 24rpx;
    background: var(--white, #fff);
    border-radius: 16rpx;
  }
  .slide-img {
    width: 200rpx;
    height: 112rpx;
    border-radius: 16rpx 16rpx 0rpx 16rpx;
  }
  .slide-title {
    width: 168rpx;
    height: 68rpx;
    font-size: 24rpx;
    margin-left: 16rpx;
    margin-top: 16rpx;
    word-break: break-all;
    white-space: normal;
  }
  .slide-bottom {
    width: 168rpx;
    height: 28rpx;
    margin-left: 16rpx;
    margin-top: 16rpx;
    display: flex;
    justify-content: space-between;
  }
  .slide-price {
    color: #e51600;
    font-size: 24rpx;
  }
  .slide-icon {
    width: 28rpx;
    height: 28rpx;
  }
</style>
