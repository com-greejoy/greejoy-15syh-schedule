<template>
  <div class="compete-detail-medal">
    <div class="medal">
      <el-table v-loading="loading" :data="dataList">
        <el-table-column label="单位" align="center" prop="calUnitTypeStr" width="60" />
        <el-table-column label="输送市州" align="center" prop="unitTypeStr" width="90" />
        <el-table-column label="项目" align="center" prop="itemStr" width="110" />
        <el-table-column label="参加比赛" align="left">
          <template slot-scope="scope">
            <span>{{scope.row.compete ? scope.row.compete : ''}}{{`（${scope.row.raceStr}）`}}</span>
          </template>
        </el-table-column>
        <el-table-column label="运动员" align="center" prop="sporters" width="160">
          <template slot-scope="scope">
            <span class="sporter-name" v-for="i in scope.row.sporters.split(',')">{{i}}</span>
          </template>
        </el-table-column>
        <el-table-column label="名次" align="center" prop="orderIndex" width="60"/>
        <el-table-column label="成绩" align="center" prop="result" width="120" show-overflow-tooltip />
        <el-table-column label="金牌" align="center" prop="goldCount" width="60"/>
        <el-table-column label="时间" align="center" prop="matchDate" width="110">
          <template slot-scope="scope">
            {{ scope.row.matchDate | dateFmt('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" width="60" show-overflow-tooltip />
      </el-table>
    </div>
  </div>
</template>

<script>
  import { listCompete } from "network/game/compete";

  export default {
    name: "CompeteDetailMedal",
    components: {

    },
    data() {
      return {
        calUnitTypeStr: null,
        loading: false,
        dataList: []
      }
    },
    created() {
      this.$emit('loadActiveTab', 'compete');
      this.calUnitTypeStr = this.$route.query.calUnitTypeStr ? this.$route.query.calUnitTypeStr : null;
      this.getDataList();
    },
    methods: {
      getDataList() {
        if (this.calUnitTypeStr) {
          this.loading = true;
          listCompete({
            gameId: this.$store.getters.game.id,
            categoryId: this.$store.getters.categoryId,
            calUnitTypeStr: this.calUnitTypeStr,
            orderByColumn: 'compete, itemStr, raceStr, orderIndex, goldCount, matchDate',
            isAsc: 'asc, asc, asc, asc, desc, asc'
          }).then(res => {
            this.dataList = res.rows;
            this.loading = false;
          })
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .compete-detail-medal {
    display: flex;
    justify-content: space-between;
    .medal {
      width: 100%;
      .sporter-name {
        margin-right: 6px;
      }
    }
  }
</style>
