<!--
* @desc 地址管理
* @author 江玉龙
* @date 2023年02月02日
-->
<template>
  <view class="common-bg">
    <view
      v-for="(item, key) in addressList"
      :key="key"
      class="address-box"
      @tap="isRadio ? handleTap(key) : ''"
    >
      <view class="flex-item">
        <view class="flex-item-center flex-wrap">
          <view class="text-size-xl common-text-600 name-text">{{ item.name }}</view>
          <view class="text-size-xl common-text-600">{{ item.mobile }}</view>
        </view>
        <view v-show="radio == key" class="t-icon t-icon-Followed icon-style" />
      </view>
      <view class="address-text">{{
        item.province + item.city + item.area + item.addressDetails
      }}</view>
      <view class="flex-item">
        <view class="flex-center" @tap.stop="handleChoose(item)">
          <view class="btn-radio" :class="item.prime == 1 ? 't-icon t-icon-xuanze' : ''" />
          <view class="text-size-sn common-text-400 common-tip">{{
            item.prime == 1 ? '默认地址' : '设为默认'
          }}</view>
        </view>
        <view
          class="text-size-sn common-text-400 common-tip"
          @tap="commonFun.routeTo(`/page_material/login/pages/editAddress?id=${item.id}`)"
          >编辑</view
        >
      </view>
    </view>
    <view style="height: 180rpx;" />
    <view class="bottom-address">
      <view
        class="add-btn flex-center"
        @tap="commonFun.routeTo(`/page_material/login/pages/addAddress`)"
        >新增收货地址
      </view>
    </view>
    <view class="noCard" v-if="addressList.length == 0">
      <image src="@/page_material/static/address.png" mode="scaleToFill" />
      <p class="text-size-sn common-text-400 common-tip">暂无收货地址</p>
    </view>
  </view>
</template>
<script>
  import { getAddressList, editAddress } from '@/api/modules/user/setUp.ts';
  export default {
    name: 'addressManage',
    onLoad(option) {
      if (option.isRadio == 'true') {
        this.isRadio = true;
      } else {
        this.isRadio = false;
      }
    },
    onShow() {
      this.getAddressList();
    },
    data() {
      return {
        addressList: [],
        radio: -1, // 选中的项
        isRadio: false,
      };
    },
    computed: {
      uid() {
        return this.$store.getters.getUid;
      },
    },
    methods: {
      // 获取地址列表
      async getAddressList() {
        const res = await getAddressList({ stuUid: this.uid });
        this.addressList = res.body;
      },
      // 选择项
      handleTap(key) {
        this.radio = key;
        uni.setStorageSync('radio', this.radio);
      },
      // 设置默认
      async handleChoose(item) {
        await editAddress({ ...item, prime: item.prime == 0 ? 1 : 0 });
        this.getAddressList();
      },
    },
  };
</script>
<style lang="scss" scoped>
  .common-bg {
    padding-top: 32rpx;
  }
  .address-box {
    width: 662rpx;
    min-height: 194rpx;
    border-radius: 24rpx;
    background: #ffffff;
    margin: 0 auto 30rpx auto;
    padding: 40rpx 24rpx;
    .name-text {
      margin-right: 24rpx;
    }
    .flex-wrap {
      min-height: 48rpx;
    }
    .icon-style {
      width: 48rpx;
      height: 48rpx;
    }
    .address-text {
      font-size: 28rpx;
      font-weight: 400;
      margin-top: 16rpx;
      margin-bottom: 48rpx;
    }
    .btn-radio {
      width: 40rpx;
      height: 40rpx;
      border: 2rpx solid #ecedf1;
      border-radius: 50%;
      margin-right: 16rpx;
    }
  }
  .bottom-address {
    position: fixed;
    bottom: 0;
    width: 750rpx;
    height: 148rpx;
    background: #ffffff;
    padding-top: 32rpx;
  }
  .add-btn {
    width: 654rpx;
    height: 96rpx;
    border-radius: 24rpx;
    background: #475ffd;
    color: #ffffff;
    margin: 0 auto;
    font-weight: 600;
  }
  .noCard {
    position: absolute;
    top: 31%;
    left: 50%;
    transform: translate(-50%);
    text-align: center;
    image {
      width: 324rpx;
      height: 316rpx;
    }
  }
</style>
