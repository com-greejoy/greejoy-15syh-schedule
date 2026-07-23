<template>
  <div class="extra-record">
    <div v-if="extraList.length > 0" class="extra-query">
      <div class="left">
        <el-select v-model="itemSelect" clearable class="query" placeholder="请选择项目">
          <el-option v-for="item in itemOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <el-select v-if="isExtra" v-model="extraSelect" clearable class="query" placeholder="请选择超破类型">
          <el-option v-for="item in extraOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <el-select v-if="!isExtra" v-model="levelSelect" clearable class="query" placeholder="请选择达级">
          <el-option v-for="item in levelOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </div>
      <div class="right">
        <el-switch v-model="isExtra" active-text="超破纪录" inactive-text="运动员达级" @change="handleSwitch">
        </el-switch>
      </div>
    </div>

    <div class="extra-data">
      <div class="record">
        <el-table :data="isExtra ? extraRecords : levelRecords" stripe>
          <el-table-column label="项目" align="center" prop="itemStr" width="120" />
          <el-table-column label="组别" align="center" prop="groupStr" width="120" />
          <el-table-column label="竞赛项目" align="center" prop="raceStr" />
          <el-table-column label="赛次" align="center" prop="stage" width="120" />
          <el-table-column v-if="isExtra" label="破纪录" align="center" prop="extraType" width="160" />
          <el-table-column v-if="isExtra" label="原纪录" align="center" prop="oldResult" width="140" />
          <el-table-column label="成绩" align="center" prop="result" width="140" />
          <el-table-column v-if="!isExtra" label="达级" align="center" prop="level" width="140" />
          <el-table-column label="单位" align="center" prop="unitTypeStr" width="120" />
          <el-table-column label="参赛者" align="center" prop="sportersText" min-width="120" />
        </el-table>
      </div>
    </div>

  </div>
</template>

<script>
import { listExtraResult } from "network/game/result";

export default {
  name: "ExtraRecord",
  data() {
    return {
      isExtra: true,
      itemSelect: '',
      extraSelect: '',
      levelSelect: '',
      extraList: []
    }
  },
  computed: {
    // TEMP: 达级模式下隐藏的项目列表，后期去掉此数组即可恢复全部显示
    hiddenLevelItems() {
      return ['田径'];
    },
    extraRecords() {
      let arr = this.extraList.filter(i => i.extraType);
      if (this.itemSelect) {
        arr = arr.filter(i => i.itemStr == this.itemSelect)
      }
      if (this.extraSelect) {
        arr = arr.filter(i => i.extraType == this.extraSelect)
      }
      return arr;
    },
    levelRecords() {
      let arr = this.extraList.filter(i => i.level && !this.hiddenLevelItems.includes(i.itemStr));
      if (this.itemSelect) {
        arr = arr.filter(i => i.itemStr == this.itemSelect)
      }
      if (this.levelSelect) {
        arr = arr.filter(i => i.level == this.levelSelect)
      }
      return arr;
    },
    itemOptions() {
      const source = this.isExtra
        ? this.extraList
        : this.extraList.filter(i => !this.hiddenLevelItems.includes(i.itemStr));
      const arr = source.map(i => i.itemStr).filter(i => i);
      return Array.from(new Set(arr));
    },
    extraOptions() {
      const arr = this.extraList.map(i => i.extraType).filter(i => i);
      return Array.from(new Set(arr));
    },
    levelOptions() {
      const arr = this.extraList.map(i => i.level).filter(i => i);
      return Array.from(new Set(arr));
    }
  },
  created() {
    this.getExtraList();
  },
  methods: {
    handleSwitch() {
      this.extraSelect = '';
      this.levelSelect = '';
    },
    getExtraList() {
      listExtraResult({
        gameId: this.$store.getters.game.id,
        categoryId: this.$store.getters.categoryId,
        orderByColumn: 'orderNum',
        isAsc: 'asc'
      }).then(res => {
        this.extraList = res.rows;
      });
    }
  }
}
</script>

<style lang="less" scoped>
.extra-record {

  .extra-query {
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: left;

    .query {
      width: 180px;
      margin-right: 20px;
    }
  }

  .extra-data {
    margin-top: 20px;

    .title {
      height: 60px;
      line-height: 60px;
      font-size: 24px;
      color: @t-color-m1;
      text-align: left;

      img {
        width: 40px;
        height: 40px;
        padding-left: 10px;
        padding-right: 4px;
      }
    }

    table {
      width: 100%;
    }

    .record {
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
        line-height: 26px;
        font-size: 16px;
        border: solid 1px #eee;
        text-align: center;
        color: #000;

        .sporter-name:hover {
          cursor: pointer;
          color: @t-color-m1;
        }
      }
    }

    .sporter-data {
      margin-top: 20px;

      .el-pagination {
        margin: 20px auto;
      }
    }
  }

}

.sporter-list {
  display: flex;
  flex-wrap: wrap;

  .sporter-info {
    margin-right: 8px;
    margin-bottom: 25px;
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
</style>
