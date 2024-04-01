<template>
  <view class="sign-content" v-if="showModal" @tap.stop="cancel()">
    <view class="integral-sign">
      <p class="text-size-xl common-text-700 common-text sign-box">签到成功</p>
      <p class="text-size-main common-text-400 common-text"
        >已连续签到{{ data.continuousDay }}天，明天签到赚{{
          data.cycle[data.continuousDay].integration
            ? data.cycle[data.continuousDay].integration
            : 20
        }}积分</p
      >
      <view class="sign-day">
        <view class="day-item" v-for="(item, key) in data.cycle" :key="key">
          <p
            class="text-size-xxs common-text-700"
            :class="
              item.isFinished
                ? 'common-tip'
                : item.integration == 20
                ? 'common-brown'
                : item.day == 7
                ? 'common-brown'
                : 'common-price'
            "
            >{{ item.day == 7 ? '礼盒' : '+' + item.integration }}</p
          >
          <image
            src="@/home/static/img/shop/integral0.png"
            class="icon-integral"
            v-if="item.day !== 7 && item.isFinished"
          />
          <image
            src="@/home/static/img/shop/integral.png"
            class="icon-integral"
            v-if="item.integration == 20 && !item.isFinished"
          />
          <image
            src="@/home/static/img/shop/integral2.png"
            class="icon-integral"
            v-if="item.integration == 40 && !item.isFinished"
          />
          <image
            src="@/home/static/img/shop/integral3.png"
            class="icon-integral"
            v-if="item.integration == 60 && !item.isFinished"
          />
          <image src="@/home/static/img/shop/integral4.png" class="icon-integral" v-if="item.day == 7" />
          <p class="text-size-xxs common-text-400 common-text">第{{ item.day }}天</p>
        </view>
      </view>
      <button class="sign-btn flex-center" @tap.stop="cancel()">收下</button>
    </view>
  </view>
</template>
<script>
  export default {
    name: 'signInModal',
    props: {
      data: {
        type: Object,
      },
      num: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        showModal: false,
        list: [0, 1, 2, 3, 4, 5, 6],
      };
    },
    methods: {
      // 关闭弹窗
      cancel() {
        this.showModal = false;
      },
    },
  };
</script>
<style lang="scss" scoped>
  .sign-content {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99;
    .integral-sign {
      width: 622rpx;
      height: 802rpx;
      border-radius: 24rpx;
      background: linear-gradient(0deg, #ffffff 0%, #fffefc 72%, #fff2ba 100%);
      display: flex;
      flex-flow: column;
      align-items: center;
      .sign-box {
        margin-top: 64rpx;
        margin-bottom: 16rpx;
      }
      .sign-day {
        margin-top: 46rpx;
        margin-bottom: 32rpx;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        .day-item {
          width: 120rpx;
          height: 196rpx;
          border-radius: 16rpx;
          background: linear-gradient(180deg, #f5f6fa 0%, #ffffff 100%);
          display: flex;
          flex-flow: column;
          align-items: center;
          margin: 0 8rpx;
          padding-top: 16rpx;
          .icon-integral {
            margin: 16rpx 0;
            width: 60rpx;
            height: 60rpx;
          }
        }
      }
      .sign-btn {
        width: 526rpx;
        height: 88rpx;
        border-radius: 24rpx;
        color: #ffffff;
        background-color: #f0522f;
      }
    }
  }
</style>
