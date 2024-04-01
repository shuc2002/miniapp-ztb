<template>
  <view>
    <u-tabs-swiper
      :current="current"
      @change="onChange"
      :list="tabs"
      :is-scroll="false"
      active-color="#E51600"
    ></u-tabs-swiper>
    <!-- <ChapterCourse /> -->
    <view class="chapter-list-wrap">
      <RecursionLevelList :list="list" :current="currentType" :supplierId="supplierId" />
    </view>
  </view>
</template>

<script>
  // import ChapterCourse from '@/components/ChapterCourse/ChapterCourse';
  import RecursionLevelList from '@/components/ChapterCourse/RecursionLevelList';
  import { fetchCourseInfo, getProductIds, assembleData } from '@/api/modules/chapterCourse/index';
  import { fetchGetStudyStat } from '@/api/modules/common/index';
  // import { fetchGetStudyStat } from '@/api/modules/common/index';
  import { flatList, tabEnum } from './utils/index';
  // import list from './utils/data.json';

  let originList = null;
  export default {
    name: 'home',
    components: {
      // ChapterCourse,
      RecursionLevelList,
    },
    data() {
      return {
        current: 1,
        list: [],
        tabs: [
          //  0 资料, 1 视频 , 2 考试练习 ,4直播
          {
            name: '视频',
          },
          {
            name: '资料',
          },
          {
            name: '直播',
          },
          {
            name: '题库',
          },
        ],
        supplierId: '', // 供应商id
        option: {},
      };
    },
    computed: {
      currentType() {
        return tabEnum[this.current];
      },
    },
    onLoad(option) {
      const { type = 0 } = option;
      this.option = option;
      this.getCourseList({ ...option, type: tabEnum[type] });
    },
    methods: {
      // TODO: 多层级嵌套
      handleCurrentType(val) {
        const list = this.list.map((item) => {
          if (item.id === val.id) {
            return { ...item, isExpand: !item.isExpand };
          }
          return item;
        });
        this.list = list;
      },
      onChange(current) {
        this.current = current;
        this.getCourseList({ ...this.option, type: tabEnum[current] });
      },
      async getCourseList(data) {
        const res = await fetchCourseInfo(data);
        let { constructs = [], supplierId = '' } = res?.body || {};
        this.supplierId = supplierId;
        // 利用缓存重新组织树结构
        const productIds = getProductIds(constructs, 'P');
        const statics = await fetchGetStudyStat({ productIds });
        constructs = assembleData(constructs, statics.body);
        originList = flatList(constructs);
        this.list = originList;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .chapter-list-wrap {
    margin-top: 80rpx;
    padding: 0 30rpx;
  }
</style>
