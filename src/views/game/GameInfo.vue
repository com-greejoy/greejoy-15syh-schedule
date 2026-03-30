<template>
  <div class="game-info">
    <div v-if="$store.getters.game.id > 0">
      <div class="game-name" @click="handleGameClick">
        {{'竞赛信息发布系统'}}
      </div>
      <div class="game-category">
        <el-radio-group v-model="categoryId" size="small">
          <el-radio-button v-for="item in $store.getters.game.categoryList" :label="item.id">{{item.name}}</el-radio-button>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "GameInfo",
    computed: {
      categoryId: {
        get() {
          return this.$store.getters.categoryId;
        },
        set(value) {
          this.$store.dispatch('setCategoryId', value);
          this.$router.push('/game/rule'); //组别点击切换，强行跳转到通用的总则页面，避免不属于该组别的页面停留显示
        }
      }
    },
    methods: {
      handleGameClick() {
        this.$router.push('/bind');
      }
    }
  }
</script>

<style lang="less" scoped>
  .game-info {
    .game-name {
      font-size: 20px;
      line-height: 40px;
      font-weight: bold;
      cursor: pointer;
      &:hover {
        color: @t-color-m1;
      }
    }
    .game-category{

    }
  }
</style>
