<template>
  <div class="item-medal">
    <div class="medal">
      <el-table v-loading="loading" :data="dataList" show-summary>
        <el-table-column label="排名" align="center" prop="order" width="80" fixed/>
        <el-table-column label="单位" align="center" prop="unitTypeStr" width="400" />
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
    <div class="item">
      <main-item-list></main-item-list>
    </div>
  </div>
</template>

<script>
  import { calUnitTypeMedal } from "network/game/cal";
  import MainItemList from './MainItemList';

  export default {
    name: "MainItemMedal",
    components: {
      MainItemList
    },
    data() {
      return {
        loading: false,
        itemId: null,
        dataList: []
      }
    },
    created() {
      this.$emit('loadActiveTab', 'game');
      this.itemId = this.$route.params.itemId ? parseInt(this.$route.params.itemId) : null;
      this.getDataList();
    },
    methods: {
      getDataList() {
        this.loading = true;
        calUnitTypeMedal({
          gameId: this.$store.getters.game.id,
          categoryId: this.$store.getters.categoryId,
          itemId: this.itemId
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
        itemId=${this.itemId}&unitTypeId=${row.unitTypeId}&orderIndex=${orderIndex}`;
        const path = {
          to: to,
          name: row.unitTypeStr
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
    .item {
      width: 25%;
    }
  }
</style>
