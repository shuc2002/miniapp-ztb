<!--
* @desc 学习报告
* @author daisitin
* @date 2022年04月25日
-->
<template>
  <view class="page-bg" v-if="ifLoad">
    <!-- 学习报告卡片 -->
    <ReportCard :proportion="proportion" :tipText="tipText" :sloganText="sloganText" />
    <!-- 有学习计划时 按钮居于中间 -->
    <view class="center-btn flex" v-show="hasPlan">
      <view class="redo-btn btn-common " @tap="reExercise">重新练习</view>
      <view
        class="analysis-btn btn-common"
        @tap="commonFun.routeTo(`/business/brushQuestions/analysisList?code=${code}&card=${card}`)"
        >查看解析</view
      >
    </view>

    <!-- 学习计划  start -->
    <view class="study-plan" v-show="!hasPlan">
      <view class="trade-item plan-title-box">
        <image src="@/static/img/home/com-list.png" />
        <span class="text-size-main common-text-700 common-text">制定学习计划</span>
      </view>
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
    </view>
    <!-- 学习计划  end -->
    <!-- 学习小组 start -->
    <!-- #ifdef MP-WEIXIN -->
    <view class="content-bg" v-show="hasPlan">
      <view class="trade-item">
        <image src="@/static/img/home/com-list.png" />
        <span class="text-size-main common-text-700 common-text">组队学习</span>
      </view>
      <MyGroup :groupId="groupId" :groupInfo="groupInfo" :ifBrush="true" />
      <RankingList
        :groupInfo="groupInfo"
        :activeNum="activeNum"
        :list="list"
        @choose="handleChoose"
        @handleToLower="handleToLower"
      />
    </view>
    <!-- #endif -->
    <!-- 学习小组 end -->
    <view class="report-btn" v-show="!hasPlan">
      <view class="white-btn btn-all" v-show="!hasPlan" @tap="reExercise">
        重新练习
      </view>
      <view
        class="blue-btn btn-all"
        v-show="!hasPlan"
        @tap="
          commonFun.redirectTo(`/business/brushQuestions/analysisList?code=${code}&card=${card}`)
        "
        >查看解析</view
      >
    </view>
    <GetIntegral
      ref="integral"
      :num="socketMsgs.integral ? socketMsgs.integral : 0"
      :name="socketMsgs.name ? socketMsgs.name : '隐藏任务'"
    />
  </view>
</template>
<script>
  import ReportCard from './comps/ReportCard.vue';
  import StudyPlan from './comps/StudyPlan.vue';
  import { submitDaily } from '@/api/modules/question/index.ts';
  import { getSetting, toSetting, getBrushList } from '@/api/modules/question/exercise';
  import { getPhotoJson } from '@/api/modules/user/index';
  import MyGroup from '@/business/learnGroup/comps/MyGroup.vue';
  import RankingList from '@/business/learnGroup/comps/RankingList.vue';
  import { getGroupInfo, getDayList, getWeekList, getCode } from '@/api/modules/question/group.ts';
  import { getEmpower } from '@/api/modules/question/exercise';
  import { getDailyExerciseRecord } from '@/api/modules/home/index';
  import GetIntegral from '@/components/GetIntegral/GetIntegral.vue';

  export default {
    name: 'order',
    components: {
      ReportCard,
      StudyPlan,
      MyGroup,
      RankingList,
      GetIntegral,
    },
    data() {
      return {
        code: '',
        proportion: 0, //正确率
        userAnswerList: [],
        time: '00:00',
        groupId: '',
        groupInfo: {},
        list: [[], []], // 日榜和周榜数据
        page: [0, 0],
        activeNum: 1,
        card: '',
        sloganText: '',
        tipText: '',
        socketMsgs: {},
        ifLoad: false,
        hasPlan: false,
        photoList: [],
        manNumber: 0,
        subjectId: '',
      };
    },
    // 分享按钮
    async onShareAppMessage() {
      const res = await getCode();
      return {
        path: `/business/learnGroup/index?uid=${res.body}`,
        imageUrl: 'https://app.static.wangxiao.cn/ykmf/images/zuduishuati.png',
      };
    },
    computed: {
      socketMsg() {
        return this.$store.getters.getSocketMsg;
      },
      projectId() {
        return this.$store.getters.getProjectId;
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
      hasPlan: {
        handler(val) {
          console.log(val, 'hasPlan变化了，为');
        },
      },
    },
    onLoad(options) {
      this.code = options.code;
      this.subjectId = options.subjectId;
      if (options.fromHome) {
        this.getReportFromHome(options.projectId, options.subjectId);
      } else {
        this.userAnswerList = JSON.parse(options.userAnswerList);
        this.getReport(options.code);
      }
      // this.getReport(options.code);
      this.getSetting();
      this.getGroupInfo();
    },
    methods: {
      //获取时间
      async getTime(value) {
        this.time = value;
        this.handleSave();
      },

      //获取设置内容
      async getSetting() {
        const res = await getSetting();
        if (res.body.hour || res.body.hour === 0) {
          this.hasPlan = true;
          this.time =
            (res.body.hour / 10 < 1 ? `0${res.body.hour}` : res.body.hour) +
            ':' +
            (res.body.minutes / 10 < 1 ? `0${res.body.minutes}` : res.body.minutes);
        } else {
          this.hasPlan = false;
          this.getBrushList();
          this.getPhoto();
        }
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
      async getReport(code) {
        const res = await submitDaily({ code, answers: this.userAnswerList });
        this.proportion = res.body.percentage;
        this.tipText = res.body.text;
        this.sloganText = res.body.slogan;
        this.$store.commit('setDailyAnalysis', res.body.analysis);
        this.card = JSON.stringify(res.body.card);
        this.ifLoad = true;
        console.log(this.card, 'testyuyuyu');
        console.log(res.body.analysis, 'testyuyuyu-2');
      },
      // 从首页直接过来获取数据
      async getReportFromHome(projectId, subjectId) {
        let params = {
          subjectId: subjectId,
          projectId: projectId,
        };
        const res = await getDailyExerciseRecord(params);
        this.proportion = res.body.percentage;
        this.tipText = res.body.text;
        this.sloganText = res.body.slogan;
        this.$store.commit('setDailyAnalysis', res.body.analysis);
        this.card = JSON.stringify(res.body.card);
        this.ifLoad = true;
        console.log(this.card, 'testyuyuyu');
        console.log(res.body.analysis, 'testyuyuyu-2');
      },
      // 获取小组信息
      async getGroupInfo() {
        const res = await getGroupInfo();
        this.page = [0, 0];
        this.activeNum = 1;
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
        }
      },
      // 日榜
      async getDayList() {
        const res = await getDayList({ index: this.page[0], row: 10 });
        if (this.page[0] === 0) {
          this.list[0] = res.body;
        } else if (this.page[0] > 0) {
          this.list[0].push(...res.body);
        }
        this.$forceUpdate();
      },
      // 周榜
      async getWeekList() {
        const res = await getWeekList({ index: this.page[1], row: 10 });
        if (this.page[1] === 0) {
          this.list[1] = res.body;
        } else if (this.page[1] > 0) {
          this.list[1].push(...res.body);
        }
      },
      // 切换榜单
      handleChoose(key) {
        this.activeNum = key;
      },
      // 加载更多
      handleToLower() {
        if (this.activeNum === 1) {
          this.pages[0]++;
          this.getDayList();
        } else if (this.activeNum === 2) {
          this.pages[1]++;
          this.getWeekList();
        }
        setTimeout(() => {
          this.$forceUpdate();
          uni.hideLoading();
        }, 1000);
      },
      // 获取每日一练打卡人数
      async getBrushList() {
        const res = await getBrushList({ projectId: this.projectId });
        this.manNumber = res.body;
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
      // 重新练习每日一练
      async reExercise() {
        let res = await getEmpower(this.subjectId);
        uni.redirectTo({
          url: `/business/brushQuestions/index?code=${res.body.code}&subjectId=${this.subjectId}`,
        });
      },
    },
  };
</script>
<style lang="scss" scoped>
  .page-bg {
    display: flex;
    flex-flow: column;
    .center-btn {
      margin: 0 64rpx 72rpx 64rpx;
      .btn-common {
        width: 288rpx;
        height: 96rpx;
        border-radius: 72rpx;
        text-align: center;
        line-height: 96rpx;
        font-size: 32rpx;
        font-weight: 700;
        font-family: 'PingFang SC';
      }
      .redo-btn {
        border: 2rpx solid #ecedf1;
        background: #ffffff;
        color: #4e5969;
      }
      .analysis-btn {
        background: #475ffd;
        color: #ffffff;
        margin-left: 48rpx;
      }
    }
    .study-plan {
      margin-top: 70rpx;
      flex: 1;
      background-color: #f5f6fa;
      .partake {
        margin: 168rpx auto 0rpx;
        display: flex;
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
    }
  }
  .report-btn {
    width: 100%;
    padding-top: 40rpx;
    padding-bottom: 72rpx;
    display: flex;
    justify-content: center;
    background-color: #f5f6fa;
    .btn-all {
      width: 288rpx;
      height: 96rpx;
      border-radius: 72rpx;
      font-size: 32rpx;
      font-weight: 700;
      font-family: 'PingFang SC';
      text-align: center;
      line-height: 96rpx;
    }
    .white-btn {
      border: 2rpx solid #ecedf1;
      background: #ffffff;
      color: #4e5969;
      margin-right: 48rpx;
    }
    .blue-btn {
      background: #475ffd;
      color: #ffffff;
    }
  }
  .common-bg {
    padding-top: 48rpx;
  }
  .trade-item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-left: 32rpx;
    image {
      width: 48rpx;
      height: 48rpx;
      margin-right: 16rpx;
    }
  }
  .plan-title-box {
    margin-top: 48rpx;
    margin-bottom: 49rpx;
  }
  .content-bg {
    background-color: #f5f6fa;
    padding: 50rpx 0 200rpx 0;
  }
</style>
