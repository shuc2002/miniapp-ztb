<!--
* @desc 积分任务
* @author dcj
* @date 2022年07月11日
-->
<template>
  <view class="common-bg page-box">
    <!-- 积分内容 start  -->
    <view class="integral-box">
      <!-- 积分余额 start  -->
      <view class="flex-center-box integral-content">
        <view class="text-left">
          <view class="flex integral-title">
            <image src="@/home/static/img/shop/integral.png" />
            <text class="common-main text-size-sn">积分明细</text>
          </view>
          <text class="text-size-4xl common-main common-text-700">{{ integral }}</text>
        </view>
        <view class="integral-btn" @tap="toShopping()">立即兑换</view>
      </view>
      <!-- 积分余额 end  -->
      <text class="common-main text-size-xxs" @tap="commonFun.routeTo(`/business/integral/detail`)"
        >查看积分明细 ></text
      >
    </view>
    <!-- 积分内容 end  -->
    <!-- 签到 start -->
    <view class="sgin-box">
      <view class="flex-center-box">
        <view class="common-text common-text-700"
          >已连续签到<text class="common-blue">{{ signList.continuousDay }}</text
          >天</view
        >
        <view class="common-text-400 text-size-xxs common-tip flex-item-center">
          <!-- <view class="t-icon t-icon-wenhao" @tap="openRules" /> -->
          <view>连续签到7天开宝箱</view></view
        >
      </view>
      <!-- 签到模块 start -->
      <view class="flex">
        <view class="sign-card" v-for="(item, key) in signList.cycle" :key="key">
          <p
            class="text-size-xxs common-text-400"
            :class="
              item.isFinished
                ? 'common-tip'
                : item.integration == 20
                ? 'common-brown'
                : item.day == 7
                ? 'visibility'
                : 'common-price'
            "
            >{{ '+' + item.integration }}</p
          >
          <image
            src="@/home/static/img/shop/integral0.png"
            v-if="item.day !== 7 && item.isFinished"
          />
          <image
            src="@/home/static/img/shop/integral.png"
            v-if="item.integration == 20 && !item.isFinished"
          />
          <image
            src="@/home/static/img/shop/integral2.png"
            v-if="item.integration == 40 && !item.isFinished"
          />
          <image
            src="@/home/static/img/shop/integral3.png"
            v-if="item.integration == 60 && !item.isFinished"
          />
          <image src="@/home/static/img/shop/integral4.png" v-if="item.day == 7" />
          <view
            class="flex-center"
            :class="{
              'chest-tips': item.day == 7,
              'Double-tips': item.day !== 7 && item.integration > 20,
              visibility: item.integration <= 20,
            }"
            >{{ item.day == 7 ? '开宝箱' : '翻倍' }}</view
          >
        </view>
      </view>
      <!-- 签到模块 end -->
    </view>
    <!-- 签到 end -->
    <!-- 任务列表 start -->
    <view class="taskList-box">
      <view class="flex-center-box">
        <text class="common-text common-text-700">天天领积分</text>
        <text class="common-blue common-text-400 text-size-xxs" @tap="openModel"
          >如何日赚1000积分?</text
        >
      </view>
      <view
        class="flex-center-box task-item-box"
        v-for="(item, index) in missionList"
        :key="index"
        @tap="doTask(item.id, item.finished)"
        v-show="taskList[item.id]"
      >
        <view class="flex-center">
          <view class="t-icon task-img" :class="taskList[item.id].icon" />
          <view class="task-content-box">
            <view class="text-size-sn">{{ item.name }}</view>
            <view class="text-size-xxs common-tip common-text-400">{{ item.instruction }}</view>
          </view>
        </view>

        <view v-show="item.finished" class="task-btn-finished common-text-400 text-size-sn"
          >已完成</view
        >
        <view
          class="flex-center task-btn common-text-700 common-main text-size-sn"
          v-show="item.id != 'share' && !item.finished"
        >
          <image class="star-img" src="@/home/static/img/shop/integral.png" />
          <view>+{{ item.integration }} </view>
        </view>
        <button
          open-type="share"
          id="share"
          v-show="item.id == 'share' && !item.finished"
          class="flex-center task-btn common-text-700 common-main text-size-sn"
        >
          <image class="star-img" src="@/home/static/img/shop/integral.png" />
          <view>+{{ item.integration }} </view>
        </button>
      </view>
    </view>
    <!-- 任务列表 end -->
    <GetIntegral
      ref="integral"
      :num="socketMsgs.integral ? socketMsgs.integral : 0"
      :name="socketMsgs.name ? socketMsgs.name : '隐藏任务'"
    />
    <PopupWindow
      ref="detail"
      height="450rpx"
      title="积分赚取说明"
      confirmTitle="去分享"
      :openType="'share'"
    >
      <view class="text-size-main modal-text"
        >每位好友点击你分享的链接 你都将获得 <text class="common-blue">10</text> 积分，无上限</view
      >
    </PopupWindow>
    <PopupWindow ref="rules" height="650rpx" title="签到规则" confirmTitle="我知道了">
      <view class="text-size-xs modal-text">1. 每天登录签到可领取20积分，第3/5天积分翻倍</view>
      <view class="text-size-xs modal-text"> 2.连续签到7天，可开启宝箱，最高可领取80积分</view>
      <view class="text-size-xs modal-text"> 3.若未连续签到7天，则次日需重新开始签到</view>
    </PopupWindow>
  </view>
</template>
<script>
  import { getIntegralNum } from '@/api/modules/order/index';
  import { getTaskList, getSign } from '@/api/modules/task/index';
  import { finishTask } from '@/api/modules/task/index';
  import { checkSign, getEmpower } from '@/api/modules/question/exercise';
  import { getShareCode } from '@/api/modules/user/index';

  import GetIntegral from '@/components/GetIntegral/GetIntegral.vue';
  import PopupWindow from '@/components/PopupComp/PopupWindow.vue';

  export default {
    name: 'integral',
    components: { GetIntegral, PopupWindow },
    onLoad() {
      this.getSignList();
    },
    onShow() {
      this.getIntegralNum();
      this.getList();
    },
    computed: {
      socketMsg() {
        return this.$store.getters.getSocketMsg;
      },
    },
    watch: {
      socketMsg: {
        handler(nv) {
          this.socketMsgs = JSON.parse(nv);
          if (this.socketMsgs.missionId == 'share') {
            this.$refs.integral.showModal = true;
          }
        },
        immediate: false,
        deep: true,
      },
    },
    data() {
      return {
        integral: 0,
        signList: {},
        socketMsgs: {},
        taskList: {
          edit_info: {
            name: '完善个人资料',
            instruction: '换个酷酷的昵称和头像+50积分',
            id: 'edit_info',
            icon: 't-icon-jifenrenwu',
          },
          commit_exercise: {
            name: '去完成每日一练',
            instruction: '完成每日一练打卡+30积分',
            id: 'commit_exercise',
            icon: 't-icon-jifenrenwu-1',
          },
          study_content: {
            name: '去阅读考点资料',
            instruction: '完成1篇考点资料阅读+20积分',
            id: 'study_content',
            icon: 't-icon-jifenrenwu-2',
          },
          /* #ifdef MP-WEIXIN */
          share: {
            name: '分享至微信群',
            instruction: '邀请好友一起完成每日一练+30积分',
            id: 'share',
            icon: 't-icon-jifenrenwu-3',
          },
          join_in_group: {
            name: '邀请好友加入学习小组',
            instruction: '邀请1位好友加入我的小组+50积分',
            id: 'join_in_group',
            icon: 't-icon-jifenrenwu',
          },
          /* #endif */
        },
        missionList: [],
      };
    },
    // 分享逻辑
    async onShareAppMessage(res) {
      if (res.from === 'button') {
        // 来自页面内转发按钮
        if (res.target.id == 'share') {
          await finishTask({ missionId: 'share' });
          this.getList();
          return {
            title: '好友邀请@你一起刷题',
            imageUrl: 'https://app.static.wangxiao.cn/ykmf/images/zuduishuati.png',
            path: '/pages/realHome',
            /* #ifdef MP-TOUTIAO */
            templateId: '1q3ra5e657d1qmadp9',
            /* #endif */
          };
        } else {
          const res = await getShareCode();
          return {
            title: '看一看你的积分能兑换什么?',
            imageUrl: 'https://acc.wangxiao.cn/ztb/shareImg.png',
            path: `/pages/realHome?shareCode=${res.body}`,
            /* #ifdef MP-TOUTIAO */
            templateId: 'bc790d7j9mghafvn5t',
            /* #endif */
          };
        }
      }
    },
    methods: {
      openModel() {
        this.$refs.detail.showModal = true;
      },
      openRules() {
        this.$refs.rules.showModal = true;
      },
      toShopping() {
        uni.switchTab({ url: '/home/shopping/index' });
      },
      // 获取我的积分
      async getIntegralNum() {
        const data = await getIntegralNum();
        this.integral = data.body;
      },
      //获取任务列表
      async getList() {
        const data = await getTaskList();
        this.missionList = data.body;
        this.missionList.map((item) => {
          if (!item.finished) item.finished = false;
        });
      },
      //获取签到列表
      async getSignList() {
        const res = await getSign();
        this.signList = res.body;
      },
      async clickBrush() {
        // 检测是否领取每日一练
        let data = await checkSign();
        if (data.code == 1000) {
          let code = data.body.code;
          this.$store.commit('setDailyCode', code);
          uni.navigateTo({
            url: `/business/brushQuestions/index?code=${code}`,
          });
        } else {
          let res = await getEmpower();
          uni.navigateTo({
            url: `/business/brushQuestions/index?code=${res.body.code}`,
          });
        }
      },
      //做任务
      doTask(id, finished) {
        if (finished) {
          return;
        }
        switch (id) {
          case 'edit_info':
            uni.navigateTo({ url: '/page_material/myInfo/index' });
            break;
          case 'commit_exercise':
            this.clickBrush();
            break;
          case 'study_content':
            uni.navigateTo({ url: '/page_commodity/courseList/index' });
            break;
          case 'share':
            break;
          case 'join_in_group':
            uni.navigateTo({ url: '/business/learnGroup/index' });
            break;
          default:
            break;
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
  .page-box {
    min-width: calc(100vw - 48rpx);
    padding: 30rpx 24rpx;
    line-height: 1.5;
  }
  .integral-box {
    width: calc(100% - 64rpx);
    padding: 34rpx 32rpx 24rpx 32rpx;
    border-radius: 24rpx;
    background: linear-gradient(140.2deg, rgba(255, 113, 78, 1) 0%, rgba(248, 59, 41, 1) 100%);
    .integral-content {
      padding-bottom: 16rpx;
      border-bottom: 1rpx solid rgba(255, 255, 255, 0.5);
      .integral-title {
        image {
          width: 40rpx;
          height: 40rpx;
          margin-right: 16rpx;
        }
      }
      .integral-btn {
        width: 176rpx;
        height: 64rpx;
        line-height: 64rpx;
        text-align: center;
        border-radius: 74rpx;
        color: #f0522f;
        background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(253, 212, 205, 1) 100%);
      }
    }
  }
  .sgin-box,
  .taskList-box {
    border-radius: 24rpx;
    padding: 32rpx 24rpx;
    margin-top: 24rpx;
    background: #ffffff;
  }
  //天天领积分 start
  .star-img {
    width: 30rpx;
    height: 30rpx;
  }
  .task-item-box {
    margin-top: 40rpx;
    &:first-child {
      margin-top: 40rpx;
    }
  }
  .task-img {
    width: 80rpx;
    height: 80rpx;
  }
  .task-content-box {
    text-align: left;
    margin-left: 16rpx;
  }
  .task-btn {
    margin: 0;
    width: 142rpx;
    height: 64rpx;
    border-radius: 68rpx;
    background: rgba(240, 82, 47, 1);
  }
  .task-btn-finished {
    width: 142rpx;
    height: 64rpx;
    border-radius: 68rpx;
    background: #ecedf1;
    color: #989ead;
    line-height: 64rpx;
  }
  //签到
  .sign-card {
    margin-top: 32rpx;
    margin-right: 12rpx;
    width: 84rpx;
    border-radius: 16rpx;
    background: linear-gradient(180deg, rgba(245, 246, 250, 1) 0%, rgba(255, 255, 255, 1) 100%);
    display: flex;
    flex-flow: column;
    align-items: center;
    &:last-child {
      margin-right: 0;
    }
    p {
      margin-top: 16rpx;
      margin-bottom: 4rpx;
    }
    image {
      width: 64rpx;
      height: 64rpx;
    }
    .Double-tips {
      width: 56rpx;
      height: 36rpx;
      border-radius: 8rpx;
      background-color: #ffee83;
      color: #8c513e;
      font-size: 20rpx;
      margin-top: 30rpx;
      position: relative;
    }
    .chest-tips {
      width: 76rpx;
      height: 36rpx;
      border-radius: 8rpx;
      background: linear-gradient(180deg, #fe9f62 0%, #ff8d54 100%);
      font-size: 20rpx;
      color: #ffffff;
      margin-top: 30rpx;
    }
  }
  .modal-text {
    margin: 0 48rpx;
    line-height: 1.8;
  }
  .t-icon-wenhao {
    margin-right: 10rpx;
  }
</style>
