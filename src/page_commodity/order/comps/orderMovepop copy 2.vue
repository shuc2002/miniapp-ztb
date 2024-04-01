<template>
  <MovePopup
    title="订单信息"
    v-model="showPopup"
    @change="movePopupChange"
    :showClose="true"
    :goodsdata="goodsdata"
    class="popbox"
    backgroundColor="#222"
  >
    <view>
      <view class="price-flex">
        <view>优惠卷</view>
        <view
          ><span>-50</span><view class="iconfont icon-more_large" @tap="navigateBack"></view
        ></view>
      </view>
      <view class="price-flex"> <view>商品金额</view><view>￥300</view></view>
      <view class="price-flex"> <view>优惠金额</view><view>-￥300</view></view>
      <view class="price-flex">
        <view>学币扣除（当前可用300学币）</view><view>-270学币</view>
      </view>
      <view class="price-flex"> <view>合计</view><view>￥48</view> </view>
    </view>
    <button class="buy-btn">确认支付48元</button>
  </MovePopup>
</template>
<script>
  import MovePopup from './MovePopup.vue';
  export default {
    name: 'orderMovepop',
    components: {
      MovePopup,
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
      return {
        color: '#000',
      };
    },
    methods: {},
  };
</script>

<style lang="scss" scoped></style>
