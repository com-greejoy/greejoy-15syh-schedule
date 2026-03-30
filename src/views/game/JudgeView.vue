<template>
  <div class="judge-view">
    <div class="judge-query">
      <el-select class="query" v-model="itemId" placeholder="请选择项目" filterable @change="handleItemChange">
        <el-option
          v-for="item in itemList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </div>
    <div class="judge-data">
      <div v-if="judgeList.length">
        <div class="wrapper" v-for="sort in sortJudgeList">
          <div class="position">
            <span>{{sort.type ? sort.type : '其他'}}</span>
          </div>
          <div class="judge">
            <table>
              <tr v-for="judges in sort.judgeList">
                <td v-for="judge in judges">
                  <div v-if="judge.id > 0">
                    <img v-if="judge.photo" v-show="showPhoto" class="photo" :src="judge.photo">
                    <img v-else v-show="showPhoto" class="photo" src="~assets/img/game/default_profile.png">
                    <span class="name">{{judge.name}}（{{sexFormat(judge.sex)}}）</span>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div v-else>没有更多数据</div>
    </div>
  </div>
</template>

<script>
  import { listItem } from "network/game/item";
  import { listJudge } from "network/game/judge";
  import { sortJudgeByLevel } from "common/utils";

  export default {
    name: "JudgeView",
    data() {
      return {
        rowSize: 6,
        showPhoto: true,
        sexOptions: [],
        itemId: null,
        itemList: [],
        judgeList: []
      }
    },
    computed: {
      sortJudgeList() {
        //按type分类
        const map = new Map();
        this.judgeList.forEach(i => {
          let arr = map.get(i.type);
          if (!arr) {
            map.set(i.type, []);
          }
          map.get(i.type).push(i);
        });
        //根据表格横排数量进行切割
        const res = [];
        map.forEach((arr, key) => {
          let judges = [];
          const count = (Math.floor(arr.length / this.rowSize)) + (arr.length % this.rowSize > 0 ? 1 : 0);
          for (let i = 0; i < count; i++) {
            const batch = arr.splice(0, this.rowSize);
            //补空缺
            const add = this.rowSize - batch.length;
            for (let j = 0; j < add; j++) {
              batch.push({});
            }
            judges.push(batch);
          }
          res.push({
            type: key,
            judgeList: judges
          });
        });
        return res;
      }
    },
    created() {
      this.init();
      this.getDicts("gm_person_sex").then(response => {
        this.sexOptions = response.data;
      });
    },
    methods: {
      sexFormat(sex) {
        return this.selectDictLabel(this.sexOptions, sex);
      },
      init() {
        listItem({
          gameId: this.$store.getters.game.id,
          categoryId: this.$store.getters.categoryId,
          orderByColumn: 'i.orderNum',
          isAsc: 'asc'
        }).then(res => {
          this.itemList = res.rows;
          if (res.rows.length > 0) {
            this.itemId = res.rows[0].id;
            this.getJudgeList();
          }
        });
      },
      getJudgeList() {
        this.judgeList = [];
        listJudge({
          gameId: this.$store.getters.game.id,
          categoryId: this.$store.getters.categoryId,
          itemId: this.itemId,
          orderByColumn: 'j.orderNum, j.type, j.sex, j.spell',
          isAsc: 'asc, asc, desc, asc'
        }).then(res => {
          this.judgeList = sortJudgeByLevel(res.rows);
        })
      },
      handleItemChange() {
        this.getJudgeList();
      }
    }
  }
</script>

<style lang="less" scoped>
  .judge-view {

    .judge-query {
      text-align: left;
      margin-bottom: 20px;
      .query {
        width: 200px;
      }
    }

    .judge-data {
      text-align: center;

      @h: 44px;
      .wrapper {
        margin-bottom: 40px;
        .position {
          font-weight: bold;
          font-size: 18px;
          line-height: @h;
          text-align: center;
          background-color: @t-color-m1;
          color: #fff;
        }
        table {
          width: 100%;
          text-align: center;
          table-layout:fixed;
          td {
            padding: 10px;
            border: 1px solid #C0C4CC;
          }
          .photo {
            @w: 120px;
            width: @w;
            height: @w*1.5;
            object-fit: cover;
          }
          .name {
            display: block;
            line-height: 24px;
          }
        }
      }
    }
  }
</style>
