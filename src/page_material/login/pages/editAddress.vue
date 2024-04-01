<!--
* @desc 编辑收货地址
* @author 江玉龙
* @date 2023年02月03日
-->
<template>
  <EditInfo
    :info="addressInfo"
    :isEdit="true"
    @handleSwitch="handleSwitch"
    @handleCity="handleCity"
  />
</template>
<script>
  import { getAddressDetail } from '@/api/modules/user/setUp.ts';
  import EditInfo from '../comps/EditInfo.vue';
  export default {
    name: 'editAddress',
    components: {
      EditInfo,
    },
    onLoad(option) {
      this.getAddressDetail(option.id);
    },
    data() {
      return { addressInfo: {} };
    },
    methods: {
      async getAddressDetail(id) {
        const res = await getAddressDetail({ id });
        this.addressInfo = res.body;
      },
      handleSwitch(info) {
        this.addressInfo = info;
      },
      handleCity(info) {
        this.addressInfo = info;
      },
    },
  };
</script>
