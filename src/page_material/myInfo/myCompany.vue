<!--
* @desc 工作单位编辑
* @author 江玉龙
* @date 2022年07月07日
-->
<template>
  <view class="bg-color-white">
    <view class="exam-input">
      <input
        v-model="inputValue"
        placeholder="请输入单位名称"
        maxlength="20"
        class="common-text-400 text-size-sn common-text"
        @confirm="handleSearch"
      />
      <view class="input-icon_search" @tap="handleSearch">
        <view class="t-icon t-icon-uil_search" />
      </view>
    </view>
    <!-- 公司列表 start -->
    <scroll-view
      style="height: 100vh"
      scroll-y="true"
      @scrolltolower="handleToLower"
      scroll-with-animation
    >
      <view
        v-for="(item, index) in checkedNodes"
        :key="index"
        class="common-text-400 text-size-sn search-listItem flex-start"
        @tap="handleChoose(index)"
        ><view v-html="item"
      /></view>
      <!-- 公司列表 end -->
    </scroll-view>
  </view>
</template>

<script>
  import { editUserCompany, getEnterpriseList } from '@/api/modules/register/index.ts';
  export default {
    name: 'myCompany',
    computed: {
      nickName() {
        return this.$store.getters.getNickName;
      },
      avatar() {
        return this.$store.getters.getAvatar;
      },
    },
    data() {
      return {
        inputValue: '',
        list: [],
        checkedNodes: [], // 搜索到的值
        page: 0,
        ifMore: false,
        showBottom: false,
      };
    },
    onLoad() {
      this.getEnterpriseList();
    },
    methods: {
      // 获取企业列表
      async getEnterpriseList() {
        if (this.inputValue) {
          const res = await getEnterpriseList({ key: this.inputValue, index: this.page, row: 20 });
          if (this.page == 0) {
            this.list = res.body;
          } else if (this.page > 0) {
            this.list.push(...res.body);
          }
          if (res.body.length < 20) {
            this.ifMore = true;
          }
          this.getCheckedNodes(this.inputValue);
        }
      },
      // 搜索
      handleSearch() {
        this.checkedNodes = [];
        this.page = 0;
        this.ifMore = false;
        this.showBottom = false;
        this.getEnterpriseList();
      },
      // 选中项
      async handleChoose(index) {
        const res = await editUserCompany({
          org: this.list[index],
        });
        if (res.code === 1000) {
          this.$store.commit('setOrg', this.list[index]);
          uni.navigateBack();
        }
      },
      // 查找相符的项
      getCheckedNodes(value) {
        this.list.forEach((record) => {
          if (record.indexOf(value) != -1) {
            // 修改关键字样式
            record = record.replace(value, `<span style="color:#475FFD">${value}</span>`);
            this.checkedNodes.push(record);
          }
        });
      },
      // 触底加载更多
      handleToLower() {
        if (!this.showBottom) {
          uni.showLoading({
            title: '加载中',
            mask: true,
          });
          this.page++;
          this.getEnterpriseList();
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
  .bg-color-white {
    padding-top: 32rpx;
  }
  .exam-input {
    margin: 0 40rpx 32rpx 40rpx;
    padding: 0 48rpx;
    height: 80rpx;
    border-radius: 40rpx;
    background: #f5f6fa;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .bg-color-white .exam-input input {
    width: 280px;
    height: 43px;
  }
  .exam-input .input-icon_search {
    width: 43px;
    height: 43px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .search-listItem {
    height: 108rpx;
    padding: 0 88rpx;
  }
</style>
