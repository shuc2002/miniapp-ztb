<!--
* @desc 证书考试列表
-->
<template>
  <view class="certificate-exam">
    <view class="mt-32" v-for="(item, index) in tabData" :key="index">
      <examItem :examItem="item" />
    </view>
  </view>
</template>
<script>
  import examItem from '../comps/examItem.vue';
  import { fetchCertificateExam } from '@/api/modules/certificate/index';
  export default {
    name: 'certificate-exam',
    components: { examItem },
    data() {
      return {
        tabData: [],
      };
    },
    onLoad(options) {
      this.getCertificateExam(options.id);
    },
    methods: {
      async getCertificateExam(certificateId) {
        let res = await fetchCertificateExam({ certificateId });
        // res.body = [
        //   {
        //     certificateId: '',
        //     examId: '',
        //     code: '',
        //     productId: '',
        //     examName: '',
        //     score: '',
        //     isPassedExam: '',
        //   },
        // ];
        this.tabData = res.body;
        // console.log(certificateId);
      },
    },
  };
</script>
<style lang="scss" scoped>
  .certificate-exam {
    overflow-y: auto;
    padding: 0 24rpx 30rpx;
  }
  .mt-32 {
    margin-top: 32rpx;
  }
</style>
