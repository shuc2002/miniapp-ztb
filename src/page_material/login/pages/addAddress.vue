<!--
* @desc 新增收货地址
* @author 江玉龙
* @date 2023年02月03日
-->
<template>
  <EditInfo
    :info="addressInfo"
    :isEdit="false"
    :isReFill="false"
    @handleSwitch="handleSwitch"
    @handleCity="handleCity"
  />
</template>
<script>
  import EditInfo from '../comps/EditInfo.vue';
  export default {
    name: 'addAddress',
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
      };
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
