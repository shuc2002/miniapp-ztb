<!-- 富文本组件 -->
<template>
  <view :style="[style]">
    <rich-text :nodes="content[0].val"></rich-text>
  </view>
</template>
<script>
  export default {
    name: 'RichText',
    props: {
      content: {
        type: Array,
        default: () => [],
      },
      style: {
        type: Object,
        default: () => {},
      },
    },
  };
</script>
