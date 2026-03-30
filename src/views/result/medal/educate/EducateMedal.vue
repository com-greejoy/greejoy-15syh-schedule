<template>
  <div class="educate-medal">
    <div class="medal">
      <el-table v-loading="loading" :data="dataList" show-summary>
        <el-table-column label="排名" align="center" prop="order" width="80" fixed/>
        <el-table-column label="单位" align="center" prop="unitTypeStr" width="400">
          <template scope="scope">
            <span @click="handleNameClick(scope.row)" class="name">{{scope.row.unitTypeStr}}</span>
          </template>
        </el-table-column>
        <el-table-column label="统计" align="center" prop="amount" sortable/>
      </el-table>
    </div>
    <div class="item">

    </div>
  </div>
</template>

<script>
  import { calUnitTypeEducate } from "network/game/cal";

  export default {
    name: "EducateMedal",
    components: {

    },
    data() {
      return {
        loading: false,
        dataList: []
      }
    },
    created() {
      this.$emit('loadActiveTab', 'educate');
      this.$store.dispatch('resetEducatePaths');
      this.getDataList();
    },
    methods: {
      getDataList() {
        this.loading = true;
        calUnitTypeEducate({
          gameId: this.$store.getters.game.id,
          categoryId: this.$store.getters.categoryId
        }).then(res => {
          this.dataList = res.data;
          this.loading = false;
        })
      },
      handleNameClick(row) {
        const to = `/result/medal/educate/detail`;
        const path = {
          to: to,
          name: row.unitTypeStr
        };
        this.$store.dispatch('setEducatePaths', path);
        this.$router.push({
          path: to,
          query: {
            unitTypeStr: row.unitTypeStr
          }
        });
      }
    }
  }
</script>

<style lang="less" scoped>
  .educate-medal {
    display: flex;
    justify-content: space-between;
    .medal {
      width: 70%;
      .name {
        cursor: pointer;
        &:hover {
          color: @t-color-m1;
        }
      }
      .warning {
        text-align: left;
        margin-top: 10px;
        margin-bottom: 8px;
        font-size: 14px;
        line-height: 20px;
      }
    }
    .item {
      width: 25%;
    }
  }
</style>
