<template>
  <view class="empty-box">
    <view style="display:flex;justify-content:center">
      <img class="empty-img" src="https://acc.wangxiao.cn/image/dpzx/empy-info.png" />
    </view>
    <view class="empty-text">{{ text }}</view>
  </view>
</template>

<script>
  export default {
    name: 'EmptyInfo',
    props: {
      text: {
        type: String,
        default: '',
      },
    },
  };
</script>

<style lang="scss" scoped>
  .empty-box {
    height: 578rpx;
    width: 100%;
  }
  .empty-img {
    width: 344rpx;
    height: 344rpx;
    margin-top: 228rpx;
  }
  .empty-text {
    text-align: center;
    color: #c9cdd4;
  }
</style>
