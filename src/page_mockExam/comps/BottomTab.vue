<!--
* @desc 模拟考试底部组件
* @author 江玉龙
* @date 2022年06月11日
-->
<template>
  <view>
    <view class="bottom-box">
      <!-- #ifdef MP-BAIDU -->
      <view class="set-btn flex-column-center btn-style" @click="toReturn">
        <view class="iconfont icon-power exit-icon image-style" />
        <view class="common-text text-size-xxs common-text-400">退出</view>
      </view>
      <!-- #endif -->
      <view class="set-btn flex-column-center btn-style" @click="openSettingPopup">
        <view class="t-icon t-icon-shezhi image-style" />
        <view class="common-text text-size-xxs common-text-400">设置</view>
      </view>
      <view class="answer-btn flex-column-center btn-style" @click="openPopup">
        <view class="t-icon t-icon-ziliao image-style" />
        <view class="common-text text-size-xxs common-text-400">答题卡</view>
      </view>
      <view
        v-show="showAnalysis && !tourist"
        class="set-btn flex-column-center w-100 btn-style"
        @click="analysisItem"
      >
        <view
          class="t-icon image-style"
          :class="isAnalysis ? 't-icon-aixin' : 't-icon-icon_collect'"
        />
        <view class="common-text text-size-xxs common-text-400">{{
          isAnalysis ? '取消收藏' : '收藏'
        }}</view>
      </view>
    </view>
    <MovePopup title="答题卡" height="850rpx" v-model="showPopup" @change="changePopup">
      <scroll-view :scroll-y="true" class="anwser-sheept-width">
        <view v-for="(data, key) in list" :key="key">
          <p>{{ data.groupName }}</p>
          <view class="flex-wrap flex">
            <view
              v-for="(item, index) in data.list"
              :key="index"
              class="answer-box flex-center common-text-600"
              :class="
                showAnalysis
                  ? item.choose == true
                    ? 'option-right-plain'
                    : item.choose == false
                    ? 'option-error-plain'
                    : ''
                  : item.choose
                  ? 'answer-box-active'
                  : ''
              "
              @tap="choiceQuestion(item.index)"
              >{{ item.name }}</view
            >
          </view>
        </view>
        <view style="height: 200rpx" v-show="!showAnalysis" />
        <view style="height: 120rpx" />
      </scroll-view>
      <view class="common-buttonBox" v-show="!showAnalysis">
        <view class="common-button flex-center" @tap="submitpaper()">交卷并查看结果</view>
      </view>
    </MovePopup>
    <MovePopup
      title="设置"
      v-model="settingPopup"
      @change="changeSettingPopup"
      :height="showAnalysis ? '140px' : '80px'"
      bottomClose="true"
      ><view class="px-32">
        <view class="flex-center-box mb-16">
          <view class="text-size-main">字体大小</view
          ><view class="flex-center-box">
            <view
              class="text-size-sn answer-box flex-center"
              :class="textSize == 'text-size-sn' ? 'answer-box-active' : ''"
              @tap="choiceSize('text-size-sn')"
              >Aa</view
            >
            <view
              class="text-size-main answer-box flex-center"
              :class="textSize == 'text-size-main' ? 'answer-box-active' : ''"
              @tap="choiceSize('text-size-main')"
              >Aa</view
            >
            <view
              class="text-size-xl answer-box flex-center"
              :class="textSize == 'text-size-xl' ? 'answer-box-active' : ''"
              @tap="choiceSize('text-size-xl')"
              >Aa</view
            >
          </view>
        </view>
        <view class="flex-center-box border-t-1" v-show="showAnalysis">
          <view class="text-size-main">仅查看错题解析</view
          ><view>
            <switch
              color="#475FFD"
              :disabled="isDisabled"
              :checked="checked"
              @change="switchChange"
            />
          </view>
        </view>
      </view>
    </MovePopup>
  </view>
</template>
<script>
  import MovePopup from '@/components/MovePopup/move-popup.vue';
  export default {
    name: 'bottomTab',
    components: { MovePopup },
    props: {
      list: {
        type: Array,
        default: () => [],
      },
      isAnalysis: {
        type: Boolean,
        default: false,
      },
      isDisabled: {
        type: Boolean,
        default: false,
      },
      checked: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        showPopup: false,
        settingPopup: false,
      };
    },
    watch: {
      list: {
        handler() {},
        deep: true,
        immediate: true,
      },
    },
    computed: {
      textSize() {
        return this.$store.getters.getTextSize;
      },
      showAnalysis() {
        return this.$store.getters.getShowType == 1;
      },
      tourist() {
        return uni.getStorageSync('tourist');
      },
    },
    methods: {
      //打开答题卡
      openPopup() {
        this.showPopup = true;
      },
      //打开设置
      openSettingPopup() {
        this.settingPopup = true;
      },
      //改变答题卡状态
      changePopup(val) {
        this.showPopup = val;
      },
      //改变设置状态
      changeSettingPopup(val) {
        this.settingPopup = val;
      },
      //选择字体
      choiceSize(textSize) {
        this.$store.commit('setTextSize', textSize);
        this.settingPopup = false;
      },
      //选择题目
      choiceQuestion(num) {
        this.showPopup = false;
        this.$emit('changeNum', num);
      },
      toReturn() {
        // console.log(11111);
        this.$emit('isReturn');
        // console.log(33333);
      },
      // 提交试卷
      submitpaper() {
        this.$emit('submit');
      },
      analysisItem() {
        this.$emit('analysisItem', this.isAnalysis);
      },
      //选中错题
      switchChange(val) {
        this.$emit('switchChange', val.detail.value);
      },
    },
  };
</script>
<style lang="scss" scoped>
  @import '@/common/css/rushQuestion.scss';

  .bottom-box {
    width: 100%;
    height: 132rpx;
    background-color: white;
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    // padding: 24rpx 100rpx;
    padding: 24rpx 0;
    box-shadow: 0 -6px 8px 0 #f5f6fa;
    .btn-style {
      width: 100%;
      padding: 0 40rpx;
    }
    .image-style {
      width: 40rpx;
      height: 40rpx;
      margin-bottom: 12rpx;
    }
  }
  .px-32 {
    padding: 0 32rpx;
    .flex-center-box {
      height: 112rpx;
      line-height: 112rpx;
    }
  }
  .anwser-sheept-width {
    height: 100%;
    padding: 0;
    margin: 0rpx 42rpx;
    p {
      margin-left: 16rpx;
      margin-top: 24rpx;
      font-size: 24rpx;
      color: #323949;
    }
  }
  .border-t-1 {
    border-top: 1rpx solid #f5f6fa;
  }
  .mb-16 {
    margin-bottom: 16rpx;
  }
  .w-100 {
    width: 100rpx;
  }

  .common-buttonBox {
    background-color: #fff;
  }
  .common-button {
    background-color: #475ffd;
    border-radius: 20px;
  }
</style>
