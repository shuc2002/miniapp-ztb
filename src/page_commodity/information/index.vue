<!--
* @desc 资讯详情页面
* @author 江玉龙
* @date 2022年08月04日
-->
<template>
  <view class="info-bg">
    <p class="title">{{ data.title }}</p>
    <p class="subhead">{{ data.subhead }}</p>
    <view class="flex-center-box text-size-sn common-text-400 common-tip">
      <view class="flex-item-center">
        <p class="second-p">{{ data.publishTime }}</p>
        <p>{{ data.issuer }}</p>
      </view>
      <view class="flex-item-center">
        <view class="t-icon t-icon-book-open-copy icon-read" />
        <p>{{ data.readingAmount ? data.readingAmount : 0 }}</p>
      </view>
    </view>
    <view v-show="pubCommodityList.length > 0">
      <swiper
        class="banner-swiper"
        :indicator-dots="true"
        :autoplay="true"
        :interval="2000"
        :duration="500"
        indicator-active-color="#98ADFF"
        indicator-color="#EAEEFF"
      >
        <swiper-item v-for="(item, idx) in pubCommodityList" :key="idx">
          <image
            class="swiper-item"
            :src="item.imgUrl"
            @tap="clickAdvert(item)"
            @error="handleError()"
          />
        </swiper-item>
      </swiper>
    </view>
    <view class="foreword-box" v-if="data.summary">
      <view>
        <view class="t-icon t-icon-quotes icon-style" />
      </view>
      <p>{{ data.summary }}</p>
    </view>
    <view v-html="marketContent" />
  </view>
</template>
<script>
  import { addRecord, getAdvertList } from '@/api/modules/user/index';
  import { getInfoDetail } from '@/api/modules/commodity/index';
  import { AdertUrl, baseUrl } from '@/enums/advert';
  import { getCommodityStatus } from '@/api/modules/commodity/index';

  export default {
    name: 'infoDetail',
    computed: {
      projectId() {
        return this.$store.getters.getProjectId;
      },
      tenantId() {
        return this.$store.getters.getTenantId;
      },
    },
    onLoad(options) {
      this.getInfoDetail(options.id);
      this.getAdvertList();
      this.pubCommodityList = [
        {
          imgUrl: baseUrl + this.tenantId + '/d6dc9ec1ce784a08abf109bba7030b86.png',
        },
      ];
    },
    data() {
      return {
        data: {},
        pubCommodityList: [
          {
            imgUrl: '',
          },
        ],
        marketContent: '',
      };
    },
    methods: {
      // 获取广告
      async getAdvertList() {
        const data = await getAdvertList({
          type: 3,
          productId: this.projectId,
          tenantId: this.tenantId,
        });
        if (data && data.length > 0) this.pubCommodityList = data;
      },
      // 获取资讯详情
      async getInfoDetail(id) {
        const res = await getInfoDetail({ id });
        this.data = res.body;
        this.marketContent = this.data.content.replace(
          /<img style="max-width: 100%;"/g,
          '<img style="width:92vw;height:auto;" '
        );
        this.marketContent = this.replaceSpecialChar(this.marketContent);
      },
      // 图片错误
      handleError() {
        this.pubCommodityList = [
          {
            imgUrl: AdertUrl.Home,
          },
        ];
      },
      // 转义
      replaceSpecialChar(str) {
        let arrEntities = {
          lt: '<',
          gt: '>',
          nbsp: ' ',
          amp: '&',
          quot: '"',
          ldquo: '“',
          rdquo: '”',
        };
        return str.replace(/&(lt|gt|nbsp|amp|quot|ldquo|rdquo);/gi, function(_, t) {
          return arrEntities[t];
        });
      },
      // 点击广告
      async clickAdvert(data) {
        // 记录点击广告
        if (data.id) {
          await addRecord({ advertId: data.id });
          if (data.jumpType == 2) {
            //跳转链接
            uni.setClipboardData({
              data: data.jumpPage,
              success: () => {
                uni.hideToast();
                this.$nextTick(() => {
                  uni.showToast({
                    title: '链接已复制，请在浏览器打开',
                    icon: 'none',
                  });
                });
              },
            });
          } else {
            const status = await getCommodityStatus({ id: data.jumpPage });
            //跳转商品当type:1
            if (status.body == false) {
              uni.navigateTo({
                url: `/page_commodity/commodity/pages/commodityBank?id=${data.jumpPage}`,
              });
            } else if (status.body == true) {
              uni.navigateTo({
                url: `/page_commodity/courseList/index?id=${data.jumpPage}&isOrder=true`,
              });
            }
          }
        }
      },
      // 转发页面
      async onShareAppMessage() {
        return {
          path: '/page_commodity/information/index',
          // imageUrl: 'https://app.static.wangxiao.cn/ykmf/images/zuduishuati.png',
        };
      },
    },
  };
</script>
<style lang="scss" scoped>
  .info-bg {
    padding: 32rpx;
    background-color: #ffffff;
    word-break: break-all;
  }
  .title {
    margin-bottom: 24rpx;
    font-size: 40rpx;
    font-weight: 700;
    color: #333228;
    line-height: 1.5;
  }
  .subhead {
    font-size: 32rpx;
    color: #323949;
    margin-bottom: 32rpx;
  }
  .second-p {
    margin-right: 48rpx;
  }
  .banner-swiper {
    height: 128rpx;
    margin: 32rpx 0;
    .swiper-item {
      height: 100%;
      width: 686rpx;
      border-radius: 24rpx;
    }
  }
  .foreword-box {
    background-color: #fafafa;
    padding: 32rpx;
    border-radius: 16rpx;
    display: flex;
    margin-bottom: 32rpx;
    .icon-style {
      width: 32rpx;
      height: 32rpx;
    }
    p {
      font-size: 28rpx;
      font-weight: 400;
      color: #5b648d;
      line-height: 1.5;
      margin-left: 16rpx;
    }
  }
  .icon-read {
    margin-right: 8rpx;
  }
</style>
