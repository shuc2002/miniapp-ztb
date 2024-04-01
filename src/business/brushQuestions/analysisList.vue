<!--
* @desc 查看解析
* @author 江玉龙
* @date 2022年05月31日
-->
<template>
  <view class="common-bg">
    <!-- 头部组件 -->
    <AnalysisTop
      @handleWrong="handleWrong"
      :showWrong="showWrong"
      :total="total"
      :hasWrong="hasWrong"
    />
    <view class="list-box">
      <!-- 题目组件 -->
      <QuesAnalysis
        ref="quesAnalysis"
        :list="showWrong ? wrongList : list"
        @handleCol="handleCol"
      />
    </view>
    <!-- 按钮 -->
    <view style="height: 180rpx" />
    <view class="btn-box">
      <button
        class="redo-btn flex-center"
        @tap="commonFun.redirectTo(`/business/brushQuestions/index?code=${code}`)"
        >重做一遍</button
      >
      <!-- <button
        class="bank-btn flex-center"
        @tap="
          vipId
            ? commonFun.routeTo(`/page_commodity/commodity/pages/commodityBank?id=${vipId}`)
            : questionBankId
            ? commonFun.redirectTo(
                `/page_commodity/courseList/index?id=${questionBankId}&isOrder=true`
              )
            : toToast()
        "
        >进入大题库</button
      > -->
    </view>
  </view>
</template>
<script>
  import { getStatistics } from '@/api/modules/question/exercise';
  import AnalysisTop from './comps/AnalysisTop.vue';
  import QuesAnalysis from './comps/QuesAnalysis.vue';
  import { addFavorite, removeFavorite } from '@/api/modules/user/aggregate.ts';
  export default {
    name: 'analysisList',
    components: { AnalysisTop, QuesAnalysis },
    props: {},
    data() {
      return {
        wrongList: [],
        showWrong: false,
        code: '',
        total: 0,
        card: '',
      };
    },
    onLoad(options) {
      this.code = options.code;
      this.card = JSON.parse(options.card);
      console.log(this.card, 'card', this.code);
      this.getWrongList();
      this.getSum();
      /* #ifndef MP-TOUTIAO */
      if (this.$refs.quesAnalysis) {
        this.$refs.quesAnalysis.getAdvertLists();
      }
      /* #endif */
      /* #ifdef MP-TOUTIAO */
      let that = this;
      setTimeout(() => {
        that.$refs.quesAnalysis.getAdvertLists();
      }, 100);

      /* #endif */
    },
    computed: {
      list() {
        return this.$store.getters.getDailyAnalysis;
      },
      vipId() {
        return uni.getStorageSync('vipId');
      },
      questionBankId() {
        return uni.getStorageSync('questionBankId');
      },
      hasWrong() {
        return this.wrongList.length > 0;
      },
    },
    methods: {
      //获取统计
      async getSum() {
        const res = await getStatistics();
        this.total = res.body.total;
      },
      getWrongList() {
        this.wrongList = [];
        this.card.map((item, index) => {
          if (!item) {
            this.wrongList.push(this.list[index]);
          }
        });
      },
      // 点击只选错题
      handleWrong(e) {
        this.showWrong = e;
      },
      // 收藏该题
      async handleCol(val) {
        if (this.showWrong) {
          if (this.wrongList[val.key].isCollected) {
            await removeFavorite({
              questionId: val.id,
              index: val.index,
            });
            this.$set(this.wrongList[val.key], 'isCollected', false);
          } else {
            await addFavorite({ code: this.code, id: val.id, index: val.index });
            this.$set(this.wrongList[val.key], 'isCollected', true);
          }
        } else {
          if (this.list[val.key].isCollected) {
            await removeFavorite({
              questionId: val.id,
              index: val.index,
            });
            this.$set(this.list[val.key], 'isCollected', false);
          } else {
            await addFavorite({ code: this.code, id: val.id, index: val.index });
            this.$set(this.list[val.key], 'isCollected', true);
          }
        }
      },
      toToast() {
        uni.showToast({
          title: '该商品未上架，敬请等待',
          icon: 'none',
        });
      },
    },
  };
</script>
<style lang="scss" scoped>
  .list-box {
    height: calc(100vh - 320rpx);
    padding-bottom: 30rpx;
    overflow-y: scroll;
  }
  .btn-box {
    width: 750rpx;
    height: 148rpx;
    background-color: #ffffff;
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: center;
    padding-top: 32rpx;
    .again-btn {
      width: 328rpx;
      height: 96rpx;
      border-radius: 24rpx;
      border: 2px solid #475ffd;
      color: #475ffd;
      font-size: 32rpx;
      font-weight: 700;
      &:active {
        opacity: 0.8;
      }
    }
    // .bank-btn {
    //   width: 328rpx;
    //   height: 96rpx;
    //   border-radius: 24rpx;
    //   color: #ffffff;
    //   font-size: 32rpx;
    //   font-weight: 700;
    //   background-color: #475ffd;
    //   &:active {
    //     opacity: 0.8;
    //   }
    // }
    .redo-btn {
      width: 654rpx;
      height: 96rpx;
      border-radius: 36rpx;
      background: #475ffd;
      color: #ffffff;
      font-size: 32rpx;
      font-weight: 700;
      font-family: 'PingFang SC';
    }
  }
</style>
