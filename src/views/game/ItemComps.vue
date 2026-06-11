<template>
  <div class="item-comps">
    <a @click="handleClick(item)">
      <img class="icon" :src="item.icon" :alt="item.name">
      <img v-if="item.icon2" class="icon2" :src="item.icon2" :alt="item.name" />
    </a>
    <div class="item-name">{{item.name}}</div>
  </div>
</template>

<script>
  export default {
    name: "ItemComps",
    props: {
      item: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    methods: {
      handleClick(item) {
        this.$router.push(`/game/item/${item.id}`)
      }
    }
  }
</script>

<style lang="less" scoped>
  .item-comps {
    position: relative;
    text-align: center;
    display: inline-block;
    width: 140px;
    a {
      border-radius: 8px;
      border-color: transparent;
      display: block;
      width: 100px;
      height: 100px;
      margin: 0 auto;
      cursor: pointer;
      overflow: hidden;
      &:hover {
        background-color: @t-color-m1;
        border-radius: 10px;
        & .icon {
          display: none;
        }
        & .icon2 {
          display: block;
        }
      }
      .icon2 {
        position: absolute;
        display: none;
      }
      img {
        padding: 10px;
        width: 80px;
        height: 80px;
        transition: all 0.5s;
        &:hover {
          transform: scale(1.1);
        }
      }
    }
    .item-name {
      padding-top: 4px;
    }
  }
</style>
