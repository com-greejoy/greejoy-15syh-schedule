<template>
  <div class="item-view">
    <item-comps v-for="item in itemList" :item="item"/>
  </div>
</template>

<script>
  import ItemComps from './ItemComps';
  import { listItem } from "network/game/item";

  export default {
    name: "ItemView",
    components: {
      ItemComps
    },
    data() {
      return {
        itemList: []
      }
    },
    created() {
      this.getItemList();
    },
    methods: {
      getItemList() {
        listItem({
          gameId: this.$store.getters.game.id,
          categoryId: this.$store.getters.categoryId,
          orderByColumn: 'i.orderNum',
          isAsc: 'asc'
        }).then(res => {
          this.itemList = res.rows;
        });
      }
    }
  }
</script>

<style lang="less" scoped>
  .item-view {
    display: flex;
    flex-wrap: wrap;

    .item-comps {
      margin-right: 20px;
      margin-bottom: 20px;
    }
  }
</style>
