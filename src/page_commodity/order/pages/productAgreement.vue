<!--
* @desc 跳转h5
* @author 江玉龙
* @date 2022年06月22日
-->
<template>
  <view>
    <web-view :src="address" />
  </view>
</template>
<script>
  import Base64 from 'base-64';
  import { getUnitList } from '@/api/modules/question/exam.ts';
  import { baseUrl } from '@/api/config/index';
  export default {
    name: 'skipTo',
    onLoad(options) {
      if (options.src) {
        this.address = 'https://embryon-develop.wangxiao.cn/h5/#/pdf?pdf=' + options.src;
      } else if (options.indexUrl) {
        this.goBroadcast(options.indexUrl);
      } else if (options.isTest == 'true') {
        this.testVideo(
          options.unit,
          options.productId,
          options.vid,
          options.commodityId,
          options.pdf
        );
      } else {
        this.getUnitList(options.unit, options.productId, options.code);
      }
    },
    computed: {
      token() {
        return this.$store.getters.getToken;
      },
    },
    data() {
      return {
        address: '',
        pdf: '',
        lastPoint: '',
      };
    },
    methods: {
      // 获取视频的数据
      async getUnitList(unit, product, code) {
        const data = await getUnitList({ code });
        this.pdf = data.body.material;
        this.lastPoint = data.body.lastPoint;
        const videoId = data.body.videoId;
        const vc = Base64.encode(JSON.stringify({ token: this.token, unit, product }));
        this.address = `${baseUrl}/h5/#/?vid=${videoId}&vc=${vc}&token=${this.token}&code=${code}&lastPoint=${this.lastPoint}&pdf=${this.pdf}`;
      },
      // 试看视频
      testVideo(unit, product, vid, commodityId, pdf) {
        const vc = Base64.encode(JSON.stringify({ token: this.token, unit, product }));
        this.address = `${baseUrl}/h5/#/videoFree?vid=${vid}&vc=${vc}&token=${this.token}&commodity=${commodityId}&pdf=${pdf}`;
      },
      // 观看直播
      goBroadcast(indexUrl) {
        this.address = JSON.parse(decodeURIComponent(indexUrl));
      },
    },
  };
</script>
