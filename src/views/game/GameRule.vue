<template>
  <div class="game-rule">
    <div class="title">
      <div
        v-for="i in category.sortList"
        :class="i.id == sortSelected ? 'sort-selected' : ''"
        @click="handleSortClick(i)"
      >
        {{i.name}}
      </div>
    </div>
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
</template>

<script>
  import { getCategory } from "network/game/category";
  import { listArticle } from "network/cms/article";

  export default {
    name: "GameRule",
    data() {
      return {
        loading: false,
        isShowList: true,
        category: {},
        sortSelected: null,
        articleIndex: 0,
        articleList: []
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
      this.initCategory();
    },
    methods: {
      initCategory() {
        getCategory(this.$store.getters.categoryId).then(res => {
          this.category = res.data;
          this.sortSelected = this.category.sortList.length > 0 ? this.category.sortList[0].id : null;
          this.listArticle();
        });
      },
      reset() {
        this.isShowList = true;
        this.articleIndex = 0;
        this.articleList = [];
      },
      listArticle() {
        const sortId = this.sortSelected;
        if (sortId > 0) {
          this.reset();
          this.loading = true;
          listArticle({
            sortId: sortId,
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
      },
      handleSortClick(title) {
        this.sortSelected = title.id;
        this.listArticle();
      },
      handleTitleClick(index) {
        this.articleIndex = index;
        this.isShowList = false;
      }
    }
  }
</script>
<style lang="less">
  .desc {
    .content {
      p {
        margin-bottom: 10px;
        text-indent: 2em;
      }
      table {
        border-spacing: 0px;
        border-collapse: collapse;
        th, td {
          border: 1px solid #000;
          vertical-align: middle;
          p {
            margin-bottom: 0px;
            text-indent: 0;
            padding: 4px;
          }
        }
      }
    }
  }
</style>
<style lang="less" scoped>
  .game-rule {
    .title {
      margin: 0 auto;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      div {
        padding: 10px 20px;
        border-radius: 20px;
        margin: 4px 10px;
        font-size: 18px;
        color: black;
        background-color: #BFBFBF;
        cursor: pointer;
        text-align: center;
        &.sort-selected, &:hover {
          color: #fff;
          background-color: @t-color-m1;
        }
      }
    }

    .desc {
      margin-top: 20px;
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
</style>
