<template>
  <div class="sporter-info">
    <div class="wrapper">
      <div class="title left">
        <span>运动员详情</span>
      </div>
      <div
        class="sporter"
        v-loading="loading"
        element-loading-spinner="el-icon-loading"
      >
        <img v-if="sporter.photo" class="photo" :src="sporter.photo" />
        <img v-else class="photo" src="~assets/img/game/default_profile.png" />
        <el-form :model="sporter" label-width="120px">
          <el-form-item label="姓名：">{{ sporter.name }}</el-form-item>
          <el-form-item label="单位：">{{ sporter.unitTypeStr }}</el-form-item>
          <el-form-item label="出生年月：" v-if="sporter.bornDate">{{
            sporter.bornDate
          }}</el-form-item>
          <el-form-item label="性别：">{{
            sexFormat(sporter.sex)
          }}</el-form-item>
          <el-form-item label="项目：">{{ sporter.itemStr }}</el-form-item>
        </el-form>
      </div>
    </div>
    <div class="wrapper">
      <div class="title left">
        <span>报项</span>
      </div>
      <div class="join left">
        <span v-for="race in sporter.raceList" @click="handleJoinClick(race)">
          {{ race.name }}
        </span>
      </div>
    </div>
    <div class="score">
      <table>
        <thead>
          <tr>
            <th class="left" style="width: 40%"><span>名次信息</span></th>
            <th style="width: 30%">成绩</th>
            <th style="width: 10%">名次</th>
            <th style="width: 20%"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="res in sporter.resultList">
            <td class="race left">
              <span @click="handleScoreClick(res)">{{ res.raceName }}</span>
            </td>
            <td>{{ res.result }}</td>
            <td>{{ res.orderIndex }}</td>
            <td>
              <medal-img
                :order-index="res.orderIndex"
                :medal-type="res.medalType"
                :show-order-index="false"
              />
            </td>
          </tr>
          <tr v-if="!sporter.resultList || !sporter.resultList.length">
            <td class="race left"><span>无信息</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import MedalImg from "views/components/MedalImg";
import { getJoinSporter } from "network/game/sporter";

export default {
  name: "SporterInfo",
  components: {
    MedalImg,
  },
  data() {
    return {
      loading: false,
      sexOptions: [],
      sporterId: null,
      sporter: {},
    };
  },
  created() {
    this.getDicts("gm_person_sex").then((response) => {
      this.sexOptions = response.data;
    });
    this.categoryId = this.$route.params.categoryId || null;
    this.sporterId = this.$route.params.sporterId || null;
    this.getJoinSporter();
  },
  methods: {
    sexFormat(sex) {
      return this.selectDictLabel(this.sexOptions, sex);
    },
    getJoinSporter() {
      this.loading = true;
      getJoinSporter(this.categoryId, this.sporterId).then((res) => {
        this.$store.dispatch("setCategoryId", this.categoryId);
        this.loading = false;
        this.sporter = res.data;
      });
    },
    handleJoinClick(race) {
      this.$router.push(`/schedule/item/${race.itemId}/${race.raceId}`);
    },
    handleScoreClick(res) {
      this.$router.push(`/schedule/item/${res.itemId}/${res.raceId}`);
    },
  },
};
</script>

<style lang="less" scoped>
.sporter-info {
  @h: 44px;

  .title {
    font-size: 18px;
    line-height: @h;
    background-color: @t-color-m1;
    color: #fff;
  }

  .left {
    text-align: left;
    span {
      margin-left: 20px;
    }
  }

  .wrapper {
    .sporter {
      display: flex;
      box-sizing: border-box;
      padding: 20px;
      text-align: left;
      .photo {
        @w: 160px;
        width: @w;
        height: @w*1.5;
        object-fit: cover;
      }
      .el-form-item {
        margin-bottom: 8px;
      }
    }
    .join {
      display: flex;
      flex-wrap: wrap;
      line-height: 40px;
      margin-bottom: 20px;
      span {
        cursor: pointer;
        &:hover {
          color: @t-color-m1;
        }
      }
    }
  }

  .score {
    table {
      width: 100%;
      thead {
        height: @h;
        background-color: @t-color-m1;
        color: #fff;
        th {
          font-weight: normal;
        }
      }
      tr {
        line-height: @h;
        td.race {
          span {
            cursor: pointer;
            &:hover {
              color: @t-color-m1;
            }
          }
        }
      }
      /deep/ img {
        width: @h - 18px;
        height: @h - 18px;
        vertical-align: middle;
      }
    }
  }
}
</style>
