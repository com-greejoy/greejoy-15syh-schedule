<template>
  <div class="medal-tally">
    <div class="title">{{ activeTitle }}</div>
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="金牌榜" name="game"></el-tab-pane>
      <!-- <el-tab-pane label="总分榜" name="score"></el-tab-pane> -->
      <!-- <el-tab-pane label="竞技体育贡献奖" name="compete"></el-tab-pane> -->
      <!-- <el-tab-pane label="体教融合贡献奖" name="educate"></el-tab-pane> -->
    </el-tabs>
    <div class="path">
      <el-breadcrumb separator-class="el-icon-arrow-right" v-show="paths && paths.length > 1">
        <el-breadcrumb-item
          v-for="(p, index) in paths"
          :to="index == paths.length-1 ? null : {path:p.to}"
          @click.native="handlePathClick(index)"
        >
          {{p.name}}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="data">
      <router-view @loadActiveTab="loadActiveTab" />
    </div>
  </div>
</template>

<script>
  export default {
    name: "MedalTally",
    data() {
      return {
        activeTab: null
      }
    },
    computed: {
      paths() {
        if (this.activeTab === 'game') {
          return this.$store.getters.medalPaths;
        }
        if (this.activeTab === 'score') {
          return this.$store.getters.scorePaths;
        }
        if (this.activeTab === 'compete') {
          return this.$store.getters.competePaths;
        }
        if (this.activeTab === 'educate') {
          return this.$store.getters.educatePaths;
        }
      },
      activeTitle() {
        if (this.activeTab === 'game') {
          return '四川省第十五届运动会青少年组金牌榜';
        }
        if (this.activeTab === 'score') {
          return '四川省第十五届运动会青少年组总分榜';
        }
      }
    },
    created() {

    },
    methods: {
      loadActiveTab(activeTab) {
        this.activeTab = activeTab;
      },
      handlePathClick(index) {
        if (this.activeTab === 'game') {
          this.$store.dispatch('splitMedalPaths', index);
        }
        if (this.activeTab === 'score') {
          this.$store.dispatch('splitScorePaths', index);
        }
        if (this.activeTab === 'compete') {
          this.$store.dispatch('splitCompetePaths', index);
        }
        if (this.activeTab === 'educate') {
          this.$store.dispatch('splitEducatePaths', index);
        }
      },
      handleTabClick() {
        if (this.activeTab === 'game') {
          this.$router.push('/result/medal/main');
        }
        if (this.activeTab === 'score') {
          this.$router.push('/result/medal/score');
        }
        if (this.activeTab === 'compete') {
          this.$router.push('/result/medal/compete');
        }
        if (this.activeTab === 'educate') {
          this.$router.push('/result/medal/educate');
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .medal-tally {
    .title {
      font-size: 24px;
      font-weight: 700;
    }
    .data {
      margin-top: 14px;
    }
  }
</style>
