<template>
  <div class="item-list">
    <table>
      <thead>
      <tr>
        <th></th>
        <th>比赛项目</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="i in items">
        <td><img :src="i.icon"/></td>
        <td class="item-name"><span @click="handleItemClick(i)">{{i.name}}</span></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import { listItem } from "network/game/item";

  export default {
    name: "MainItemList",
    data() {
      return {
        items: []
      }
    },
    created() {
      this.getItemList();
    },
    methods: {
      handleItemClick(i) {
        const to = `/result/medal/main/item/${i.id}`;
        const path = {
          to: to,
          name: i.name
        };
        this.$store.dispatch('setMedalPaths', path);
        this.$router.push(to);
      },
      getItemList() {
        listItem({
          gameId: this.$store.getters.game.id,
          categoryId: this.$store.getters.categoryId,
          orderByColumn: 'i.orderNum',
          isAsc: 'asc'
        }).then(res => {
          this.items = res.rows;
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .item-list {
    table {
      width: 100%;
      thead {
        background-color: @t-color-m1;
        color: #fff;
       th {
          height: 59px;
        }
      }
      tbody {
        tr {
          height: 60px;
          line-height: 60px;
          border-bottom: 1px solid #D8D8D8;

          .item-name {
            width: 70%;
            span {
              cursor: pointer;
              &:hover {
                color: @t-color-m1;
              }
            }
          }

          img {
            width: 45px;
            height: 45px;
            object-fit: cover;
            transform: translateY(25%);
          }
        }
      }
    }
  }
</style>
