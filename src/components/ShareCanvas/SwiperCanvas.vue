<template>
  <view v-if="isShow" class="content" @click.stop="isShow = false">
    <swiper
      class="banner-container"
      :autoplay="false"
      circular="true"
      duration="1000"
      :current="swpiperNum"
      :style="{ height: canvasH + 'px' }"
      @change="swiperChange"
    >
      <swiper-item v-for="(item, index) in bgImg" :key="index" class="banner-item">
        <canvas
          :style="{ width: canvasW + 'px', height: canvasH + 'px' }"
          :canvas-id="'my-canvas' + index"
        ></canvas>
      </swiper-item>
    </swiper>
    <view class="save-btn" @click.stop="saveImage()"> 保存本地 </view>
  </view>
</template>

<script>
  export default {
    name: 'ShareCanvas',
    props: {
      bgImg: {
        type: Array,
        // #ifdef  MP-BAIDU
        // eslint-disable-next-line vue/require-valid-default-prop
        default: () => ['https://app.static.wangxiao.cn/ztb/poster.png'],
        //#endif
        // #ifndef  MP-BAIDU
        default: () => [
          'https://app.static.wangxiao.cn/ztb/poster.png',
          'https://app.static.wangxiao.cn/ztb/poster2.png',
          'https://app.static.wangxiao.cn/ztb/poster3.png',
        ],
        //#endif
      },
      adImg: {
        type: String,
        default: 'https://app.static.wangxiao.cn/ztb/group.png',
      },
      codeImg: {
        type: String,
        default: 'https://app.static.wangxiao.cn/ztb/resources/qrcode.png',
      },

      peopleNumber: {
        type: String,
        default: '6666',
      },
      dayNumber: {
        type: String,
        default: '95',
      },
      questionNumber: {
        type: String,
        default: '165',
      },
      timeNumber: {
        type: String,
        default: '859',
      },
    },
    data() {
      return {
        swpiperNum: 0,
        canvasW: 0,
        canvasH: 0,
        ctx: [],
        isShow: false,
        userName: '小小同学',
        userPhoto: 'https://app.static.wangxiao.cn/ztb/group.png',
      };
    },
    methods: {
      swiperChange(e) {
        this.swpiperNum = e.target.current;
      },
      //显示
      showCanvas() {
        uni.showLoading({
          title: '加载中...',
          mask: true,
        });
        let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
        this.userName = userInfo.nickName;
        this.userPhoto = userInfo.avatarUrl;
        this.isShow = true;
        this.bgImg.map((item, index) => {
          this.__init(item, index);
        });
      },
      //初始化画布
      async __init(bgurl, index) {
        this.canvasW = 360;
        this.canvasH = 600;
        this.ctx[index] = uni.createCanvasContext('my-canvas' + index, this);
        //设置画布背景透明
        this.ctx[index].setFillStyle('rgba(255, 255, 255, 0)');
        //设置画布大小
        this.ctx[index].fillRect(0, 0, this.canvasW, this.canvasH);
        //绘制圆角背景
        this.drawRoundRect(
          this.ctx[index],
          0,
          0,
          this.canvasW,
          this.canvasH,
          uni.upx2px(16),
          'rgba(255, 255, 255, 0)'
        );
        //获取背景图片
        let bgImg = await this.getImageInfo(bgurl);
        let hW = 360;
        let hH = 600;
        //绘制背景图片
        this.drawRoundImg(
          this.ctx[index],
          bgImg.path,
          (this.canvasW - hW) / 2,
          (this.canvasW - hW) / 2,
          hW,
          hH,
          8
        );
        //绘制姓名
        this.ctx[index].setFontSize(12); //设置姓名字体大小
        this.ctx[index].setFillStyle('#2C364E'); //设置姓名文本颜色
        this.ctx[index].fillText(this.userName, 60, 180);
        //绘制照片
        let userPhoto = await this.getImageInfo(this.userPhoto);
        this.drawRoundImg(this.ctx[index], userPhoto.path, 25, 160, 26, 26, 12);
        //提示文案
        this.ctx[index].fillText('今年你坚持打卡', 25, 70);
        this.ctx[index].fillText('其中做了', 25, 95);
        this.ctx[index].fillText('共花了', 25, 120);
        this.ctx[index].fillText('天', 140, 70);
        this.ctx[index].fillText('道题目', 110, 95);
        this.ctx[index].fillText('分钟', 95, 120);
        this.ctx[index].setFontSize(18); //设置姓名字体大小
        this.ctx[index].setFillStyle('#2C364E'); //设置姓名文本颜色
        this.ctx[index].fillText(
          `${this.dayNumber ? this.dayNumber : 1}`,
          this.dayNumber / 10 >= 1 ? 115 : 120,
          70
        );
        this.ctx[index].fillText(
          `${this.questionNumber}`,
          this.questionNumber / 10 >= 1 ? 80 : 85,
          95
        );
        this.ctx[index].fillText(
          `${this.timeNumber ? this.timeNumber : 1}`,
          this.timeNumber / 10 >= 1 ? 65 : 75,
          120
        );
        //底部广告
        let BottomAdImg = await this.getImageInfo(this.adImg);
        this.ctx[index].drawImage(BottomAdImg.path, 15, 440, 325, 80);
        //小程序码
        let qrcodeImg = await this.getImageInfo(this.codeImg);
        this.ctx[index].drawImage(qrcodeImg.path, 250, 450, 60, 60);
        //底部文案
        this.ctx[index].setFontSize(10); //设置姓名字体大小
        // this.ctx[index].setFontFamily("italic");
        this.ctx[index].setFillStyle('#FFFFFF'); //设置姓名文本颜色
        this.ctx[index].fillText(`这一刻有${this.peopleNumber}人陪你一起学习打卡`, 100, 540);
        //延迟渲染
        setTimeout(() => {
          this.ctx[index].draw(true, () => {
            uni.hideLoading();
          });
        }, 500);
      },
      //带圆角图片
      drawRoundImg(ctx, img, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.save();
        // 左上角
        ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5);
        // 右上角
        ctx.arc(x + width - radius, y + radius, radius, Math.PI * 1.5, Math.PI * 2);
        // 右下角
        ctx.arc(x + width - radius, y + height - radius, radius, 0, Math.PI * 0.5);
        // 左下角
        ctx.arc(x + radius, y + height - radius, radius, Math.PI * 0.5, Math.PI);
        ctx.stroke();
        ctx.clip();
        ctx.drawImage(img, x, y, width, height);
        ctx.restore();
        ctx.closePath();
      },
      //圆角矩形
      drawRoundRect(ctx, x, y, width, height, radius, color) {
        ctx.save();
        ctx.beginPath();
        ctx.setFillStyle(color);
        ctx.setStrokeStyle(color);
        ctx.setLineJoin('round'); //交点设置成圆角
        ctx.setLineWidth(radius);
        ctx.strokeRect(x + radius / 2, y + radius / 2, width - radius, height - radius);
        ctx.fillRect(x + radius, y + radius, width - radius * 2, height - radius * 2);
        ctx.stroke();
        ctx.closePath();
      },
      //获取图片
      getImageInfo(imgSrc) {
        return new Promise((resolve, reject) => {
          uni.getImageInfo({
            src: imgSrc,
            success: (image) => {
              resolve(image);
              console.log('获取图片成功', image);
            },
            fail: (err) => {
              reject(err);
              console.log('获取图片失败', err, imgSrc);
            },
          });
        });
      },
      //保存图片到相册
      saveImage() {
        //判断用户授权
        uni.getSetting({
          success(res) {
            console.log('获取用户权限', res.authSetting);
            if (Object.keys(res.authSetting).length > 0) {
              //判断是否有相册权限
              if (res.authSetting['scope.writePhotosAlbum'] == undefined) {
                //打开设置权限
                uni.openSetting({
                  success(res) {
                    console.log('设置权限', res.authSetting);
                  },
                });
              } else {
                if (!res.authSetting['scope.writePhotosAlbum']) {
                  //打开设置权限
                  uni.openSetting({
                    success(res) {
                      console.log('设置权限', res.authSetting);
                    },
                  });
                }
              }
            } else {
              return;
            }
          },
        });
        var that = this;
        uni.canvasToTempFilePath(
          {
            canvasId: 'my-canvas' + this.swpiperNum,
            quality: 1,
            destWidth: 750,
            destHeight: 1350,
            complete: (res) => {
              console.log('保存到相册', res);
              uni.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success() {
                  uni.showToast({
                    title: '已保存到相册',
                    icon: 'success',
                    duration: 2000,
                  });
                  setTimeout(() => {
                    that.isShow = false;
                  }, 2000);
                },
              });
            },
          },
          this
        );
      },
    },
  };
</script>

<style scoped lang="scss">
  .content {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .save-btn {
      margin-top: 35rpx;
      color: #ffffff;
      width: 600rpx;
      height: 88rpx;
      line-height: 88rpx;
      text-align: center;
      border-radius: 24rpx;
      font-size: 32rpx;
      background: #475ffd;
    }
  }

  /* 轮播图 */
  .banner-container {
    width: 100vw;
    height: 600px;
    .banner-item {
      display: flex;
      justify-content: center;
    }
  }
</style>
