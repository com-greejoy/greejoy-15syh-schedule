<template>
  <div class="total-schedule-view">
    <div class="declare">
      <table>
        <tr>
          <td class="icon game"></td>
          <td style="padding-left: 6px">代表比赛日</td>
          <td class="icon"></td>
          <td class="icon final"></td>
          <td style="padding-left: 6px">代表决赛日</td>
          <td class="icon"></td>
          <td>数字：代表当日的决赛数量</td>
        </tr>
      </table>
    </div>
    <div class="fixed-btn">
      <div class="btn-div">
        <div @click="pre()" class="btn-left"></div>
        <div @click="next()" class="btn-right"></div>
      </div>
    </div>
    <div v-cloak class="schedule-wrapper" v-loading="loading">
      <table>
        <!--head >>>-->
        <tr>
          <td rowspan="2" class="item head" width="190px"><div>项目名称</div></td>
          <td v-for="date in dateSlice(matchDateList)">
            {{ date.matchDate | dateFmt('MM-DD') }}
          </td>
          <td rowspan="2">决赛</td>
        </tr>
        <tr>
          <td v-for="date in dateSlice(matchDateList)">
            {{ toWeekday(dayjs(date.matchDate).day()) }}
          </td>
        </tr>
        <!--head <<<-->
        <!--data >>>-->
        <tr>
          <td class="item"><div><img src="~/assets/img/schedule/ceremony.png">仪式</div></td>
          <td v-for="date in dateSlice(matchDateList)">
            <span v-if="dayjs(date.matchDate).format('YYYY-MM-DD') == dayjs($store.getters.game.openDate).format('YYYY-MM-DD')">
              <span class="has-ceremony">开幕式</span>
            </span>
            <span v-if="dayjs(date.matchDate).format('YYYY-MM-DD') == dayjs($store.getters.game.closeDate).format('YYYY-MM-DD')">
              <span class="has-ceremony">闭幕式</span>
            </span>
          </td>
          <td class="gold"></td>
        </tr>
        <tr v-for="item in itemMatchDateList" class="data">
          <!--项目-->
          <td class="item">
            <div>
              <img :src="item.icon">
              <el-tooltip :content="item.itemName" placement="top-start" :open-delay="300">
                <span class="item-name">{{ item.itemName }}</span>
              </el-tooltip>
            </div>
          </td>
          <!--数据-->
          <td
            v-for="data in dateSlice(item.matchDateList)"
            :class="[data.parallelFlag? 'dayParallel' : '']"
          >
            <a
              v-if="data.matchDate"
              :class="[data.matchDate? 'has-game' : '', data.finalCount>0? 'has-final' : '' ]"
              @click="toItemSchedule(item.itemId, data)"
            >
              <el-popover
                v-if="data.matchDate && data.finalCount>0"
                @show="handlePopShow(item.itemId, data)"
                placement="right"
                title="当日决赛"
                width="300"
                trigger="hover"
              >
                <ul>
                  <li v-for="i in popList">{{i.name}}</li>
                </ul>
                <span slot="reference">
                  {{ data.endCount + '/' + data.finalCount }}
                </span>
              </el-popover>
              <span v-else v-html="'&nbsp;'"></span>
            </a>
            <div v-if="data.parallelFlag" class="has-parallel">
              <img src="~/assets/img/schedule/parallel.png">
              <span class="desc">包含并列第一</span>
            </div>
          </td>
          <!--金牌-->
          <td class="gold">
            <span>{{ item.endCount + '/' + item.finalCount }}</span>
            <div v-if="item.parallelFlag" class="has-parallel">
              <img src="~/assets/img/schedule/parallel.png">
              <span class="desc">包含并列第一</span>
            </div>
          </td>
        </tr>
        <!--data <<<-->
        <!--foot >>>-->
        <tr class="foot">
          <td>总计</td>
          <td
            v-for="matchDate in dateSlice(matchDateList)"
            :class="[matchDate.parallelFlag? 'totalParallel' : '']"
          >
            {{ matchDate.endCount + '/' + matchDate.finalCount }}
            <div v-if="matchDate.parallelFlag" class="has-parallel">
              <img src="~/assets/img/schedule/parallel.png">
              <span class="desc">包含并列第一</span>
            </div>
          </td>
          <td>{{ totalEndCount + '/' + totalFinalCount }}</td>
        </tr>
        <!--foot <<<-->
      </table>
    </div>
    <div class="schedule-tips">注：具体比赛时间以实际为准。</div>
  </div>
</template>

<script>
  import { listMatchDate, listItemMatchDate, listInitRace} from "network/game/race";

  export default {
    name: "TotalSchedule",
    data() {
      return {
        loading: false,
        pageIndex: 0,
        pageSize: 15,
        matchDateList: [],
        itemMatchDateList: [],
        popList: []
      }
    },
    computed: {
      totalEndCount() {
        return this.matchDateList.reduce((total, curVal, curIndex, arr) => {
          return total + curVal.endCount;
        }, 0);
      },
      totalFinalCount() {
        return this.matchDateList.reduce((total, curVal, curIndex, arr) => {
          return total + curVal.finalCount;
        }, 0);
      }
    },
    created() {
      this.getMatchDateList().then(() => {
        this.getItemMatchDateList();
      });
    },
    methods: {
      toWeekday(val) {
        return ['日','一','二','三','四','五','六'][val];
      },
      injectOpenCloseDate(arr) {
        if (!arr || !arr.length) {
          return;
        }
        //如果开幕式和闭幕式的日期不在竞赛日期中，则创建
        if (this.$store.getters.game.openDate) {
          const openDate = this.dayjs(this.$store.getters.game.openDate).format('YYYY-MM-DD');
          const find = arr.find(i => {
            return i.matchDate === openDate;
          });
          if (!find) {
            arr.push({
              matchDate: openDate,
              finalCount: 0,
              endCount: 0
            });
          }
        }
        if (this.$store.getters.game.closeDate) {
          const closeDate = this.dayjs(this.$store.getters.game.closeDate).format('YYYY-MM-DD');
          const find = arr.find(i => {
            return i.matchDate === closeDate;
          });
          if (!find) {
            arr.push({
              matchDate: closeDate,
              finalCount: 0,
              endCount: 0
            });
          }
        }
        //排序，将开幕式和闭幕式放在正确的位置
        arr.sort((a, b) => {
          return a.matchDate < b.matchDate ? -1 : 1;
        });
      },
      getMatchDateList() {
        return new Promise((resolve, reject) => {
          listMatchDate({
            gameId: this.$store.getters.game.id,
            categoryId: this.$store.getters.categoryId
          }).then(res => {
            let arr = res.data;
            //如果没有任何赛程日期，则从今日开始创建空赛程日期
            if (!arr.length) {
              let curDay = this.dayjs();
              for (let i = 0; i < this.pageSize; i++) {
                arr.push({
                  matchDate: curDay.format('YYYY-MM-DD'),
                  finalCount: 0,
                  endCount: 0
                });
                curDay = curDay.add(1, 'day');
              }
            }
            this.injectOpenCloseDate(arr);
            //setValue
            this.matchDateList = arr;
            resolve();
          }).catch(err => {
            reject(err);
          });
        });
      },
      getItemMatchDateList() {
        listItemMatchDate({
          gameId: this.$store.getters.game.id,
          categoryId: this.$store.getters.categoryId,
          orderByColumn: 'i.orderNum',
          isAsc: 'asc'
        }).then(res => {
          this.formatMatchDateList(this.matchDateList, res.data);
          this.itemMatchDateList = res.data;
        });
      },
      formatMatchDateList(toMatchDateList, data) {
        data.forEach(i => {
          i.endCount = 0;
          i.finalCount = 0;
          const result = [];
          let index = 0;
          toMatchDateList.forEach(d => {
            const match = i.matchDateList[index];
            if (match && (d.matchDate === match.matchDate)) {
              result.push(match);
              i.endCount += match.endCount;
              i.finalCount += match.finalCount;
              index++;
            } else {
              result.push({});
            }
          });
          i.matchDateList = result;
        });
      },
      dateSlice(matchDateList) {
        if (matchDateList.length) {
          return matchDateList.slice(this.pageIndex, this.pageIndex + this.pageSize);
        } else {
          return [];
        }
      },
      pre() {
        let start = this.pageIndex - this.pageSize;
        start = start < 0 ? 0 : start;
        this.pageIndex = start;
      },
      next() {
        let start = this.pageIndex + this.pageSize;
        let end = start + this.pageSize;
        if (end > this.matchDateList.length) {
          end = this.matchDateList.length;
          start = end - this.pageSize;
        }
        this.pageIndex = start;
      },
      toItemSchedule(itemId, date) {
        const query = `matchDate=${date.matchDate}`;
        this.$router.push(`/schedule/item/${itemId}?${query}`);
      },
      handlePopShow(itemId, data) {
        this.popList = [];
        if (itemId > 0 && data.finalCount > 0) {
          const beginTime = this.dayjs(data.matchDate);
          const endTime = beginTime.add(1, 'day');
          listInitRace({
            gameId: this.$store.getters.game.id,
            categoryId: this.$store.getters.categoryId,
            itemId: itemId,
            orderByColumn: 'c.orderNum, i.orderNum, g.orderNum, r.orderNum',
            isAsc: 'asc, asc, asc, asc',
            beginTime: beginTime.format('YYYY-MM-DD HH:mm'),
            endTime: endTime.format('YYYY-MM-DD HH:mm')
          }).then(res => {
            this.popList = res.rows;
          });
        }
      }
    }
  }
</script>

<style lang="less" scoped>

  .total-schedule-view {

    .declare {
      width: 100%;
      height: 40px;
      background-color: @t-color-m1;
      color: #fff;

      table {
        border-collapse: separate;
        padding: 10px;
        tr {
          height: 20px;
        }
        .icon {
          width: 20px;
          &.game {
            background: @t-color-t1;
          }
          &.final {
            background: @t-color-m2;
          }
        }
      }
    }

    .fixed-btn {
      width: 100%;
      height: 1px;
      position: fixed;
      z-index: 300;
      left: 0px;
      top: 300px;

      .btn-div {
        width: 1240px;
        height: 1px;
        margin: auto;
        position: relative;

        .btn {
          width: 50px;
          height: 50px;
          cursor: pointer;
          border-radius: 50%;
          position: absolute;
          z-index: 500;
          top: 200px;
          opacity: 0.3;
          background-color: @t-color-m1;
          background-size: 50%;
          background-repeat: no-repeat;
          background-position: center center;
        }

        .btn-left {
          .btn();
          background-image: url("~assets/img/schedule/btn_left.png");
          left: 150px;
        }

        .btn-right {
          .btn();
          background-image: url("~assets/img/schedule/btn_right.png");
          right: 80px;
        }
      }
    }

    .schedule-wrapper {

      table {
        width: 100%;
        text-align: center;
        border-collapse: collapse;
        border-spacing: 0;
        background-color: #fff;
        overflow: hidden;
        z-index: 1;
        position: relative;

        .data:hover {
          background-color: rgba(34, 53, 102, 0.18);
        }

        .item {
          &.head div {
            padding-left: 0px;
            text-align: center;
          }
          div {
            text-align: left;
          }
          img {
            margin-left: 10px;
          }
          .item-name {
            display: inline-block;
            vertical-align: middle;
            max-width: calc(100% - 39px);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        td {
          height: 45px;
          border: 1px solid #acacac;
          position: relative;
          text-align: center;
          vertical-align: middle;

          img {
            width: 25px;
            height: 25px;
            margin-right: 4px;
            vertical-align: middle;
          }

          &:hover::after {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            height: 10000px;
            margin-top: -5000px;
            z-index: -1;
            background-color: rgba(34, 53, 102, 0.18);
          }

          .show-chunk {
            width: 90%;
            height: 35px;
            line-height: 35px;
            border-radius: 5px;
            display: inline-table;
            color: #fff;
          }

          .has-ceremony {
            .show-chunk();
            background-color: @t-color-t1;
          }

          .has-game {
            .show-chunk();
            cursor: pointer;
            background-color: @t-color-t1;
          }

          .has-final {
            .show-chunk();
            cursor: pointer;
            background-color: @t-color-m2;
          }

          .has-parallel {
            position: absolute;
            top: -6px;
            right: -8px;

            .desc {
              display: none;
            }

            &:hover .desc {
              display: block;
              position: absolute;
              top: -120%;
              right: 0;
              color: #C9941F;
              background-color: #FFD31A;
              width: 120px;
              padding: 4px;
              border-radius: 4px;
              transform: translateX(-10%);
            }
          }

        }

      }

    }

    .schedule-tips {
      margin-top: 20px;
      padding: 10px;
      font-size: 14px;
      color: #666;
      text-align: center;
      background-color: #fff;
    }
  }
</style>
