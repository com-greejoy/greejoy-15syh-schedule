<template>
  <div class="game-info">
    <div v-if="$store.getters.game.id > 0">
      <div class="game-name" @click="handleGameClick">
        {{'竞赛信息发布系统'}}
      </div>
      <div class="game-category">
        <el-radio-group v-if="visibleCategoryList.length > 1" v-model="categoryId" size="small">
          <el-radio-button v-for="item in visibleCategoryList" :key="item.id" :label="item.id">{{item.name}}</el-radio-button>
        </el-radio-group>
        <span v-else-if="visibleCategoryList.length === 1" class="single-category">{{visibleCategoryList[0].name}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  const allowedRaw = process.env.VUE_APP_ALLOWED_CATEGORIES;
  const allowedCodes = allowedRaw ? allowedRaw.split(',').map(s => s.trim()).filter(Boolean) : [];

  export default {
    name: "GameInfo",
    computed: {
      visibleCategoryList() {
        const list = (this.$store.getters.game.categoryList || []);
        if (!allowedCodes.length) return list;
        return list.filter(c => allowedCodes.includes(c.code));
      },
      categoryId: {
        get() {
          return this.$store.getters.categoryId;
        },
        set(value) {
          this.$store.dispatch('setCategoryId', value);
          this.$router.push('/game/rule');
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
    .game-category {
      .single-category {
        font-size: 14px;
        color: #606266;
      }
    }
  }
</style>
