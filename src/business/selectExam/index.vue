<!--
* @desc 选择考试项目
* @author 江玉龙
* @date 2022年06月02日
-->
<template>
  <div class="page-bg">
    <SearchInput @handleSearch="handleSearch" @uploadSearch="uploadSearch" :isSearch="isSearch" />
    <!-- 搜索后的列表 start -->
    <view v-if="isSearch">
      <view
        v-for="(item, index) in checkedNodes"
        :key="index"
        class="common-text-400 text-size-sn search-listItem flex-start"
        @tap="doConfirmCategorys(item)"
        ><view v-html="item.htmlText"
      /></view>
    </view>
    <!-- 搜索后的列表 end -->
    <view v-else>
      <ExamList
        ref="examList"
        :startList="startList"
        :allExam="allExam"
        :myExam="myExam"
        @clickSecond="doConfirmCategorys"
      />
    </view>
  </div>
</template>
<script>
  // Use Vuex
  import ExamList from './comps/ExamList.vue';
  import { getMyExam, getExamTagList, getExamList } from '@/api/modules/user/index';
  import SearchInput from './comps/SearchInput.vue';
  import { BaiduChannelId, WeixinChannelId, DouyinChannelId, H5ChannelId } from '@/enums/msgEnum';
  import baseInfo from '@/build/index';
  export default {
    components: {
      ExamList,
      SearchInput,
    },
    computed: {
      // channelId() {
      //   return this.$store.getters.getChannelId;
      // },
      token() {
        return this.$store.getters.getToken;
      },
    },
    data() {
      return {
        allExam: [], // 全部考试项目数据
        myExam: [],
        startList: [
          {
            key: '-1',
            type: 0,
            value: '我的考试',
          },
        ], // 第一行考试项目
        checkedNodes: [], // 搜索到的值
        isSearch: false, // 是否展开搜索框
        testData: [
          {
            children: [
              {
                key: '10002',
                type: 1,
                value: '初级金融专业知识与实务',
              },
              {
                key: '10001',
                type: 1,
                value: '初级经济师',
              },
              {
                key: 'TAG1000024',
                type: 0, //标签
                value: '建筑师子标签',
              },
              {
                children: [
                  {
                    key: '10001',
                    type: 1,
                    value: '初级经济师',
                  },
                ],
                key: 'TAG1000014',
                type: 0,
                value: '建筑师一级',
              },
            ],
            key: 'TAG1000013',
            type: 0,
            value: '建筑师',
          },
          {
            key: 'TAG1000021',
            type: 0,
            value: '建筑师三级',
          },
        ],
        channelId: '',
      };
    },
    onLoad() {
      /* #ifdef H5 */
      this.channelId = H5ChannelId[baseInfo.CHANNEL];
      /* #endif */
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
      if (this.token) {
        this.getMyExam();
        this.getExam();
      } else {
        this.getExam();
      }
    },
    onShow() {
      // if (this.token) {
      //   this.getMyExam();
      // } else {
      //   this.toAllExam();
      // }
      // console.log('onshow');
    },
    methods: {
      // async toAllExam() {
      //   const res = await getExamList({ channelId: this.channelId });
      //   this.allExam = res.body.project;
      //   this.$refs.examList.ifExamOne(this.allExam);
      // },
      async getMyExam() {
        const res = await getMyExam({ channelId: this.channelId });
        this.myExam = res.body.contents;
      },
      // 获取考试项目接口数据
      async getExam() {
        const res = await getExamTagList({ channelId: this.channelId });
        this.allExam = res.body;
        this.startList = this.startList.concat(this.allExam);
      },
      // 选择项目跳转
      async doConfirmCategorys(items, isMine) {
        // console.log(items, isMine, 'big');
        if (isMine) {
          // this.$store.commit('setProjectId', items.projectId);
          // this.$store.commit('setProjectName', items.title);
          // await setProject({ projectId: items.projectId });
          uni.navigateTo({
            url: `/home/SelectSubject?projectId=${items.projectId}&projectName=${items.title}`,
          });
        } else {
          // this.$store.commit('setProjectId', items.key);
          // this.$store.commit('setProjectName', items.value);
          // await setProject({ projectId: items.key });
          uni.navigateTo({
            url: `/home/SelectSubject?projectId=${items.key}&projectName=${items.value}`,
          });
        }
        // uni.navigateTo({url:'/home/SelectSubject'});
        // // uni.switchTab({ url: '/pages/home/index' });
        // if (!this.isSearch) {
        //   uni.navigateTo({ url: '/home/SelectSubject' });
        // } else {
        //   uni.switchTab({ url: '/pages/home/index' });
        // }
        // uni.navigateTo({url:'/home/SelectSubject'});
      },
      //搜索按钮
      handleSearch(data) {
        this.checkedNodes = [];
        this.getCheckedNodes(data);
        this.isSearch = true;
      },
      // 关闭展开的搜索框
      uploadSearch(data) {
        this.isSearch = data;
      },
      //查找树相符的项
      async getCheckedNodes(value) {
        const res = await getExamList({ channelId: this.channelId });
        res.body.project.forEach((record) => {
          if (record.value.indexOf(value) != -1) {
            //修改关键字样式
            record.htmlText = record.value.replace(
              value,
              `<span style="color:#475FFD">${value}</span>`
            );
            this.checkedNodes.push(record);
          }
        });
      },
      // 转发页面
      async onShareAppMessage() {
        return {
          path: '/business/selectExam/index',
          // imageUrl: 'https://app.static.wangxiao.cn/ykmf/images/zuduishuati.png',
        };
      },
    },
  };
</script>
<style lang="scss" scoped>
  .page-bg {
    padding-top: 32rpx;
  }
  .search-listItem {
    margin: 54rpx 0;
    padding: 0 88rpx;
  }
</style>
