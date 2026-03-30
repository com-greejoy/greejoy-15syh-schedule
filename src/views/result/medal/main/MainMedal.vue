<template>
  <div class="main-medal">
    <div class="medal">
      <el-table v-loading="loading" :data="dataList" show-summary>
        <el-table-column label="排名" align="center" prop="order" width="80" fixed/>
        <el-table-column label="单位" align="center" prop="unitTypeStr" width="400">
          <template scope="scope">
            <span @click="handleNameClick(scope.row)" class="name">{{scope.row.unitTypeStr}}</span>
          </template>
        </el-table-column>
        <el-table-column label="金牌" align="center" prop="goldCount" sortable/>
        <el-table-column label="银牌" align="center" prop="silverCount" sortable/>
        <el-table-column label="铜牌" align="center" prop="bronzeCount" sortable/>
        <el-table-column label="小计" align="center" prop="amount" fixed="right" sortable/>
      </el-table>
    </div>
    <div class="item">
      <main-item-list></main-item-list>
    </div>
  </div>
</template>

<script>
  import { calUnitTypeMedal } from "network/game/cal";
  import MainItemList from './MainItemList';

  export default {
    name: "MainMedal",
    components: {
      MainItemList
    },
    data() {
      return {
        loading: false,
        dataList: []
      }
    },
    created() {
      this.$emit('loadActiveTab', 'game');
      this.$store.dispatch('resetMedalPaths');
      this.getDataList();
    },
    methods: {
      getDataList() {
        this.loading = true;
        calUnitTypeMedal({
          gameId: this.$store.getters.game.id,
          categoryId: this.$store.getters.categoryId
        }).then(res => {
          this.dataList = res.data;
          this.loading = false;
        })
      },
      handleNameClick(row) {
        const to = `/result/medal/main/item/unitType/${row.unitTypeId}`;
        const path = {
          to: to,
          name: row.unitTypeStr
        };
        this.$store.dispatch('setMedalPaths', path);
        this.$router.push(to);
      }
    }
  }
</script>

<style lang="less" scoped>
  .main-medal {
    display: flex;
    justify-content: space-between;
    .medal {
      width: 70%;
      .name {
        cursor: pointer;
        &:hover {
          color: @t-color-m1;
        }
      }
    }
    .item {
      width: 25%;
    }
  }
</style>
