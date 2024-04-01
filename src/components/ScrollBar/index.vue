<!-- 滚动条 -->
<template>
  <view class="scrollBar">
    <view class="content" :style="'color:' + color + ';height:' + height">
      <view v-for="(item, index) in list" :key="index">
        <view
          v-if="showIndex == index"
          class="swiper-item"
          :style="'line-height:' + height + ';font-size:' + fontSize"
        >
          {{ item }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    props: {
      borderColor: {
        type: String,
        default: '',
      },
      color: {
        type: String,
        default: '#A6ACC7',
      },
      backgroundColor: {
        type: String,
        default: '',
      },
      list: {
        type: Array,
        default: () => ['每天练习，及时了解学习情况'],
      },
      height: {
        type: String,
        default: '20rpx',
      },
      fontSize: {
        type: String,
        default: '24rpx',
      },
    },
    data() {
      return {
        showIndex: 0, //当前展示的轮播
        timer: {},
      };
    },
    // beforeDestroy() {
    // 	clearInterval(this.timer);
    // },
    mounted() {
      // this.timer = setInterval(() => {
      // 	this.showIndex = this.showIndex == (this.list.length - 1) ? 0 : ++this.showIndex;
      // }, 6000)
    },
  };
</script>

<style lang="scss" scoped>
  .scrollBar {
    display: flex;
    justify-content: center;
    width: 350rpx;

    .content {
      width: 100%;
      box-sizing: border-box;
      position: relative;
      display: flex;
      justify-content: center;
      overflow: hidden;

      .swiper-item {
        width: 90%;
        height: 100%;
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation: animation-key 3s linear 0s 1 normal;
      }
    }

    @keyframes animation-key {
      0% {
        top: 100%;
      }
      10% {
        top: 50%;
      }
      80% {
        top: 50%;
      }
      100% {
        top: -50%;
      }
    }
  }
</style>
