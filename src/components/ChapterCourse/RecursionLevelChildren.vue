<template>
  <div>
    <div v-for="(item, index) in list" :key="item.name">
      <div v-if="item.next && item.next.length > 0">
        <div class="row-two">
          <div class="row" @click="openClose" :data-name="item.name">
            <div class="twolevel" v-if="item.next && item.next.length > 0">
              <!-- 根据类型 判断icon -->
              <div v-if="item.nodeType == 'P'">
                <div
                  v-if="hasPreClickId(preClickIdArr, item.name)"
                  class="tree_add icon iconfont icon-expand_1_1 ioncont-level-1"
                >
                </div>
                <div v-else class="tree_add icon iconfont icon-expand_1_1 ioncont-level-1"> </div>
              </div>
              <div v-if="item.nodeType == 'C'">
                <img
                  src="@/static/svgs/expand_2_1.svg"
                  alt=""
                  v-if="hasPreClickId(preClickIdArr, item.name)"
                  class="tree_add icon"
                />
                <img src="@/static/svgs/expand_2_2.svg" alt="" v-else class="tree_add icon " />
              </div>
              <div v-if="item.nodeType == 'S'">
                <img
                  src="@/static/svgs/expand_3_1.svg"
                  alt=""
                  v-if="hasPreClickId(preClickIdArr, item.name)"
                  class=" icon tree_add_S"
                />
                <img src="@/static/svgs/expand_3_2.svg" alt="" v-else class=" icon tree_add_S" />
              </div>
              <!-- <img
                src="@/static/svgs/expand_2_1.svg"
                alt=""
                v-if="hasPreClickId(preClickIdArr, item.name)"
                class="tree_add icon"
              />
              <img src="@/static/svgs/expand_2_2.svg" alt="" v-else class="tree_add icon" /> -->
              <div
                :class="
                  item.nodeType == 'S' ? 'title-no-margin truncate-two' : 'title truncate-two'
                "
                >{{ index + 1 + '.' + item.name }}</div
              ></div
            >
            <div class="progress-content" v-if="showSpeed">
              <div class="progress">
                <div class="progress-left">
                  <div class="percent-line">
                    <div
                      class="percent-red"
                      :style="{
                        width: Number(assembleData(item, statics).speedRate * 100).toFixed(1) + '%',
                      }"
                    ></div>
                  </div>
                  <div class="percent-number">{{
                    Number(assembleData(item, statics).speedRate * 100).toFixed(1) + '%'
                  }}</div>
                </div>
                <div class="progress-text">
                  <span
                    >{{
                      assembleData(item, statics).spnum > 9999
                        ? '9999+'
                        : assembleData(item, statics).spnum
                    }}人已学习</span
                  >
                </div>
              </div>
              <div
                v-if="item.isUnit"
                :data-sectionid="item.name"
                :data-chapterid="chapterid"
                :class="handleLock(item) ? 'btn' : 'lock-btn'"
                @click="$emit('callback', item, productId)"
              >
                <text v-if="handleLock(item)" class="iconfont to-study">练习</text>
                <text v-else class="iconfont icon-lock lock"></text>
              </div>
            </div>
            <span
              v-if="item.isUnit"
              :data-sectionid="item.name"
              :data-chapterid="chapterid"
              :class="handleLock(item) ? 'btn' : 'lock-btn'"
              @click="$emit('callback', item, productId)"
            >
              <text v-if="handleLock(item)" class="iconfont to-study">练习</text>
              <text v-else class="iconfont icon-lock lock"></text>
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
          <RecursionLevelChildren
            :list="item.next"
            v-if="hasPreClickId(preClickIdArr, item.name)"
            :chapterid="chapterid"
            :statics="statics"
            :current="current"
            :productId="productId"
            :showSpeed="showSpeed"
            @callback="
              (currItem, productId) => $emit('callback', assembleData(currItem, statics), productId)
            "
          />
        </div>
      </div>
      <div v-else>
        <div class="children-content">
          <div class="row">
            <div>
              <img
                src="@/static/svgs/practice.svg"
                alt=""
                v-if="item.type === 0"
                class="tree_add_unit icon"
              />
              <img
                src="@/static/svgs/videocast.svg"
                alt=""
                v-if="item.type === 1"
                class="tree_add_unit icon"
              />
              <img
                src="@/static/svgs/practice.svg"
                alt=""
                v-if="item.type === 2"
                class="tree_add_unit icon"
              />
              <img
                src="@/static/svgs/exams.svg"
                alt=""
                v-if="item.type === 3"
                class="tree_add_unit icon"
              />
              <img
                src="@/static/svgs/live.svg"
                alt=""
                v-if="item.type === 4"
                class="tree_add_unit icon"
              />
              <div class="title-unit truncate-two">{{ item.name }}</div>
            </div>
            <div
              class="progress-content"
              v-if="item.type != 4 && showSpeed"
              @click="$emit('callback', item, productId)"
            >
              <div class="progress">
                <div class="progress-left" v-if="handleLock(item)">
                  <div class="percent-line">
                    <div
                      class="percent-red"
                      :style="{
                        width: Number(assembleData(item, statics).speedRate * 100).toFixed(1) + '%',
                      }"
                    ></div>
                  </div>

                  <div class="percent-number" v-if="item.type === 1 || item.type === 4">
                    {{
                      `${
                        assembleData(item, statics).done
                          ? handleDuration(
                              assembleData(item, statics).done,
                              assembleData(item, statics).total,
                              0
                            )
                          : 0
                      }/${
                        assembleData(item, statics).total
                          ? handleDuration(
                              assembleData(item, statics).total,
                              assembleData(item, statics).total,
                              1
                            )
                          : 0 + '秒'
                      }`
                    }}
                    <!-- {{
                      assembleData(item, statics).done
                        ? handleDuration(
                            assembleData(item, statics).done,
                            assembleData(item, statics).total,
                            0
                          )
                        : 0
                    }} -->
                    <!-- {{ '/'
                    }}{{
                      assembleData(item, statics).total
                        ? handleDuration(
                            assembleData(item, statics).total,
                            assembleData(item, statics).total,
                            1
                          )
                        : 0 + '秒'
                    }} -->
                  </div>
                  <div class="percent-number" v-else-if="item.type === 0">
                    {{
                      `${assembleData(item, statics).done ? assembleData(item, statics).done : 0}/${
                        assembleData(item, statics).total
                          ? assembleData(item, statics).total + '页'
                          : 0 + '页'
                      }`
                    }}
                    <!-- {{ assembleData(item, statics).done ? assembleData(item, statics).done : 0 }} -->
                    <!-- {{ '/' }}
                    {{
                      assembleData(item, statics).total
                        ? assembleData(item, statics).total + '页'
                        : 0 + '页'
                    }} -->
                  </div>
                  <div class="percent-number" v-else>
                    {{
                      `${assembleData(item, statics).done ? assembleData(item, statics).done : 0}/${
                        assembleData(item, statics).total
                          ? assembleData(item, statics).total + '道'
                          : 0 + '道'
                      }`
                    }}
                    <!-- {{ assembleData(item, statics).done ? assembleData(item, statics).done : 0 }}
                    {{ '/' }}
                    {{
                      assembleData(item, statics).total
                        ? assembleData(item, statics).total + '道'
                        : 0 + '道'
                    }} -->
                  </div>
                </div>
                <div class="progress-text" style="margin-left: 8px">
                  <span
                    >{{
                      assembleData(item, statics).spnum > 9999
                        ? '9999+'
                        : assembleData(item, statics).spnum
                    }}人已学习</span
                  >
                </div>
              </div>
              <div
                :data-sectionid="item.name"
                :data-chapterid="chapterid"
                :class="handleLock(item) ? 'btn' : 'lock-btn'"
                class="unit-study-btn"
              >
                <text v-if="handleLock(item)" class="iconfont to-study">{{
                  item.type === 0
                    ? '查看'
                    : item.type === 1
                    ? '播放'
                    : item.type === 2
                    ? '练习'
                    : item.type === 3
                    ? '考试'
                    : '播放'
                }}</text>
                <text v-else class="iconfont icon-lock lock"></text>
              </div>
            </div>
            <div class="progress-content" v-if="item.type === 4">
              <div class="progress">
                <div class="progress-left" v-if="item.status === 0 || item.status === 1">
                  <div class="progress-status" v-if="item.status === 1 || item.status === 0">
                    <span>{{ item.status === 0 ? '待直播' : '直播中' }}</span>
                  </div>
                </div>

                <div class="progress-left" v-if="item.status === 2">
                  <div class="percent-line">
                    <div
                      class="percent-red"
                      :style="{
                        width: Number(assembleData(item, statics).speedRate * 100).toFixed(1) + '%',
                      }"
                    ></div>
                  </div>
                  <div class="percent-number">{{
                    handleDuration(
                      assembleData(item, statics).done,
                      assembleData(item, statics).total,
                      0
                    ) +
                      '/' +
                      handleDuration(
                        assembleData(item, statics).total,
                        assembleData(item, statics).total,
                        1
                      )
                  }}</div>
                </div>
                <div class="progress-text" v-if="item.status === 0 || item.status === 1">
                  <span>{{ item.liveStartTime }}直播</span>
                </div>
                <div class="progress-text" v-if="item.status === 2">
                  <span>已结束</span>
                </div>
                <div class="progress-text" v-if="item.status === 20">
                  <span>已关闭</span>
                </div>
              </div>
              <div v-if="item.status != 2 || item.status != 0">
                <div
                  v-if="item.isUnit && item.status != 0"
                  :data-sectionid="item.name"
                  :data-chapterid="chapterid"
                  :class="handleLock(item) ? 'btn' : 'lock-btn'"
                  @click="$emit('callback', item, productId)"
                >
                  <text v-if="item.type != 4"
                    ><text v-if="handleLock(item)" class="iconfont to-study">{{
                      item.type === 0
                        ? '查看'
                        : item.type === 1
                        ? '播放'
                        : item.type === 2
                        ? '练习'
                        : item.type === 3
                        ? '考试'
                        : '播放'
                    }}</text>
                    <text v-else class="iconfont icon-lock lock"></text>
                  </text>
                  <text v-if="item.type === 4 && item.status === 1"
                    ><text v-if="handleLock(item)" class="iconfont to-study">播放</text>
                    <text v-else class="iconfont icon-lock lock"></text>
                  </text>
                  <text v-if="item.type === 4 && item.status === 2"
                    ><text v-if="handleLock(item)" class="iconfont to-study">回放</text>
                    <text v-else class="iconfont icon-lock lock"></text>
                  </text>
                </div>
              </div>
            </div>

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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { COURSE_TYPE } from '@/consts/index.ts';
  import RecursionLevelChildren from './RecursionLevelChildren.vue';
  import { assembleData } from '@/course/chapter/utils/index';

  export default {
    name: 'RecursionLevelChildren',
    components: {
      RecursionLevelChildren,
    },
    // props: ['list', 'chapterid', 'current', 'productId'],
    props: {
      list: {
        type: Array,
        default: () => [],
      },
      statics: {
        type: Array,
        default: () => [],
      },
      current: {
        type: Number,
        default: 0,
      },
      productId: {
        type: String,
        default: '',
      },
      chapterid: {
        type: Number || String,
        default: 0,
      },
      showSpeed: {
        type: Boolean,
        default: false,
      },
      defaultExpan: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        preClickIdArr: [],
        COURSE_TYPE,
        assembleData,
      };
    },
    watch: {
      data() {
        let arr = [];
        this.list.forEach((item) => {
          if (item.spread) {
            arr.push(item.name);
          }
        });
        this.preClickIdArr = arr;
      },
      isPreview: {
        immediate: true,
        handler(n) {
          // console.log(n, 2222);
          if (n.list && n.defaultExpan) {
            this.justOpen(n.list[0]);
          }
        },
      },
    },
    computed: {
      isPreview() {
        let list = this.list;
        let defaultExpan = this.defaultExpan;
        // console.log(9999, list, defaultExpan);
        return { list, defaultExpan };
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
          return false;
        } else {
          return true;
        }
      },
      handleDuration(times, total, type) {
        if (total < 60) {
          return type === 0 ? times : times + '秒';
        } else {
          if (type === 0) {
            //处理已学
            return Math.floor(times / 60);
          } else {
            //全部
            return Math.floor(times / 60) + '分钟';
          }
        }
        // if (type === 0) {

        //   return times < 30 ? times : Math.floor(times / 30);
        // } else {
        //   return times < 30 ? times + '秒' : Math.floor(times / 30) + '分';
        // }
        //处理已学

        // const min = Math.floor(times / 30);
        // if (min < 1) {
        //   return (times % 60) + '秒';
        // } else {
        //   return min + '分' + (times % 60) + '秒';
        // }
      },
      handleLock(item) {
        const newData = assembleData(item, this.statics);
        if (newData.isPurchase || newData.preview) {
          return true;
        } else {
          return false;
        }
      },
      justOpen(item) {
        // console.log(11111, item);
        const currentVal = item.name;
        let preClickIdArr2 = JSON.parse(JSON.stringify(this.preClickIdArr));
        if (preClickIdArr2.indexOf(currentVal) === -1) {
          preClickIdArr2.push(currentVal);
        }
        this.preClickIdArr = preClickIdArr2;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
  // 锁的颜色
  .lock {
    color: #c9cdd4;
  }
  .row-two {
    padding-left: 6px;
  }
  .row-two-nopadding {
    padding-left: 0px;
  }
  .children-content {
    background: #f6f6f6;
    // height: 160rpx;
    border-radius: 16rpx;
    opacity: 1;
    box-sizing: border-box;
    padding: 0 12px;
    // 卡片之间保持12的间距
    margin-top: 12rpx;
    // padding: 5px 12px;
    margin-bottom: 24rpx;
  }
  .row {
    position: relative;
    min-height: 25px;
    padding: 11px 0 16rpx 20px;
  }
  .twolevel {
    display: flex;
  }
  .line {
    position: absolute;
    width: 1px;
    top: 0;
    bottom: 0;
    left: 6px;
    background-color: #eee;
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
    // top: 14px;
    top: 12px;
    font-size: 40rpx;
    // margin-top: -4rpx;
    /* width: 25rpx; */
    /* height: 25rpx; */
  }
  .tree_add_unit {
    position: absolute;
    left: 0;
    // top: 14px;
    top: 14px;
    font-size: 32rpx;
  }
  .tree_add_S {
    position: absolute;
    left: -14rpx;
    // top: 14px;
    top: 12px;
    font-size: 40rpx;
    color: #333333;
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
    // display: inline-block;
    font-size: 32rpx;
    // overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
    // width: 225px;
    max-width: 588rpx;
    color: #4e4e4e;
    margin-left: 15rpx;
  }
  .title-no-margin {
    // display: inline-block;
    font-size: 32rpx;
    // overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
    // width: 225px;
    max-width: 588rpx;
    color: #4e4e4e;
    margin-left: 0rpx;
  }
  .title-unit {
    // display: inline-block;
    font-size: 28rpx;
    // overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
    // width: 225px;
    max-width: 588rpx;
    font-weight: 700;
    color: #4e4e4e;
    // margin-left: 15rpx;
    margin-left: 7rpx;
  }
  .btn {
    display: flex;
    justify-content: center;
    font-size: 14px;
    text-align: center;
    border-radius: 15px;
    color: #e51600;
    background-color: #fde8e6;
    border: 1px solid #f7b2aa;
    width: 60px;
  }
  .lock-btn {
    // float: right;
    margin-top: 15rpx;
    font-size: 14px;
    text-align: center;
    line-height: 23px;
    /* border-radius: 15px; */
    /* color: #e51600; */
    /* background-color: #fde8e6; */
    width: 60px;
    height: 24px;
  }
  .unit-study-btn {
    margin-top: 10rpx;
  }
  .to-study {
    font-size: 12px;
    width: 112rpx;
    height: 48rpx;
    border-radius: 72rpx;
    opacity: 1;
    background: #fde8e6;
    // 按钮和文字居中对齐
    text-align: center;
    line-height: 48rpx;
  }
  .progress {
    margin-top: 4px;
    width: 225px;
    float: left;
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
  .progress-content {
    height: 34px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .progress {
      // margin-top: 15px;
      width: 225px;
      display: flex;
      .progress-left {
        display: flex;
        margin-right: 8px;
        margin-left: 8px;
      }
      .percent-line {
        width: 40px;
        height: 6px;
        border-radius: 4px;
        margin-right: 8px;
        background: #e5e6eb;
        line-height: 6px;
        margin-top: 6px;
      }
      .percent-red {
        background: #e51600;
        height: 6px;
        border-radius: 4px;
      }
      .percent-number {
        font-size: 12px;
        color: #9a9a9a;
      }
      .progress-text {
        font-size: 12px;
        color: #9a9a9a;
      }
      .progress-status {
        font-size: 12px;
        color: #e51600;
      }
    }
  }
</style>
