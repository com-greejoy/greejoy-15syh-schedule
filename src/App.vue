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
        <!--
        <router-link
          v-if="this.$store.getters.categoryCode == 'young'"
          class="link"
          to="/game/honor"
          >荣誉</router-link
        >
        -->
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
      </div>
    </div>
    <div id="main">
      <div v-if="routerViewAlive" class="main-container">
        <router-view :key="key" />
      </div>
    </div>
    <div id="beian">
      <img class="beian-icon" src="~assets/img/beian-icon.png" />
      <a style="margin-right: 20px" href=" " rel="noreferrer" target="_blank"
        >川公网安备51160202511962号</a
      >
      <a target="_blank" href="https://beian.miit.gov.cn/#/Integrated/index"
        >备案号：蜀ICP备2025145529号-3</a
      >
    </div>
  </div>
</template>

<script>
import GameInfo from "views/game/GameInfo";
export default {
  components: {
    GameInfo,
  },
  data() {
    return {
      routerViewAlive: true,
    };
  },
  computed: {
    key() {
      return this.$route.fullPath; //带参数的全路径，进入同页面带不同参数可以刷新页面
    },
    categoryId() {
      return this.$store.getters.categoryId;
    },
  },
  watch: {
    categoryId(newVal, oldVal) {
      if (newVal > 0 && oldVal > 0 && newVal !== oldVal) {
        this.routerViewAlive = false;
        this.$nextTick(() => {
          this.routerViewAlive = true;
        });
      }
    },
  },
  methods: {
    toHome() {
      window.location.href = process.env.VUE_APP_HOST_URL;
    },
  },
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

  a {
    color: #939393;
    text-decoration: none;
    &:hover {
      color: black;
    }
  }

  .beian-icon {
    width: 18px;
    height: 18px;
    vertical-align: middle;
    margin-right: 6px;
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
