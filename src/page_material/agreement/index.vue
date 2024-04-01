<template>
  <view>
    <view class="page-box">
      <u-tabs-swiper
        ref="tabs"
        :current="current"
        active-color="#E51600"
        inactive-color="#9FA1A4"
        :height="96"
        bar-height="8"
        @change="onChange"
        :list="tabs"
        :is-scroll="false"
      ></u-tabs-swiper>
      <view class="list-item-box" v-if="listData.length > 0">
        <view v-for="(item, index) in listData" :key="index">
          <ListItem :data="item" />
        </view>
      </view>
      <view class="empty-box" v-else>
        <EmptyAgree />
      </view>
      <button class="sign-btn" v-if="listData.length > 0 && current == 0" @tap="signAll">
        一键签署
      </button>
      <view style="height:10rpx;width:100%"></view>
    </view>
  </view>
</template>

<script>
  import { getAgreementList } from '@/api/modules/agreement/index';
  import ListItem from './comps/ListItem.vue';
  import EmptyAgree from './comps/EmptyAgree.vue';
  export default {
    name: 'agreement',
    components: {
      EmptyAgree,
      ListItem,
    },
    data() {
      return {
        isShow: false,
        projectInfo: {},
        list: [],
        current: 0,
        tabs: [
          {
            name: '未签署',
          },
          {
            name: '已签署',
          },
        ],
        listData: [],
      };
    },
    onLoad() {
      this.getList();
    },
    // 转发页面
    async onShareAppMessage() {
      return {
        path: '/pages/page_material/agreement/index ',
      };
    },
    methods: {
      onChange(index) {
        this.current = index;
        this.getList();
      },
      async getList() {
        const res = await getAgreementList({ status: this.current });
        this.listData = res.body;
      },
      signAll() {
        const ids = [];
        this.listData.map((item) => {
          ids.push(item.id);
        });
        uni.navigateTo({
          url: `/page_protocol/signAgreement/index?orderContractId=${ids.toString()}&isOrder=true`,
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .page-box {
    position: relative;
    min-height: 100vh;
    background-color: #f6f6f6;
  }
  .sign-btn {
    width: 590rpx;
    height: 96rpx;
    // padding: 20rpx 24rpx;
    border-radius: 72rpx;
    background: var(--brand-17, #e51600);
    color: #ffffff;
    font-size: 32rpx;
    font-weight: 600;
    line-height: 96rpx;
    position: fixed;
    bottom: 46rpx;
    left: 80rpx;
  }
</style>
