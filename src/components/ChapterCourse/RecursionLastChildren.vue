<template>
  <div>
    <div v-for="(item, index) in list" :key="item.name">
      <div v-if="item.children && item.children.length > 0" class="ccccc">
        <div class="row-last">
          <div class="row" @click="openClose" :data-name="item.name">
            <div class="treelevel">
              <text
                class="tree_add iconfont"
                :class="
                  hasPreClickId(preClickIdArr, item.name) ? 'icon-expand_3_1' : 'icon-expand_3_2'
                "
              ></text>
              <!-- <img
                src="@/static/svgs/expand_2_1.svg"
                alt=""
                v-if="hasPreClickId(preClickIdArr, item.id)"
              />
              <img
                src="@/static/svgs/expand_2_2.svg"
                alt=""
                v-if="!hasPreClickId(preClickIdArr, item.id)"
              /> -->
              <span class="title-father">{{ index + 1 + ')' + item.name }}</span>
            </div>

            <div class="progress-content">
              <div class="progress">
                <div class="progress-left" v-if="showSpeed">
                  <div class="percent-line">
                    <div
                      class="percent-red"
                      :style="{ width: Number(item.speedRate * 100).toFixed(1) + '%' }"
                    ></div>
                  </div>
                  <div class="percent-number">{{
                    Number(item.speedRate * 100).toFixed(1) + '%'
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
                @click="handleLock(item) ? $emit('callback', item, productId) : null"
              >
                <text v-if="handleLock(assembleData(item, statics))" class="iconfont to-study"
                  >练习</text
                >
                <text v-else class="iconfont icon-lock"></text>
              </div>
            </div>
            <span
              v-if="item.isUnit"
              :data-sectionid="item.name"
              :data-chapterid="chapterid"
              :class="handleLock(item) ? 'btn' : 'lock-btn'"
              @click="handleLock(item) ? $emit('callback', item, productId) : null"
            >
              <text v-if="handleLock(item)" class="iconfont to-study">去学习</text>
              <text v-else class="iconfont icon-lock"></text>
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
          <RecursionLastChildren
            :list="item.children"
            v-if="hasPreClickId(preClickIdArr, item.name)"
            :chapterid="chapterid"
            :current="current"
            :productId="productId"
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
                class="tree_add icon"
              />
              <img
                src="@/static/svgs/videocast.svg"
                alt=""
                v-if="item.type === 1"
                class="tree_add icon"
              />
              <img
                src="@/static/svgs/practice.svg"
                alt=""
                v-if="item.type === 2"
                class="tree_add icon"
              />
              <img
                src="@/static/svgs/exams.svg"
                alt=""
                v-if="item.type === 3"
                class="tree_add icon"
              />
              <img
                src="@/static/svgs/live.svg"
                alt=""
                v-if="item.type === 4"
                class="tree_add icon"
              />
              <span class="title">{{ item.name }}</span>
            </div>
            <div class="progress-content" v-if="item.type != 4 && showSpeed">
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

                  <div class="percent-number" v-if="item.type === 1 || item.type === 4"
                    >{{
                      assembleData(item, statics).done
                        ? handleDuration(
                            assembleData(item, statics).done,
                            assembleData(item, statics).total,
                            0
                          )
                        : 0
                    }}
                    {{ '/'
                    }}{{
                      assembleData(item, statics).total
                        ? handleDuration(
                            assembleData(item, statics).total,
                            assembleData(item, statics).total,
                            1
                          )
                        : 0 + '秒'
                    }}</div
                  >
                  <div class="percent-number" v-else-if="item.type === 0"
                    >{{ assembleData(item, statics).done ? assembleData(item, statics).done : 0 }}
                    {{ '/' }}
                    {{
                      assembleData(item, statics).total
                        ? assembleData(item, statics).total + '页'
                        : 0 + '页'
                    }}</div
                  >
                  <div class="percent-number" v-else
                    >{{ assembleData(item, statics).done ? assembleData(item, statics).done : 0 }}
                    {{ '/' }}
                    {{
                      assembleData(item, statics).total
                        ? assembleData(item, statics).total + '道'
                        : 0 + '道'
                    }}</div
                  >
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
                :data-sectionid="item.name"
                :data-chapterid="chapterid"
                :class="handleLock(item) ? 'btn' : 'lock-btn'"
                @click="handleLock(item) ? $emit('callback', item, productId) : null"
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
              <div
                v-if="(item.type != 4 && item.status != 20) || (item.type != 4 && item.stauts != 0)"
              >
                <div
                  v-if="item.isUnit"
                  :data-sectionid="item.name"
                  :data-chapterid="chapterid"
                  :class="handleLock(item) ? 'btn' : 'lock-btn'"
                  @click="handleLock(item) ? $emit('callback', item, productId) : null"
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
  import RecursionLastChildren from './RecursionLastChildren.vue';
  export default {
    name: 'RecursionLevelChildren',
    components: {
      RecursionLastChildren,
    },
    props: ['list', 'chapterid', 'current', 'productId', 'showSpeed'],
    /* 直播状态status 0 未开播 1直播中 2已结束 20已关闭 */
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
      },
      handleLock(item) {
        const newData = assembleData(item, this.statics);
        if (newData.isPurchase || newData.preview) {
          return true;
        } else {
          return false;
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .icon {
    width: 13.33px;
    height: 14px;
  }
  .row-last {
    padding-left: 10px;
  }
  .children-content {
    background: #f6f6f6;
    height: 160rpx;
    border-radius: 16rpx;
    opacity: 1;
    box-sizing: border-box;
    padding: 16px 12px;
  }
  .row {
    position: relative;
    min-height: 25px;
    padding: 0px 0px 0px 20px;
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
    top: 5px;
    /* width: 25rpx; */
    /* height: 25rpx; */
  }
  .tree_add_S {
    position: absolute;
    left: -14px;
    top: 5px;
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
  .title-father {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #333333;
    font-size: 16px;
    font-weight: 400;
    font-family: 'PingFang SC';
    text-align: left;
    width: 225px;
    padding-left: 10px;
  }
  .title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #333333;
    font-size: 28rpx;
    font-weight: 600;
    font-family: 'PingFang SC';
    text-align: left;
    width: 225px;
    color: #333333;
    // padding-left: 10px;
  }
  .btn {
    // float: right;
    margin-top: 9rpx;
    font-size: 14px;
    text-align: center;
    line-height: 18px;
    border-radius: 15px;
    color: #e51600;
    background-color: #fde8e6;
    border: 1px solid #f7b2aa;
    width: 56px;
    height: 24px;
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
  .to-study {
    font-size: 12px;
  }
  .progress-content {
    display: flex;
    height: 34px;
    justify-content: space-between;
    align-items: center;
    .progress {
      // margin-top: 15px;
      width: 225px;
      display: flex;
      .progress-left {
        display: flex;
        margin-right: 8px;
        // margin-left: 8px;
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
    }
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
    justify-content: space-between;
    align-items: center;
    .progress {
      // margin-top: 15px;
      width: 225px;
      display: flex;
      .progress-left {
        display: flex;
        margin-right: 8px;
        // margin-left: 8px;
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
