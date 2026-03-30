<template>
  <div class="compete-medal">
    <div class="medal">
      <el-table v-loading="loading" :data="dataList" show-summary>
        <el-table-column label="排名" align="center" prop="order" width="80" fixed/>
        <el-table-column label="单位" align="center" prop="unitTypeStr" width="400">
          <template scope="scope">
            <span @click="handleNameClick(scope.row)" class="name">{{scope.row.unitTypeStr}}</span>
          </template>
        </el-table-column>
        <el-table-column label="金牌" align="center" prop="goldCount" sortable/>
      </el-table>
    </div>
    <div class="item">

    </div>
  </div>
</template>

<script>
  import { calUnitTypeCompete } from "network/game/cal";

  export default {
    name: "CompeteMedal",
    components: {

    },
    data() {
      return {
        loading: false,
        dataList: []
      }
    },
    created() {
      this.$emit('loadActiveTab', 'compete');
      this.$store.dispatch('resetCompetePaths');
      this.getDataList();
    },
    methods: {
      getDataList() {
        this.loading = true;
        calUnitTypeCompete({
          gameId: this.$store.getters.game.id,
          categoryId: this.$store.getters.categoryId
        }).then(res => {
          this.dataList = res.data;
          this.loading = false;
        })
      },
      handleNameClick(row) {
        const to = `/result/medal/compete/detail`;
        const path = {
          to: to,
          name: row.unitTypeStr
        };
        this.$store.dispatch('setCompetePaths', path);
        this.$router.push({
          path: to,
          query: {
            calUnitTypeStr: row.unitTypeStr
          }
        });
      }
    }
  }
</script>

<style lang="less" scoped>
  .compete-medal {
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
