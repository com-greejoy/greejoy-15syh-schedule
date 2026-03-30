<template>
  <div class="unitType-view">
    <div class="unitType-query">
      <el-input class="query" v-model="name" clearable placeholder="请输入名称"></el-input>
      <el-button icon="el-icon-search" circle @click="handleQuery"></el-button>
    </div>
    <div class="unitType-data" v-loading="loading" element-loading-spinner="el-icon-loading">
      <div v-if="unitTypeList.length>0">
        <div class="letter-div" v-for="item in letterUnitTypeList">
          <div class="letter">{{item.letter}}</div>
          <div class="data">
            <span v-for="u in item.unitTypeList" @click="toUnitTypeInfo(u)">{{u.name}}</span>
          </div>
        </div>
      </div>
      <div v-else>没有更多数据</div>
    </div>
  </div>
</template>

<script>
  import { sortUnitTypeByOrder } from "common/utils";
  import { listUnitType } from "network/game/unitType";

  export default {
    name: "UnitTypeView",
    data() {
      return {
        loading: false,
        unitTypeList: [],
        name: null
      }
    },
    computed: {
      letterUnitTypeList() {
        const list = this.name ? this.unitTypeList.filter(i => {
          return i.name.indexOf(this.name) != -1 || i.spell.indexOf(this.name) != -1;
        }) : this.unitTypeList;

        const map = new Map();
        list.forEach(i => {
          i.spell = i.spell == 'YZ' ? 'LSYZ' : i.spell;
          const letter = i.spell ? i.spell[0].toUpperCase() : null;
          let arr = map.get(letter);
          if (!arr) {
            map.set(letter, []);
          }
          map.get(letter).push(i);
        });
        const res = [];
        map.forEach((arr, key) => {
          res.push({
            letter: key,
            unitTypeList: sortUnitTypeByOrder(arr)
          });
        });
        return res;
      },
    },
    created() {
      this.getUnitTypeList();
    },
    methods: {
      getUnitTypeList() {
        this.loading = true;
        listUnitType({
          gameId: this.$store.getters.game.id,
          categoryId: this.$store.getters.categoryId,
          parentId: 0,
          orderByColumn: 'ut.spell',
          slaveOrderBy: 'c.NAME',
          isAsc: 'asc'
        }).then(res => {
          this.unitTypeList = res.rows;
          this.loading = false;
        })
      },
      handleQuery() {
        this.getUnitTypeList();
      },
      toUnitTypeInfo(u) {
        this.$router.push(`/game/unitType/${u.categoryId}/${u.id}`);
      },
    }
  }
</script>

<style lang="less" scoped>
  .unitType-view {
    .unitType-query {
      text-align: left;
      .query {
        width: 180px;
        margin-right: 20px;
      }
    }
    .unitType-data {
      margin-top: 20px;
      font-size: 16px;
      .letter-div {
        display: flex;
        margin-bottom: 10px;
        .letter {
          color: @t-color-m1;
          font-weight: bold;
          width: 40px;
          padding: 10px;
        }
        .data {
          flex-grow: 1;
          display: flex;
          flex-wrap: wrap;
          span {
            padding: 10px;
            margin-right: 10px;
            margin-bottom: 10px;
            border: 1px solid @t-color-m1;
            border-radius: 8px;
            cursor: pointer;
            &:hover {
              background-color: @t-color-m1;
              color: #fff;
            }
          }
        }
      }
    }
  }
</style>
