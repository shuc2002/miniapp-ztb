<!-- 二级页面中的微页面 -->
<template>
  <view class="wxPage-bg">
    <view v-for="(item, index) in list" :key="index">
      <view :class="index == 0 ? 'first-component' : ''" v-if="item.type == 'function-comp'">
        <StateCard
          :days="currentDays"
          :currentGroupData="currentGroupData"
          :content="item.action.config"
          :config="item"
          :showType="item.showType"
          @handleDailyExercise="handleDailyExercise()"
        />
      </view>
      <view v-if="item.type == 'ad-factory'" :key="index">
        <Advertisement
          :advStyle="item.style"
          :config="item.action.config[0]"
          @handleDailyExercise="handleDailyExercise()"
        />
      </view>
      <view v-if="item.type == 'goods-list'">
        <Commodity :style="item.style" :content="item.content" />
      </view>
      <view v-if="item.type == 'single-goods'">
        <ChapterIndex
          :projectId="projectId"
          :subjectId="currentSubjectId"
          :config="item"
          :chapterConfig="chapterConfig"
          :displayAreaId="displayAreaId"
          :currentSubName="getCurrentSubName()"
        />
      </view>
      <view v-if="item.type == 'grid-menu'">
        <JingGangArea
          :subjectId="currentSubjectId"
          :activeSubjectId="currentSubjectId"
          :config="item"
          :subjectList="subjectList"
          :projectId="projectId"
          :currentProp="getCurrent()"
          @handleDailyExercise="handleDailyExercise()"
        />
      </view>
      <view v-if="item.type == 'info-list'">
        <Information
          :title="item.info ? item.info.title : ''"
          :subTitle="item.info ? item.info.subTitle : ''"
          :dataList="item.info ? item.info.dataList : []"
          :style="item.style"
          :content="item.content"
        />
      </view>
      <view v-if="item.type === 'editor-text'">
        <RichText :content="item.content" :style="item.style" />
      </view>
    </view>
    <view style="width: 100%; height: 100rpx; opacity: 0" />
    <!-- 弹窗 -->
    <ExerciseModal
      ref="exercise"
      :doneNum="doneNum"
      @toReStart="toReStart()"
      @toContinue="toContinue()"
    />
  </view>
</template>

<script>
  import Advertisement from '@/components/PublicSmallCom/Advertisement.vue';
  import Commodity from '@/components/PublicSmallCom/Commodity.vue';
  import ChapterIndex from '@/components/PublicSmallCom/ChapterIndex.vue';
  import JingGangArea from '@/components/PublicSmallCom/JingGangArea.vue';
  import Information from '@/components/PublicSmallCom/Information.vue';
  import RichText from '@/components/PublicSmallCom/RichText.vue';
  import StateCard from '../../pages/realHome/new-comps/StateCard.vue';
  import ExerciseModal from '../../pages/realHome/new-comps/ExerciseModal.vue';

  // import { getDailyExerciseRecord } from '@/api/modules/home/index';
  import { getDailyExerciseRecord } from '@/api/modules/home/index';
  import { getPageTempalte } from '@/api/modules/common/index';
  import { getConfigure } from '@/api/modules/user/index';
  import { getEmpower } from '@/api/modules/question/exercise';
  import baseInfo from '@/build/index';
  import { BaiduChannelId, WeixinChannelId, DouyinChannelId } from '@/enums/msgEnum';
  export default {
    name: 'wPage',
    props: {
      pageId: {
        type: String,
        default: '',
      },
    },
    components: {
      Advertisement,
      Commodity,
      ChapterIndex,
      JingGangArea,
      Information,
      RichText,
      StateCard,
      ExerciseModal,
    },
    data() {
      return {
        list: [], // 组件数据
        doneNum: 0, // 每日一练已做题目数
        codeExercise: '', // 暂存每日一练code
        chapterConfig: {},
        displayAreaId: '', // 陈列区id
        currentDays: 0, //当前的坚持天数
        currentGroupData: 0, // 当前小组题数
        channelId: '',
        goLoad: 1,
      };
    },
    computed: {
      projectId() {
        return this.$store.getters.getProjectId;
      },
      currentSubjectId() {
        return this.$store.getters.getCurrentSubjectId;
      },
      subjectList() {
        return this.$store.getters.getSubjectList;
      },
      token() {
        return this.$store.getters.getToken;
      },
    },
    onLoad(options) {
      this.goLoad = 0;
      /* #ifdef MP-BAIDU */
      // this.thirdAppId = ChannelAppId[baseInfo.CHANNEL];
      this.channelId = BaiduChannelId[baseInfo.CHANNEL];
      /* #endif */
      /* #ifdef MP-WEIXIN */
      this.channelId = WeixinChannelId[baseInfo.CHANNEL];
      /* #endif */
      /* #ifdef MP-TOUTIAO */
      this.channelId = DouyinChannelId[baseInfo.CHANNEL];
      /* #endif */
      // let pageId = props.pageId;
      this.pageId = options.pageId;
      // 获取数据
      this.getPageInfo(this.pageId);
      if (this.token) {
        this.getDaysData();
      }
      uni.hideTabBar();
    },
    methods: {
      // 获取页面信息
      async getPageInfo(pageId) {
        if (!pageId) {
          return;
        }
        const res = await getPageTempalte({
          pageCode: 'webPage',
          id: pageId,
        });
        // this.displayAreaId = res.body.id;
        if (res.body.pageJson) {
          uni.setNavigationBarTitle({
            title: res.body.name,
          });
          let config = JSON.parse(res.body.pageJson);
          config.forEach((item) => {
            if (item.type == 'goods-list') {
              item.content.push({ attr: 'layout', val: this.getType(item.style) });
            }
            if (item.type == 'function-comp') {
              // item.content.push({ attr: 'layout', val: this.getType(item.style) });
              item.showType = this.getType(item.style);
            }
            item.style = this.getStyle(item.style);
            if (item.type == 'single-goods') {
              this.chapterConfig = item;
              // 章节课陈列区id获取
              const hrefs = item?.action?.config?.href;
              if (hrefs?.length > 0) {
                this.displayAreaId = hrefs[hrefs.length - 1];
              }
            }
          });
          this.list = config;
        }
        if (res.body.areaJson) {
          const config = JSON.parse(res.body.areaJson);
          if (config?.length > 0) {
            config.map((item) => {
              if (item.attr == 'background-color') {
                console.log(item.val);
              }
            });
          }
        }
      },
      async getDaysData() {
        const data = await getConfigure({ channelId: this.channelId });
        if (data.body.groupMember) {
          this.currentGroupData = data.body.groupMember.questionNum;
        }
        if (this.subjectList.length != 0) {
          if (data.body.subjects) {
            data.body.subjects.map((item) => {
              if (item.k == this.currentSubjectId) {
                this.currentDays = item.signDay;
              }
            });
          }
        }
      },
      // 处理样式
      getStyle(temp) {
        const style = {};
        const k_v = {
          'padding-top': 'paddingTop',
          'padding-right': 'paddingRight',
          'padding-bottom': 'paddingBottom',
          'padding-left': 'paddingLeft',
          'background-color': 'backgroundColor',
        };
        temp.map((item) => {
          const key = k_v[item.attr];
          if (key) {
            if (item.unit) {
              style[key] = item.val + 'px';
            } else {
              style[key] = item.val;
            }
            // style[key] = item.val + 'px';
          }
        });
        return style;
      },
      getType(temp) {
        let val = 0;
        temp.map((item) => {
          // const key = [item.attr];
          if (item.attr == 'layout') {
            val = item.val;
          }
        });
        return val;
      },
      // 点击每日一练
      async handleDailyExercise() {
        let params = {
          subjectId: this.currentSubjectId,
          projectId: this.projectId,
        };
        const res = await getDailyExerciseRecord(params);
        if (res.body) {
          if (res.body.hasRecord) {
            if (res.body.finished) {
              // 去往解析页
              uni.navigateTo({
                url: `/business/report/index?code=${res.body.code}&projectId=${this.projectId}&subjectId=${this.currentSubjectId}&fromHome=true`,
              });
            } else {
              this.doneNum = res.body.done;
              this.codeExercise = res.body.code;
              this.$refs.exercise.showModal = true;
            }
          } else {
            this.toExercise();
          }
        }
      },
      // 重新练习
      async toReStart() {
        let res = await getEmpower(this.currentSubjectId);
        uni.navigateTo({
          url: `/business/brushQuestions/index?code=${res.body.code}&subjectId=${this.currentSubjectId}`,
        });
      },
      // 没有记录 直接进
      async toExercise() {
        let res = await getEmpower(this.currentSubjectId);
        uni.navigateTo({
          url: `/business/brushQuestions/index?code=${res.body.code}&subjectId=${this.currentSubjectId}`,
        });
      },
      // 继续做题
      toContinue() {
        uni.navigateTo({
          url: `/business/brushQuestions/index?code=${this.codeExercise}&currentIndex=${this
            .doneNum - 1}&subjectId=${this.currentSubjectId}`,
        });
      },
      // 金刚区获取当前current
      getCurrent() {
        let current = 0;
        this.subjectList.map((item, index) => {
          if ((item.k = this.currentSubjectId)) {
            current = index;
          }
        });
        return current;
      },
      // 章节课 获取当前科目名字
      getCurrentSubName() {
        let currentName = '';
        this.subjectList.map((item) => {
          if ((item.k = this.currentSubjectId)) {
            currentName = item.name;
          }
        });
        return currentName;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .wxPage-bg {
    background-color: #f5f6fa;
    min-height: 100vh;
    // height: 520vh;
  }
</style>
