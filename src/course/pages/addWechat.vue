<template>
  <div>
    <!-- <canvas id="canvas" style="width:300px;height:300px;" canvas-id="canvas1"></canvas> -->
    <div class="wx-bg-wrap">
      <img src="./images/add-wx-bg.png" class="qrcode-bg" />
    </div>
    <img src="./images/qrcode.png" class="qrcode-content" />
  </div>
</template>

<script>
  import QRCode from 'qrcode';

  export default {
    // components: { QRCode },
    data() {
      return {
        url: 'https://www.baidu.com',
        imgUrl: '',
      };
    },
    mounted() {
      // this.getCode();
      // this.generateQR();
    },
    methods: {
      async generateQR() {
        try {
          this.imgUrl = await QRCode.toDataURL(this.url);
        } catch (err) {
          console.error(err);
        }
      },
      getCode() {
        let canvas = document.getElementById('canvas');
        QRCode.toCanvas(canvas, this.url, { width: 300 }, function(error) {
          if (error) console.error(error);
          console.log('success!');
        });
      },
    },
  };
</script>
<style lang="scss" scoped>
  .wx-bg-wrap {
    display: flex;
    justify-content: center;
    position: relative;
  }
  .qrcode-bg {
    width: 650rpx;
    height: 820rpx;
  }
  .qrcode-content {
    width: 300px;
    height: 300px;
    position: absolute;
    top: 50px;
    left: 40px;
  }
</style>