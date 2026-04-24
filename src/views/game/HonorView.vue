<template>
  <div class="honor-view">
    <div class="filter-bar">
      <el-select
        v-model="queryParams.unitTypeId"
        placeholder="全部代表团"
        clearable
        @change="handleFilterChange"
      >
        <el-option
          v-for="u in unitTypeList"
          :key="u.id"
          :label="u.name"
          :value="u.id"
        />
      </el-select>
      <el-select
        v-model="queryParams.itemId"
        placeholder="全部项目"
        clearable
        @change="handleFilterChange"
      >
        <el-option
          v-for="i in itemList"
          :key="i.id"
          :label="i.name"
          :value="i.id"
        />
      </el-select>
    </div>

    <div
      class="honor-list"
      v-loading="loading"
      element-loading-spinner="el-icon-loading"
    >
      <div v-if="!honorList.length && !loading" class="empty-tip">
        暂无荣誉运动员数据
      </div>
      <div v-for="(athlete, idx) in honorList" :key="athlete.gameAthleteId">
        <el-collapse class="athlete-collapse">
          <el-collapse-item
            :name="athlete.gameAthleteId"
            @click.native="handleAthleteClick(athlete, idx)"
          >
            <template slot="title">
              <div class="athlete-summary">
                <span class="col rank">{{ athlete.rankNum }}</span>
                <span class="col name">{{ athlete.athleteName }}</span>
                <span class="col gender">{{ sexFormat(athlete.gender) }}</span>
                <span class="col delegation">{{ athlete.delegationName }}</span>
                <span class="col sport">{{ athlete.gameSportName }}</span>
                <span class="col medal-group">
                  <span class="medal"
                    ><img src="~assets/img/game/1st.png" />{{
                      formatMedal(athlete.goldMedal)
                    }}</span
                  >
                  <span class="medal"
                    ><img src="~assets/img/game/2nd.png" />{{
                      formatMedal(athlete.silverMedal)
                    }}</span
                  >
                  <span class="medal"
                    ><img src="~assets/img/game/3rd.png" />{{
                      formatMedal(athlete.bronzeMedal)
                    }}</span
                  >
                </span>
              </div>
            </template>
            <div
              class="result-detail"
              v-loading="athlete._loading"
              element-loading-spinner="el-icon-loading"
            >
              <div
                v-if="athlete._loaded && !athlete._resultList.length"
                class="empty-tip"
              >
                暂无获牌记录
              </div>
              <el-collapse
                class="race-collapse"
                v-for="res in athlete._resultList"
                :key="res.raceId"
              >
                <el-collapse-item :name="res.raceId">
                  <template slot="title">
                    <div class="head" @click.stop="handleResultClick(res)">
                      <div class="race-name">{{ res.raceName }}</div>
                      <div class="race-medal">
                        <medal-img
                          :order-index="res.orderIndex"
                          :medal-type="res.medalType"
                          :show-order-index="false"
                        />
                      </div>
                    </div>
                  </template>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>

    <el-pagination
      v-if="total > 0"
      class="pagination"
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="queryParams.pageSize"
      :current-page.sync="queryParams.pageNum"
      @current-change="getHonorList"
    />
  </div>
</template>

<script>
import MedalImg from "views/components/MedalImg";
import { listHonor } from "network/game/honor";
import { listUnitType } from "network/game/unitType";
import { listItem } from "network/game/item";
import { getJoinSporter } from "network/game/sporter";

export default {
  name: "HonorView",
  components: {
    MedalImg,
  },
  data() {
    return {
      loading: false,
      sexOptions: [],
      unitTypeList: [],
      itemList: [],
      honorList: [],
      total: 0,
      queryParams: {
        unitTypeId: null,
        itemId: null,
        pageNum: 1,
        pageSize: 20,
      },
    };
  },
  created() {
    this.getDicts("gm_person_sex").then((response) => {
      this.sexOptions = response.data;
    });
    this.loadFilters();
    this.getHonorList();
  },
  methods: {
    sexFormat(sex) {
      return this.selectDictLabel(this.sexOptions, sex);
    },
    formatMedal(val) {
      if (val == null || val === 0) return 0;
      return Number.isInteger(val) ? val : val.toFixed(1);
    },
    loadFilters() {
      const categoryId = this.$store.getters.categoryId;
      const gameId = this.$store.getters.game.id;
      listUnitType({
        gameId: gameId,
        categoryId: categoryId,
      }).then((res) => {
        this.unitTypeList = res.rows || [];
      });
      listItem({
        gameId: gameId,
        categoryId: categoryId,
      }).then((res) => {
        this.itemList = res.rows || [];
      });
    },
    handleFilterChange() {
      this.queryParams.pageNum = 1;
      this.getHonorList();
    },
    getHonorList() {
      this.loading = true;
      listHonor(this.queryParams).then((res) => {
        const rows = res.rows || [];
        rows.forEach((r) => {
          r._resultList = [];
          r._loading = false;
          r._loaded = false;
        });
        this.honorList = rows;
        this.total = res.total || 0;
        this.loading = false;
      });
    },
    handleAthleteClick(athlete, idx) {
      if (athlete._loaded) return;
      const item = this.honorList[idx];
      this.$set(item, "_loading", true);
      const categoryId = this.$store.getters.categoryId;
      getJoinSporter(categoryId, athlete.gameAthleteId).then((res) => {
        const allResults = res.data.resultList || [];
        const medalResults = allResults.filter((r) => r.medal && r.medal > 0);
        this.$set(item, "_resultList", medalResults);
        this.$set(item, "_loading", false);
        this.$set(item, "_loaded", true);
      });
    },
    handleResultClick(res) {
      this.$router.push(`/schedule/item/${res.itemId}/${res.raceId}`);
    },
  },
};
</script>

<style lang="less" scoped>
.honor-view {
  .filter-bar {
    display: flex;
    padding: 12px 20px;
    gap: 12px;
    background-color: #fff;
    border-bottom: 1px solid #ebeef5;
    .el-select {
      width: 200px;
    }
  }

  .empty-tip {
    text-align: center;
    padding: 40px 0;
    color: #909399;
    font-size: 14px;
  }

  .athlete-collapse {
    margin-top: -1px;
  }

  .athlete-summary {
    width: 100%;
    display: flex;
    align-items: center;
    font-size: 15px;
    padding: 0 10px;

    .col {
      flex-shrink: 0;
    }
    .rank {
      width: 40px;
      font-weight: 500;
      color: @t-color-m1;
    }
    .name {
      width: 120px;
      font-weight: 500;
      color: @t-color-m1;
    }
    .gender {
      width: 50px;
      color: #606266;
    }
    .delegation {
      width: 100px;
      color: #606266;
    }
    .sport {
      flex: 1;
      color: #606266;
      text-align: left;
    }
    .medal-group {
      display: flex;
      align-items: center;
      gap: 8px;
      .medal {
        display: flex;
        align-items: center;
        font-size: 14px;
        img {
          width: 18px;
          height: 18px;
          margin-right: 2px;
        }
      }
    }
  }

  .result-detail {
    min-height: 40px;
  }

  /deep/ .race-collapse {
    margin-top: -1px;

    .head {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;

      .race-name {
        margin-left: 187px;
        color: @t-color-m1;
      }

      .race-medal {
        display: flex;
        align-items: center;
        font-size: 16px;
        margin-right: 45px;

        img {
          width: 14px;
          height: 14px;
        }
      }
    }
  }

  .pagination {
    padding: 20px 0;
    text-align: center;
  }
}
</style>
<style lang="less">
.athlete-collapse {
  .el-collapse-item__header {
    height: 56px;
    line-height: 56px;
  }
  .race-collapse {
    border-top: none;
    border-bottom: none;
    .el-collapse-item__header {
      @h: 40px;
      height: @h;
      line-height: @h;
      border-bottom: none;
      &:hover {
        background-color: #e7f2fa;
      }
    }
    .el-collapse-item__wrap {
      display: none;
    }
    .el-collapse-item__arrow {
      display: none;
    }
  }
}
</style>
