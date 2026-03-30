<template>
  <div class="daily-schedule-view">
    <div class="schedule-date">
      <ul class="months">
        <li
          v-for="(i, key) in monthScheduleDates"
          :key="key"
          :class="{
            'month-select':key==monthSelect
          }"
          @click="handleMonthClick(key)"
        >
          {{ key | dateToFmt(key, 'MM月') }}
        </li>
      </ul>
      <div class="days" v-if="monthSelect">
        <ul>
          <li
            v-for="i in monthScheduleDates[monthSelect]"
            :class="{
              'has-final':i.finalCount>0,
              'day-select':i.matchDate==matchDateSelect.matchDate
            }"
            @click="handleDateClick(i)"
          >
            {{ i.matchDate | dateFmt('DD') }}
          </li>
        </ul>
      </div>
    </div>
    <div class="panel">
      <ul class="info">
        <li class="day">{{ (matchDateSelect ? matchDateSelect.matchDate : '') | dateFmt('MM月DD日') }}</li>
        <li class="final">决赛数</li>
        <li class="num">{{ (matchDateSelect ? matchDateSelect.finalCount : 0) }}</li>
      </ul>
      <div class="search">
        <el-checkbox
          v-model="checkFinal"
          @change="handleCheckFinalChange"
          class="check-final"
        >
          决赛成绩
        </el-checkbox>
        <div class="option time">
          <span class="text">按时间&nbsp;▽</span>
          <ul class="time-info">
            <li
              v-for="(time, index) in timeOptions"
              :class="index === timeIndexSelect ? 'time-select': ''"
              @click="handleTimeClick(index)"
            >{{time.text}}</li>
          </ul>
        </div>
        <div class="option items">
          <span class="text">按项目&nbsp;▽</span>
          <ul class="items-info">
            <li
              v-for="item in items"
              :class="item.id === itemIdSelect ? 'item-select': ''"
              @click="handleItemClick(item)"
            >
              {{item.name}}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-loading="loading" element-loading-spinner="el-icon-loading">
      <div class="schedule-item" v-for="itemRaces in itemRaceList">
        <div class="title">{{itemRaces.name}}</div>
        <div class="schedule-data">
          <table>
            <thead>
              <tr>
                <th style="width:15%;">时间</th>
                <th style="width:45%;">比赛名称</th>
                <th style="width:10%;min-width: 180px">报表</th>
                <th>比赛场馆</th>
              </tr>
            </thead>
            <tbody>
            <tr v-for="(race, index) in itemRaces.raceList" :class="index % 2 == 0 ? '': 'odd'">
              <td>{{race.matchDate | dateFmt('HH:mm')}}</td>
              <td class="left">
                <a class="fr ml5" v-if="race.stage == '0' && race.scoreStatus == '0'">
                  <img src="~assets/img/schedule/has_result.png">
                  <span @click="handleRaceClick(race)">&nbsp;查看详情</span>
                </a>
                <span class="fr" v-if="race.parallelFlag">
                  <img src="~assets/img/schedule/parallel.png">
                  <span>&nbsp;含并列</span>
                </span>
                {{race.name}}
                <span class="sub-text-sm">{{ race.remark }}</span>
              </td>
              <td>
                <a class="lf" v-if="race.stage == '0' && race.scoreStatus == '0'">
                  <img src="~assets/img/schedule/has_sheet.png">
                  <span class="lf" @click="downloadResult(race)">&nbsp;名次公告</span>
                </a>
                <a class="lf ml10" v-if="race.stage == '0'">
                  <template v-if="!race.remark || !race.remark.includes('取消')">
                    <img src="~assets/img/schedule/has_sheet.png">
                    <span class="lf" @click="downloadProgram(race)">&nbsp;参赛名单</span>
                  </template>
                </a>
              </td>
              <td>
                <div v-if="race.activeFlag">{{race.matchAddress}}</div>
                <div v-else style="color: red">{{race.remark}}</div>
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
  import { listMatchDate } from "network/game/race";
  import { listGameRace } from "network/game/race";

  export default {
    name: "DailySchedule",
    data() {
      return {
        loading: false,
        checkFinal: false,
        timeOptions: [
          {
            text: '上午 00:00-12:00',
            start: '00:00',
            end: '12:00'
          },
          {
            text: '下午 12:00-18:00',
            start: '12:00',
            end: '18:00'
          },
          {
            text: '晚间 18:00-24:00',
            start: '18:00',
            end: '23:59'
          }
        ],
        timeIndexSelect: null,
        itemIdSelect: null,
        matchDateList: [],
        monthSelect: '',
        matchDateSelect: null,
        raceList: []
      }
    },
    computed: {
      checkStage() {
        return this.checkFinal ? '0' : null;
      },
      items() {
        const map = new Map();
        this.raceList.forEach(i => {
          let item = map.get(i.itemId);
          if (!item) {
            map.set(i.itemId, i.itemName);
          }
        });
        const res = [];
        map.forEach((value, key) => {
          res.push({
            id: key,
            name: value
          });
        });
        return res;
      },
      monthScheduleDates() {
        let obj = {};
        if (this.matchDateList && this.matchDateList.length) {
          this.matchDateList.forEach(i => {
            const key = this.dayjs(i.matchDate).format('YYYY-MM');
            if (!obj[key]) {
              obj[key] = [];
            }
            obj[key].push(i);
          });
        }
        return obj;
      },
      itemRaceList() {
        const map = new Map();
        this.raceList.forEach(i => {
          let arr = map.get(i.itemId);
          if (!arr) {
            map.set(i.itemId, []);
          }
          if (this.timeIndexSelect != null) {
            const timeSelect = this.timeOptions[this.timeIndexSelect];
            const raceTime = this.dayjs(i.matchDate).format('HH:mm');
            //因为格式相同，这里直接用的字符串比较时间
            if (raceTime >= timeSelect.start && raceTime <= timeSelect.end) {
              map.get(i.itemId).push(i);
            }
          } else {
            map.get(i.itemId).push(i);
          }
        });
        const res = [];
        map.forEach((arr, key) => {
          //因为可能因为时间选项过滤导致arr为空，所以这里要再判断下
          if (arr.length && (!this.itemIdSelect || this.itemIdSelect === key)) {
            res.push({
              itemId: arr[0].itemId,
              name: arr[0].itemName,
              raceList: arr
            });
          }
        });
        return res;
      }
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        this.getMatchDateList().then(() => {
          if (!this.monthSelect && this.matchDateList.length) {
            let selectDate = this.matchDateList[0];
            const cur = this.dayjs().format('YYYY-MM-DD');
            for (let i = 0; i < this.matchDateList.length; i++) {
              const d = this.matchDateList[i];
              const dStr = d.matchDate;
              if (dStr >= cur || i == this.matchDateList.length - 1) {
                selectDate = d;
                break;
              }
            }
            this.monthSelect = this.dayjs(selectDate.matchDate).format('YYYY-MM');
            this.matchDateSelect = selectDate;
            this.getRaceList();
          }
        });
      },
      handleCheckFinalChange() {
        this.matchDateList = [];
        this.monthSelect = '';
        this.matchDateSelect = null;
        this.raceList = [];
        this.init();
      },
      handleMonthClick(val) {
        this.monthSelect = val;
      },
      handleDateClick(val) {
        this.matchDateSelect = val;
        this.getRaceList();
      },
      handleTimeClick(index) {
        this.timeIndexSelect = this.timeIndexSelect==null ? index : (this.timeIndexSelect === index ? null : index);
      },
      handleItemClick(item) {
        this.itemIdSelect = !this.itemIdSelect ? item.id : (this.itemIdSelect === item.id ? null : item.id);
      },
      getMatchDateList() {
        return new Promise((resolve, reject) => {
          listMatchDate({
            gameId: this.$store.getters.game.id,
            categoryId: this.$store.getters.categoryId,
            stage: this.checkStage
          }).then(res => {
            this.matchDateList = res.data;
            resolve();
          }).catch(err => {
            reject(err);
          });
        });
      },
      getRaceList() {
        this.loading = true;
        listGameRace({
          gameId: this.$store.getters.game.id,
          categoryId: this.$store.getters.categoryId,
          orderByColumn: 'i.orderNum, r.matchDate, r.orderNum',
          isAsc: 'asc, asc, asc',
          beginTime: this.matchDateSelect.matchDate,
          endTime: this.dayjs(this.matchDateSelect.matchDate).add(1, 'day').format('YYYY-MM-DD'),
          stage: this.checkStage
        }).then(res => {
          this.raceList = res.rows;
          this.loading = false;
        });
      },
      handleRaceClick(race) {
        this.$router.push(`/schedule/item/${race.itemId}/${race.id}`)
      },
      downloadResult(race) {
        const url = process.env.VUE_APP_BASE_API + `/game/score/export/race/result?gameId=${this.$store.getters.game.id}&categoryId=${this.$store.getters.categoryId}&raceId=${race.id}`;
        window.open(url, '_blank');
      },
      downloadProgram(race) {
        const url = process.env.VUE_APP_BASE_API + `/game/score/export/race/program?gameId=${this.$store.getters.game.id}&categoryId=${this.$store.getters.categoryId}&raceId=${race.id}`;
        window.open(url, '_blank');
      }
    }
  }
</script>

<style lang="less" scoped>
  .daily-schedule-view {

    .schedule-date {

      .months {
        width: 100%;
        height: 40px;
        margin: auto;

        li {
          width: 100px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          font-size: 16px;
          float: left;
          cursor: pointer;

          &:hover {
            background: #f1f1f1;
          }

          &.month-select {
            background: @t-color-m1;
            color: #fff;
          }
        }
      }

      .days {
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

            width: 45px;
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
          width: 100px;
          height: 36px;
          line-height: 36px;
          text-align: center;
          font-size: 18px;
          color: #fff;
          &.day {
            background-color: #494949;
          }
          &.final {
            background-color: @t-color-m1;
          }
          &.num {
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

        .check-final {
          height: @option-height;
          line-height: @option-height;
          padding-right: 10px;
        }

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
            width: @option-width*2 - @border-width*2;
            min-height: 40px;
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
            position: absolute;
            right: 0px;
            top: @option-height;
            border: @border-width solid @t-color-m1;
            padding-bottom: 5px;
            li {
              width: 80px;
              height: 30px;
              line-height: 30px;
              text-align: center;
              float: left;
              font-size: 14px;
              background: #e3ecf0;
              margin-top: 5px;
              margin-left: 5px;
              color: #000;
              cursor: pointer;
              &.item-select, &:hover {
                background: @t-color-m1;
                color: #fff;
              }
            }
          }
        }

        .time {
          position: relative;
          background: @t-color-m3;
          &:hover .time-info {
            display: block;
          }
          .time-info {
            position: absolute;
            right: 0 - @option-width;
            top: @option-height;
            border: @border-width solid @t-color-m3;
            li {
              width: 100%;
              height: 30px;
              line-height: 30px;
              text-align: center;
              font-size: 14px;
              color: #000;
              cursor: pointer;
              &.time-select, &:hover {
                background: @t-color-m3;
                color: #fff;
              }
            }
          }
        }
      }
    }

    .schedule-item {
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
              color: @t-color-click;
            }
          }
        }
      }
    }
  }
</style>
