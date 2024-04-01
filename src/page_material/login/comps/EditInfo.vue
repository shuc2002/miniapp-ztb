<!--
* @desc 地址信息组件
* @author 江玉龙
* @date 2023年02月02日
-->
<template>
  <view class="common-bg">
    <view class="info-box">
      <view class="flex-item-center form-item">
        <view class="form-name">收货人</view>
        <input placeholder="姓名" maxlength="15" v-model="info.name" class="input-name" />
      </view>
      <view class="flex-item-center form-item">
        <view class="form-name">手机号码</view>
        <input placeholder="手机号码" maxlength="11" v-model="info.mobile" class="input-name" />
      </view>
      <view class="flex-item-center form-item">
        <view class="form-name">所在地区</view>
        <view class="flex-item-center" @tap="openRegion">
          <view v-if="info.province" class="input-address">{{
            info.province + info.city + info.area
          }}</view>
          <input placeholder="选择省、市、区" class="input-address" disabled v-else />
          <view class="t-icon t-icon-chevron-right icon-style" />
        </view>
      </view>
      <view class="flex-item-center form-item">
        <view class="form-name">详细地址</view>
        <textarea
          placeholder="小区，门牌号等"
          maxlength="100"
          :auto-height="true"
          v-model="info.addressDetails"
          class="input-detail"
        ></textarea>
      </view>
    </view>
    <view class="default-address flex-item">
      <view>设置为默认地址</view>
      <view
        class="switch"
        :class="info.prime == 1 ? 'switch-open' : 'switch-close'"
        @tap="handleSwitch()"
      >
        <view class="circular" />
      </view>
    </view>
    <view class="button-box">
      <view class="save-btn flex-center" @tap="handleSave">保存地址 </view>
      <view class="delete-btn flex-center" v-if="isEdit" @tap="handleDelete">删除地址 </view>
    </view>
    <regionWindow ref="region" @finish="finish" />
  </view>
</template>
<script>
  import {
    addAddress,
    editAddress,
    deleteAddress,
    reFillAddress,
  } from '@/api/modules/user/setUp.ts';
  import regionWindow from './RegionWindow.vue';
  export default {
    name: 'EditInfo',
    components: {
      regionWindow,
    },
    props: {
      isEdit: {
        type: Boolean,
        default: false,
      },
      info: {
        type: Object,
      },
      isReFill: {
        type: Boolean,
        default: false,
      },
      orderId: {
        type: String,
        default: '',
      },
    },
    computed: {
      uid() {
        return this.$store.getters.getUid;
      },
    },
    data() {
      return {
        reg: /^1[3-9]\d{9}$/, // 正则验证手机号
      };
    },
    methods: {
      // 是否默认地址
      handleSwitch() {
        if (this.info.prime == 1) {
          this.info.prime = 0;
        } else {
          this.info.prime = 1;
        }
        this.$emit('handleSwitch', this.info);
      },
      // 打开地址选择
      openRegion() {
        this.$refs.region.open();
      },
      // 地址数据
      finish(province, city, district) {
        this.info.province = province.name;
        this.info.city = city.name;
        this.info.area = district.name;
        this.$emit('handleCity', this.info);
      },
      // 保存地址
      async handleSave() {
        if (this.reg.test(this.info.mobile)) {
          if (this.isEdit) {
            await editAddress({ ...this.info });
          } else if (this?.isReFill) {
            const res = await addAddress({
              ...this.info,
              stuUid: this.uid,
            });
            console.log(res.body);
            await reFillAddress({
              orderId: this.orderId,
              addressId: res.body,
            });
          } else {
            await addAddress({
              ...this.info,
              stuUid: this.uid,
            });
          }
          uni.navigateBack();
        } else {
          uni.showToast({
            title: '请输入正确的手机号',
            icon: 'none',
          });
        }
      },
      // 删除地址
      async handleDelete() {
        await deleteAddress({ id: this.info.id });
        uni.navigateBack();
      },
    },
  };
</script>
<style lang="scss" scoped>
  .common-bg {
    padding-top: 32rpx;
  }
  .info-box {
    width: 646rpx;
    border-radius: 24rpx;
    margin: auto;
    padding: 0 32rpx;
    background: #ffffff;
    .form-item {
      padding: 32rpx 0;
      border-bottom: 2rpx solid #f5f6fa;
      .input-name {
        width: 438rpx;
        height: 44rpx;
      }
      .input-address {
        width: 422rpx;
        min-height: 44rpx;
      }
      .input-detail {
        width: 438rpx;
        margin-right: 32rpx;
      }
      .icon-style {
        width: 40rpx;
        height: 40rpx;
      }
    }
    .form-name {
      width: 144rpx;
      color: #323949;
      font-weight: 400;
      margin-right: 32rpx;
    }
  }
  .default-address {
    width: 662rpx;
    height: 48rpx;
    border-radius: 24rpx;
    background: #ffffff;
    margin: 32rpx auto;
    padding: 32rpx 24rpx;
    .switch {
      width: 80rpx;
      height: 48rpx;
      border-radius: 32rpx;
      .circular {
        width: 36rpx;
        height: 36rpx;
        border-radius: 32rpx;
        background-color: #ffffff;
        margin: 0 6rpx;
      }
    }
    .switch-open {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      background-color: #475ffd;
      transition: all 0.5s linear 0s;
    }
    .switch-close {
      display: flex;
      align-items: center;
      background-color: #ecedf1;
      transition: all 0.5s linear 0s;
    }
  }
  .button-box {
    position: fixed;
    bottom: 100rpx;
    left: 50%;
    transform: translateX(-50%);
    .save-btn {
      width: 654rpx;
      height: 96rpx;
      border-radius: 24rpx;
      background: #475ffd;
      color: #ffffff;
      margin: 0 auto;
      font-weight: 600;
    }
    .delete-btn {
      width: 654rpx;
      height: 96rpx;
      border-radius: 24rpx;
      background: #ffffff;
      color: #5b648d;
      margin: 32rpx auto;
      font-weight: 600;
    }
  }
</style>
