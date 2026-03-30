<template>
  <div class="sheet-view">
    <div class="sheet-query">
      <el-select
        v-model="queryParams.type"
        clearable
        class="query"
        placeholder="请选择报表类型"
        @change="handleQuery"
      >
        <el-option
          v-for="(item, index) in sheetTypeList"
          :key="index"
          :label="item"
          :value="item"
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
        @change="handleQuery"
      >
        <el-option
          v-for="item in raceList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </div>
    <div class="sheet-data">
      <div v-if="sheets.length">
        <table>
          <thead>
          <tr>
            <th width="20%">报表类型</th>
            <th width="60%">名称</th>
            <th width="20%">操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="s in sheets">
            <td>{{s.type}}</td>
            <td>{{s.name}}</td>
            <td class="download" @click="handleDownload(s)">点击下载</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div v-else>没有找到数据，您可以通过条件筛选查找更多</div>
    </div>
  </div>
</template>

<script>
  import { listItem } from "network/game/item";
  import { listInitRace } from "network/game/race";
  import { listSheetType, listGameSheet, listItemSheet, listRaceSheet } from "network/game/sheet";

  export default {
    name: "SheetView",
    data() {
      return {
        sheetTypeList: [],
        itemList: [],
        raceList: [],
        sheetList: [],
        queryParams: {
          gameId: this.$store.getters.game.id,
          categoryId: this.$store.getters.categoryId,
          type: null,
          itemId: null,
          raceId: null
        }
      }
    },
    computed: {
      sheets() {
        if (this.queryParams.type) {
          return this.sheetList.filter(i => {
            return i.type === this.queryParams.type;
          })
        } else {
          return this.sheetList;
        }
      },
      curItem() {
        if (this.queryParams.itemId) {
          const item = this.itemList.find(i => {
            return i.id === this.queryParams.itemId;
          });
          return item || {};
        }
        return {};
      },
      curRace() {
        if (this.queryParams.raceId) {
          const race = this.raceList.find(i => {
            return i.id === this.queryParams.raceId;
          });
          return race || {};
        }
        return {};
      }
    },
    created() {
      this.getSheetTypeList();
      this.getItemList();
      this.handleQuery();
    },
    methods: {
      getSheetTypeList() {
        listSheetType({
          gameId: this.$store.getters.game.id,
          categoryId: this.$store.getters.categoryId,
          orderByColumn: 's.orderNum',
          isAsc: 'asc'
        }).then(res => {
          let arr = ['参赛名单', '名次公告'].concat(res.data);
          this.sheetTypeList = Array.from(new Set(arr)); //去重，比如后台建立的类型包含默认的秩序册/名次公告
        })
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
      handleQuery() {
        /*
        if !itemId -> game
        if  itemId && !raceId -> item
        if  itemId &&  raceId -> race
         */
        this.sheetList = [];
        //game
        if (!this.queryParams.itemId) {
          listGameSheet(this.queryParams).then(res => {
            const list = [
              /*
              {
                type: '参赛名单',
                name: `${this.$store.getters.game.name}${this.$store.getters.categoryName}体育项目比赛参赛名单`,
                path: `/game/score/export/program?gameId=${this.$store.getters.game.id}&categoryId=${this.$store.getters.categoryId}`
              },
              */
              /*
              {
                type: '名次公告',
                name: `${this.$store.getters.game.name}${this.$store.getters.categoryName}体育项目比赛名次公告`,
                path: `/game/score/export/result?gameId=${this.$store.getters.game.id}&categoryId=${this.$store.getters.categoryId}`
              }
              */
            ];
            this.handleDefaultPath(list);
            this.handleCommonPath(res.rows);
            this.sheetList = list.concat(res.rows);
          });
        }
        //item
        if (this.queryParams.itemId && !this.queryParams.raceId) {
          listItemSheet(this.queryParams).then(res => {
            const list = [
              {
                type: '参赛名单',
                name: `${this.$store.getters.game.name}${this.$store.getters.categoryName}体育项目${this.curItem.name}比赛参赛名单`,
                path: `/game/score/export/program?gameId=${this.$store.getters.game.id}&categoryId=${this.$store.getters.categoryId}&itemId=${this.queryParams.itemId}`
              },
              {
                type: '名次公告',
                name: `${this.$store.getters.game.name}${this.$store.getters.categoryName}体育项目${this.curItem.name}比赛名次公告`,
                path: `/game/score/export/result?gameId=${this.$store.getters.game.id}&categoryId=${this.$store.getters.categoryId}&itemId=${this.queryParams.itemId}`
              }
            ];
            this.handleDefaultPath(list);
            this.handleCommonPath(res.rows);
            this.sheetList = list.concat(res.rows);
          });
        }
        //race
        if (this.queryParams.itemId && this.queryParams.raceId) {
          listRaceSheet(this.queryParams).then(res => {
            const list = [
              {
                type: '参赛名单',
                name: `${this.$store.getters.game.name}${this.$store.getters.categoryName}体育项目${this.curRace.name}比赛参赛名单`,
                path: `/game/score/export/race/program?gameId=${this.$store.getters.game.id}&categoryId=${this.$store.getters.categoryId}&raceId=${this.queryParams.raceId}`
              },
              {
                type: '名次公告',
                name: `${this.$store.getters.game.name}${this.$store.getters.categoryName}体育项目${this.curRace.name}比赛名次公告`,
                path: `/game/score/export/race/result?gameId=${this.$store.getters.game.id}&categoryId=${this.$store.getters.categoryId}&raceId=${this.queryParams.raceId}`
              }
            ];
            this.handleDefaultPath(list);
            this.handleCommonPath(res.rows);
            this.sheetList = list.concat(res.rows);
          })
        }
      },
      handleDefaultPath(list) {
        list.forEach(i => {
          i.path += `&downName=${i.name}`
        });
      },
      handleCommonPath(list) {
        list.forEach(i => {
          i.path = `/common/download/resource?name=${i.path}&downName=${i.name}`;
        });
      },
      handleDownload(sheet) {
        let url = process.env.VUE_APP_BASE_API + sheet.path;
        window.open(url, '_blank');
      }
    }
  }
</script>

<style lang="less" scoped>
  .sheet-view {

    .sheet-query {
      text-align: left;
      .query {
        width: 180px;
        margin-right: 20px;
      }
    }

    .sheet-data {
      margin-top: 20px;

      .el-pagination {
        margin: 20px auto;
      }

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
          height: @h;
          line-height: @h;
          font-size: 14px;
          border: solid 1px #eee;
          text-align: center;
          color: #000;
          &.download {
            color: @t-color-click;
            cursor: pointer;
          }
        }
        tbody tr:hover {
          background: #e5ebee;
        }
      }

    }

  }
</style>
