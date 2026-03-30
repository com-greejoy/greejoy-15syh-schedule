<template>
  <div
    class="bind-view"
    v-loading="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-text="加载中"
  >
    <div class="game-select">
      <el-select
        v-if="gameList.length > 0"
        v-model="gameId"
        placeholder="请选择比赛"
      >
        <el-option
          v-for="item in gameList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </div>
    <div>
      <el-button
        v-if="gameId > 0"
        class="confirm-btn"
        type="success"
        @click="handleBindClick"
      >确 定</el-button>
    </div>
  </div>
</template>

<script>
  import { greejoy } from "common/greejoy";
  import { listOpenGame } from "network/game/game";

  export default {
    name: "BindView",
    data() {
      return {
        redirect: null,
        loading: true,
        gameList: [],
        gameId: null
      }
    },
    computed: {
      curGame() {
        return this.gameList.find(i => {
          return i.id === this.gameId;
        });
      }
    },
    watch: {
      $route: {
        handler: function(route) {
          this.redirect = route.query && route.query.redirect;
        },
        immediate: true
      }
    },
    created() {
      //query Params -> e.g. xxx.com?gameId=xxx
      const categoryId = this.$route.query.categoryId ? parseInt(this.$route.query.categoryId) : greejoy.categoryId;
      if (categoryId) {
        this.$store.dispatch('setCategoryId', categoryId);
      }
      this.gameId = this.$route.query.gameId ? parseInt(this.$route.query.gameId) : greejoy.gameId;
      this.getGameList();
    },
    methods: {
      getGameList() {
        listOpenGame({
          orderByColumn: 'joinStartTime',
          isAsc: 'desc'
        }).then(res => {
          const gameList = res.rows;
          this.gameList = gameList;
          if (gameList.length == 1 && !this.gameId) {
            this.gameId = gameList[0].id;
          }
          this.loading = false;
          this.bind();
        });
      },
      handleBindClick() {
        this.bind();
      },
      bind() {
        if (this.gameId > 0) {
          if (!this.curGame) {
            this.$message({
              message: '没有比赛信息',
              duration: 1500
            });
            return;
          }
          if (!this.curGame.categoryList.length) {
            this.$message({
              message: '没有比赛组别信息',
              duration: 1500
            });
            return;
          }
          this.$store.dispatch('setGame', this.curGame).then(() => {
            this.$router.push({path: this.redirect || "/" });
          });
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .bind-view {
    .el-select {
      margin-bottom: 10px;
    }
    .el-select, .confirm-btn {
      width: 280px;
    }
  }
</style>
