<template>
  <view class="question-box" id="question">
    <view
      class="question-msg"
      @tap="
        queCommodity.isBought
          ? commonFun.routeTo(`/page_commodity/courseList/index?id=${queCommodity.id}&isOrder=true`)
          : toProduct(queCommodity.id)
      "
      v-if="queCommodity.name"
    >
      <image
        class="isBought-status"
        v-show="queCommodity.isBought"
        src="@/static/img/home/isBought.png"
        mode="scaleToFill"
      />
      <view class="flex">
        <image src="@/static/img/home/question.png" mode="scaleToFill" />
        <view>
          <p class="text-size-main common-text common-text-700 text-width-name">{{
            queCommodity.name
          }}</p>
          <view class="question-value-box text-size-xxs text-nowarp" v-if="!system"
            >价值￥{{ queCommodity.price }}</view
          >
          <p class="common-tip text-size-xxs text-nowarp visibility" v-if="queCommodity.resourceNum"
            >题数：{{ queCommodity.resourceNum }}题</p
          >
        </view>
      </view>
      <view class="t-icon t-icon-chevron-right analysis-icon" />
    </view>
    <view class="question-set flex-center">
      <view
        class="question-set-item flex-center"
        @tap="commonFun.routeTo('/business/myRecords/index?activeNum=0')"
      >
        <view class="t-icon t-icon-wrong" />
        <p class="text-size-xxs common-message">错题集</p>
      </view>
      <view
        class="question-set-item flex-center"
        @tap="commonFun.routeTo('/business/myRecords/index?activeNum=1')"
      >
        <view class="t-icon t-icon-Favorites" />
        <p class="text-size-xxs common-message">收藏夹</p>
      </view>

      <view
        v-if="queCommodity.isExam"
        class="question-set-item flex-center"
        @tap="
          commonFun.routeTo(
            `/page_mockExam/paperList/index?id=${queCommodity.id}&isBought=${queCommodity.isBought}`
          )
        "
      >
        <view class="t-icon t-icon-Test" />
        <p class="text-size-xxs common-message">模拟考场</p>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'DailyPractice',
    components: {},
    props: {
      queCommodity: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        userInfo: {
          avatarUrl: '../../static/img/mine/default-Avatar.png',
          nickName: '普通用户',
        },
      };
    },
    computed: {
      token() {
        return this.$store.getters.getToken;
      },
      system() {
        return this.$store.getters.getSystem;
      },
    },
    onShow() {
      this.userInfo = JSON.parse(uni.getStorageSync('userInfo'));
    },
    methods: {
      //去商品页面
      toProduct(id) {
        uni.navigateTo({
          url: `/page_commodity/commodity/pages/commodityBank?id=${id}`,
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .question-box {
    background-color: #ffffff;
    width: calc(100% - 64rpx);
    position: relative;
    margin-top: 32rpx;
    border-radius: 24rpx;
    padding: 54rpx 32rpx 32rpx 32rpx;
    min-height: 125rpx;

    .question-msg {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24rpx;
      image {
        margin-right: 25rpx;
        width: 120rpx;
        height: 120rpx;
        flex-shrink: 0;
      }
      .isBought-status {
        position: absolute;
        width: 148rpx;
        height: 48rpx;
        top: 0;
        right: 0;
        margin: 0;
      }

      .question-value-box {
        display: inline-block;
        text-align: center;
        padding: 0 10rpx;
        min-width: 100rpx;
        height: 40rpx;
        line-height: 40rpx;
        border-radius: 8rpx;
        color: #ffffff;
        background: linear-gradient(140.2deg, #ff8058 0%, #ff6969 100%);
        margin: 8rpx 0;
      }
      .text-width-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 440rpx;
        margin-top: 10rpx;
      }
    }
    .question-set {
      width: 100%;
      height: 140rpx;
      border-radius: 16rpx;
      background: #f5f6fa;
      .question-set-item {
        width: 50%;
        flex-flow: column;
        position: relative;
        &::after {
          content: '';
          position: absolute;
          right: 0;
          background-color: #dae2ff;
          width: 4rpx;
          height: 60rpx;
          border-radius: 16rpx;
        }
        &:last-child::after {
          content: none;
        }
        .t-icon {
          width: 43rpx;
          height: 43rpx;
          margin-bottom: 12rpx;
        }
      }
    }
  }
</style>
