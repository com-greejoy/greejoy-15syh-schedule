<template>
  <div class="judge-view">
    <div class="judge-query">
      <el-select class="query" v-model="itemId" placeholder="请选择项目" filterable @change="handleItemChange">
        <el-option
          v-for="item in itemList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </div>
    <div class="judge-data">
      <div
        v-loading="loading"
        class="desc"
        element-loading-spinner="el-icon-loading"
      >
        <div
          v-show="isShowList"
          class="list"
        >
          <a v-for="(i,idx) in articleList" @click="handleTitleClick(idx)">{{i.title}}</a>
        </div>
        <div
          v-show="!isShowList"
          v-html="article.content"
          class="content"
        ></div>
        <div class="end"><span class="line"></span><span class="text">没有更多了</span><span class="line"></span></div>
      </div>
    </div>
  </div>
</template>

<script>
  import { listItem, getItem } from "network/game/item";
  import { listArticle } from "network/cms/article";

  export default {
    name: "JudgeShowView",
    data() {
      return {
        loading: false,
        itemId: null,
        itemList: [],
        articleIndex: null,
        articleList: [],
        isShowList: false
      }
    },
    computed: {
      article() {
        const len = this.articleList.length;
        if (len > 0 && this.articleIndex < len) {
          return this.articleList[this.articleIndex];
        } else {
          return {};
        }
      }
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        listItem({
          gameId: this.$store.getters.game.id,
          categoryId: this.$store.getters.categoryId,
          orderByColumn: 'i.orderNum',
          isAsc: 'asc'
        }).then(res => {
          this.itemList = res.rows;
          if (res.rows.length > 0) {
            this.itemId = res.rows[0].id;
          }
          this.handleItemChange();
        });
      },
      reset() {
        this.isShowList = true;
        this.articleIndex = 0;
        this.articleList = [];
      },
      handleItemChange() {
        if (this.itemId) {
          this.reset();
          getItem(this.$store.getters.categoryId, this.itemId).then(res => {
            const categoryId = res.data.categoryId;
            if (this.$store.getters.categoryId !== categoryId) {
              this.$store.dispatch('setCategoryId', categoryId);
            }
            const sortList = res.data.sortList;
            const sort = sortList.find(i => i.code === 'judge');
            if (sort) {
              this.loading = true;
              listArticle({
                sortId: sort.id,
                status: '0',
                orderByColumn: 'a.publishTime',
                isAsc: 'desc'
              }).then(res => {
                this.articleList = res.rows;
                this.loading = false;
                if (this.articleList.length == 1) {
                  this.isShowList = false;
                }
              });
            }
          });
        }
      },
      handleTitleClick(index) {
        this.articleIndex = index;
        this.isShowList = false;
      }
    }
  }
</script>

<style lang="less" scoped>
  .judge-view {

    .judge-query {
      text-align: left;
      margin-bottom: 20px;
      .query {
        width: 200px;
      }
    }

    .judge-data {
      .desc {
        text-align: left;
        line-height: 24px;
        .list {
          a {
            display: block;
            cursor: pointer;
            text-indent: 2em;
            color: @t-color-m1;
          }
        }
        .end {
          width: 100%;
          margin: 0 auto;
          display: flex;
          align-items: center;
          height: 60px;
          line-height: 60px;
          text-align: center;
          .line {
            flex-grow: 1;
            display: inline-block;
            border-top: 1px solid #ccc;
          }
          .text {
            padding: 0 10px;
            font-size: 14px;
            color: #ccc;
          }
        }
      }
    }
  }
</style>
