<template>
  <MovePopup
    title="title"
    v-model="showPopup"
    @change="movePopupChange"
    :showClose="true"
    :goodsdata="goodsdata"
    class="popbox"
  >
    <view>
      <view class="price-flex">
        <view>优惠卷</view>
        <view
          ><span>-50</span><view class="iconfont icon-more_large" @tap="navigateBack"></view
        ></view>
      </view>
      <view class="price-flex"> <view>商品金额</view><view>￥300</view> </view>
      <view class="price-flex"> <view>优惠金额</view><view>-￥300</view> </view>
      <view class="price-flex"> <view>优惠金额</view><view>-￥300</view> </view>
      <view class="price-flex">
        <view>学币扣除（当前可用300学币）</view><view>-270学币</view>
      </view>
      <view class="price-flex"> <view>合计</view><view>￥0</view> </view>
    </view>
    <button>确认支付48元</button>
  </MovePopup>
</template>
<script>
  import MovePopup from '@/components/MovePopup/move-popup.vue';
  export default {
    name: 'orderMovepop',
    components: {
      MovePopup,
    },
    props: {
      title: string,
      orderdata: {
        type: Number,
        default: 0,
      },
    },
    onLoad() {},
    computed: {
      nickName() {
        return this.$store.getters.getNickName;
      },
      avatar() {
        return this.$store.getters.getAvatar;
      },
    },
    data() {
      return {};
    },
    methods: {},
  };
</script>

<style lang="scss" scoped></style>
