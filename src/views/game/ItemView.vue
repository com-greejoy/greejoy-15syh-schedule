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
          this.itemList = this.splitSpecialItems(res.rows);
        });
      },
      splitSpecialItems(list) {
        if (!Array.isArray(list)) {
          return [];
        }
        const result = [];
        list.forEach(item => {
          // 足球项目（id=163）拆分为 足球 + 八人足球
          if (item.id == 163) {
            result.push(item);
            result.push({
              ...item,
              name: '八人足球',
              orderNum: item.orderNum + 1
            });
          // 轮滑冰球/女子冰球项目（id=144）拆分为 轮滑冰球 + 女子冰球
          } else if (item.id == 144) {
            result.push({
              ...item,
              name: '轮滑冰球'
            });
            result.push({
              ...item,
              name: '女子冰球',
              orderNum: item.orderNum + 1
            });
          } else {
            result.push(item);
          }
        });
        return result.sort((a, b) => a.orderNum - b.orderNum);
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
