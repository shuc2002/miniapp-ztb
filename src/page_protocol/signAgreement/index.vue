<template>
  <div class="flex-col page">
    <div class="flex-col flex-auto group_3">
      <div class="flex-col space-y-8">
        <div class="flex-col">
          <img class="shrink-0 image_5" src="https://acc.wangxiao.cn/image/mini_program/agreement_bg.png" />
          <div class="flex-col relative section">
            <div class="flex-row group_5 space-x-22">
              <span class="font_3">真实姓名</span>
              <u-input
                v-model="userRealName"
                :type="text"
                class="font_4"
                placeholder="请填写真实姓名"
              />
            </div>
            <div class="flex-row group_6 space-x-22">
              <span class="font_3">身份证号</span>
              <u-input
                v-model="idCardNo"
                :type="text"
                class="font_4"
                placeholder="请填写真实的身份证号"
              />
            </div>
          </div>
        </div>
        <div class="flex-row items-center group_7 space-x-6">
          <img class="image_6" src="https://app.static.wangxiao.cn/images/tick1.png" />
          <span class="font_5 text_4">仅用于签署商品协议，中大网校100%保密</span>
        </div>
      </div>
      <div class="flex-col items-center group_8 space-y-14">
        <img v-if="frontIdCard" class="image_7" :src="frontIdCard" />
        <img
          v-else
          @click="uploadIdCard1"
          class="image_7"
          src="https://app.static.wangxiao.cn/images/icard.png"
        />
        <div v-if="frontIdCard" class="success-text" style="margin-top: 16px">
          <span class="iconfont icon-select_circular_1_2"></span>
          <span class="font_5" style="padding-left: 10rpx">识别成功</span>
        </div>
        <span v-else class="font_5 text_5">支持选取图片与拍照</span>
      </div>
      <!-- <div class="flex-col items-center group_8 space-y-14">
        <img v-if="reverseIdCard" class="image_7" :src="reverseIdCard" />
        <img
          v-else
          @click="uploadIdCard2"
          class="image_7"
          src="https://app.static.wangxiao.cn/images/icard.png"
        />
        <span class="font_5 text_5">支持选取图片与拍照</span>
      </div> -->
      <div
        class="flex-col justify-start items-center button text-wrapper submit"
        @click="submit"
        :class="userRealName && idCardNo ? 'enable' : ''"
        ><span class="font_2 text_6">提交</span></div
      >
    </div>
  </div>
</template>

<script>
  // import { createWorker } from 'tesseract.js'; // ocr识别
  import { postSignAgreement } from '@/api/modules/order/index';
  import { uploadFiles } from '@/api/request/upload.ts';

  export default {
    name: 'SignProtocol',
    components: {},
    props: {},
    data() {
      return {
        userRealName: '', // 真实姓名
        idCardNo: '', // 身份证号码
        frontIdCard: '', // 身份证-正面
        reverseIdCard: '', // 身份证-反面
      };
    },
    onLoad(options) {
      console.log('111---', options);
      this.options = options;
    },
    methods: {
      // 提交数据
      async submit() {
        if (!this.userRealName || !this.idCardNo) {
          uni.showToast({
            title: '姓名或身份证号不能为空',
            icon: 'none',
          });
          return;
        }
        const { orderContractId = '' } = this.options;
        await postSignAgreement({
          orderContractIds: orderContractId,
          userRealName: this.userRealName,
          idCardNo: this.idCardNo,
        });
        const paramsStr = Object.entries(this.options)
          .map(([key, value]) => `${key}=${value}`)
          .join('&');
        uni.navigateTo({
          url: `/page_protocol/signFinish/index?${paramsStr}`,
        });
      },
      // 上传身份证-正面
      async uploadIdCard1() {
        uni.chooseImage({
          count: 1, // 最多选择一张图片
          sizeType: ['compressed'], // 压缩图片
          sourceType: ['album', 'camera'], // 选择图片的来源，可以是相册或者相机
          success: async (res) => {
            // 处理选择的图片
            const { code = '', body = {} } = await uploadFiles(
              '/upload/idCard/recognize',
              res.tempFilePaths[0]
            );
            if (code === 1000) {
              const { name = '', idNumber = '' } = body;
              this.userRealName = name;
              this.idCardNo = idNumber;
              this.frontIdCard = res.tempFilePaths[0];
            }
          },
          fail(err) {
            console.error('选择图片失败---:', err);
          },
        });
      },
      // 上传身份证-反面
      async uploadIdCard2() {
        uni.chooseImage({
          count: 1, // 最多选择一张图片
          sizeType: ['compressed'], // 压缩图片
          sourceType: ['album', 'camera'], // 选择图片的来源，可以是相册或者相机
          success: (res) => {
            // 处理选择的图片
            this.reverseIdCard = res.tempFilePaths[0];
          },
          fail(err) {
            console.error('选择图片失败---:', err);
          },
        });
      },
      // OCR识别
      // async performOCR(base64Image) {
      //   console.log('111---');
      //   const worker = await createWorker();
      //   await worker.load();
      //   await worker.loadLanguage('eng');
      //   await worker.initialize('eng');
      //   const { data } = await worker.recognize(base64Image);
      //   console.log('333---', data.text);
      //   await worker.terminate();
      // },
    },
  };
</script>

<style scoped lang="css">
  .flex-row {
    display: flex;
    flex-direction: row;
  }

  .flex-col {
    display: flex;
    flex-direction: column;
  }

  .justify-start {
    justify-content: flex-start;
  }

  .justify-end {
    justify-content: flex-end;
  }

  .justify-center {
    justify-content: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  .justify-around {
    justify-content: space-around;
  }

  .justify-evenly {
    justify-content: space-evenly;
  }

  .items-start {
    align-items: flex-start;
  }

  .items-end {
    align-items: flex-end;
  }

  .items-center {
    align-items: center;
  }

  .items-baseline {
    align-items: baseline;
  }

  .items-stretch {
    align-items: stretch;
  }

  .self-start {
    align-self: flex-start;
  }

  .self-end {
    align-self: flex-end;
  }

  .self-center {
    align-self: center;
  }

  .self-baseline {
    align-self: baseline;
  }

  .self-stretch {
    align-self: stretch;
  }

  .flex-1 {
    flex: 1 1 0%;
  }

  .flex-auto {
    flex: 1 1 auto;
  }

  .grow {
    flex-grow: 1;
  }

  .grow-0 {
    flex-grow: 0;
  }

  .shrink {
    flex-shrink: 1;
  }

  .shrink-0 {
    flex-shrink: 0;
  }

  .relative {
    position: relative;
  }
  .page {
    background-color: #ffffff;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
  }
  .header {
    padding: 18px 16px 14px;
    height: 88px;
  }
  .space-y-28 > *:not(:first-child) {
    margin-top: 28px;
  }
  .group {
    padding-left: 18px;
  }
  .group_2 {
    line-height: 10.5px;
    height: 10.5px;
  }
  .font_1 {
    font-size: 14px;
    font-family: SF Pro Text;
    line-height: 10.5px;
    font-weight: 600;
    color: #000000;
  }
  .text {
    word-break: break-all;
  }
  .text_2 {
    line-height: 10px;
  }
  .image {
    width: 17px;
    height: 11px;
  }
  .image_2 {
    width: 15px;
    height: 11px;
  }
  .image_3 {
    width: 24px;
    height: 11.5px;
  }
  .image_4 {
    width: 16px;
    height: 16px;
  }
  .pos {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  .font_2 {
    font-size: 16px;
    font-family: PingFang SC;
    line-height: 15px;
  }
  .text_3 {
    color: #333333;
  }
  .group_3 {
    overflow-y: auto;
  }
  .space-y-8 > *:not(:first-child) {
    margin-top: 8px;
  }
  .image_5 {
    width: 100%;
    height: 150px;
    contrast:100%;
    brightness:50%
  }
  .section {
    margin: -50px 15px 0;
    padding: 0 15px;
    background-color: #ffffff;
    border-radius: 5px;
    box-shadow: 0px 0px 10px #0000000d;
  }
  .group_5 {
    padding: 3px 0;
    border-bottom: solid 1px #f6f6f6;
  }
  .font_3 {
    font-size: 14px;
    font-family: PingFang SC;
    line-height: 13px;
    color: #333333;
    margin-right: 24px;
  }
  .font_4 {
    font-size: 14px;
    font-family: PingFang SC;
    line-height: 13px;
    color: #9ea1a3;
  }
  .group_6 {
    padding: 3px 0;
  }
  .space-x-22 {
    /* margin-left: 22px; */
    display: flex;
    align-items: center;
  }
  .group_7 {
    padding: 0 32px;
  }
  .space-x-6 > *:not(:first-child) {
    margin-left: 6px;
  }
  .image_6 {
    width: 12px;
    height: 15px;
  }
  .font_5 {
    font-size: 12px;
    font-family: PingFang SC;
  }
  .text_4 {
    color: #fe5548;
    padding: 8px;
  }
  .group_8 {
    margin-top: 42px;
  }
  .space-y-14 > *:not(:first-child) {
    margin-top: 14px;
  }
  .image_7 {
    width: 186px;
    height: 113px;
  }
  .text_5 {
    margin-top: 16px;
    color: #9ea1a3;
  }
  .button {
    align-self: center;
    margin-top: 100px;
  }
  .submit {
    margin-bottom: 40px;
  }
  .text-wrapper {
    padding: 16px 0;
    background-color: #f7b2aa;
    border-radius: 36px;
    width: 295px;
  }
  .enable {
    background-color: #e51600;
  }
  .text_6 {
    color: #ffffff;
    font-weight: 600;
  }
  .icon-select_circular_1_2 {
    color: #d81e06;
  }
</style>
