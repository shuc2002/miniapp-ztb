<!--
* @desc 每日一练小组
* @author 江玉龙
* @date 2022年6月15日
-->
<template>
  <view class="common-bg">
    <MyGroup
      :groupId="groupId"
      :groupInfo="groupInfo"
      @edit="handleEdit()"
      @dismiss="dismiss()"
      @shareTap="shareTap()"
      v-if="ifLoad"
    />
    <RankingList
      :groupId="groupId"
      :groupInfo="groupInfo"
      :ourList="ourList"
      :activeNum="activeNum"
      :rank="rank"
      :ourInfo="ourInfo"
      v-if="ifLoad"
      :list="list"
      @choose="handleChoose"
      @handleToLower="handleToLower"
    />
    <view style="height: 180rpx" />
    <view class="bottom-box" v-if="ifLoad">
      <!-- #ifdef H5 -->
      <button class="invite-btn flex-center" @tap="shareTap()">邀请同事加入小组</button>
      <!-- #endif -->
      <!-- #ifndef H5 -->
      <button class="invite-btn flex-center" open-type="share">邀请同事加入小组</button>
      <!-- #endif -->
    </view>
    <view class="model-content" @tap="cancel()" v-if="ifJoin">
      <view class="integral-box" @tap.stop v-if="!noRepeat">
        <p class="text-size-sn common-text-400"
          >hi！<span class="common-blue">{{ nickName }}</span></p
        >
        <button class="join-btn flex-center" @tap="handleJoin()">加入小组</button>
      </view>
      <view class="repeat-box" @tap.stop v-if="noRepeat">
        <view class="text-size-main common-text-700 text-item">你已经加入一个小组</view>
        <view class="text-size-main common-text-700 text-item">无法重复加入</view>
        <button class="success-btn" @tap.stop="cancel()">知道了</button>
      </view>
    </view>
    <GetIntegral
      ref="integral"
      :num="socketMsgs.integral ? socketMsgs.integral : 0"
      :name="socketMsgs.name ? socketMsgs.name : '隐藏任务'"
    />
    <WxShare ref="WxShare" />
  </view>
</template>
<script>
  import MyGroup from './comps/MyGroup.vue';
  import RankingList from './comps/RankingList.vue';
  import GetIntegral from '@/components/GetIntegral/GetIntegral.vue';
  import WxShare from '@/components/WxShare/WxShare.vue';
  import baseInfo from '@/build/index';
  import { getChannelMsg } from '@/api/modules/user/index.ts';
  import { ChannelName } from '@/enums/msgEnum';
  import {
    getGroupInfo,
    joinGroup,
    getDayList,
    getWeekList,
    getOurGroup,
    getCode,
  } from '@/api/modules/question/group.ts';
  /* #ifdef H5 */
  import wxSdk from '@/utils/weixin.js';
  /* #endif */
  export default {
    name: 'learnGroup',
    components: {
      MyGroup,
      RankingList,
      GetIntegral,
      WxShare,
    },
    computed: {
      nickName() {
        return this.$store.getters.getNickName;
      },
      token() {
        return this.$store.getters.getToken;
      },
      socketMsg() {
        return this.$store.getters.getSocketMsg;
      },
    },
    watch: {
      socketMsg: {
        handler(nv) {
          this.socketMsgs = JSON.parse(nv);
          this.$refs.integral.showModal = true;
        },
        immediate: false,
        deep: true,
      },
    },
    onLoad(options) {
      if (options.uid) {
        uni.setStorageSync('joinId', options.uid);
        this.ifJoin = true;
        this.joinId = uni.getStorageSync('joinId');
      }
      this.appletName = ChannelName[baseInfo.CHANNEL];
      this.getGroupInfo();
    },
    // 分享按钮
    async onShareAppMessage() {
      const res = await getCode();
      this.$forceUpdate();
      return {
        title: `我在${this.appletName}坚持[每日一练]，邀请你一起刷题`,
        path: `/business/learnGroup/index?uid=${res.body}`,
        imageUrl: 'https://app.static.wangxiao.cn/ykmf/images/zuduishuati.png',
        /* #ifdef MP-TOUTIAO */
        templateId: '54j75t03jp375klb6m',
        /* #endif */
      };
    },
    data() {
      return {
        ifJoin: false, // 是否是被邀请
        groupId: '',
        groupInfo: {},
        joinId: '',
        noRepeat: false,
        ifLoad: false, // 页面是否已加载完毕
        list: [[], []], // 日榜和周榜数据
        page: [0, 0],
        ourList: [],
        activeNum: 1,
        ourInfo: {},
        rank: 0,
        showMore: true,
        socketMsgs: {},
        appletName: '',
      };
    },
    methods: {
      async shareTap() {
        const res = await getCode();
        let url = window.location.origin + '/#/business/learnGroup/index?uid=' + res.body;
        console.log(url);
        /* #ifdef H5 */
        const { body } = await getChannelMsg();
        this.appletName = body.appName;
        if (wxSdk.isWechat()) {
          wxSdk.shareWx({
            title: `我在${this.appletName}坚持[每日一练]，邀请你一起刷题`,
            desc: '',
            imgUrl: 'https://app.static.wangxiao.cn/ykmf/images/zuduishuati.png',
            link: url,
          });
          this.$refs.WxShare.showModal = true;
        } else {
          if (navigator.share) {
            console.log('支持分享');
            navigator.share({
              title: `我在${this.appletName}坚持[每日一练]，邀请你一起刷题`,
              text: '',
              url: url,
            });
          } else {
            uni.setClipboardData({
              data: url,
              success: () => {
                uni.hideToast();
                this.$nextTick(() => {
                  uni.showToast({
                    title: '链接已复制，请在浏览器打开',
                    icon: 'none',
                  });
                });
              },
            });
          }
        }
        /* #endif */
      },
      // 获取小组信息
      async getGroupInfo() {
        if (this.token) {
          const res = await getGroupInfo();
          this.page = [0, 0];
          this.activeNum = 1;
          this.ifLoad = false;
          this.showMore = true;
          this.groupId = '';
          this.groupInfo = {};
          if (res.code == 2061) {
            this.getDayList();
            this.getWeekList();
          } else {
            this.groupId = res.body.id;
            this.groupInfo = res.body;
            this.getDayList();
            this.getWeekList();
            this.getOurGroup(this.groupId);
          }
          uni.removeStorageSync('joinId');
        } else {
          this.getDayList();
          this.getWeekList();
        }
      },
      // 我的小组人员的排行榜
      async getOurGroup() {
        const res = await getOurGroup();
        this.ourList = res.body.members;
        this.ourInfo = res.body.me;
        this.rank = res.body.rank;
      },
      // 日榜
      async getDayList() {
        const res = await getDayList({ index: this.page[0], row: 10 });
        if (this.page[0] === 0) {
          this.list[0] = res.body;
        } else if (this.page[0] > 0) {
          this.list[0].push(...res.body);
        }
        if (res.body.length < 10) {
          this.showMore = false;
        }
        this.ifLoad = true;
      },
      // 周榜
      async getWeekList() {
        const res = await getWeekList({ index: this.page[1], row: 10 });
        if (this.page[1] === 0) {
          this.list[1] = res.body;
        } else if (this.page[1] > 0) {
          this.list[1].push(...res.body);
        }
        if (res.body.length < 10) {
          this.showMore = false;
        }
      },
      // 邀请
      async handleJoin() {
        let res = await joinGroup({ shareCode: this.joinId });
        if (res.code == 3500) {
          this.noRepeat = true;
        } else if (res.code == 3503) {
          uni.showToast({
            title: '不能加入自己的组',
            icon: 'none',
          });
        } else {
          this.ifJoin = false;
          this.getGroupInfo();
        }
      },
      // 切换榜单
      handleChoose(key) {
        if (key == 0) {
          this.showMore = false;
        } else {
          this.showMore = true;
        }
        this.activeNum = key;
      },
      // 关闭弹窗
      cancel() {
        this.ifJoin = false;
        this.noRepeat = false;
      },
      // 编辑结束
      handleEdit() {
        this.getGroupInfo();
      },
      // 退队结束
      dismiss() {
        this.getGroupInfo();
      },
      // 加载更多
      handleToLower() {
        if (this.showMore) {
          uni.showLoading({
            title: '加载中',
            mask: true,
          });
          if (this.activeNum === 1) {
            this.page[0]++;
            this.getDayList();
          } else if (this.activeNum === 2) {
            this.page[1]++;
            this.getWeekList();
          }
          setTimeout(() => {
            this.$forceUpdate();
            uni.hideLoading();
          }, 1000);
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
  .common-bg {
    padding-top: 24rpx;
  }
  .bottom-box {
    position: fixed;
    bottom: 0;
    height: 180rpx;
    background: #ffffff;
    box-shadow: 0 -6px 8px 0 #f5f6fa;
    .invite-btn {
      width: 654rpx;
      height: 96rpx;
      border-radius: 24rpx;
      // background: #475ffd;
      background: #e51600;
      margin-top: 32rpx;
      margin-left: 48rpx;
      margin-right: 48rpx;
      color: #ffffff;
      &:active {
        opacity: 0.8;
      }
    }
  }
  .model-content {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99;
    .integral-box {
      width: 646rpx;
      height: 720rpx;
      background-image: url(https://app.static.wangxiao.cn/ztb/Background220617.png);
      background-size: 100% 100%;
      background-repeat: no-repeat;
      margin-top: -140rpx;
      p {
        margin-bottom: 24rpx;
        margin-left: 76rpx;
        margin-top: 160rpx;
        color: #5b648d;
      }
      .join-btn {
        width: 526rpx;
        height: 88rpx;
        border-radius: 56rpx;
        background-color: #ffffff;
        color: #5b648d;
        margin-top: 380rpx;
      }
    }
  }
  .repeat-box {
    width: 602rpx;
    height: 290rpx;
    border-radius: 24rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 60rpx;
    background: linear-gradient(-0.2deg, #ffffff 0%, #f7fafe 81%, #ebf1fd 100%);
    .text-item {
      margin-bottom: 16rpx;
      color: #2c364e;
    }
    .success-btn {
      width: 506rpx;
      height: 88rpx;
      border-radius: 24rpx;
      background: #475ffd;
      color: #ffffff;
      font-size: 32rpx;
      font-weight: 700;
      margin-top: 48rpx;
      &:active {
        opacity: 0.8;
      }
    }
  }
</style>
