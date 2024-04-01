<!--
* @desc 底部弹窗组件
* @author 江玉龙
* @date 2022年05月05日
-->
<template>
  <view @click.stop @touchmove.prevent.stop :style="{ '--color': backgroundColor }">
    <view class="cover-box" v-if="showCover" @tap="cancel" />
    <view class="modal-box" v-if="showCover" :class="!closeOne ? 'open' : 'close'">
      <slot name="head"></slot>
      <slot name="body"></slot>
      <view class="foot-box" v-if="showFoot" @tap="cancel">取消</view>
    </view>
  </view>
</template>
<script>
  export default {
    name: 'bottomModal',
    props: {
      showFoot: {
        type: Boolean,
        default: false,
      },
      backgroundColor: {
        type: String,
        default: '#ffffff',
      },
    },
    data() {
      return {
        showCover: false, // 弹窗条件判断
        closeOne: false, // 动画条件判断
      };
    },
    methods: {
      // 底部弹窗关闭
      cancel() {
        this.closeOne = true;
        setTimeout(() => {
          this.showCover = false;
          this.closeOne = false;
        }, 400);
      },
    },
  };
</script>
<style lang="scss" scoped>
  $color: var(--color);
  .cover-box {
    background-color: #000000;
    opacity: 0.2;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
  }
  .modal-box {
    border-radius: 40rpx 40rpx 0 0;
    background-color: $color;
    padding: 24rpx 0 64rpx 0;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100vw;
    z-index: 999;
  }

  .close {
    animation: close 0.5s 1;
  }
  @keyframes close {
    from {
      bottom: 0;
    }
    to {
      bottom: -400px;
    }
  }
  .open {
    animation: open 0.4s 1;
  }
  @keyframes open {
    from {
      bottom: -400px;
    }
    to {
      bottom: 0rpx;
    }
  }
  .foot-box {
    border-top: 20rpx solid #f5f6fa;
    text-align: center;
    padding-top: 32rpx;
    padding-bottom: 14rpx;
    font-weight: 400;
    font-size: 32rpx;
    color: #323949;
  }
</style>
