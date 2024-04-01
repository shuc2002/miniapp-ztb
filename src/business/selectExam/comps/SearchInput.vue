<template>
  <view class="flex-center">
    <view class="exam-input" :class="isSearch ? 'open-input' : 'close-input'">
      <input
        v-model="inputValue"
        placeholder="请输入考试名称"
        class="common-text-400 text-size-sn common-tip"
      />
      <view class="t-icon t-icon-uil_search" @tap="handleSearch" />
    </view>
    <view
      v-if="isSearch"
      @tap="closeSearch"
      class="common-text-400 text-size-sn common-tip cancel-btn"
      >取消</view
    >
  </view>
</template>

<script>
  export default {
    props: {
      isSearch: { type: Boolean, default: () => false },
    },
    data() {
      return {
        inputValue: '',
      };
    },
    methods: {
      handleSearch() {
        this.$emit('handleSearch', this.inputValue);
      },
      closeSearch() {
        this.$emit('uploadSearch', false);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .exam-input {
    margin: 0 40rpx;
    padding: 0 48rpx;
    height: 80rpx;
    border-radius: 40rpx;
    background: #f5f6fa;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .close-input {
    width: calc(100vw - 168rpx);
  }
  .open-input {
    flex: 1;
  }
  .cancel-btn {
    margin-right: 32rpx;
  }
</style>
