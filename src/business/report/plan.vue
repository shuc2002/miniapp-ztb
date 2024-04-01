<!--
* @desc 学习报告
* @author daisitin
* @date 2022年04月25日
-->
<template>
  <view class="pagebg">
    <view style="height: 70rpx" />
    <StudyPlan @getTime="getTime" :time="time" />
    <view class="partake">
      <view class="img-place">
        <image
          v-for="(item, idx) in photoList"
          :key="idx"
          class="photo-img"
          :src="item"
          mode="scaleToFill"
          lazy-load="true"
        />
      </view>
      <view class="text-size-xxs common-message common-text-400">
        <span>今日参与人数：</span>
        <span class="common-price person">{{ manNumber }}</span>
        <span>人</span>
      </view>
    </view>
    <button class="btn-detail flex-center" @tap="handleSave()">保存</button>
  </view>
</template>
<script>
  import StudyPlan from './comps/StudyPlan.vue';
  import { getPhotoJson } from '@/api/modules/user/index';
  import { getSetting, toSetting } from '@/api/modules/question/exercise';
  import { getBrushList } from '@/api/modules/question/exercise';

  export default {
    name: 'learnPlan',
    components: { StudyPlan },
    onLoad() {
      this.getPhoto();
      this.getSetting();
      this.getBrushList();
    },
    data() {
      return {
        photoList: [],
        manNumber: 0,
        time: '00:00',
      };
    },
    computed: {
      projectId() {
        return this.$store.getters.getProjectId;
      },
    },
    methods: {
      // 获取每日一练打卡人数
      async getBrushList() {
        const res = await getBrushList({ projectId: this.projectId });
        this.manNumber = res.body;
      },
      //获取时间
      getTime(value) {
        this.time = value;
      },

      //获取设置内容
      async getSetting() {
        const res = await getSetting();
        this.time =
          (res.body.hour ? (res.body.hour / 10 < 1 ? `0${res.body.hour}` : res.body.hour) : '00') +
          ':' +
          (res.body.minutes
            ? res.body.minutes / 10 < 1
              ? `0${res.body.minutes}`
              : res.body.minutes
            : '00');
      },
      // 保存学习计划
      async handleSave() {
        const data = await toSetting({
          hour: this.time.split(':')[0],
          minutes: this.time.split(':')[1],
        });
        if (data.code == 1000) {
          uni.showToast({
            title: '保存成功',
            icon: 'none',
          });
        }
      },
      //获取头像图片列表
      async getPhoto() {
        const res = await getPhotoJson();
        this.photoList = this.shuffle(res, 6);
      },
      //随机从数据种拿n项
      shuffle(arr, number) {
        let i = arr?.length;
        while (i) {
          let j = Math.floor(Math.random() * i--);
          [arr[j], arr[i]] = [arr[i], arr[j]];
        }
        return arr?.slice(0, number);
      },
    },
  };
</script>
<style lang="scss" scoped>
  .pagebg {
    height: 100vh;
    background-color: #f5f6fa;
    .partake {
      position: fixed;
      bottom: 378rpx;
      margin: auto;
      display: flex;
      left: 0;
      right: 0;
      justify-content: center;
      align-items: center;
      flex: 1;
      .img-place {
        margin-right: 16rpx;
        padding-top: 4rpx;
      }
      .person {
        margin-left: 8rpx;
        margin-right: 8rpx;
      }
    }
  }
  .btn-detail {
    width: 654rpx;
    height: 96rpx;
    border-radius: 24rpx;
    background: #475ffd;
    color: #ffffff;
    position: fixed;
    bottom: 256rpx;
    margin: auto;
    left: 0;
    right: 0;
    &:active {
      opacity: 0.8;
    }
  }
  .photo-img {
    border: 2rpx solid #ffffff;
    width: 32rpx;
    height: 32rpx;
    border-radius: 50%;
    margin-left: -12rpx;
    &:first-child {
      margin: 0;
    }
  }
</style>
