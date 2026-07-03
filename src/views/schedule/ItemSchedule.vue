<template>
  <div class="item-schedule-view">
    <div class="schedule-date">
      <div v-if="matchDateList.length > 0" class="date">
        <ul>
          <li
            v-for="i in matchDateList"
            :class="{
              'has-final': i.finalCount > 0,
              'day-select': matchDateSelect && i.matchDate == matchDateSelect,
            }"
            @click="handleDateClick(i)"
          >
            {{ i.matchDate | dateFmt("MM-DD") }}
          </li>
        </ul>
      </div>
    </div>

    <div class="panel">
      <ul class="info">
        <li class="item" v-if="itemId > 0">
          {{ curItem ? curItem.name : "" }}
        </li>
        <li class="title">比赛日程</li>
        <li class="race" v-if="raceId > 0" @click="handleCurRaceClick">
          {{ curRace ? curRace.name : "" }}
        </li>
      </ul>
      <div class="search">
        <div class="option sex" v-for="sexRaces in sexInitRaceList">
          <span class="text">{{ raceSexFormat(sexRaces.sex) }}项目&nbsp;▽</span>
          <ul class="races-info">
            <li
              v-for="race in sexRaces.raceList"
              :class="race.id == raceId ? 'race-select' : ''"
              @click="handleRaceClick(race)"
            >
              {{ race.name }}
            </li>
          </ul>
        </div>
        <div class="option items">
          <span class="text">更多项目&nbsp;▽</span>
          <ul class="items-info">
            <li v-for="i in letterItemList">
              <a class="letter">{{ i.letter }}</a>
              <a
                class="item"
                v-for="item in i.itemList"
                :class="item.id == itemId ? 'item-select' : ''"
                @click="handleItemClick(item)"
                >{{ item.name }}</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="order-display" v-if="resultList.length > 0">
      <div class="title">
        <span class="head">名次公告</span>
        <span class="info"
          >{{ resultList[0].matchDate | dateFmt("MM-DD HH:mm") }}
          {{ resultList[0].matchAddress }}</span
        >
      </div>
      <div class="data">
        <el-table
          :data="resultList"
          row-key="idx"
          :expand-row-keys="expandIdxs"
        >
          <el-table-column
            label="名次"
            align="center"
            prop="orderIndex"
            width="200"
          >
            <template slot-scope="scope">
              <medal-img
                class="medal"
                v-if="scope.row.medalType"
                :order-index="scope.row.orderIndex"
                :medal-type="scope.row.medalType"
                :show-order-index="true"
              />
              <span v-else>{{ scope.row.orderIndex }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单位" align="left" prop="unitName" />
          <el-table-column
            label="成绩"
            align="center"
            prop="result"
            width="200"
          />
          <el-table-column
            v-if="isYoung"
            label="计牌"
            align="center"
            prop="medal"
            width="100"
          />
          <el-table-column
            v-if="isYoung"
            label="超破计牌"
            align="center"
            prop="extra.extraMedal"
            width="100"
          />
          <el-table-column
            v-if="isYoung"
            label="运动员"
            align="center"
            width="150"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{
                scope.row.sporterList
                  ? scope.row.sporterList.map((s) => s.name).join("/")
                  : ""
              }}
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            align="center"
            prop="remark"
            width="150"
            show-overflow-tooltip
          />
          <el-table-column type="expand" align="center" width="60">
            <template slot="header" slot-scope="scope">
              <div
                class="el-table__expand-icon"
                :class="expandAll ? 'el-table__expand-icon--expanded' : ''"
              >
                <i
                  class="expand-arrow el-icon el-icon-arrow-right"
                  @click="handleExpand()"
                />
              </div>
            </template>
            <template slot-scope="props">
              <div class="sporter-list">
                <div
                  class="sporter-info"
                  v-for="sporter in props.row.sporterList"
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
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div v-loading="loading" element-loading-spinner="el-icon-loading">
      <div class="schedule-date" v-for="dateRaces in dateRaceList">
        <div class="title">{{ dateRaces.date | dateFmt("MM-DD") }}</div>
        <div class="schedule-data">
          <table>
            <thead>
              <tr>
                <th style="width: 15%">时间</th>
                <th style="width: 45%">比赛名称</th>
                <th style="width: 10%; min-width: 180px">报表</th>
                <th>比赛场馆</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(race, index) in dateRaces.raceList"
                :class="index % 2 == 0 ? '' : 'odd'"
              >
                <td>{{ race.matchDate | dateFmt("HH:mm") }}</td>
                <td class="left">
                  <a
                    class="fr ml5"
                    v-if="race.stage == '0' && race.scoreStatus == '0'"
                  >
                    <img src="~assets/img/schedule/has_result.png" />
                    <span @click="handleRaceClick(race)">&nbsp;查看详情</span>
                  </a>
                  <span class="fr" v-if="race.parallelFlag">
                    <img src="~assets/img/schedule/parallel.png" />
                    <span>&nbsp;含并列</span>
                  </span>
                  {{ race.name }}
                  <span class="sub-text-sm">{{ race.remark }}</span>
                </td>
                <td>
                  <a
                    class="lf"
                    v-if="race.stage == '0' && race.scoreStatus == '0'"
                  >
                    <img src="~assets/img/schedule/has_sheet.png" />
                    <span class="lf" @click="downloadResult(race)"
                      >&nbsp;名次公告</span
                    >
                  </a>
                  <a class="lf ml10" v-if="race.stage == '0'">
                    <template
                      v-if="!race.remark || !race.remark.includes('取消')"
                    >
                      <img src="~assets/img/schedule/has_sheet.png" />
                      <span class="lf" @click="downloadProgram(race)"
                        >&nbsp;参赛名单</span
                      >
                    </template>
                  </a>
                </td>
                <td>
                  <div v-if="race.activeFlag">{{ race.matchAddress }}</div>
                  <div v-else style="color: red">{{ race.remark }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MedalImg from "views/components/MedalImg";
import { listItem } from "network/game/item";
import { listGameRace, listInitRace } from "network/game/race";
import { listMatchDate } from "network/game/race";
import { listResult } from "network/game/result";

export default {
  name: "ItemSchedule",
  components: {
    MedalImg,
  },
  data() {
    return {
      loading: false,
      itemId: null,
      raceId: null,
      sexOptions: [],
      raceSexOptions: [],
      itemList: [],
      initRaceList: [],
      raceList: [],
      matchDateList: [],
      matchDateSelect: null,
      resultList: [],
      expandIdxs: [],
      expandAll: false,
    };
  },
  computed: {
    isYoung() {
      return this.$store.getters.categoryCode === "young";
    },
    curItem() {
      if (this.itemId > 0) {
        return this.itemList.find((i) => {
          return i.id === this.itemId;
        });
      }
      return {};
    },
    curRace() {
      if (this.raceId > 0) {
        return this.initRaceList.find((i) => {
          return i.id === this.raceId;
        });
      }
      return {};
    },
    sexInitRaceList() {
      const map = new Map();
      this.initRaceList.forEach((i) => {
        let arr = map.get(i.sex);
        if (!arr) {
          map.set(i.sex, []);
        }
        map.get(i.sex).push(i);
      });
      const res = [];
      map.forEach((arr, key) => {
        res.push({
          sex: key,
          raceList: arr,
        });
      });
      return res;
    },
    letterItemList() {
      const map = new Map();
      this.itemList.forEach((i) => {
        const letter = i.spell ? i.spell[0].toUpperCase() : null;
        let arr = map.get(letter);
        if (!arr) {
          map.set(letter, []);
        }
        map.get(letter).push(i);
      });
      const res = [];
      map.forEach((arr, key) => {
        res.push({
          letter: key,
          itemList: arr,
        });
      });
      return res;
    },
    dateRaceList() {
      const map = new Map();
      this.raceList.forEach((i) => {
        const key = i.matchDate
          ? this.dayjs(i.matchDate).format("YYYY-MM-DD")
          : null;
        let arr = map.get(key);
        if (!arr) {
          map.set(key, []);
        }
        map.get(key).push(i);
      });
      const res = [];
      map.forEach((arr, key) => {
        if (!this.matchDateSelect || this.matchDateSelect === key) {
          res.push({
            date: key,
            raceList: arr,
          });
        }
      });
      return res;
    },
  },
  created() {
    this.getDicts("gm_person_sex").then((response) => {
      this.sexOptions = response.data;
    });
    this.getDicts("gm_race_sex").then((response) => {
      this.raceSexOptions = response.data;
    });
    this.matchDateSelect = this.$route.query.matchDate;
    this.itemId = this.$route.params.itemId
      ? parseInt(this.$route.params.itemId)
      : null;
    this.raceId = this.$route.params.raceId
      ? parseInt(this.$route.params.raceId)
      : null;
    this.getItemList().then(() => {
      const find = this.itemList.find((i) => {
        return i.id === this.itemId;
      });
      if (!find) {
        //如果和当前选择组别不统一，则跳转
        this.$router.push(`/schedule/item`);
        return;
      }
      this.getMatchDateList();
      this.getInitRaceList();
      this.getRaceList();
      this.getResultList();
    });
  },
  methods: {
    sexFormat(sex) {
      return this.selectDictLabel(this.sexOptions, sex);
    },
    raceSexFormat(sex) {
      return this.selectDictLabel(this.raceSexOptions, sex);
    },
    handleDateClick(val) {
      const matchDate = val.matchDate;
      this.matchDateSelect = !this.matchDateSelect
        ? matchDate
        : this.matchDateSelect == matchDate
        ? null
        : matchDate;
    },
    getItemList() {
      return new Promise((resolve, reject) => {
        listItem({
          gameId: this.$store.getters.game.id,
          categoryId: this.$store.getters.categoryId,
          orderByColumn: "i.spell",
          isAsc: "asc",
        })
          .then((res) => {
            this.itemList = res.rows;
            //如果不是点击项目跳转而来，则自动显示首个项目
            this.itemId =
              this.itemList.length > 0 && !this.itemId
                ? this.itemList[0].id
                : this.itemId;
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getInitRaceList() {
      listInitRace({
        gameId: this.$store.getters.game.id,
        categoryId: this.$store.getters.categoryId,
        itemId: this.itemId,
        orderByColumn: "c.orderNum, i.orderNum, g.orderNum, r.orderNum",
        isAsc: "asc, asc, asc, asc",
      }).then((res) => {
        this.initRaceList = res.rows;
      });
    },
    getMatchDateList() {
      listMatchDate({
        gameId: this.$store.getters.game.id,
        categoryId: this.$store.getters.categoryId,
        itemId: this.itemId,
        raceId: this.raceId,
      }).then((res) => {
        this.matchDateList = res.data;
      });
    },
    getRaceList() {
      this.loading = true;
      listGameRace({
        gameId: this.$store.getters.game.id,
        categoryId: this.$store.getters.categoryId,
        itemId: this.itemId,
        id: this.raceId,
        orderByColumn: "r.matchDate, r.orderNum",
        isAsc: "asc, asc",
      }).then((res) => {
        this.raceList = res.rows;
        this.loading = false;
      });
    },
    getResultList() {
      if (this.raceId > 0) {
        listResult({
          gameId: this.$store.getters.game.id,
          categoryId: this.$store.getters.categoryId,
          raceId: this.raceId,
          orderByColumn: "s.orderIndex",
          isAsc: "asc",
        }).then((res) => {
          for (let i = 0; i < res.rows.length; i++) {
            res.rows[i].idx = i;
          }
          this.resultList = res.rows;
        });
      }
    },
    handleItemClick(item) {
      this.$router.push(`/schedule/item/${item.id}`);
    },
    handleRaceClick(race) {
      this.$router.push(`/schedule/item/${race.itemId}/${race.id}`);
    },
    handleCurRaceClick() {
      this.$router.push(`/schedule/item/${this.curRace.itemId}`);
    },
    toSporterInfo(sp) {
      this.$router.push(`/game/sporter/${sp.categoryId}/${sp.sporterId}`);
    },
    downloadResult(race) {
      const url =
        process.env.VUE_APP_BASE_API +
        `/game/score/export/race/result?gameId=${this.$store.getters.game.id}&categoryId=${this.$store.getters.categoryId}&raceId=${race.id}`;
      window.open(url, "_blank");
    },
    downloadProgram(race) {
      const url =
        process.env.VUE_APP_BASE_API +
        `/game/score/export/race/program?gameId=${this.$store.getters.game.id}&categoryId=${this.$store.getters.categoryId}&raceId=${race.id}`;
      window.open(url, "_blank");
    },
    handleExpand() {
      this.expandAll = !this.expandAll;
      if (this.expandAll) {
        this.expandIdxs = this.resultList.map((i) => {
          return i.idx;
        });
      } else {
        this.expandIdxs = [];
      }
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-table th.el-table__cell {
  background-color: #f7f7f7 !important;
  color: #000;
}

.item-schedule-view {
  .schedule-date {
    .date {
      width: 100%;
      margin-bottom: 20px;
      border: 1px solid #dadada;
      overflow: hidden;

      ul {
        box-sizing: border-box;
        margin: 10px 10px 0px 10px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-content: flex-start;

        li {
          &.has-final {
            background: @t-color-m2;
            color: #fff;
          }

          &.day-select {
            background: @t-color-m1;
            color: #fff;
          }

          width: 60px;
          height: 35px;
          line-height: 35px;
          border-radius: 3px;
          border: none;
          background: @t-color-option;
          font-size: 14px;
          text-align: center;
          font-weight: bold;
          margin: 0px 10px 10px 0px;
          cursor: pointer;
        }
      }
    }
  }

  .panel {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .info {
      display: flex;
      flex-direction: row;

      li {
        width: 160px;
        height: 44px;
        line-height: 44px;
        text-align: center;
        font-size: 18px;
        color: #fff;
        &.item {
          background-color: #494949;
        }
        &.title {
          background-color: @t-color-m1;
        }
        &.race {
          width: auto;
          padding: 0 10px;
          cursor: pointer;
          background-color: @t-color-m2;
        }
      }
    }

    .search {
      display: flex;
      flex-direction: row;
      align-items: flex-end;

      @option-width: 90px;
      @option-height: 30px;
      @border-width: 2px;

      .option {
        width: @option-width;
        height: @option-height;
        line-height: @option-height;
        color: #fff;
        .text {
          font-size: 14px;
        }
        ul {
          display: none;
          width: 300px;
          min-height: @option-height;
          z-index: 100;
          background-color: #fff;
        }
      }

      .items {
        position: relative;
        background: @t-color-m1;
        &:hover .items-info {
          display: block;
        }

        .items-info {
          @gap: 6px;

          position: absolute;
          right: 0;
          top: @option-height;
          border: @border-width solid @t-color-m1;
          text-align: left;
          padding-bottom: @gap;

          li {
            box-sizing: border-box;
            padding: 0px @gap;
            width: 100%;
            font-size: 14px;
            color: #000;

            a {
              display: inline-block;
              height: 22px;
              line-height: 22px;
              padding: 5px 10px;
              text-align: center;
              margin: @gap @gap 0px 0px;
              background: #f1f1f1;

              &.item {
                cursor: pointer;

                &.item-select,
                &:hover {
                  background: @t-color-m1;
                  color: #fff;
                }
              }

              &.letter {
                background: @t-color-m1;
                color: #fff;
              }
            }
          }
        }
      }

      .sex {
        position: relative;
        background: @t-color-m3;
        &:hover .races-info {
          display: block;
        }
        .races-info {
          position: absolute;
          right: 0;
          top: @option-height;
          border: @border-width solid @t-color-m3;
          li {
            .single-line-break();
            box-sizing: border-box;
            padding: 0px 10px;
            width: 100%;
            height: 30px;
            line-height: 30px;
            text-align: left;
            font-size: 14px;
            color: #000;
            cursor: pointer;
            &.race-select,
            &:hover {
              background: @t-color-m3;
              color: #fff;
            }
          }
        }
      }
    }
  }

  .order-display {
    .title {
      position: relative;
      margin-top: 20px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      background-color: @t-color-m1;
      color: #fff;
      .info {
        position: absolute;
        right: 20px;
        font-size: 14px;
      }
    }

    /deep/ .data {
      td {
        height: 48px;
        padding: 0;
      }
      .medal img {
        width: 30px;
        height: 30px;
      }
      .expand-arrow {
        cursor: pointer;
      }
    }

    .sporter-list {
      margin-top: 10px;
      margin-left: 200px;
      display: flex;
      flex-wrap: wrap;
      .sporter-info {
        margin-right: 8px;
        margin-bottom: 10px;
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
          @w: 100px;
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
  }

  .schedule-date {
    margin-top: 20px;
    .title {
      height: 60px;
      line-height: 60px;
      font-size: 24px;
      color: @t-color-m1;
      text-align: left;
    }
    table {
      width: 100%;
    }
    .schedule-data {
      th {
        height: 40px;
        line-height: 40px;
        border: dotted 1px #eee;
        text-align: center;
        background: @t-color-m1;
        color: #fff;
        font-size: 14px;
      }

      tr.odd {
        background: @t-color-oddrow;
      }

      td {
        width: 60px;
        min-width: 60px;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        border: solid 1px #eee;
        text-align: center;
        color: #000;
        img {
          width: 24px;
          height: 24px;
          border: 0px;
          transform: translateY(25%);
        }
        a {
          font-size: 12px;
          color: #000;
          cursor: pointer;
        }
        span {
          font-size: 12px;
        }
        &.left {
          text-align: left;
          padding-left: 5px;
          padding-right: 5px;
          a {
            color: #177dce;
          }
        }
      }
    }
  }
}
</style>
