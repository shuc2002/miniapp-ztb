<!--
* @desc 题库科目列表
* @author daisitin
* @date 2022年04月22日
-->
<template>
  <view class="page-bg">
    <view class="paper-msg">
      <view class="text-size-xl common-text-700 project-name">
        {{ paperName }}
      </view>
      <view class="text-size-sn tip-content">请选择本次参加的考试</view>
    </view>
    <view class="select-value text-size-sn common-text">
      <view
        v-for="(item, key) in tabList"
        :key="key"
        class="tab-item"
        :class="activeTabIndex === key ? 'active-tab-item' : ''"
        @tap="selectTab(key)"
      >
        {{ item.name }}</view
      >
    </view>
    <view class="sbuject-list">
      <image
        class="no-card"
        v-if="!list && tabList[activeTabIndex].paperList === 0"
        src="@/static/img/empty/order.png"
        mode="scaleToFill"
      />
      <view
        v-for="(data, index) in tabList[activeTabIndex].paperList"
        :key="index"
        class="subject-card flex-center-box bg-color-white"
        @tap="
          commonFun.redirectTo(
            `/page_mockExam/paperCover/index?id=${data.id}&productId=${data.productId}&subjectName=${data.subjectName}&isBought=${isBought}&commodityId=${commodityId}`
          )
        "
      >
        <view class="subject-list-item">
          <p class="text-size-sn common-text truncate unitName">{{ data.name }}</p>
          <view class="text-size-xxs common-tip text-box" v-if="data.haveRecord"
            ><text> {{ data.times }}次考试 | </text
            ><text class="text-item">平均{{ data.avg }}分 | </text>
            <text class="text-item">上次{{ data.last }}分</text>
          </view>
          <view class="text-size-xxs common-tip text-box" v-if="!data.haveRecord">暂无成绩 </view>
        </view>
        <view class="button-flex" v-if="data.isFinished == false">
          <button class="question-button">继续考试</button>
          <view class="t-icon t-icon-chevron-right" />
        </view>
      </view>
    </view>
    <ProceedModal ref="point" :problemNum="problemNum" />
  </view>
</template>
<script>
  import ProceedModal from './comps/ProceedModal.vue';
  import { getUnitsList } from '@/api/modules/commodity/index';

  export default {
    name: 'order',
    components: {
      ProceedModal,
    },
    data() {
      return {
        paperName: '2022年二级建筑师模拟考试',
        commodityId: '',
        tabList: [{ name: '全部考试' }],
        activeTabIndex: 0,
        isBought: false,
        paperList: [
          {
            productName: '建设工程项目成本管理',
            srcCount: 20,
            doSrcCount: '2',
            correctRate: '1',
            srcStatus: 1,
          },
          {
            productName: '建设工程项目成本管理',
            srcCount: 20,
            doSrcCount: '2',
            correctRate: '1',
            srcStatus: 0,
          },
        ],
        problemNum: 0,
      };
    },
    onLoad(options) {
      this.getUnitsList(options.id);
      this.isBought = options.isBought;
    },
    methods: {
      async getUnitsList(commodityId) {
        const res = await getUnitsList({ commodityId });
        if (res.body.subjects) this.tabList.push(...res.body.subjects);
        let list = res.body.units;
        this.tabList.map((item, index) => {
          item.paperList = [];
          if (index != 0) {
            list.map((data) => {
              if (data.subjectId == item.id) {
                data.subjectName = item.name;
                item.paperList.push(data);
              }
            });
          }
        });
        this.tabList[0].paperList = [...res.body.units];
        this.paperName = res.body.name;
        this.commodityId = res.body.commodityId;
      },
      selectTab(num) {
        this.activeTabIndex = num;
      },
    },
  };
</script>
<style lang="scss" scoped>
  .unitName {
    width: 370rpx;
  }
  .page-bg {
    text-align: center;
    display: flex;
    flex-flow: column;
    height: 100vh;
    .select-value {
      display: flex;
      height: 75rpx;
      line-height: 45px;
      padding: 0 16px;
      color: #989ead;
      overflow-x: scroll;
      .tab-item {
        margin-right: 64rpx;
      }
      .active-tab-item {
        color: #323949;
        font-weight: 700;
        &::after {
          content: '';
          width: 40rpx;
          height: 8rpx;
          border-radius: 4rpx;
          background: #475ffd;
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
  }
  .paper-msg {
    height: 256rpx;
    .project-name {
      margin: 32rpx auto 16rpx auto;
    }
    .tip-content {
      margin: auto;
    }
  }
  .sbuject-list {
    flex: 1;
    background-color: #f5f6fa;
    padding: 32rpx;
    overflow-y: scroll;
    .subject-card {
      margin-bottom: 24rpx;
      padding: 32rpx;
      height: 84rpx;
      border-radius: 16rpx;
      .subject-list-item {
        text-align: left;
      }
      .text-box {
        margin-top: 8rpx;
        .text-item {
          margin-left: 12rpx;
        }
      }
      .button-flex {
        display: flex;
        align-items: center;
        .question-button {
          margin-right: 16rpx;
          width: 144rpx;
          height: 48rpx;
          border-radius: 36rpx;
          background: #eef2ff;
          color: #475ffd;
          font-size: 24rpx;
          font-weight: 700;
          text-align: center;
          line-height: 48rpx;
          &:active {
            opacity: 0.8;
          }
        }
        .start-button {
          width: 144rpx;
          height: 48rpx;
          border-radius: 36rpx;
          background: #475ffd;
          color: #eef2ff;
          font-size: 24rpx;
          font-weight: 700;
          text-align: center;
          line-height: 48rpx;
          &:active {
            opacity: 0.8;
          }
        }
      }
    }
  }
  .no-card {
    width: 344rpx;
    height: 344rpx;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%);
  }
</style>
