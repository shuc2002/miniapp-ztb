<template>
  <view class="tab-box">
    <view class="tab-tr tab-header">
      <view
        v-for="(column, index) in columns"
        class="tab-td tab-td-header"
        :key="index"
        :style="{
          width: getWidth(column),
          borderRight: index === columns.length - 1 ? 'none' : '2rpx solid #ecedf1',
        }"
        >{{ column.name }}</view
      >
    </view>
    <view class="table-content">
      <view class="tab-tr" v-for="(item, index) in data" :key="index">
        <view
          class="tab-td"
          v-for="(column, index) in columns"
          :key="index"
          :style="{
            width: getWidth(column),
            borderRight: index === columns.length - 1 ? 'none' : '2rpx solid #f6f6f6',
          }"
          >{{ item[column.key] }}</view
        >
      </view>
    </view>
  </view>
</template>
<script>
  export default {
    name: 'tab-list',
    props: {
      columns: {
        type: Array,
      },
      data: {
        type: Array,
      },
    },
    data() {
      return {};
    },
    methods: {
      getWidth(column) {
        let w = (this.columns.length / 24) * 100 + '%';
        if (column.rowSpan) {
          w = (24 / this.columns.length / 24) * 100 + '%';
        }
        return w;
      },
    },
  };
</script>
<style lang="scss" scoped>
  .tab-box {
    width: 100%;
    // border: 2rpx solid #f6f6f6;
  }
  .tab-tr {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    text-align: center;
  }

  .tab-header {
    background: #f6f6f6;
    height: 80rpx;
    font-weight: 600;
  }
  .tab-td {
    padding: 16rpx;
    flex: 1;
    border-right: 2rpx solid #f6f6f6;
    border-bottom: 2rpx solid #f6f6f6;
    display: flex;
    text-align: center;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .tab-td-header {
    background: #f6f6f6;
    border-right: 2rpx solid #ecedf1;
    border-bottom: 2rpx solid #ffffff;
  }
</style>
