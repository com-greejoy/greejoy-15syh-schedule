<template>
  <div id="app">
    <div id="header">
      <img src="~assets/img/header.png" @click="toHome" />
      <game-info></game-info>
    </div>
    <div id="nav">
      <div class="wrapper">
        <router-link class="link" to="/game/rule">总则</router-link>
        <router-link class="link" to="/game/item">项目</router-link>
        <router-link class="link" to="/schedule/total">总赛程</router-link>
        <router-link class="link" to="/schedule/daily">每日赛程</router-link>
        <router-link class="link" to="/schedule/item">单项赛程</router-link>
        <router-link
          v-if="this.$store.getters.categoryCode == 'young'"
          class="link"
          to="/result/extra"
          >纪录和等级</router-link
        >
        <router-link
          v-if="this.$store.getters.categoryCode == 'young'"
          class="link"
          to="/result/medal"
          >奖牌</router-link
        >
        <router-link class="link" to="/game/judge">裁判员</router-link>
        <!--
        <router-link
          v-if="this.$store.getters.categoryCode != 'young'"
          class="link"
          to="/game/judgeShow"
          >裁判员</router-link
        >
        -->
        <router-link class="link" to="/game/sporter">运动员</router-link>
        <router-link class="link" to="/game/sheet">报表</router-link>
        <router-link
          v-if="this.$store.getters.categoryCode == 'young'"
          class="link"
          to="/game/unitType"
          >代表团</router-link
        >
        <!--
        <router-link class="link" to="/game/print">打印</router-link>
        -->
      </div>
    </div>
    <div id="main">
      <div v-if="routerViewAlive" class="main-container">
        <router-view :key="key" />
      </div>
    </div>
    <div id="beian">
      <span>
        <a target="_blank" href="https://beian.miit.gov.cn">
          <span class="num">蜀ICP备2023022713号</span>
        </a>
      </span>
      <span class="tools">
        实用工具：
        <span class="item" @click="toPrint">获奖证书打印</span>
      </span>
    </div>
  </div>
</template>

<script>
import GameInfo from "views/game/GameInfo";
export default {
  components: {
    GameInfo
  },
  data() {
    return {
      routerViewAlive: true
    };
  },
  computed: {
    key() {
      return this.$route.fullPath; //带参数的全路径，进入同页面带不同参数可以刷新页面
    },
    categoryId() {
      return this.$store.getters.categoryId;
    }
  },
  watch: {
    categoryId(newVal, oldVal) {
      if (newVal > 0 && oldVal > 0 && newVal !== oldVal) {
        this.routerViewAlive = false;
        this.$nextTick(() => {
          this.routerViewAlive = true;
        });
      }
    }
  },
  methods: {
    toHome() {
      window.location.href = process.env.VUE_APP_HOST_URL;
    },
    toPrint() {
      this.$router.push("/game/print");
    }
  }
};
</script>

<style lang="less">
@import "assets/css/base.css";

#app {
  text-align: center;
  color: #2c3e50;
}

#header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  margin: 0 auto;
  padding: 30px 0px;
  img {
    width: 604px;
    height: 103px;
    object-fit: contain;
    cursor: pointer;
  }
}

#nav {
  @h: 120px;
  width: 100%;
  height: @h;
  background-image: url("~assets/img/nav_bg.jpg");
  background-size: cover;

  .wrapper {
    width: 90%;
    margin: 0 auto;
    display: flex;
    align-items: center;

    .link {
      height: @h;
      line-height: @h;
      flex-grow: 1;
      color: #fff;
      font-weight: bold;
      font-size: 22px;

      &.router-link-exact-active {
        background: linear-gradient(
          to bottom,
          transparent,
          rgba(0, 147, 245, 0.6)
        );
      }
    }
  }
}

#main {
  padding-top: 30px;
  padding-bottom: 30px;
  min-height: 600px;
  background-image: url("~assets/img/main_bg.jpg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  .main-container {
    width: 90%;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 20px;
    background-color: #fff;
    border-radius: 6px;
  }
}

#beian {
  height: 40px;
  line-height: 40px;

  .num {
    color: #939393;
    &:hover {
      color: black;
    }
  }

  .tools {
    margin-left: 30px;
    color: #939393;
    .item {
      cursor: pointer;
      &:hover {
        color: black;
      }
    }
  }
}
</style>
