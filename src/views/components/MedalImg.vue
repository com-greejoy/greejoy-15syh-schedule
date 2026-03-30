<template>
  <div class="medal-img">
    <div class="order-index" v-if="showOrderIndex">{{ orderIndex }}</div>
    <img class="medal" v-if="showMedal === 1" src="~assets/img/game/1st.png">
    <img class="medal" v-if="showMedal === 2" src="~assets/img/game/2nd.png">
    <img class="medal" v-if="showMedal === 3" src="~assets/img/game/3rd.png">
  </div>
</template>

<script>
  export default {
    name: "MedalImg",
    props: {
      orderIndex: {
        type: Number,
        default: null
      },
      medalType: {
        type: String,
        default: null
      },
      showOrderIndex: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      showMedal() {
        const medalTypes = ['gold', 'silver', 'bronze'];
        return medalTypes.indexOf(this.medalType) + 1;
      }
    }
  }
</script>

<style class="less" scoped>
.medal-img {
  position: relative;
  text-align: center;
  font-size: 12px;
  color: aliceblue;

  .order-index {
    position: absolute;
    top: -1.5px;
    left: 0;
    right: 0;
  }
}
</style>
