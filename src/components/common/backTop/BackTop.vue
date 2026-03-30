<template>
  <div class="back-top">
    <font-awesome-icon class="font-chevron-up" icon="chevron-up"/>
  </div>
</template>

<script>
  export default {
    name: "BackTop"
  }
</script>

<style lang="less" scoped>

  .back-top {
    position: fixed;
    right: 12px;
    bottom: 86px;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    color: #fff;
    background: rgba(0, 0, 0, .3);
  }

</style>
