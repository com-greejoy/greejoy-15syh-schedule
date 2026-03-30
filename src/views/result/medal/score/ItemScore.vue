<template>
  <div class="item-score">
    <div class="score">
      <el-table v-loading="loading" :data="dataList" show-summary>
        <el-table-column type="index" align="center" width="80" fixed/>
        <el-table-column label="项目" align="center" prop="itemStr" width="200" />
        <el-table-column label="第一名" align="center" prop="score1" sortable>
          <template scope="scope">
            <span @click="handleNumberClick(scope.row, 1, scope.row.score1)" class="number">
              {{scope.row.score1}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="第二名" align="center" prop="score2" sortable>
          <template scope="scope">
            <span @click="handleNumberClick(scope.row, 2, scope.row.score2)" class="number">
              {{scope.row.score2}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="第三名" align="center" prop="score3" sortable>
          <template scope="scope">
            <span @click="handleNumberClick(scope.row, 3, scope.row.score3)" class="number">
              {{scope.row.score3}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="第四名" align="center" prop="score4" sortable>
          <template scope="scope">
            <span @click="handleNumberClick(scope.row, 4, scope.row.score4)" class="number">
              {{scope.row.score4}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="第五名" align="center" prop="score5" sortable>
          <template scope="scope">
            <span @click="handleNumberClick(scope.row, 5, scope.row.score5)" class="number">
              {{scope.row.score5}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="第六名" align="center" prop="score6" sortable>
          <template scope="scope">
            <span @click="handleNumberClick(scope.row, 6, scope.row.score6)" class="number">
              {{scope.row.score6}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="第七名" align="center" prop="score7" sortable>
          <template scope="scope">
            <span @click="handleNumberClick(scope.row, 7, scope.row.score7)" class="number">
              {{scope.row.score7}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="第八名" align="center" prop="score8" sortable>
          <template scope="scope">
            <span @click="handleNumberClick(scope.row, 8, scope.row.score8)" class="number">
              {{scope.row.score8}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="第九名" align="center" prop="score9" sortable>
          <template scope="scope">
            <span @click="handleNumberClick(scope.row, 9, scope.row.score9)" class="number">
              {{scope.row.score9}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="第十名" align="center" prop="score10" sortable>
          <template scope="scope">
            <span @click="handleNumberClick(scope.row, 10, scope.row.score10)" class="number">
              {{scope.row.score10}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="第十一名" align="center" prop="score11" sortable>
          <template scope="scope">
            <span @click="handleNumberClick(scope.row, 11, scope.row.score11)" class="number">
              {{scope.row.score11}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="第十二名" align="center" prop="score12" sortable>
          <template scope="scope">
            <span @click="handleNumberClick(scope.row, 12, scope.row.score12)" class="number">
              {{scope.row.score12}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="预赛超破" align="center" prop="score0" sortable>
          <template scope="scope">
            <span @click="handleNumberClick(scope.row, 0, scope.row.score0)" class="number">
              {{scope.row.score0}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="总分" align="center" prop="amount" fixed="right" sortable/>
      </el-table>
    </div>
  </div>
</template>

<script>
  import { calItemScore } from "network/game/cal";

  export default {
    name: "ItemScore",
    components: {
    },
    data() {
      return {
        loading: false,
        unitTypeId: null,
        dataList: []
      }
    },
    created() {
      this.$emit('loadActiveTab', 'score');
      this.unitTypeId = this.$route.params.unitTypeId ? parseInt(this.$route.params.unitTypeId) : null;
      this.getDataList();
    },
    methods: {
      getDataList() {
        this.loading = true;
        calItemScore({
          gameId: this.$store.getters.game.id,
          categoryId: this.$store.getters.categoryId,
          unitTypeId: this.unitTypeId
        }).then(res => {
          this.dataList = res.data;
          this.loading = false;
        })
      },
      handleNumberClick(row, orderIndex, count) {
        if (!count) {
          return;
        }
        const to = `/result/medal/race?
        slaveItemId=${row.slaveItemId}&unitTypeId=${this.unitTypeId}&orderIndex=${orderIndex}&activeTab=score`;
        const path = {
          to: to,
          name: row.itemStr
        };
        this.$store.dispatch('pushScorePaths', path);
        this.$router.push(to);
      }
    }
  }
</script>

<style lang="less" scoped>
  .item-score {
    display: flex;
    justify-content: space-between;
    .score {
      width: 100%;
      .number {
        cursor: pointer;
        &:hover {
          color: @t-color-m1;
        }
      }
    }
    .right {
      width: 25%;
    }
  }
</style>
