<!--
* @desc 补填收货地址
* @author lwx
* @date 2023年02月03日
-->
<template>
  <EditInfo
    :info="addressInfo"
    :isEdit="false"
    :isReFill="true"
    :orderId="orderId"
    @handleSwitch="handleSwitch"
    @handleCity="handleCity"
  />
</template>
<script>
  import EditInfo from '../comps/EditInfo.vue';
  export default {
    name: 'reFillAddress',
    components: {
      EditInfo,
    },
    data() {
      return {
        addressInfo: {
          name: '', // 收货人名称
          mobile: '', // 手机号
          province: '', // 省
          city: '', // 市
          area: '', // 区
          addressDetails: '', // 详情地址
          prime: 0, // 是否默认收货地址（0-否，1-是）
        },
        orderId: '', // 订单id
      };
    },
    onLoad(option) {
      this.orderId = option.orderId;
    },
    methods: {
      handleSwitch(info) {
        this.addressInfo = info;
      },
      handleCity(info) {
        this.addressInfo = info;
      },
    },
  };
</script>
