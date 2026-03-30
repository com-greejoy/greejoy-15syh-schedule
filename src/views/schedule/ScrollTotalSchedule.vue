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
        <div @mouseenter="autoPre" @mouseleave="resetTimer" @click="pre" class="btn-left"></div>
        <div @mouseenter="autoNext" @mouseleave="resetTimer" @click="next" class="btn-right"></div>
      </div>
    </div>
    <div v-cloak class="schedule-wrapper scroll" v-loading="loading">
      <div class="wrapper-left">
        <table>
          <tr>
            <td class="item head" style="height: 91px;"><div>项目名称</div></td>
          </tr>
          <tr>
            <td class="item"><div><img src="~/assets/img/schedule/ceremony.png">仪式</div></td>
          </tr>
          <tr v-for="item in itemMatchDateList" class="data">
            <td class="item"><div><img :src="item.icon">{{ item.itemName }}</div></td>
          </tr>
          <tr class="foot">
            <td>总计</td>
          </tr>
        </table>
      </div>
      <div class="wrapper-center">
        <table>
          <!--head >>>-->
          <tr>
            <td v-for="(date, idx) in matchDateList" :class="{init:idx === initIndex}">
              <span v-if="date.ignore" style="display: block; width: 130px">
                {{date.ignore.start | dateFmt('MM-DD')}}至{{date.ignore.end | dateFmt('MM-DD')}}
              </span>
              <span v-else>{{ date.matchDate | dateFmt('MM-DD') }}</span>
            </td>
          </tr>
          <tr>
            <td v-for="date in matchDateList">
              <span v-if="date.ignore">
                ......
              </span>
              <span v-else>{{ toWeekday(dayjs(date.matchDate).day()) }}</span>
            </td>
          </tr>
          <!--head <<<-->
          <!--data >>>-->
          <tr>
            <td v-for="date in matchDateList">
            <span v-if="dayjs(date.matchDate).format('YYYY-MM-DD') == dayjs($store.getters.game.openDate).format('YYYY-MM-DD')">
              <span class="has-ceremony"><img src="~/assets/img/schedule/open_date.png">开幕</span>
            </span>
              <span v-if="dayjs(date.matchDate).format('YYYY-MM-DD') == dayjs($store.getters.game.closeDate).format('YYYY-MM-DD')">
              <span class="has-ceremony"><img src="~/assets/img/schedule/close_date.png">闭幕</span>
            </span>
            </td>
          </tr>
          <tr v-for="item in itemMatchDateList" class="data">
            <!--数据-->
            <td
              v-for="data in item.matchDateList"
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
                  width="340"
                  trigger="hover"
                >
                  <ul>
                    <li v-for="i in popList">{{i.name}}<span v-if="i.remark" style="font-size:11px;margin-left:4px">{{ i.remark }}</span></li>
                  </ul>
                  <span slot="reference" style="display: block; width: 100%; height: 100%;">
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
          </tr>
          <!--data <<<-->
          <!--foot >>>-->
          <tr class="foot">
            <td
              v-for="matchDate in matchDateList"
              :class="[matchDate.parallelFlag? 'totalParallel' : '']"
            >
              {{ matchDate.endCount + '/' + matchDate.finalCount }}
              <div v-if="matchDate.parallelFlag" class="has-parallel">
                <img src="~/assets/img/schedule/parallel.png">
                <span class="desc">包含并列第一</span>
              </div>
            </td>
          </tr>
          <!--foot <<<-->
        </table>
      </div>
      <div class="wrapper-right">
        <table>
          <!--head >>>-->
          <tr>
            <td style="height: 91px;">决赛</td>
          </tr>
          <!--head <<<-->
          <!--data >>>-->
          <tr>
            <td class="gold"></td>
          </tr>
          <tr v-for="item in itemMatchDateList" class="data">
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
            <td>{{ totalEndCount + '/' + totalFinalCount }}</td>
          </tr>
          <!--foot <<<-->
        </table>
      </div>
    </div>

  </div>
</template>

<script>
  import { listMatchDate, listItemMatchDate, listInitRace} from "network/game/race";

  export default {
    name: "ScrollTotalSchedule",
    data() {
      return {
        initIndex: -1,
        loading: false,
        timer: null,
        autoScrollStep: 60,
        scrollStep: 300,
        dayIgnore: 5,
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
      handleTotalMatchDate(arr) {
        const fmt = 'YYYY-MM-DD';
        //>>> 先处理开幕式和闭幕式
        //如果开幕式和闭幕式的日期不在竞赛日期中，则创建
        const openDt = this.$store.getters.game.openDate;
        const closeDt = this.$store.getters.game.closeDate;
        const _openDt = openDt ? this.dayjs(openDt) : null;
        const _closeDt = closeDt ? this.dayjs(closeDt) : null;
        {
          if (_openDt) {
            const openDtStr = _openDt.format(fmt);
            const find = arr.find(i => {
              return i.matchDate === openDtStr;
            });
            if (!find) {
              arr.push({
                matchDate: openDtStr,
                finalCount: 0,
                endCount: 0
              });
            }
          }
          if (_closeDt) {
            const closeDtStr = _closeDt.format(fmt);
            const find = arr.find(i => {
              return i.matchDate === closeDtStr;
            });
            if (!find) {
              arr.push({
                matchDate: closeDtStr,
                finalCount: 0,
                endCount: 0
              });
            }
          }
          //排序，将开幕式和闭幕式放在正确的位置
          arr.sort((a, b) => {
            return a.matchDate < b.matchDate ? -1 : 1;
          });
        }
        //<<<

        //处理中间留白时间 >>>
        {
          const len = arr.length;
          for (let i = 0; i < len; i++) {
            //最后一个不处理
            if (i == len - 1) {
              break;
            }
            const dt = arr[i];
            const dtBehind = arr[i + 1];
            const _dt = this.dayjs(dt.matchDate);
            const _dtBehind = this.dayjs(dtBehind.matchDate);
            const diff = _dtBehind.diff(_dt, 'days');
            //如果两个日期之间存在间隔
            if (diff > 1 && this.dayIgnore > 1) {
              //如果间隔期在开幕式和闭幕式之间，则不得忽略
              const mustFlag = _openDt && _closeDt
                && ( _dt.add(1, 'day').isAfter(_openDt, 'day') && _dt.add(1, 'day').isBefore(_closeDt, 'day') );
              if (diff > this.dayIgnore && !mustFlag) {
                arr.push({
                  matchDate: _dt.add(1, 'day').format(fmt),
                  finalCount: 0,
                  endCount: 0,
                  ignore: {
                    start: _dt.add(1, 'day').format(fmt),
                    end: _dt.add(diff - 1, 'day').format(fmt)
                  }
                })
              } else {
                for (let j = 0; j < diff - 1; j++) {
                  arr.push({
                    matchDate: _dt.add( j + 1, 'day').format(fmt),
                    finalCount: 0,
                    endCount: 0
                  })
                }
              }
            }
          }
          arr.sort((a, b) => {
            return a.matchDate < b.matchDate ? -1 : 1;
          });
        }
        //<<<
        //如果不足一页，则添加空白日期
        if ((arr.length < this.pageSize) && !_closeDt) {
          let startDay = arr.length ? (this.dayjs(arr[arr.length - 1].matchDate)) : this.dayjs();
          for (let i = 0; i < this.pageSize - arr.length; i++) {
            startDay = startDay.add(1, 'day');
            arr.push({
              matchDate: startDay.format(fmt),
              finalCount: 0,
              endCount: 0
            });
          }
        }
      },
      getMatchDateList() {
        return new Promise((resolve, reject) => {
          listMatchDate({
            gameId: this.$store.getters.game.id,
            categoryId: this.$store.getters.categoryId
          }).then(res => {
            let arr = res.data || [];
            this.handleTotalMatchDate(arr);
            //setValue
            this.matchDateList = arr;
            this.$nextTick(() => {
              //处理当前日期移动
              this.toNowScrollLeft(arr);
            })
            resolve();
          }).catch(err => {
            reject(err);
          });
        });
      },
      toNowScrollLeft(arr) {
        const fmt = 'YYYY-MM-DD';
        const now = this.dayjs().format(fmt);
        for (let i = 0; i < arr.length; i++) {
          let flag = false;
          const dt = arr[i];
          if (dt.ignore && (now >= dt.ignore.start && now <= dt.ignore.end)) {
            flag = true;
          } else if (now <= dt.matchDate) {
            flag = true;
          } else if (i == arr.length - 1 && now >= dt.matchDate) {
            flag = true;
          }

          if (flag) {
            let left = ((i > 0 ? i - 1 : i) + 1) * 80; //每列最低宽度80px
            let wrp = document.querySelector('.wrapper-center');
            wrp.scrollLeft += left;
            this.initIndex = i;
            return;
          }
        }
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
      pre() {
        this.resetTimer();
        let wrp = document.querySelector('.wrapper-center');
        wrp.scrollLeft -= this.scrollStep;
      },
      next() {
        this.resetTimer();
        let wrp = document.querySelector('.wrapper-center');
        wrp.scrollLeft += this.scrollStep;
      },
      autoPre() {
        this.resetTimer();
        this.timer = setInterval(() => {
          let wrp = document.querySelector('.wrapper-center');
          wrp.scrollLeft -= this.autoScrollStep;
        }, 100)
      },
      autoNext() {
        this.resetTimer();
        this.timer = setInterval(() => {
          let wrp = document.querySelector('.wrapper-center');
          wrp.scrollLeft += this.autoScrollStep;
        }, 100)
      },
      resetTimer() {
        clearInterval(this.timer);
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

    .schedule-wrapper.scroll {
      display: flex;
      .wrapper-left {
        position: relative;
        z-index: 999;
        min-width: 150px;
        margin-right: -1px;
      }
      .wrapper-right {
        min-width: 80px;
        margin-left: -1px;
      }
      .wrapper-center {
        flex-grow: 1;
        scroll-behavior: smooth;
        overflow-x: hidden;
        td {
          min-width: 80px;
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
            padding-left: 15px;
            text-align: left;
          }
          img {
            margin-left: 10px;
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

          &.init::after {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            height: 10000px;
            margin-top: -5000px;
            z-index: -1;
            background-color: rgba(34, 53, 102, 0.18);
            animation: fade 6s 1 forwards;
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
            font-size: 14px;
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
  }
  
  @keyframes fade {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
  @-webkit-keyframes fade {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
</style>
