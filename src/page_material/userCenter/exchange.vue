<!--
* @desc 兑换码
* @author 江玉龙
* @date 2023年02月01日
-->
<template>
  <view class="exchange-bg">
    <view class="topbar"> </view>
    <view class="flex-item topbox">
      <!-- #ifdef MP-WEIXIN -->
      <view class="iconfont icon-return" @tap="navigateBack"></view>
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <view class="iconfont icon-return" @tap="navigateBack"></view>
      <!-- #endif -->
      <!-- #ifdef MP-TOUTIAO -->
      <view class="iconfont icon-return" @tap="navigateBack"></view>
      <!-- #endif -->

      <view class="exchange-title">
        <view class="text-size-xxl common-text-700">激活兑换码</view>
        <view class="head-title">
          <span class="exchangeTitle">输入兑换码</span>
          <span class="receiveTitle">进行领取</span>
        </view>
      </view>
      <image src="@/page_material/static/exchange.png" class="img-icon" />
    </view>
    <view class="exchange-box">
      <input
        placeholder="请输入兑换码"
        v-model="exchangeCode"
        maxlength="11"
        placeholder-style="font-weight:500;color:#A2A6B9;"
        class="exchange-input"
        cursor="6"
      />
      <view
        class="common-button flex-center text-size-main common-click"
        :class="!isDisable ? 'disable-btn' : 'bg-color-red'"
        @tap="isDisable ? activation() : ''"
      >
        激活</view
      >
      <view class="text-size-xxs common-message">
        <view>使用说明：</view>
        <view>1、兑换成功后，可在兑换记录中查看；</view>
        <view>2、若兑换码不存在，请联系直播客服人员。</view>
        <view>3、输入兑换码，可激活对应的商品；</view>
        <view>4、若第三方购买的兑换码有疑问，请及时联系您的商家。</view>
      </view>
      <view class="message-title">
        <u-tabs
          :list="list"
          :current="currentTabIndex"
          @change="change"
          active-color="#E51600"
        ></u-tabs>
      </view>
      <swiper style="height: 500rpx" :current="currentTabIndex" @change="swiperTab">
        <swiper-item v-for="(item, idx) in list" :key="idx">
          <scroll-view
            style="height: 100%"
            scroll-y="true"
            @scrolltolower="handleToLower"
            scroll-with-animation
          >
            <view class="redeemed" v-if="!ifNoData">
              <view>
                <view v-for="(item, idx) in exerciseList" :key="idx">
                  <view class="content-item" @tap="goStudy(item)">
                    <view class="flex-item">
                      <view>
                        <view class="common-text-600">{{ item.activityName }}</view>
                        <view class="text-size-xxs common-tip common-text-400 time-text">{{
                          item.createTime
                        }}</view>
                      </view>
                      <view class="exercise-button text-size-xxs flex-center common-click">
                        查看</view
                      >
                    </view>
                  </view>
                </view>
              </view>

              <!-- 占位容器 -->
              <view style="width: 100%; height: 50upx; opacity: 0" v-if="!ifMore" />
              <view class="no-more" v-if="ifMore">这是我的底线了~</view>
            </view>
            <view class="noCard" v-else>
              <image src="https://acc.wangxiao.cn/image/app/course-empty.png" mode="scaleToFill" />
              <p class="text-size-sn common-text-400 common-tip">暂无记录</p>
            </view>
          </scroll-view>
        </swiper-item>
      </swiper>
    </view>
    <PopupWindow
      ref="question"
      height="360rpx"
      confirmTitle="确定"
      title="温馨提示"
      @success="handleSuccess()"
      :cancelShow="false"
      :canClose="false"
      :setConfirm="false"
    >
      <view class="text-size-main">您输入的兑换码已激活</view>
    </PopupWindow>
  </view>
</template>

<script>
  import PopupWindow from '@/components/PopupComp/PopupWindow.vue';
  import {
    submitExchange,
    getExchangeList,
    exchangeActivation,
    getGoodsRechargeList,
  } from '@/api/modules/exchange/index.ts';

  export default {
    name: 'exchange',
    components: {
      PopupWindow,
    },
    data() {
      return {
        exchangeCode: '', // 输入的兑换码
        exerciseList: [], // 兑换列表
        test: [],
        ifNoData: true, // 兑换列表是否为空
        page: 0, // 兑换列表页数
        ifMore: false, // 是否还有更多数据
        list: [
          {
            name: '活动兑换记录',
            key: 'video',
          },
          {
            name: '商品兑换记录',
            key: 'kk',
          },
        ],
        currentTabIndex: 0, //当前tab
      };
    },
    onLoad() {
      // this.change();
      // this.currentTabIndex = 0;
      this.getExchangeList();
    },
    computed: {
      isDisable() {
        return this.exchangeCode != '';
      },
      channelId() {
        return this.$store.getters.getChannelId;
      },
    },
    methods: {
      // 弹窗关闭
      handleSuccess() {
        this.$refs.question.showModal = false;
      },
      //返回
      navigateBack() {
        uni.navigateBack();
      },
      // 兑换码校验
      async activation() {
        let res = { code: 0 };
        if (/[\u4E00-\u9FA5]/g.test(this.exchangeCode)) {
          uni.showToast({
            title: '请输入正确的兑换码',
            icon: 'none',
          });
        } else {
          if (String(this.exchangeCode)[0] === 'J' && String(this.exchangeCode).length === 10) {
            res = await exchangeActivation({
              code: this.exchangeCode,
              channelId: this.channelId,
            });
          } else {
            res = await submitExchange({
              redeemCode: this.exchangeCode,
              channelId: this.channelId,
            });
          }

          if (res.code == 2085) {
            this.$refs.question.showModal = true;
          } else if (res.code == 2088) {
            uni.showToast({
              title: '兑换码无效',
              icon: 'error',
            });
          } else {
            uni.showToast({
              title: '兑换成功',
              icon: 'success',
            });
            this.exchangeCode = '';
            this.getExchangeList();
          }
        }
      },
      // 兑换列表请求
      async getExchangeList() {
        // this.exerciseList = [];
        let res = {};
        if (this.currentTabIndex === 0) {
          res = await getExchangeList({ index: this.page, row: 5 });
        } else {
          // console.log(2222);
          res = await getGoodsRechargeList({ index: this.page, row: 5 });
        }

        if (this.page == 0) {
          this.exerciseList = res.body;
        } else if (this.page > 0) {
          if (res.body.length > 0) {
            this.exerciseList.push(...res.body);

            if (res.body.length < 5) {
              this.ifMore = true;
            }
          } else if (res.body.length <= 0) {
            this.ifMore = true;
          }
        }
        if (this.exerciseList.length > 0) {
          this.ifNoData = false;
        } else {
          this.ifNoData = true;
        }
      },
      //tab切换
      change(index) {
        this.currentTabIndex = index;
        this.page = 0;
        this.exerciseList = [];
        this.getExchangeList();
      },
      goStudy(item) {
        if (this.currentTabIndex === 0) {
          uni.navigateTo({
            url: `/page_commodity/courseList/exchangeCourse?id=${item.activityId}`,
          });
        } else {
          uni.navigateTo({
            url: `/page_commodity/courseList/exchangeCourse?skuId=${item.skuId}`,
          });
        }
      },
      swiperTab(e) {
        console.log('dddddd----', e);
      },
      // 触底加载更多
      handleToLower() {
        if (!this.ifMore) {
          uni.showLoading({
            title: '加载中',
            mask: true,
          });
          this.page++;
          this.getExchangeList();
          setTimeout(() => {
            this.$forceUpdate();
            uni.hideLoading();
          }, 1000);
        }
      },
      // 转发页面
      async onShareAppMessage() {
        return {
          path: '/page_material/userCenter/exchange',
          // imageUrl: 'https://app.static.wangxiao.cn/ykmf/images/zuduishuati.png',
        };
      },
    },
  };
</script>

<style lang="scss" scoped>
  .exchange-bg {
    width: 750rpx;
    height: 600rpx;
    border-radius: 0 0 8rpx 260rpx;
    background: linear-gradient(148.4deg, #d04e46 0%, #c24040 100%);
    .topbar {
      width: 100%;
      height: 122rpx;
      padding-top: 68rpx;
      padding-left: 32rpx;
      // background: linear-gradient(143.4deg, #ff6f66ff 0%, #ff3e3eff 100%);
    }
    .topbox {
      position: relative;

      .icon-return {
        position: absolute;
        left: 32rpx;
        top: -20rpx;
        color: #fff;
      }
    }

    .exchange-title {
      position: relative;
      padding: 36rpx 48rpx 48rpx 48rpx;
      color: #ffffff;
      z-index: 2;
      .head-title {
        font-size: 28rpx;
        margin-top: 16rpx;
        color: #ffffff99;
        span {
          font-family: 'PingFang SC';
          font-size: 14px;
          font-style: normal;
          font-weight: 500;
          line-height: normal;
          letter-spacing: 0.7px;
        }
        .exchangeTitle {
          color: #ffce00;
        }
        .receiveTitle {
          margin-left: 8px;
          color: #ffffff99;
        }
      }
    }

    .exchange-box {
      position: relative;
      z-index: 200;
      width: 100%;
      border-radius: 48rpx 48rpx 0 0;
      padding: 50rpx 0 50rpx 0;
      background: #ffffff;
      box-shadow: 0 8px 20px 0 #f1f3fa;

      .exchange-input {
        width: 650rpx;
        height: 112rpx;
        border-radius: 24rpx;
        border: 2rpx solid #e51600;
        margin: 0 auto;
        text-align: center;
        font-weight: 600;
        font-size: 32rpx;
      }

      .common-button {
        margin-top: 32rpx;
        margin-bottom: 24rpx;
        width: 650rpx;
        height: 96rpx;
        border-radius: 74rpx;
      }
    }
  }
  .common-message {
    padding: 0 46rpx;
    line-height: 2;
    margin-top: 30rpx;
    color: #4e5969;
  }
  .message-title {
    display: flex;
    align-items: center;
    margin: 88rpx 0 30rpx 40rpx;

    .main-line {
      margin-right: 16rpx;
      width: 8rpx;
      height: 32rpx;
      border-radius: 16rpx;
      background: #e51600;
    }
  }
  .redeemed {
    position: relative;
    background: #ffffff;
    padding: 0 30rpx;
  }

  .content-item {
    background-color: #f2f3f5;
    width: 690rpx;
    height: 164rpx;
    border-radius: 24rpx;
    padding: 32rpx;
    margin-bottom: 30rpx;
    .time-text {
      margin-top: 24rpx;
    }

    .exercise-button {
      width: 96rpx;
      height: 48rpx;
      border-radius: 56rpx;
      color: #ffffff;
      background: #e51600;
    }
  }
  .disable-btn {
    background-color: #f7b2aa;
  }
  .noCard {
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translate(-50%);
    text-align: center;
    image {
      width: 324rpx;
      height: 316rpx;
    }
    p {
      margin-top: -40rpx;
    }
  }
  .img-icon {
    width: 256rpx;
    height: 220rpx;
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
</style>
