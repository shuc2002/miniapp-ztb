<template>
  <div>
    <div v-for="(item, index) in list" :key="item.name">
      <div>
        <!-- 判断几级展示不同UI -->
        <div v-if="item.children && item.children.length > 0">
          <div class="row-first row-pad0" @click="openClose" :data-id="item.name">
            <span
              :class="
                index !== list.length - 1 || hasPreClickId(preClickIdArr, item.name) ? 'line' : ''
              "
            ></span>
            <text
              class="tree__bottom iconfont"
              :class="
                hasPreClickId(preClickIdArr, item.name)
                  ? 'icon-directory_retract-1'
                  : 'icon-directory_expand_1'
              "
              style="color: #e51600;"
            ></text>
            <span class="title">{{ item.name }}</span>
            <!-- <span class="btn" :data-chapterid="item.name" catchtap="goQuest">查看</span> -->
            <div class="progress">
              <div class="progress-text">
                <span>{{ item.questionCount }}</span>
              </div>
            </div>
          </div>
          <!-- 大于二级进行递归 -->
          <RecursionLevelChildrenLive
            :list="item.children"
            v-if="hasPreClickId(preClickIdArr, item.name)"
            :chapterid="item.name"
            :current="current"
            @callback="(curr) => $emit('callback', curr)"
          />
        </div>
        <!-- 当前为1级 -->
        <div v-else>
          <div class="row-first">
            <span class="line line-first"></span>
            <span class="tree_last"></span>
            <span class="title-first">{{ item.name }}</span>
            <!-- <span class="btn" :data-chapterid="item.name" catchtap="goQuest">查看</span> -->
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
  </div>
</template>

<script>
  import RecursionLevelChildrenLive from './RecursionLevelChildrenLive.vue';

  export default {
    name: 'RecursionLevelListLive',
    props: ['list', 'current'],
    components: {
      RecursionLevelChildrenLive,
    },
    data() {
      return {
        preClickIdArr: [],
      };
    },
    watch: {
      data() {
        const arr = [];
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
      hasPreClickId(arrData, id) {
        if (arrData.indexOf(id) == -1) {
          console.log('false-111--', id);
          return false;
        } else {
          console.log('true-111--', arrData, id);
          return true;
        }
      },
      openClose(e) {
        let currentId = e.currentTarget.dataset.id,
          preClickIdArr = JSON.parse(JSON.stringify(this.preClickIdArr));
        if (preClickIdArr.indexOf(currentId) == -1) {
          preClickIdArr.push(currentId);
        } else {
          preClickIdArr.splice(preClickIdArr.indexOf(currentId), 1);
        }
        this.preClickIdArr = preClickIdArr;
      },
    },
  };
</script>

<style>
  .row {
    position: relative;
    min-height: 40px;
    padding-left: 20px;
  }

  .line {
    position: absolute;
    width: 1px;
    /* top: 3px; */
    top: 13px;
    /* bottom: 0; */
    bottom: -13px;
    left: 6px;
    /* background-color: #eee; */
    background-color: #E51600;
  }
  .line-first {
    /* top: 213px; */
    top: 253px;
    /* bottom: -15px; */
    bottom: -35px;
  }

  .row-first {
    position: relative;
    min-height: 25px;
    padding: 10px 0 5px 20px;
  }
  .row-pad0 {
    padding-top: 1px;
  }
  .tree__bottom {
    position: absolute;
    left: -1px;
    top: 3px;
    width: 15px;
    height: 15px;
  }

  .tree_add {
    position: absolute;
    left: 0;
    top: 14px;
    width: 12px;
    height: 12px;
  }

  .tree_last {
    position: absolute;
    left: 5px;
    top: 16px;
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

  .title-first {
    width: 225px;
  }

  .btn {
    float: right;
    width: 70px;
    height: 23px;
    font-size: 14px;
    text-align: center;
    color: #fc8118;
    line-height: 23px;
    border: 1rpx solid #fc8118;
    border-radius: 15px;
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
