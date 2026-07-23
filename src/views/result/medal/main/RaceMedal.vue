<template>
  <div class="item-medal">
    <div class="medal">
      <el-table v-loading="loading" :data="dataList">
        <el-table-column type="index" align="center" width="80" fixed />
        <el-table-column
          label="竞赛项目"
          align="center"
          width="300"
          show-overflow-tooltip
        >
          <template scope="scope">
            <span class="race" @click="toItemSchedule(scope.row)">{{
              scope.row.raceName
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="运动员" align="center">
          <template scope="scope">
            <span
              class="sporter"
              v-for="sp in scope.row.sporterList"
              @click="toSporterInfo(sp)"
              >{{ sp.name }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          label="成绩"
          align="center"
          prop="result"
          width="140"
        />
        <el-table-column
          label="名次"
          align="center"
          prop="orderIndex"
          width="80"
        />
        <el-table-column
          label="计牌"
          align="center"
          prop="medal"
          sortable
          width="80"
        />
        <el-table-column
          label="超破计牌"
          align="center"
          sortable
          width="100"
          fixed="right"
        >
          <template scope="scope">
            {{ scope.row.extra && scope.row.extra.extraMedal ? scope.row.extra.extraMedal : '' }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { listResult } from "network/game/result";

export default {
  name: "RaceMedal",
  components: {},
  data() {
    return {
      loading: false,
      itemId: null,
      slaveItemId: null,
      unitTypeId: null,
      orderIndex: null,
      activeTab: "game",
      dataList: [],
    };
  },
  created() {
    this.itemId = this.$route.query.itemId || null;
    this.slaveItemId = this.$route.query.slaveItemId || null;
    this.unitTypeId = this.$route.query.unitTypeId || null;
    this.orderIndex = this.$route.query.orderIndex || null;
    this.activeTab = this.$route.query.activeTab || "game";
    this.getDataList();
    this.$emit("loadActiveTab", this.activeTab);
  },
  methods: {
    getDataList() {
      if (this.unitTypeId && (this.itemId || this.slaveItemId)) {
        this.loading = true;
        let params = {
          gameId: this.$store.getters.game.id,
          categoryId: this.$store.getters.categoryId,
          itemId: this.itemId,
          slaveItemId: this.slaveItemId,
          unitTypeId: this.unitTypeId,
          orderIndex: this.orderIndex == 0 ? 0 : null,
          orderIndexStart: this.orderIndex,
          orderIndexEnd: this.orderIndex,
          // 奖牌榜下钻时按奖牌类型筛选（1金/2银/3铜），与金牌榜统计口径一致
          // （如第二名计金牌的项目）；总分榜（score）下钻仍按名次筛选
          medalType:
            this.activeTab === "game" &&
            [1, 2, 3].includes(Number(this.orderIndex))
              ? String(this.orderIndex)
              : null,
        };

        listResult(params).then((res) => {
          this.dataList = res.rows;
          this.loading = false;
        });
      }
    },
    toItemSchedule(row) {
      this.$router.push(`/schedule/item/${row.itemId}/${row.raceId}`);
    },
    toSporterInfo(sp) {
      this.$router.push(`/game/sporter/${sp.categoryId}/${sp.sporterId}`);
    },
  },
};
</script>

<style lang="less" scoped>
.item-medal {
  display: flex;
  justify-content: space-between;
  .medal {
    width: 100%;
    .race {
      padding-right: 10px;
      cursor: pointer;
      &:hover {
        color: @t-color-m1;
      }
    }
    .sporter {
      padding-right: 10px;
      cursor: pointer;
      &:hover {
        color: @t-color-m1;
      }
    }
  }
}
</style>
