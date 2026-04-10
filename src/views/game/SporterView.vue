<template>
  <div class="sporter-view">
    <div class="sporter-query">
      <el-select
        v-model="queryParams.unitTypeId"
        clearable
        filterable
        class="query"
        placeholder="请选择单位"
        @change="handleUnitTypeChange"
      >
        <el-option
          v-for="item in unitTypeList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        class="query"
        v-model="queryParams.itemId"
        clearable
        filterable
        placeholder="请选择比赛项目"
        @change="handleItemChange"
      >
        <el-option
          v-for="item in itemList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        class="query"
        v-model="queryParams.raceId"
        clearable
        filterable
        placeholder="请选择竞赛项目"
        @change="handleRaceChange"
      >
        <el-option
          v-for="item in raceList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-input
        class="query"
        v-model="queryParams.name"
        clearable
        placeholder="请输入运动员姓名"
      ></el-input>
      <el-button icon="el-icon-search" circle @click="handleQuery"></el-button>
    </div>
    <div
      class="sporter-data"
      v-loading="loading"
      element-loading-spinner="el-icon-loading"
    >
      <div v-if="total > 0">
        <!--照片卡片形式-->
        <div v-if="showPhoto" class="sporter-list">
          <div
            class="sporter-info"
            v-for="sporter in gameSporterList"
            @click="toSporterInfo(sporter)"
          >
            <el-image
              v-if="sporter.photo"
              class="photo"
              :src="sporter.photo"
              fit="cover"
              :lazy="true"
            />
            <img
              v-else
              class="photo"
              src="~assets/img/game/default_profile.png"
            />
            <ul class="info">
              <li>{{ sporter.name }}</li>
              <li>{{ sexFormat(sporter.sex) }}</li>
            </ul>
            <ul class="info">
              <li>{{ sporter.itemStr }}</li>
              <li>{{ sporter.unitTypeStr }}</li>
            </ul>
          </div>
        </div>
        <!--无照片的表格形式-->
        <div v-else class="sporter-table">
          <div class="container" v-for="t in tSporterList">
            <table>
              <thead>
                <tr>
                  <th width="30%">项目</th>
                  <th width="30%">姓名</th>
                  <th width="15%">性别</th>
                  <th width="25%">单位</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="sporter in t" @click="toSporterInfo(sporter)">
                  <td>{{ sporter.itemStr }}</td>
                  <td>{{ sporter.name }}</td>
                  <td>{{ sexFormat(sporter.sex) }}</td>
                  <td class="unitTypeStr">{{ sporter.unitTypeStr }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div v-else>没有更多数据</div>
      <el-pagination
        background
        layout="prev, pager, next"
        hide-on-single-page
        :total="total"
        :current-page.sync="queryParams.pageNum"
        :page-size.sync="queryParams.pageSize"
        @current-change="getGameSporterList"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { listUnitType } from "network/game/unitType";
import { listItem } from "network/game/item";
import { listInitRace } from "network/game/race";
import { listGameSporter } from "network/game/sporter";
import { sortUnitTypeByOrder } from "common/utils";

export default {
  name: "SporterView",
  data() {
    return {
      showPhoto: this.$store.getters.categoryCode == "young",
      loading: false,
      sexOptions: [],
      unitTypeList: [],
      itemList: [],
      raceList: [],
      gameSporterList: [],
      total: 0,
      queryParams: {
        gameId: this.$store.getters.game.id,
        categoryId: this.$store.getters.categoryId,
        unitTypeId: null,
        itemId: null,
        raceId: null,
        name: null,
        pageNum: 1,
        pageSize: 30,
      },
    };
  },
  computed: {
    tSporterList() {
      const tSize = 10;
      const res = [];
      let counter = 0;
      this.gameSporterList.forEach((i) => {
        if (!res[counter]) {
          res[counter] = [];
        }
        res[counter].push(i);
        if (res[counter].length === tSize) {
          counter++;
        }
      });
      if (res.length > 3) {
        throw Error(`渲染的表格数量应该控制在3个及以内:${res.length}`);
      }
      return res;
    },
  },
  created() {
    const categoryId = this.$route.query.categoryId || null;
    if (categoryId) {
      this.$store.dispatch("setCategoryId", categoryId);
    }
    this.queryParams.unitTypeId = this.$route.query.unitTypeId || null;
    this.queryParams.itemId = this.$route.query.itemId || null;
    this.queryParams.raceId = this.$route.query.raceId || null;
    this.getUnitTypeList();
    this.getItemList();
    this.getRaceList();
    this.getGameSporterList();
    this.getDicts("gm_person_sex").then((response) => {
      this.sexOptions = response.data;
    });
  },
  methods: {
    sexFormat(sex) {
      return this.selectDictLabel(this.sexOptions, sex);
    },
    toSporterInfo(sp) {
      this.$router.push(`/game/sporter/${sp.categoryId}/${sp.sporterId}`);
    },
    getUnitTypeList() {
      listUnitType({
        gameId: this.$store.getters.game.id,
        categoryId: this.$store.getters.categoryId,
        parentId: 0,
        orderByColumn: "ut.orderNum",
        isAsc: "asc",
      }).then((res) => {
        if (this.$store.getters.categoryCode == "young") {
          this.unitTypeList = sortUnitTypeByOrder(res.rows);
        } else {
          this.unitTypeList = res.rows;
        }
      });
    },
    getItemList() {
      listItem({
        gameId: this.$store.getters.game.id,
        categoryId: this.$store.getters.categoryId,
        orderByColumn: "i.orderNum",
        isAsc: "asc",
      }).then((res) => {
        this.itemList = res.rows;
      });
    },
    getRaceList() {
      this.raceList = [];
      if (this.queryParams.itemId > 0) {
        listInitRace({
          gameId: this.$store.getters.game.id,
          categoryId: this.$store.getters.categoryId,
          itemId: this.queryParams.itemId,
          orderByColumn: "c.orderNum, i.orderNum, g.orderNum, r.orderNum",
          isAsc: "asc, asc, asc, asc",
        }).then((res) => {
          this.raceList = res.rows;
        });
      }
    },
    handleUnitTypeChange(unitTypeId) {
      this.handleQuery();
    },
    handleItemChange(itemId) {
      this.raceList = [];
      this.queryParams.raceId = null;
      if (this.queryParams.itemId > 0) {
        listInitRace({
          gameId: this.$store.getters.game.id,
          categoryId: this.$store.getters.categoryId,
          itemId: this.queryParams.itemId,
          orderByColumn: "c.orderNum, i.orderNum, g.orderNum, r.orderNum",
          isAsc: "asc, asc, asc, asc",
        }).then((res) => {
          this.raceList = res.rows;
        });
      }
      this.handleQuery();
    },
    handleRaceChange(raceId) {
      this.handleQuery();
    },
    getGameSporterList() {
      this.loading = true;
      this.gameSporterList = [];
      listGameSporter(this.queryParams).then((res) => {
        this.loading = false;
        this.gameSporterList = res.rows;
        this.total = res.total;
      });
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getGameSporterList();
    },
  },
};
</script>

<style lang="less" scoped>
.sporter-view {
  .sporter-query {
    text-align: left;
    .query {
      width: 180px;
      margin-right: 20px;
    }
  }

  .sporter-data {
    margin-top: 20px;

    .el-pagination {
      margin: 20px auto;
    }

    .sporter-list {
      display: flex;
      flex-wrap: wrap;
      .sporter-info {
        min-width: 120px;
        margin-right: 20px;
        margin-bottom: 25px;
        background-color: #e7f2fa;
        box-sizing: border-box;
        padding: 8px;
        border-radius: 4px;
        &:hover {
          cursor: pointer;
          background-color: @t-color-m1;
          color: #fff;
        }
        .photo {
          @w: 120px;
          width: @w;
          height: @w*1.5;
          object-fit: cover;
          border-radius: 2px;
        }
        .info {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          line-height: 22px;
        }
      }
    }

    .sporter-table {
      display: flex;
      justify-content: center;
      .container {
        margin: 0 10px;
        width: 30%;
        table {
          width: 100%;
          @h: 40px;
          th {
            height: @h;
            line-height: @h;
            border: dotted 1px #eee;
            text-align: center;
            background: @t-color-m1;
            color: #fff;
            font-size: 14px;
          }
          td {
            max-width: 100px;
            height: @h;
            line-height: @h;
            font-size: 14px;
            border: solid 1px #eee;
            text-align: center;
            color: #000;
          }
          tbody tr:hover {
            cursor: pointer;
            background: #e5ebee;
          }
          td.unitTypeStr {
            .single-line-break();
          }
        }
      }
    }
  }
}
</style>
