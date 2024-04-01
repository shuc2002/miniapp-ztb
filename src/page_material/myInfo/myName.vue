<!--
* @desc 昵称编辑
* @author 江玉龙
* @date 2022年07月06日
-->
<template>
  <view class="common-bg">
    <view class="exam-input">
      <input maxlength="15" v-model="textName" @focus="handleFocus" @blur="handleBlur" />
      <view class="t-icon t-icon-guanbi input-icon" v-if="textName && ifFocus" @tap="handleClear" />
    </view>
    <p class="tips">请输入你的昵称，仅支持中英文和数字，长度15字以内</p>
    <button class="save-btn flex-center" @tap="handleSave()">保存</button>
  </view>
</template>
<script>
  import { editUserInfo } from '@/api/modules/register/index.ts';
  export default {
    name: 'myName',
    computed: {
      avatar() {
        return this.$store.getters.getAvatar;
      },
      org() {
        return this.$store.getters.getOrg;
      },
    },
    data() {
      return {
        textName: '',
        ifFocus: false,
      };
    },
    onLoad(options) {
      this.textName = options.name;
    },
    methods: {
      // 保存
      async handleSave() {
        var reg = /^[\u4e00-\u9fa5A-Za-z0-9]*$/;
        if (reg.test(this.textName) && this.textName.length > 0) {
          const res = await editUserInfo({
            nickname: this.textName,
            avatar: this.avatar,
            gender: 0,
            org: this.org,
          });
          if (res.code === 1000) {
            this.$store.commit('setNickName', this.textName);
            uni.navigateBack();
          }
        } else {
          uni.showToast({
            title: '仅支持中英文和数字，长度15字以内',
            icon: 'none',
          });
        }
      },
      // 清空
      handleClear() {
        this.textName = '';
        /* #ifdef H5 */
        this.ifFocus = false;
        /* #endif */
      },
      // 获取焦点
      handleFocus() {
        this.ifFocus = true;
      },
      // 失去焦点
      handleBlur() {
        /* #ifndef H5 */
        this.ifFocus = false;
        /* #endif */
      },
    },
  };
</script>
<style lang="scss" scoped>
  .common-bg {
    padding-top: 48rpx;
    position: relative;
  }
  .exam-input {
    height: 112rpx;
    margin: 0 32rpx 16rpx 32rpx;
    padding: 0 24rpx;
    border-radius: 24rpx;
    background: #ffffff;
    font-size: 32rpx;
    font-weight: 400rpx;
    color: #323949;
    display: flex;
    align-items: center;
    justify-content: space-between;
    input {
      width: 560rpx;
    }
  }
  .input-icon {
    width: 36rpx;
    height: 36rpx;
  }
  .tips {
    margin-left: 48rpx;
    font-size: 24rpx;
    font-weight: 400;
    color: #989ead;
  }
  .save-btn {
    width: 654rpx;
    height: 96rpx;
    border-radius: 24rpx;
    background: #475ffd;
    color: #ffffff;
    position: absolute;
    bottom: 240rpx;
    left: 0;
    right: 0;
  }
</style>
