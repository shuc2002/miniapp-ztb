<template>
  <view class="flex-col page">
    <view class="flex-col justify-start flex-auto group_3">
      <view class="flex-col">
        <view class="flex-col group_4">
          <view class="flex-row justify-between items-center group_5">
            <view class="flex-row items-center space-x-32">
              <text class="text_3" v-for="(item, index) in tabList" :key="item.id">
                <text :class="index === currentIndex ? 'text_3' : 'font_3 text_4'">{{
                  item.name
                }}</text>
              </text>
            </view>
            <image
              class="image_6"
              src="https://codesign-v2-1258344706.cos.ap-guangzhou.myqcloud.com/codefun///16862752773888417352.png"
            />
          </view>
          <view class="self-start section"></view>
        </view>
        <view class="flex-col group_6">
          <RecursionLevelList :list="list" callback="handleNavigation" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import { getDisplayList } from '@/api/modules/commodity/index.ts';
  import { flatList } from '@/course/chapter/utils/index';
  import RecursionLevelList from '@/components/ChapterCourse/RecursionLevelList';

  export default {
    components: {
      RecursionLevelList,
    },
    data() {
      return {
        list: [],
        currentIndex: 0,
      };
    },
    // {"subjectId":"10079","projectId":"10078","type":4,"displayAreaId":"116892147755843584", "isMulti":false}
    onLoad(options) {
      this.getDisplaySingleData(options);
    },
    computed: {
      tabList() {
        const list = this.$store.getters.getProjectList;
        return JSON.parse(list);
      },
    },
    methods: {
      handleNavigation(item) {
        console.log('item--', item);
      },
      async getDisplaySingleData(options) {
        const res = await getDisplayList({
          index: 0,
          isMulti: false,
          row: 50,
          type: 4,
          ...options,
        });
        console.log('22--', res);
        let products = res?.body[0]?.products || [];
        let result = [];
        for (let i = 0; i < products.length; i++) {
          let { id, name, subjectName, constructs } = products[i];
          result[i] = {
            id,
            name,
            subjectName,
            children: flatList(constructs, 1),
          };
        }
        console.log('33--', result);
        this.list = result;
      },
    },
  };
</script>

<style scoped lang="css">
  .flex-row {
    display: flex;
    flex-direction: row;
  }

  .flex-col {
    display: flex;
    flex-direction: column;
  }

  .justify-start {
    justify-content: flex-start;
  }

  .justify-end {
    justify-content: flex-end;
  }

  .justify-center {
    justify-content: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  .justify-around {
    justify-content: space-around;
  }

  .justify-evenly {
    justify-content: space-evenly;
  }

  .items-start {
    align-items: flex-start;
  }

  .items-end {
    align-items: flex-end;
  }

  .items-center {
    align-items: center;
  }

  .items-baseline {
    align-items: baseline;
  }

  .items-stretch {
    align-items: stretch;
  }

  .self-start {
    align-self: flex-start;
  }

  .self-end {
    align-self: flex-end;
  }

  .self-center {
    align-self: center;
  }

  .self-baseline {
    align-self: baseline;
  }

  .self-stretch {
    align-self: stretch;
  }

  .flex-1 {
    flex: 1 1 0%;
  }

  .flex-auto {
    flex: 1 1 auto;
  }

  .grow {
    flex-grow: 1;
  }

  .grow-0 {
    flex-grow: 0;
  }

  .shrink {
    flex-shrink: 1;
  }

  .shrink-0 {
    flex-shrink: 0;
  }

  .relative {
    position: relative;
  }
  .page {
    background-color: #ffffff;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
  }
  .image_4 {
    width: 32rpx;
    height: 32rpx;
  }
  .font_2 {
    font-size: 32rpx;
    font-family: PingFang SC;
    line-height: 30rpx;
    color: #333333;
  }
  .group_3 {
    padding-top: 20rpx;
    overflow-y: auto;
  }
  .group_4 {
    padding: 0 32rpx;
    border-bottom: solid 1rpx #f6f6f6;
  }
  .group_5 {
    padding-bottom: 16rpx;
  }
  .space-x-32 > view:not(:first-child),
  .space-x-32 > text:not(:first-child),
  .space-x-32 > image:not(:first-child) {
    margin-left: 64rpx;
  }
  .text_3 {
    color: #333333;
    font-size: 36rpx;
    font-family: PingFang SC;
    font-weight: 600;
    line-height: 33rpx;
  }
  .font_3 {
    font-size: 28rpx;
    font-family: PingFang SC;
    line-height: 26rpx;
    color: #4e5969;
  }
  .text_4 {
    opacity: 0.6;
  }
  .image_6 {
    width: 30rpx;
    height: 24rpx;
  }
  .section {
    margin-left: 48rpx;
    background-color: #e51600;
    border-radius: 4rpx;
    width: 30rpx;
    height: 8rpx;
  }
  .group_6 {
    padding: 34rpx 30rpx 336rpx;
    /* height: 685px; */
  }
  .list-item {
    background-color: #ffffff;
  }
  .group_7 {
    margin: 0 24rpx;
    padding: 44rpx 0;
    border-bottom: solid 1rpx #f6f6f6;
  }
  .list-item_2 {
    padding: 46rpx 24rpx;
    background-color: #ffffff;
  }
  .group_8 {
    margin-top: -58rpx;
    padding-top: 58rpx;
  }
  .section_2 {
    background-color: #e51600;
    height: 108rpx;
  }
  .pos {
    position: absolute;
    left: 40rpx;
    right: 708rpx;
    top: 0;
  }
  .group_9 {
    margin-top: -50rpx;
    padding-top: 50rpx;
  }
  .section_4 {
    padding: 46rpx 30rpx;
    background-color: #ffffff;
  }
  .section_3 {
    background-color: #e51600;
    height: 100rpx;
  }
  .pos_2 {
    position: absolute;
    left: 40rpx;
    right: 708rpx;
    top: 0;
  }
  .section_6 {
    padding: 40rpx 24rpx;
    background-color: #ffffff;
  }
  .section_7 {
    padding: 12rpx 16rpx 12rpx 20rpx;
    background-color: #fde8e6;
    border-radius: 72rpx;
    height: 46rpx;
  }
  .image_7 {
    width: 22rpx;
    height: 22rpx;
  }
  .font_4 {
    font-size: 24rpx;
    font-family: PingFang SC;
    line-height: 21rpx;
    color: #e51600;
  }
  .text_5 {
    line-height: 22rpx;
  }
  .group_10 {
    margin: 0 24rpx;
    padding: 40rpx 0;
    border-bottom: solid 1rpx #f6f6f6;
  }
  .section_5 {
    background-color: #e51600;
    height: 140rpx;
  }
  .pos_3 {
    position: absolute;
    left: 40rpx;
    right: 708rpx;
    top: 0;
  }
  .group_11 {
    margin: 0 30rpx;
    padding: 48rpx 0 42rpx;
    border-top: solid 1rpx #f6f6f6;
    border-bottom: solid 1rpx #f6f6f6;
  }
  .space-x-6 > view:not(:first-child),
  .space-x-6 > text:not(:first-child),
  .space-x-6 > image:not(:first-child) {
    margin-left: 12rpx;
  }
</style>
