<!--
* @desc 跳转h5
* @author 江玉龙
* @date 2022年06月22日
-->
<template>
  <view>
    <web-view :src="formatUrl" allow="fullscreen" />
    <WxShare
      ref="WxShare"
      title="浏览器打开可下载讲义到本地"
      subTitle="点击屏幕右上角选择在浏览器中打开"
    />
  </view>
</template>
<script>
  import Base64 from 'base-64';
  import { getUnitList } from '@/api/modules/question/exam.ts';
  import { handerLiveHeart } from '@/api/modules/course/index.ts';
  import { clientUrl } from '@/api/config/index';
  import WxShare from '@/components/WxShare/WxShare.vue';
  export default {
    name: 'skipTo',
    components: {
      WxShare,
    },
    onShow() {
      console.log('111---');
      this.initData(this.options);
    },
    onLoad(options) {
      console.log(options, 'options---');
      this.options = options;
      this.initData(options);
    },
    onHide() {
      clearInterval(this.timeD);
    },
    onUnload() {
      clearInterval(this.timeD);
    },
    computed: {
      token() {
        return this.$store.getters.getToken;
      },
      formatUrl() {
        return this.address.replaceAll(/"/g, '');
      },
      channelId() {
        return this.$store.getters.getChannelId;
      },
    },

    mounted() {
      /* #ifdef H5 */
      window.addEventListener('message', this.receiveMessage, false);
      /* #endif */
    },
    data() {
      return {
        address: '',
        pdf: '',
        lastPoint: '',
        timeD: 'null',
        options: {},
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
        let clientOrigin = '';
        /* #ifdef H5 */
        clientOrigin = window.location.origin;
        this.address = `${clientUrl}/h5/#/webVideo/?vid=${videoId}&vc=${vc}&token=${
          this.token
        }&code=${code}&lastPoint=${this.lastPoint}&pdf=${this.pdf}&channelId=${
          this.channelId
        }&clientOrigin=${clientOrigin}&platform=${uni.getSystemInfoSync().uniPlatform}`;
        /* #endif */
        /* #ifndef H5 */
        this.address = `${clientUrl}/h5/#/?vid=${videoId}&vc=${vc}&token=${
          this.token
        }&code=${code}&lastPoint=${this.lastPoint}&pdf=${this.pdf}&channelId=${
          this.channelId
        }&clientOrigin=${clientOrigin}&platform=${uni.getSystemInfoSync().uniPlatform}`;
        /* #endif */
      },
      // 试看视频
      testVideo(unit, product, vid, commodityId, pdf, downloadable, handouts) {
        let clientOrigin = '';
        /* #ifdef H5 */
        clientOrigin = window.location.origin;
        /* #endif */
        const vc = Base64.encode(JSON.stringify({ token: this.token, unit, product }));
        this.address = `${clientUrl}/h5/#/videoFree?vid=${vid}&vc=${vc}&token=${
          this.token
        }&commodity=${commodityId}&handouts=${handouts}&downloadable=${downloadable}&pdf=${pdf}&channelId=${
          this.channelId
        }&clientOrigin=${clientOrigin}&platform=${uni.getSystemInfoSync().uniPlatform}`;
      },
      // 观看直播
      goBroadcast(indexUrl) {
        this.address = decodeURIComponent(indexUrl);
      },
      // 从消息通知进来观看直播
      goBroadcastUnjson(indexUrl) {
        this.address = decodeURIComponent(indexUrl);
      },
      // 补0
      addZero(val) {
        if (val < 10) {
          val = `0${val}`;
        }
        return val;
      },
      // 格式化时间
      formateTime(timer) {
        let year = timer.getFullYear();
        let month = this.addZero(timer.getMonth() + 1);
        let day = this.addZero(timer.getDate());
        let hour = this.addZero(timer.getHours());
        let minutes = this.addZero(timer.getMinutes());
        let seconds = this.addZero(timer.getSeconds());
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
      },
      // 直播心跳
      async heartdeat(code, roomId, startTime, endTime) {
        const data = {
          code: code,
          roomId: roomId,
          startTime: startTime,
          endTime: endTime,
          player: 0,
        };
        const res = await handerLiveHeart(data);
        console.log(res);
      },
      // 打开遮罩
      receiveMessage(e) {
        console.log('lail---0009', e);
        this.$refs.WxShare.showModal = true;
      },
      initData(options) {
        console.log(options, 'options');
        // return;
        let clientOrigin = '';
        /* #ifdef H5 */
        clientOrigin = window.location.origin;
        /* #endif */
        // return;
        if (options.src) {
          this.address = `${clientUrl}/h5/#/pdf?pdf=${options.src}&channelId=${
            this.channelId
          }&code=${options.code}&limit=${options.limit}&clientOrigin=${clientOrigin}&platform=${
            uni.getSystemInfoSync().uniPlatform
          }`;
        } else if (options.indexUrl) {
          // 在进入直播之前，开启心跳定时器
          if (options.code) {
            this.timeD = setInterval(() => {
              let startTime = new Date();
              startTime = new Date(startTime.setMinutes(startTime.getMinutes() - 5));
              startTime = this.formateTime(startTime);
              let endTime = new Date();
              endTime = this.formateTime(endTime);
              this.heartdeat(options.code, options.roomId, startTime, endTime);
            }, 5 * 60 * 1000);
          }
          if (options.unJson) {
            this.goBroadcastUnjson(options.indexUrl);
          } else {
            this.goBroadcast(options.indexUrl);
          }
        } else if (options.isTest == 'true') {
          this.testVideo(
            options.unit,
            options.productId,
            options.vid,
            options.commodityId,
            options.pdf,
            options.downloadable,
            options.handouts
          );
        } else {
          if (options.code) {
            this.getUnitList(options.unit, options.productId, options.code);
          }
        }
      },
    },
  };
</script>
