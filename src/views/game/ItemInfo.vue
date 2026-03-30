<template>
  <div class="item-info">
    <div class="title">
      <div
        v-for="i in item.sortList"
        :class="i.id == sortSelected ? 'sort-selected' : ''"
        @click="handleSortClick(i)"
      >
        {{i.name}}
      </div>
    </div>
    <div class="logo">
      <img :src="item.icon">
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
  import { getItem } from "network/game/item";
  import { listArticle } from "network/cms/article";

  export default {
    name: "ItemInfo",
    data() {
      return {
        loading: false,
        isShowList: true,
        itemId: null,
        item: {},
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
      this.itemId = this.$route.params.itemId ? parseInt(this.$route.params.itemId) : null;
      this.initItem();
    },
    methods: {
      initItem() {
        if (this.itemId) {
          getItem(this.$store.getters.categoryId, this.itemId).then(res => {
            const categoryId = res.data.categoryId;
            if (this.$store.getters.categoryId !== categoryId) {
              this.$store.dispatch('setCategoryId', categoryId);
            }
            this.item = res.data;
            this.sortSelected = this.item.sortList.length > 0 ? this.item.sortList[0].id : null;
            this.listArticle();
          });
        }
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
  .item-info {
    display: flex;
    .title {
      div {
        width: 135px;
        padding: 10px 20px;
        margin-bottom: 4px;
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
    .logo {
      img {
        width: 100px;
        height: 100px;
        padding: 0 20px;
      }
    }
    .desc {
      flex-grow: 1;
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
