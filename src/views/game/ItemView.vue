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
              orderNum: item.orderNum + 1,
              icon: '/15syh/profile/cms/material/upload/2026/07/04/84870b49-04a1-41cb-ade6-af10cf6a48e8.png',
              icon2: '/15syh/profile/cms/material/upload/2026/07/04/6e56991c-0fdf-4e7a-ba93-827639a5e04d.png'
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
              orderNum: item.orderNum + 1,
              icon: '/15syh/profile/cms/material/upload/2026/07/04/bae797de-48fa-4a38-ad84-b8809582c5bc.png',
              icon2: '/15syh/profile/cms/material/upload/2026/07/04/2cd20907-8230-4e20-a200-d99802734205.png'
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
