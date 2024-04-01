<!--
* @desc 积分商品
* @author 江玉龙
* @date 2022年04月20日
-->
<template>
  <view class="common-bg">
    <scroll-view
      style="height: 100vh"
      scroll-y="true"
      @scrolltolower="handleToLower"
      scroll-with-animation
    >
      <view class="shop-box">
        <view>
          <view class="text-size-main common-text common-text-700 truncate" v-if="projectName"
            >{{ projectName }}积分购物商城</view
          >
          <view class="integral">
            <view class="integral-text">积分余额：</view>
            <image src="@/home/static/img/shop/integral.png" />
            <view class="text-size-sn common-text common-text-700">{{ integral }}</view>
          </view>
        </view>
        <view>
          <button
            class="btn-obtain flex-center"
            @tap="commonFun.routeTo(`/business/integral/index`)"
            >获取积分</button
          >
        </view>
      </view>
      <view class="flex-center-box home-tab-box">
        <p class="common-text text-size-main common-text-700">积分商品</p>
      </view>
      <view class="commodity-display" v-if="list.length > 0">
        <view v-for="(item, key) in list" :key="key">
          <view
            @tap="
              item.isBought
                ? commonFun.routeTo(`/page_commodity/courseList/index?id=${item.id}&isOrder=true`)
                : commonFun.routeTo(
                    `/page_commodity/commodity/pages/commodityIntegral?id=${item.id}`
                  )
            "
          >
            <ShopData :data="item" />
          </view>
        </view>
      </view>
      <image
        class="no-card"
        v-if="list.length === 0"
        src="@/static/img/empty/order.png"
        mode="scaleToFill"
      />
      <view style="width: 100%; height: 50upx; opacity: 0" v-if="!showBottom" />
      <view class="no-more" v-if="showBottom">这是我的底线了~</view>
    </scroll-view>
    <SignInModal ref="sign" :data="signList" />
  </view>
</template>
<script>
  import ShopData from './comps/ShopData.vue';
  import { getIntegralList } from '@/api/modules/commodity/index';
  import { getIntegralNum } from '@/api/modules/order/index';
  import SignInModal from '@/components/GetIntegral/SignInModal.vue';
  import { finishTask, getSign } from '@/api/modules/task/index';

  export default {
    name: 'shopping',
    components: { ShopData, SignInModal },
    onLoad() {
      this.dailySign();
    },
    onShow() {
      this.ifMore = false;
      this.showBottom = false;
      this.page = 0;
      this.getIntegralList();
      this.getIntegralNum();
    },
    computed: {
      projectId() {
        return this.$store.getters.getProjectId;
      },
      projectName() {
        return this.$store.getters.getProjectName;
      },
      token() {
        return this.$store.getters.getToken;
      },
    },
    data() {
      return {
        ifMore: false,
        showBottom: false,
        page: 0,
        list: [],
        integral: 0,
        signList: {},
        integralNum: 0,
      };
    },
    methods: {
      // 签到接口
      async dailySign() {
        const res = await finishTask({ missionId: 'sign' });
        if (res.code == 1000 && res.body > 0) {
          const data = await getSign();
          this.$refs.sign.showModal = true;
          this.signList = data.body;
          this.getIntegralNum();
        }
      },
      // 获取我的积分
      async getIntegralNum() {
        if (this.token) {
          const res = await getIntegralNum();
          this.integral = res.body;
        }
      },
      // 获取积分商品列表
      async getIntegralList() {
        if (this.page == 0) {
          const res = await getIntegralList({
            projectId: this.projectId,
            index: this.page,
            row: 10,
          });
          this.list = res.body;
        } else if (this.page > 0) {
          const data = await getIntegralList({
            projectId: this.projectId,
            index: this.page,
            row: 10,
          });
          if (data.body.length > 0) {
            this.list.push(...data.body);
            if (data.body.length < 10) {
              this.ifMore = true;
            }
          } else if (data.body.length <= 0) {
            this.ifMore = true;
          }
        }
      },
      // 触底加载更多
      handleToLower() {
        if (!this.showBottom) {
          uni.showLoading({
            title: '加载中',
            mask: true,
          });
          this.page++;
          this.getIntegralList();
          setTimeout(() => {
            if (this.ifMore) {
              this.showBottom = true;
            }
            this.$forceUpdate();
            uni.hideLoading();
          }, 1000);
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
  .shop-box {
    background-color: white;
    padding: 24rpx;
    display: flex;
    justify-content: space-between;
    .truncate {
      width: 550rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .integral {
      display: flex;
      align-items: center;
      margin-top: 16rpx;
      .integral-text {
        font-size: 24rpx;
        font-weight: 400;
      }
      image {
        width: 32rpx;
        height: 32rpx;
        margin-right: 8rpx;
      }
    }
    .btn-obtain {
      width: 144rpx;
      height: 48rpx;
      border-radius: 56rpx;
      background-color: #eef2ff;
      color: #475ffd;
      font-size: 24rpx;
    }
  }
  .home-tab-box {
    height: 90rpx;
    width: 100%;
    background-color: white;
    p {
      line-height: 90rpx;
      width: 33%;
      position: relative;
      &:after {
        content: '';
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 0;
        width: 40rpx;
        height: 8rpx;
        border-radius: 4rpx;
        background-color: #475ffd;
      }
    }
  }
  .commodity-display {
    display: flex;
    flex-wrap: wrap;
    padding: 6rpx;
  }
  .no-more {
    font-size: 28rpx;
    font-weight: 400;
    text-align: center;
    width: 100%;
    height: 100upx;
    color: #989ead;
    line-height: 50upx;
  }
  .no-card {
    width: 344rpx;
    height: 344rpx;
    position: absolute;
    top: 33%;
    left: 50%;
    transform: translate(-50%);
  }
</style>
