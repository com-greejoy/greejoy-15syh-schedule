<template>
  <div class="compete-detail-medal">
    <div class="medal">
      <el-table v-loading="loading" :data="dataList">
        <el-table-column label="单位" align="center" prop="unitTypeStr" width="80" />
        <el-table-column label="姓名" align="center" prop="name" />
        <!--<el-table-column label="性别" align="center" prop="sex" :formatter="sexFormat" />-->
        <el-table-column label="项目" align="center" prop="type" width="200" />
        <!--<el-table-column label="年份" align="center" prop="year" />-->
        <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip />
      </el-table>
    </div>
  </div>
</template>

<script>
  import { listEducate } from "network/game/educate";

  export default {
    name: "EducateDetailMedal",
    components: {

    },
    data() {
      return {
        sexOptions: [],
        unitTypeStr: null,
        loading: false,
        dataList: []
      }
    },
    created() {
      this.$emit('loadActiveTab', 'educate');
      this.unitTypeStr = this.$route.query.unitTypeStr ? this.$route.query.unitTypeStr : null;
      this.getDataList();
      this.getDicts("gm_person_sex").then(response => {
        this.sexOptions = response.data;
      });
    },
    methods: {
      sexFormat(row, column) {
        return this.selectDictLabel(this.sexOptions, row.sex);
      },
      getDataList() {
        if (this.unitTypeStr) {
          this.loading = true;
          listEducate({
            gameId: this.$store.getters.game.id,
            categoryId: this.$store.getters.categoryId,
            unitTypeStr: this.unitTypeStr,
            orderByColumn: 'remark, type, name',
            isAsc: 'asc, asc, asc'
          }).then(res => {
            this.dataList = res.rows;
            this.loading = false;
          })
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .compete-detail-medal {
    display: flex;
    justify-content: space-between;
    .medal {
      width: 100%;
    }
  }
</style>
