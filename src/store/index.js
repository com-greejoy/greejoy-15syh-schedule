import Vue from 'vue'
import Vuex from 'vuex'
import game from './modules/game';
import medal from './modules/medal';
import score from './modules/score';
import compete from './modules/compete';
import educate from './modules/educate';
import getters from './getters';

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    game,
    medal,
    score,
    compete,
    educate
  },
  getters
})
