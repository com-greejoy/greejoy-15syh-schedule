<template>
  <div class="main-score">
    <div class="score">
      <el-table v-loading="loading" :data="dataList" show-summary>
        <el-table-column label="排名" align="center" prop="order" width="80" fixed/>
        <el-table-column label="单位" align="center" prop="unitTypeStr" width="200">
          <template scope="scope">
            <span @click="handleNameClick(scope.row)" class="name">{{scope.row.unitTypeStr}}</span>
          </template>
        </el-table-column>
        <el-table-column label="第一名" align="center" prop="score1" sortable/>
        <el-table-column label="第二名" align="center" prop="score2" sortable/>
        <el-table-column label="第三名" align="center" prop="score3" sortable/>
        <el-table-column label="第四名" align="center" prop="score4" sortable/>
        <el-table-column label="第五名" align="center" prop="score5" sortable/>
        <el-table-column label="第六名" align="center" prop="score6" sortable/>
        <el-table-column label="第七名" align="center" prop="score7" sortable/>
        <el-table-column label="第八名" align="center" prop="score8" sortable/>
        <el-table-column label="第九名" align="center" prop="score9" sortable/>
        <el-table-column label="第十名" align="center" prop="score10" sortable/>
        <el-table-column label="第十一名" align="center" prop="score11" sortable/>
        <el-table-column label="第十二名" align="center" prop="score12" sortable/>
        <el-table-column label="预赛超破" align="center" prop="score0" sortable/>
        <el-table-column label="总分" align="center" prop="amount" fixed="right" sortable/>
      </el-table>
    </div>
  </div>
</template>

<script>
  import { calUnitTypeScore } from "network/game/cal";

  export default {
    name: "MainScore",
    components: {
    },
    data() {
      return {
        loading: false,
        dataList: []
      }
    },
    created() {
      this.$emit('loadActiveTab', 'score');
      this.$store.dispatch('resetScorePaths');
      this.getDataList();
    },
    methods: {
      getDataList() {
        this.loading = true;
        calUnitTypeScore({
          gameId: this.$store.getters.game.id,
          categoryId: this.$store.getters.categoryId
        }).then(res => {
          this.dataList = res.data;
          this.loading = false;
        })
      },
      handleNameClick(row) {
        const to = `/result/medal/score/item/unitType/${row.unitTypeId}`;
        const path = {
          to: to,
          name: row.unitTypeStr
        };
        this.$store.dispatch('setScorePaths', path);
        this.$router.push(to);
      }
    }
  }
</script>

<style lang="less" scoped>
  .main-score {
    display: flex;
    justify-content: space-between;
    .score {
      width: 100%;
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
