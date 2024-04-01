<!--
* @desc 考试项目列表
* @author 江玉龙
* @date 2022年06月02日
-->
<template>
  <view class="tree-select-contain">
    <!-- 选中的数据 -->
    <view class="select-value text-size-sn common-text">
      <view v-for="(item, key) in tabList" @tap="tabClick(key)" :key="key" class="tab-item">{{
        item
      }}</view>
    </view>
    <scroll-view scroll-y style="width: 100%; height: 100%" :scroll-with-animation="true">
      <view class="scroll-box">
        <!-- 我的考试 -->
        <view class="col-1">
          <ScrollList ref="scroll" @clickItem="clickOne" :dataList="curStartList" :level="1" />
        </view>
        <!-- 全部考试 -->
        <view class="col-2">
          <ScrollList
            ref="subscroll"
            @clickItem="clickSecond"
            :dataList="colItems"
            :level="2"
            :ifMine="ifMine"
          />
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
  import ScrollList from './ScrollList.vue';
  export default {
    components: { ScrollList },
    props: {
      startList: { type: Array, default: () => [] },
      allExam: { type: Array, default: () => [] },
      myExam: { type: Array, default: () => [] },
    },
    data() {
      return {
        selectedItems: [], //选中的数据
        tabList: ['请选择'],
        colItems: [], // 第二组数据
        ifMine: false,
        curStartList: [],
        isSub: false,
      };
    },

    watch: {
      startList: {
        handler: function() {
          this.curStartList = this.startList;
          if (this.myExam && this.myExam.length > 0) {
            this.startToMyExam(this.myExam, this.startList[0], 0);
          } else {
            if (this.startList && this.startList.length > 1) this.ifExamOne(this.startList[1], 1);
          }
        },
        immediate: true,
      },
      myExam: {
        handler: function(value) {
          if (value && value.length > 0) {
            this.startToMyExam(this.myExam, this.startList[0], 0);
          } else {
            if (this.startList && this.startList.length > 1) this.ifExamOne(this.startList[1], 1);
          }
        },
        immediate: true,
      },
    },
    mounted() {
      this.curStartList = this.startList;
      if (this.myExam && this.myExam.length > 0) {
        this.startToMyExam(this.myExam, this.startList[0], 0);
      } else {
        if (this.startList && this.startList.length > 1) this.ifExamOne(this.startList[1], 1);
      }
    },
    methods: {
      // 点击第一列
      clickOne(data, index) {
        // 更新tab数据
        if (this.isSub) {
          if (data.type == 1) {
            this.tabList.splice(1, 2, data.value);
          } else {
            this.tabList.splice(1, 2, data.value, '请选择');
          }
        } else {
          this.tabList[0] = data.value;
          this.tabList.splice(1, 1, '请选择');
        }
        //更新数组数据
        if (index == 0 && !this.isSub) {
          this.ifMine = true;
          this.colItems = this.myExam;
        } else {
          this.ifMine = false;
          this.colItems = data.children ? data.children : [];
          if (data.type == 1) {
            this.$emit('clickSecond', data, this.ifMine);
          }
        }
      },
      // 点击第二列
      clickSecond(data, index) {
        if (this.ifMine) {
          this.tabList.splice(1, 1, data.title);
          this.$emit('clickSecond', data, this.ifMine);
        } else {
          if (data.type == 0) {
            this.curStartList = this.colItems;
            this.$refs.scroll.activeNum = index;
            this.isSub = true;
            this.tabList.splice(this.tabList.length - 1, 1, data.value, '请选择');
            // this.tabList.splice(this.tabList.length - 1, 1, '请选择');
            this.clickOne(data, index);
          } else {
            this.tabList.splice(this.tabList.length - 1, 1, data.value);
            this.$emit('clickSecond', data, this.ifMine);
          }
        }
        // this.$emit('clickSecond', data, this.ifMine);
      },
      // 如果只有全部考试
      ifExamOne(data, index) {
        this.$refs.scroll.activeNum = index;
        this.colItems = data.children ? data.children : [];
        setTimeout(() => {
          this.clickOne(data, index);
        }, 100);
      },
      startToMyExam(val, data, index) {
        this.$refs.scroll.activeNum = index;
        this.colItems = val;
        setTimeout(() => {
          this.clickOne(data, index);
        }, 100);
      },
      tabClick(index) {
        if (index <= this.tabList.length - 1) {
          this.curStartList = this.startList;
          this.isSub = false;
          this.tabList = ['请选择'];
          this.$refs.subscroll.activeNum = -1;
          if (this.myExam && this.myExam.length > 0) {
            this.startToMyExam(this.myExam, this.startList[0], 0);
          } else {
            if (this.startList && this.startList.length > 1) this.ifExamOne(this.startList[1], 1);
          }
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .tree-select-contain {
    height: calc(100vh - 200rpx);

    .select-value {
      display: flex;
      height: 98rpx;
      line-height: 45px;
      padding: 0 16px;

      .tab-item {
        margin-right: 64rpx;

        &:last-child {
          margin-right: 0;
          color: #e51600;
        }
      }
      .active-tab-item {
        &::after {
          content: '';
          display: block; //块级元素
          width: 32rpx;
          height: 4rpx;
          border-radius: 4rpx;
          // background: #475ffd;
          background: #e51600;
          margin: auto;
        }
      }
    }

    .scroll-box {
      height: calc(100% - 46px);
      width: 100%;
      display: flex;
      .col-1 {
        width: 40%;
        background-color: #ffffff;
      }
      .col-2 {
        width: 60%;
        background-color: #f5f6fa;
      }
    }
  }
</style>
