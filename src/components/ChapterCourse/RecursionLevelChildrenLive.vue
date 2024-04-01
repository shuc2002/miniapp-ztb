<template>
  <div>
    <div v-for="item in list" :key="item.name">
      <div v-if="item.children && item.children.length > 0" class="ccccc">
        <div class="row" @click="openClose" :data-name="item.name">
          <!-- <span class="line" ></span> -->
          <span :class="hasPreClickId(preClickIdArr, item.name) ? 'line' : '' " ></span>
          <text
            class="tree_add iconfont"
            :class="
              hasPreClickId(preClickIdArr, item.id)
                ? 'icon-directory_retract-2'
                : 'icon-directory_expand_2'
            "
            style="color: #e51600;"
          ></text>
          <span class="title">{{ item.name }}</span>
          <span
            v-if="item.isUnit"
            :data-sectionid="item.name"
            :data-chapterid="chapterid"
            @click="$emit('callback', item)"
            >
            <!-- <text v-if="item.isPurchase" class="iconfont to-study">去学习</text>
            <text v-else class="iconfont icon-lock"></text> -->
          </span>
          <div class="progress">
            <div class="progress-text">
              <span>{{ item.questionCount }}</span>
            </div>
            <!-- <progress
              percent="{{item.studyCount/item.questionCountInt*100}}"
              class="progress__line"
              border-radius="10"
              stroke-width="3"
              activeColor="#FC8118"
            ></progress> -->
          </div>
        </div>
        <RecursionLevelChildrenLive
          :list="item.children"
          v-if="hasPreClickId(preClickIdArr, item.name)"
          :chapterid="chapterid"
          :current="current"
          @callback="(curr) => $emit('callback', curr)"
        />
      </div>
      <div v-else>
        <div class="row">
          <span :class="hasPreClickId(preClickIdArr, item.name) ? 'line-bottom' : 'line-bottom' "></span>
          <span class="tree_last"></span>
          <span class="title">{{ item.name }}</span>
          <div
            v-if="item.info"
            style="position: absolute; color: #9fa1a4; font-size: 24rpx;top:75rpx"
            class="flex"
          >
            <div :style="{ color: item.resourceStatus === 1 ? '#E51600' : '#9fa1a4' }">
              {{
                item.resourceStatus
                  ? item.resourceStatus == 1
                    ? '直播中'
                    : item.resourceStatus == 2
                    ? '已结束'
                    : item.resourceStatus == 40
                    ? '已关闭'
                    : '已封禁'
                  : '未开始'
              }}
            </div>
            <div style="margin-left: 16rpx;">
              {{ item.info }}
            </div>
            <!-- <text v-if="item.isPurchase" class="iconfont to-study">去学习</text>
            <text v-else class="iconfont icon-lock"></text> -->
          </div>
          <!-- <span> {{item.id}}</span> -->
          <div class="progress">
            <div class="progress-text">
              <span>{{ item.questionCount }}</span>
              <!-- <text></text> -->
            </div>
            <!-- <progress
              percent="{{item.studyCount/item.questionCountInt*100}}"
              class="progress__line"
              border-radius="10"
              stroke-width="3"
              activeColor="#FC8118"
            ></progress> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { COURSE_TYPE } from '@/consts/index.ts';
  import RecursionLevelChildrenLive from './RecursionLevelChildrenLive.vue';
  export default {
    name: 'RecursionLevelChildrenLive',
    components: {
      RecursionLevelChildrenLive,
    },
    props: ['list', 'chapterid', 'current'],
    data() {
      return {
        preClickIdArr: [],
        COURSE_TYPE,
      };
    },
    watch: {
      list() {
        let arr = [];
        this.list.forEach((item) => {
          if (item.spread) {
            arr.push(item.name);
          }
        });
        this.preClickIdArr = arr;
      },
    },
    methods: {
      handleItem(item) {
        const { next = [], units = [] } = item;
        return next ? (units ? next.concat(units) : next) : [];
      },
      openClose(e) {
        let currentId = e.currentTarget.dataset.name;
        let preClickIdArr = JSON.parse(JSON.stringify(this.preClickIdArr));
        if (preClickIdArr.indexOf(currentId) == -1) {
          preClickIdArr.push(currentId);
        } else {
          preClickIdArr.splice(preClickIdArr.indexOf(currentId), 1);
        }
        this.preClickIdArr = preClickIdArr;
      },
      hasPreClickId(arrData, id) {
        if (arrData.indexOf(id) == -1) {
          // console.log('false-222--', arrData, id);
          return false;
        } else {
          // console.log('true-222--', arrData, id);
          return true;
        }
      },
    },
  };
</script>

<style scoped>
  .row {
    position: relative;
    min-height: 25px;
    padding: 10px 0 10px 20px;
  }
  .line {
    position: absolute;
    width: 1px;
    top: 0;
    top: 32px;
    bottom: 0;
    bottom: -39px;
    left: 6px; 
    /* background-color: #eee; */
    background-color: #E51600;
  }
  .line-bottom {
    position: absolute;
    width: 1px;
    top: 0;
    top: 32px;
    bottom: -16px;
    left: 6px; 
    /* background-color: #eee; */
    background-color: #E51600;
  }
  .tree__bottom {
    position: absolute;
    left: 0;
    top: 2px;
    width: 15px;
    height: 15px;
  }
  .tree_add {
    position: absolute;
    left: 0;
    top: 14px;
    /* width: 25rpx; */
    /* height: 25rpx; */
  }
  .tree_last {
    position: absolute;
    left: 5px;
    top: 18px;
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: #fc8118;
  }
  .title {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 225px;
    color: #4e4e4e;
  }

  .to-study {
    font-size: 12px;
  }
  .progress {
    margin-top: 15px;
    width: 225px;
  }
  .progress-text {
    font-size: 12px;
    color: #9a9a9a;
  }
  .progress__line {
    margin-top: 5px;
  }
  .progress-text > text {
    margin-right: 40px;
  }
  .share {
    display: inline;
    padding: 0;
    margin: 0;
    line-height: normal;
    background-color: transparent;
    border: none;
  }
  .share::after {
    border: none;
  }
</style>
