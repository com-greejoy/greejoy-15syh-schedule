<template>
  <div class="item-medal">
    <div class="medal">
      <el-table v-loading="loading" :data="dataList" show-summary>
        <el-table-column type="index" align="center" width="80" fixed/>
        <el-table-column label="项目" align="center" prop="itemStr" width="400" />
        <el-table-column label="金牌" align="center" prop="goldCount" sortable>
          <template scope="scope">
            <span @click="handleNumberClick(scope.row, 1, scope.row.goldCount)" class="number">
              {{scope.row.goldCount}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="银牌" align="center" prop="silverCount" sortable>
          <template scope="scope">
            <span @click="handleNumberClick(scope.row, 2, scope.row.silverCount)" class="number">
              {{scope.row.silverCount}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="铜牌" align="center" prop="bronzeCount" sortable>
          <template scope="scope">
            <span @click="handleNumberClick(scope.row, 3, scope.row.bronzeCount)" class="number">
              {{scope.row.bronzeCount}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="小计" align="center" prop="amount" fixed="right" sortable/>
      </el-table>
    </div>
    <div class="right">

    </div>
  </div>
</template>

<script>
  import { calItemMedal } from "network/game/cal";

  export default {
    name: "ItemMedal",
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
      this.$emit('loadActiveTab', 'game');
      this.unitTypeId = this.$route.params.unitTypeId ? parseInt(this.$route.params.unitTypeId) : null;
      this.getDataList();
    },
    methods: {
      getDataList() {
        this.loading = true;
        calItemMedal({
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
        slaveItemId=${row.slaveItemId}&unitTypeId=${this.unitTypeId}&orderIndex=${orderIndex}`;
        const path = {
          to: to,
          name: row.itemStr
        };
        this.$store.dispatch('pushMedalPaths', path);
        this.$router.push(to);
      }
    }
  }
</script>

<style lang="less" scoped>
  .item-medal {
    display: flex;
    justify-content: space-between;
    .medal {
      width: 70%;
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
