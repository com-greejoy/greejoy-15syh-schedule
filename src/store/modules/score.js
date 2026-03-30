const main = {
  to: '/result/medal/score',
  name: '总分榜'
}

const score = {
  state: {
    paths: []
  },

  mutations: {
    PUSH_SCORE_PATHS: (state, paths) => {
      paths = paths instanceof Array ? paths : [paths];
      state.paths = state.paths.concat(paths);
    },
    SET_SCORE_PATHS: (state, paths) => {
      paths = paths instanceof Array ? paths : [paths];
      state.paths = [main].concat(paths);
    },
    SPLIT_SCORE_PATHS: (state, index) => {
      state.paths.splice(index + 1);
    },
    RESET_SCORE_PATHS: (state) => {
      state.paths = [main];
    }
  },

  actions: {
    pushScorePaths(context, paths) {
      context.commit('PUSH_SCORE_PATHS', paths);
    },
    setScorePaths(context, paths) {
      context.commit('SET_SCORE_PATHS', paths);
    },
    splitScorePaths(context, index) {
      context.commit('SPLIT_SCORE_PATHS', index);
    },
    resetScorePaths(context) {
      context.commit('RESET_SCORE_PATHS');
    }
  }
};

export default score;
