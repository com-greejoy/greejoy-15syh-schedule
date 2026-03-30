<template>
  <div class="unitType-info">
    <div class="base">{{unitType ? unitType.name : ''}}</div>
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="奖牌" name="itemResult"></el-tab-pane>
      <el-tab-pane label="运动员" name="sporter"></el-tab-pane>
    </el-tabs>
    <div class="data">
      <router-view @loadActiveTab="loadActiveTab"/>
    </div>
  </div>
</template>

<script>
  import { getUnitType } from "network/game/unitType";

  export default {
    name: "UnitTypeInfo",
    data() {
      return {
        activeTab: null,
        categoryId: null,
        unitTypeId: null,
        unitType: null
      }
    },
    created() {
      this.categoryId = this.$route.params.categoryId ? parseInt(this.$route.params.categoryId) : null;
      this.unitTypeId = this.$route.params.unitTypeId ? parseInt(this.$route.params.unitTypeId) : null;
      this.getUnitType();
    },
    methods: {
      loadActiveTab(activeTab) {
        this.activeTab = activeTab;
      },
      getUnitType() {
        getUnitType(this.categoryId, this.unitTypeId).then(res => {
          this.$store.dispatch('setCategoryId', this.categoryId);
          this.unitType = res.data;
        });
      },
      handleTabClick(tab) {
        if (this.activeTab === 'itemResult') {
          this.$router.push(`/game/unitType/${this.categoryId}/${this.unitTypeId}/itemResult`);
        }
        if (this.activeTab === 'sporter') {
          this.$router.push(`/game/unitType/${this.categoryId}/${this.unitTypeId}/sporter`);
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .unitType-info {
    .base {
      font-size: 20px;
      font-weight: bold;
      text-align: left;
      margin-bottom: 20px;
    }
  }
</style>
