<template>
  <view class="tree-select-contain">
    <!-- 选中的数据 -->
    <view class="select-value text-size-sn common-text">
      <view
        v-for="(item, key) in tabList"
        :key="key"
        class="tab-item"
        :class="activeTabIndex === key ? 'active-tab-item' : ''"
        @tap="selectTab(key)"
      >
        {{ item }}</view
      >
    </view>
    <scroll-view
      scroll-x
      style="width: 100%; height: 100%"
      :scroll-left="scrollLeft"
      :scroll-with-animation="true"
    >
      <view class="scroll-box" :class="{ 'width-per150': thirdWidth, 'width-per200': fourWidth }">
        <view class="col">
          <ScrollList
            @clickItem="clickItem"
            :level="1"
            :dataList="treeData"
            :activeNum="activedNavIndex"
          />
        </view>
        <view class="col">
          <ScrollList
            @clickItem="clickItem"
            :level="2"
            :dataList="colItems[0]"
            :activeNum="activedSubIndex"
          />
        </view>
        <view class="col" v-if="colItems[1].length > 0">
          <ScrollList
            @clickItem="clickItem"
            :level="3"
            :dataList="colItems[1]"
            :activeNum="activedThiredIndex"
          />
        </view>
        <view class="col" v-if="colItems[2].length > 0">
          <ScrollList @clickItem="clickItem" :level="4" :dataList="colItems[2]" />
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
  import ScrollList from './ScrollList.vue';
  export default {
    props: {
      titleText: { type: String, default: '请选择' },
      treeData: { type: Array, default: () => [] },
      maxSelected: { type: Number, default: 1 },
      selectedValues: { type: Array, default: () => [] },
    },
    data() {
      return {
        scrollLeft: 0,
        activeTabIndex: 0,
        activedNavIndex: 0,
        activedSubIndex: null,
        activedThiredIndex: null,
        colItems: [[], [], []],
        selectedItems: [], //选中的数据
        tabList: ['请选择'],
      };
    },
    computed: {
      thirdWidth() {
        return Boolean(this.colItems[1].length > 0 && this.colItems[2].length == 0);
      },
      fourWidth() {
        return Boolean(this.colItems[2].length > 0);
      },
    },
    watch: {
      selectedValues: {
        handler: function () {
          this.initChange();
        },
        immediate: true,
      },
      treeData() {
        this.initChange();
      },
    },
    methods: {
      /**点击第一列**/
      clickItem(data, index, level) {
        this.activeTabIndex = level - 1;
        if (data.children.length > 0) {
          this.activedNavIndex = level == 1 ? index : this.activedNavIndex;
          this.activedSubIndex = level < 2 ? null : level == 2 ? index : this.activedSubIndex;
          this.activedThiredIndex = level < 3 ? null : level == 2 ? index : this.activedThiredIndex;
          this.tabList = this.tabList.slice(0, level - 1);
          this.tabList.splice(level - 1, 1, data.name);
          this.tabList.splice(level, 1, '请选择');
          //更新数组数据
          this.colItems.splice(level - 1, 1, data.children);
          this.scrollLeft = this.scrollLeft + wx.getSystemInfoSync().windowWidth / 2;
        } else {
          //selectedItems发生了变化，需要更新选中状态
          this.$emit('doConfirm', data);
        }
      },
      /**
       * 初始化选中状态
       * **/
      initChange() {
        //根据外部出入的ids，找出每个选中值的上级下标
        let col1 = this.treeData || [];
        let flag = false;
        for (let i = 0; i < col1.length; i++) {
          let col2 = col1[i].children || [];
          for (let j = 0; j < col2.length; j++) {
            let col3 = col2[j].children || [];
            for (let k = 0; k < col3.length; k++) {
              if (this.selectedValues.indexOf(col3[k].value) > -1) {
                this.selectedItems.push({
                  navIndex: i,
                  subIndex: j,
                  thirdIndex: k,
                  value: col3[k].value,
                  label: col3[k].label,
                });
                if (!flag) {
                  this.activedNavIndex = i;
                  this.activedSubIndex = j;
                  flag = true;
                }
              }
            }
          }
        }
      },
      // tab选择
      selectTab(index) {
        this.activeTabIndex = index;
        this.scrollLeft = (wx.getSystemInfoSync().windowWidth / 2) * index;
      },
    },
    components: { ScrollList },
  };
</script>

<style lang="scss" scoped>
  @import './ExamSelect.scss';
</style>
