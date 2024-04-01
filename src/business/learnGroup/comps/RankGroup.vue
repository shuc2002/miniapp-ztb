<template>
  <view>
    <view
      class="text-size-sn common-text-700 common-tip img-rank flex-center"
      v-if="(keys != 1) & (keys != 2) & (keys != 3)"
      >{{ keys }}</view
    >
    <image src="@/business/static/group/1.png" class="img-rank" v-if="keys == 1" />
    <image src="@/business/static/group/2.png" class="img-rank" v-if="keys == 2" />
    <image src="@/business/static/group/3.png" class="img-rank" v-if="keys == 3" />
  </view>
</template>
<script>
  export default {
    name: 'rank',
    components: {},
    props: {
      keys: {
        type: Number,
        default: 1,
      },
    },
  };
</script>
<style lang="scss" scoped>
  .img-rank {
    width: 48rpx;
    height: 48rpx;
  }
</style>
