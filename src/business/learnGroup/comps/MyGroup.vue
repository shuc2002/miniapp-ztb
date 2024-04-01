<!--
* @desc 每日一练小组
* @author 江玉龙
* @date 2022年6月15日
-->
<template>
  <view>
    <view class="group-box">
      <!-- 未形成小组 start -->
      <view v-if="!groupId">
        <view class="text-size-main common-text-700 common-text">还差 1 人组队成功</view>
        <view class="text-size-xxs common-text-400 common-tip text-tip"
          >学习的道路不再孤单，有人跟你一起并肩前行！</view
        >
        <view class="flex-center-box img-item">
          <view class="flex-column-center">
            <image :src="avatar" class="img-style" mode="aspectFill" lazy-load="true" />
            <view class="table-group">组长</view>
            <view class="text-size-xxs common-text-400 common-message truncate name-width">{{
              nickName
            }}</view>
          </view>
          <view class="flex-column-center">
            <!-- #ifdef H5 -->
            <button @tap="shareTap()" class="add-image flex-center">+</button>
            <!-- #endif -->
            <!-- #ifndef H5 -->
            <button open-type="share" class="add-image flex-center">+</button>
            <!-- #endif -->
            <view class="add-team flex-center">添加组员</view>
          </view>
        </view>
      </view>
      <!-- 未形成小组end -->
      <!-- 每日一练已有小组 start -->
      <view v-if="groupId && ifBrush">
        <view class="text-size-main common-text-700 common-text">{{
          groupInfo.name ? groupInfo.name : ''
        }}</view>
        <view class="text-size-xxs common-text-400 common-tip text-tip word-break">{{
          groupInfo.notice ? groupInfo.notice : '组队做题，一起霸榜吧！'
        }}</view>
        <view class="flex-center-box img-item-second">
          <view
            class="flex-column-center"
            v-for="(item, key) in groupInfo.avatars.slice(0, 4)"
            :key="key"
          >
            <image
              :src="item ? item.avatar : ''"
              class="img-style"
              mode="aspectFill"
              lazy-load="true"
            />
            <view class="table-group" v-if="item.isLeader">组长</view>
            <view class="text-size-xxs common-text-400 common-message truncate name-width">{{
              item.name
            }}</view>
          </view>
          <view class="flex-column-center" v-if="groupInfo.avatars.length < 4">
            <!-- #ifdef H5 -->
            <button @tap="shareTap()" class="add-image flex-center">+</button>
            <!-- #endif -->
            <!-- #ifndef H5 -->
            <button open-type="share" class="add-image flex-center">+</button>
            <!-- #endif -->
            <view class="add-team flex-center">添加组员</view>
          </view>
        </view>
        <view class="prompt" v-if="groupInfo.unfinished">
          <view class="text-size-xxs common-text-400 common-text"
            >还有<span class="common-price">{{ groupInfo.unfinished }}</span
            >名组员未完成每日一练</view
          >

          <view class="reminded flex-center" v-if="groupInfo.unfinished && groupInfo.remind === 1"
            >已提醒</view
          >
          <view
            class="to-remind flex-center"
            v-if="groupInfo.unfinished && groupInfo.remind === 0"
            @tap="reminder()"
            >一键提醒</view
          >
        </view>
      </view>
      <!-- 每日一练已有小组 end -->
      <!-- 已有小组 start -->
      <view v-if="groupId && !ifBrush">
        <view class="info-box">
          <view class="flex-center">
            <view class="group-img">
              <image
                :src="groupInfo.avatars[item] ? groupInfo.avatars[item].avatar : ''"
                v-for="item in four"
                :key="item"
                mode="aspectFill"
              />
            </view>
            <view>
              <view class="text-size-sn common-text common-text-600 text-name icon-text">
                {{ groupInfo.name ? groupInfo.name : '' }}
                <view
                  class="t-icon t-icon-bianji icon-style"
                  @tap="handleEdit()"
                  v-if="groupInfo.isLeader"
                />
              </view>
              <view class="text-size-xxs common-tip common-text-400 word-break">{{
                groupInfo.notice ? groupInfo.notice : '组队做题，一起霸榜吧！'
              }}</view>
            </view>
          </view>
          <button class="edit-btn flex-center" @tap="handleCancel()">{{
            groupInfo.isLeader ? '解散' : '退队'
          }}</button>
        </view>
        <view class="flex-center-box">
          <view>
            <view class="text-data">{{ groupInfo.members ? groupInfo.members : 0 }}</view>
            <view class="text-item">小组人数(人)</view>
          </view>
          <view>
            <view class="text-data">{{ groupInfo.counts ? groupInfo.counts : 0 }}</view>
            <view class="text-item">本组总做题</view>
          </view>
          <view>
            <view class="text-data">{{ groupInfo.rate ? groupInfo.rate : 0 }}</view>
            <view class="text-item">日完成率(%)</view>
          </view>
        </view>
        <view class="prompt" v-if="groupInfo.unfinished">
          <view class="text-size-xxs common-text-400 common-text"
            >还有<span class="common-price">{{ groupInfo.unfinished }}</span
            >名组员未完成每日一练</view
          >
          <view class="reminded flex-center" v-if="groupInfo.unfinished && groupInfo.remind === 1"
            >已提醒</view
          >
          <view
            class="to-remind flex-center"
            v-if="groupInfo.unfinished && groupInfo.remind === 0"
            @tap="reminder()"
            >一键提醒</view
          >
        </view>
      </view>
    </view>
    <!-- 已有小组 end -->
    <!-- 编辑弹窗 -->
    <BottomModal ref="modal">
      <view slot="head">
        <view class="flex-center text-size-main common-text-700 common-black">修改信息</view>
      </view>
      <view slot="body">
        <input
          placeholder="请输入你们的组名"
          maxlength="10"
          v-model="textName"
          class="input-name"
        />
        <textarea
          placeholder="请输入你组的宣言"
          maxlength="22"
          v-model="declaration"
          class="input-declaration"
        ></textarea>
        <button class="btn-save flex-center" @tap="saveEdit()">保存</button>
      </view>
    </BottomModal>
    <!-- 退出弹窗 -->
    <BottomModal ref="cancel" :showFoot="true">
      <view slot="head">
        <view class="flex-center text-size-xxs common-text-400 common-tip secede-text"
          >确定要退出吗？</view
        >
      </view>
      <view slot="body">
        <view class="secede flex-center" @tap="goSecede()">退出小组</view>
      </view>
    </BottomModal>
  </view>
</template>
<script>
  import BottomModal from '@/components/BottomModal/BottomModal.vue';
  import { editGroup, secedeGroup, goRemind } from '@/api/modules/question/group.ts';
  export default {
    name: 'myGroup',
    components: {
      BottomModal,
    },
    props: {
      groupId: {
        type: String,
        default: '',
      },
      groupInfo: {
        type: Object,
      },
      ifBrush: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        textName: '',
        declaration: '',
        four: [0, 1, 2, 3],
      };
    },
    computed: {
      nickName() {
        return this.$store.getters.getNickName;
      },
      avatar() {
        return this.$store.getters.getAvatar;
      },
    },
    methods: {
      // 编辑按钮
      handleEdit() {
        this.textName = this.groupInfo.name;
        this.declaration = this.groupInfo.notice;
        this.$refs.modal.showCover = true;
      },
      // 退出按钮
      handleCancel() {
        this.$refs.cancel.showCover = true;
      },
      // 保存编辑
      async saveEdit() {
        if (this.textName) {
          await editGroup({ id: this.groupId, name: this.textName, notice: this.declaration });
          this.$refs.modal.showCover = false;
          this.$emit('edit');
        } else {
          uni.showToast({
            title: '小组名不能为空',
            icon: 'none',
          });
        }
      },
      // 退出或解散小组
      async goSecede() {
        await secedeGroup();
        this.$refs.cancel.showCover = false;
        this.$emit('dismiss');
      },
      // 提醒打卡
      async reminder() {
        const res = await goRemind();
        if (res.code == 3505) {
          uni.showToast({
            title: '小组已经提醒',
            icon: 'none',
          });
        } else {
          this.groupInfo.remind = 1;
          uni.showToast({
            title: '提醒成员打卡成功',
            icon: 'none',
          });
        }
      },
      // 分享
      shareTap() {
        this.$emit('shareTap');
      },
    },
  };
</script>
<style lang="scss" scoped>
  .group-box {
    background-color: white;
    padding: 32rpx;
    border-radius: 24rpx;
    margin: 24rpx;
  }
  .text-tip {
    margin: 8rpx 0 48rpx 0;
  }
  .word-break {
    word-break: break-all;
  }
  .img-item {
    padding: 0 143rpx 16rpx 143rpx;
  }
  .img-item-second {
    padding-bottom: 16rpx;
    align-items: center;
  }
  .img-style {
    width: 96rpx;
    height: 96rpx;
    border: 2rpx solid #ffffff;
    border-radius: 50%;
    margin-bottom: 16rpx;
  }
  .table-group {
    padding: 4rpx 10rpx;
    border-radius: 16rpx;
    background-color: #323949;
    color: #ffffff;
    font-size: 20rpx;
    font-weight: 400;
    margin-top: 68rpx;
    position: absolute;
  }
  .name-width {
    width: 120rpx;
  }
  .add-image {
    width: 96rpx;
    height: 96rpx;
    border-radius: 50%;
    border: 2rpx solid #ffee83;
    background: #fffcec;
  }
  .add-team {
    width: 112rpx;
    height: 36rpx;
    border-radius: 36rpx;
    background: #ffee83;
    color: #8c513e;
    font-size: 20rpx;
    font-weight: 500;
    margin-top: 16rpx;
  }
  .info-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 48rpx;
    .text-name {
      margin-bottom: 8rpx;
    }
    .group-img {
      width: 88rpx;
      height: 88rpx;
      padding: 4rpx 2rpx 0 4rpx;
      border-radius: 16rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      margin-right: 40rpx;
      background-color: #f5f6fa;
      flex-shrink: 0;
      image {
        width: 34rpx;
        height: 34rpx;
        border-radius: 32rpx;
        background-color: #ecedf1;
        margin: 0 2rpx 4rpx 0;
      }
    }
    .edit-btn {
      width: 72rpx;
      height: 36rpx;
      border-radius: 36rpx;
      font-size: 20rpx;
      font-weight: 400;
      color: #5b648d;
      background-color: #f5f6fa;
      margin: 0;
    }
  }
  .text-data {
    font-size: 36rpx;
    font-weight: 700;
    color: #323949;
    margin-bottom: 16rpx;
  }
  .text-item {
    font-size: 24rpx;
    font-weight: 400;
    color: #989ead;
  }
  .prompt {
    margin-top: 48rpx;
    padding: 18rpx 24rpx;
    border-radius: 24rpx;
    border: 2rpx solid #fff1be;
    background-color: #fffcec;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      margin: 0 12rpx;
    }
    .reminded {
      width: 92rpx;
      height: 36rpx;
      border-radius: 36rpx;
      background-color: #ecedf1;
      font-size: 20rpx;
      font-weight: 500;
      color: #989ead;
    }
    .to-remind {
      width: 112rpx;
      height: 36rpx;
      border-radius: 36rpx;
      background: #ffee83;
      font-size: 20rpx;
      font-weight: 500;
      color: #8c513e;
      &:active {
        opacity: 0.8;
      }
    }
  }
  .btn-save {
    width: 654rpx;
    height: 96rpx;
    border-radius: 24rpx;
    background-color: #475ffd;
    color: #ffffff;
    margin-top: 64rpx;
    font-size: 32rpx;
    font-weight: 700;
    &:active {
      opacity: 0.8;
    }
  }
  .input-name {
    margin: 48rpx 32rpx 32rpx 32rpx;
    padding: 26rpx 32rpx;
    border-radius: 16rpx;
    background-color: #f5f6fa;
  }
  .input-declaration {
    margin: 48rpx 32rpx 32rpx 32rpx;
    padding: 26rpx 32rpx;
    height: 256rpx;
    border-radius: 16rpx;
    background-color: #f5f6fa;
    width: 628rpx;
  }
  .secede {
    font-size: 32rpx;
    font-weight: 400;
    color: #f0522f;
    height: 120rpx;
  }
  .secede-text {
    margin-top: 28rpx;
    margin-bottom: 12rpx;
  }
  .icon-text {
    display: flex;
    align-items: center;
    .icon-style {
      width: 32rpx;
      height: 32rpx;
      margin-left: 8rpx;
    }
  }
</style>
