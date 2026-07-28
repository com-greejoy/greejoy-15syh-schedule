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
    <div class="score join-table">
      <table>
        <thead>
          <tr>
            <th class="left" :style="{ width: showMassCert ? '88%' : '100%' }">
              <span>报项</span>
            </th>
            <th v-if="showMassCert" style="width: 12%">证书</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="race left">
              <div class="join-list">
                <span
                  v-for="race in sporter.raceList"
                  @click="handleJoinClick(race)"
                  >{{ race.name }}</span
                >
              </div>
            </td>
            <td v-if="showMassCert">
              <el-link
                type="primary"
                :underline="false"
                @click="handleJoinCertClick"
                >参赛证书</el-link
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="score">
      <table>
        <thead>
          <tr>
            <th class="left" :style="{ width: showCertColumn ? '34%' : '40%' }">
              <span>名次信息</span>
            </th>
            <th :style="{ width: showCertColumn ? '24%' : '30%' }">成绩</th>
            <th style="width: 10%">名次</th>
            <th style="width: 20%"></th>
            <th v-if="showCertColumn" style="width: 12%">证书</th>
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
            <td v-if="showCertColumn">
              <el-link
                v-if="showMassCert"
                type="primary"
                :underline="false"
                @click="handleAwardCertClick(res)"
                >获奖证书</el-link
              >
              <el-link
                v-else-if="showYoungCert && res.certNumber"
                type="primary"
                :underline="false"
                @click="handleYoungCertClick(res)"
                >获奖证书</el-link
              >
            </td>
          </tr>
          <tr v-if="!sporter.resultList || !sporter.resultList.length">
            <td class="race left"><span>无信息</span></td>
          </tr>
        </tbody>
      </table>
    </div>
    <cert-dialog
      :visible.sync="certDialogVisible"
      :cert-type="certType"
      :cert-data="certData"
    />
    <div v-if="honor" class="score honor-table">
      <table>
        <thead>
          <tr>
            <th class="left" :style="{ width: showCertColumn ? '34%' : '40%' }">
              <span>荣誉运动员</span>
            </th>
            <th :style="{ width: showCertColumn ? '24%' : '30%' }"></th>
            <th style="width: 10%">排名</th>
            <th style="width: 20%"></th>
            <th v-if="showCertColumn" style="width: 12%"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="race left"><span></span></td>
            <td></td>
            <td class="rank-cell">第 {{ honor.rankNum }} 名</td>
            <td class="medal-cell">
              <span class="medal">
                <img src="~assets/img/game/1st.png" />
                <span>{{ formatMedal(honor.goldMedal) }}</span>
              </span>
              <span class="medal">
                <img src="~assets/img/game/2nd.png" />
                <span>{{ formatMedal(honor.silverMedal) }}</span>
              </span>
              <span class="medal">
                <img src="~assets/img/game/3rd.png" />
                <span>{{ formatMedal(honor.bronzeMedal) }}</span>
              </span>
            </td>
            <td v-if="showCertColumn"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import MedalImg from "views/components/MedalImg";
import { getJoinSporter } from "network/game/sporter";
import { listHonor } from "network/game/honor";
import CertDialog from "views/game/cert/CertDialog";
import {
  buildJoinCertData,
  buildAwardCertData,
} from "views/game/cert/certDataBuilder";

export default {
  name: "SporterInfo",
  components: {
    MedalImg,
    CertDialog,
  },
  data() {
    return {
      loading: false,
      sexOptions: [],
      sporterId: null,
      sporter: {},
      honor: null,
      certDialogVisible: false,
      certType: "join",
      certData: null,
    };
  },
  computed: {
    showMassCert() {
      return (
        this.$store.getters.categoryCode &&
        this.$store.getters.categoryCode !== "young"
      );
    },
    showYoungCert() {
      return this.$store.getters.categoryCode === "young";
    },
    showCertColumn() {
      return this.showMassCert || this.showYoungCert;
    },
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
    formatMedal(val) {
      if (val == null || val === 0) return 0;
      return Number.isInteger(val) ? val : val.toFixed(1);
    },
    getJoinSporter() {
      this.loading = true;
      getJoinSporter(this.categoryId, this.sporterId).then((res) => {
        this.$store.dispatch("setCategoryId", this.categoryId);
        this.loading = false;
        this.sporter = res.data;
        this.loadHonor();
      });
    },
    loadHonor() {
      const athleteId = this.sporter && this.sporter.athleteId;
      if (!athleteId) return;
      listHonor({
        athleteId: athleteId,
        pageNum: 1,
        pageSize: 1,
      })
        .then((res) => {
          const rows = res.rows || [];
          this.honor = rows.length ? rows[0] : null;
        })
        .catch(() => {
          this.honor = null;
        });
    },
    handleJoinClick(race) {
      this.$router.push(`/schedule/item/${race.itemId}/${race.raceId}`);
    },
    handleScoreClick(res) {
      this.$router.push(`/schedule/item/${res.itemId}/${res.raceId}`);
    },
    handleJoinCertClick() {
      const data = buildJoinCertData(this.sporter);
      if (!data) return;
      this.certType = "join";
      this.certData = data;
      this.certDialogVisible = true;
    },
    handleAwardCertClick(res) {
      const data = buildAwardCertData(this.sporter, res);
      if (!data) return;
      this.certType = "award";
      this.certData = data;
      this.certDialogVisible = true;
    },
    handleYoungCertClick(res) {
      if (!res || !res.certNumber) return;
      const base = process.env.VUE_APP_CERT_URL || "";
      const url = `${base}#/query/${res.certNumber}`;
      window.open(url, "_blank");
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
  }

  .join-table {
    margin-bottom: 20px;
    table tbody tr {
      line-height: normal;
    }
    .join-list {
      display: flex;
      flex-wrap: wrap;
      line-height: 36px;
      padding: 8px 0 8px 20px;
      span {
        cursor: pointer;
        margin-right: 24px;
        margin-left: 0;
        &:last-child {
          margin-right: 0;
        }
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

  .honor-table {
    table tbody td {
      &.rank-cell {
        color: @t-color-m1;
        font-weight: 600;
      }
      &.medal-cell {
        .medal {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-right: 12px;
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }
}
</style>
