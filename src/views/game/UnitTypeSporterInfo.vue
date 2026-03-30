<template>
  <div class="unitType-sporter-info">
    <div class="sporter-query">
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
      <el-input class="query" v-model="queryParams.name" clearable placeholder="请输入运动员姓名"></el-input>
      <el-button icon="el-icon-search" circle @click="handleQuery"></el-button>
    </div>
    <div class="sporter-data" v-loading="loading" element-loading-spinner="el-icon-loading">
      <div v-if="total>0">
        <div class="sporter-list">
          <div class="sporter-info" v-for="sporter in gameSporterList" @click="toSporterInfo(sporter)">
            <el-image v-if="sporter.photo" class="photo" :src="sporter.photo" fit="cover" :lazy="true" />
            <img v-else class="photo" src="~assets/img/game/default_profile.png">
            <ul class="info">
              <li>{{sporter.name}}</li>
              <li>{{sexFormat(sporter.sex)}}</li>
            </ul>
            <ul class="info">
              <li>{{sporter.itemStr}}</li>
              <li>{{sporter.unitTypeStr}}</li>
            </ul>
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
  import { listItem } from "network/game/item";
  import { listInitRace } from "network/game/race";
  import { listGameSporter } from "network/game/sporter";

  export default {
    name: "UnitTypeSporterInfo",
    data() {
      return {
        showPhoto: this.$store.getters.categoryCode == 'young',
        loading: false,
        sexOptions: [],
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
          pageSize: 30
        }
      }
    },
    created() {
      this.$emit('loadActiveTab', 'sporter');
      this.queryParams.unitTypeId = this.$route.params.unitTypeId ? parseInt(this.$route.params.unitTypeId) : null;
      this.getDicts("gm_person_sex").then(response => {
        this.sexOptions = response.data;
      });
      this.getItemList();
      this.getGameSporterList();
    },
    methods: {
      sexFormat(sex) {
        return this.selectDictLabel(this.sexOptions, sex);
      },
      toSporterInfo(sp) {
        this.$router.push(`/game/sporter/${sp.categoryId}/${sp.sporterId}`);
      },
      getItemList() {
        listItem({
          gameId: this.$store.getters.game.id,
          categoryId: this.$store.getters.categoryId,
          orderByColumn: 'i.orderNum',
          isAsc: 'asc'
        }).then(res => {
          this.itemList = res.rows;
        });
      },
      handleItemChange(itemId) {
        this.raceList = [];
        this.queryParams.raceId = null;
        if (this.queryParams.itemId > 0) {
          listInitRace({
            gameId: this.$store.getters.game.id,
            categoryId: this.$store.getters.categoryId,
            itemId: this.queryParams.itemId,
            orderByColumn: 'c.orderNum, i.orderNum, g.orderNum, r.orderNum',
            isAsc: 'asc, asc, asc, asc'
          }).then(res => {
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
        if (this.queryParams.unitTypeId) {
          listGameSporter(this.queryParams).then(res => {
            this.loading = false;
            this.gameSporterList = res.rows;
            this.total = res.total;
          });
        }
      },
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getGameSporterList();
      }
    }
  }
</script>

<style lang="less" scoped>
  .unitType-sporter-info {

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
          }
          .info {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            line-height: 22px;
          }
        }
      }
    }
  }
</style>
