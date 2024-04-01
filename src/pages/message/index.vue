<!--
* @desc 消息页面
* @author 江玉龙
* @date 2022年08月09日
-->
<template>
  <view class="page-bg">
    <Probably margin="0 32rpx 16rpx 32rpx" />
    <view class="message-box" v-for="(value, key) in iconList" :key="key">
      <view class="flex" @tap="handleClick(key)">
        <view class="icon-box flex-center">
          <view class="icon-center t-icon" :class="value.icon" />
          <view class="red-spot" />
        </view>
        <view>
          <view class="flex-center-box">
            <p class="text-size-main common-text-700 common-text">{{ value.name }}</p>
            <p class="text-size-xxs common-text-400 common-tip">{{ value.time }}</p>
          </view>
          <p class="message-tip">{{ value.message }}</p>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
  import Probably from '@/components/Probably/Probably.vue';
  import { getInformation } from '@/api/modules/message/index';
  export default {
    name: 'message',
    components: { Probably },
    onShow() {
      this.getInformation();
    },
    computed: {
      projectId() {
        return this.$store.getters.getProjectId;
      },
    },
    data() {
      return {
        photoList: [],
        iconList: [
          {
            name: '排行榜',
            icon: 't-icon-Leaderboard',
            message: '查看本周做题排行榜',
            time: '03-15 12:00',
          },
          {
            name: '我的粉丝',
            icon: 't-icon-fans',
            message: '王老师 关注了你',
            time: '03-15 12:00',
          },
          {
            name: '考试资讯',
            icon: 't-icon-News',
            message: '2022年卫生资格人机对话各专业具体考试时的变化',
            time: '03-15 12:00',
          },
          {
            name: '做题报告',
            icon: 't-icon-Report',
            message: '你有一份近7天的做题报告待查收',
            time: '03-15 12:00',
          },
        ],
      };
    },
    methods: {
      // 获取最新考试资讯
      async getInformation() {
        const res = await getInformation({ projectId: this.projectId });
        this.iconList[2].message = res.body.title;
        this.iconList[2].time = res.body.publishTime;
        this.$forceUpdate();
      },
      // 跳转
      handleClick(key) {
        switch (key) {
          case 0:
            uni.navigateTo({
              url: '/business/rankingList/index',
            });
            break;
          case 1:
            uni.navigateTo({
              url: '/page_material/myFans/index',
            });
            break;
          case 2:
            uni.navigateTo({
              url: '/page_commodity/information/infoList',
            });
            break;
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
  .page-bg {
    padding-top: 16rpx;
  }
  .message-box {
    margin: 0 32rpx;
    padding: 32rpx 0;
    border-bottom: 2rpx solid #f0ebeb;
    .icon-box {
      width: 96rpx;
      height: 96rpx;
      border-radius: 50%;
      background-color: #eef2ff;
      position: relative;
      margin-right: 24rpx;
      .red-spot {
        padding: 6rpx;
        background-color: #fe5c23;
        position: absolute;
        border-radius: 50%;
        right: 6rpx;
        top: 6rpx;
      }
    }
    .icon-center {
      width: 48rpx;
      height: 48rpx;
    }
  }
  .message-tip {
    width: 566rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: #989ead;
    margin-top: 8rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
