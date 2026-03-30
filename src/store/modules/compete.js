const main = {
  to: '/result/medal/compete',
  name: '总榜'
}

const compete = {
  state: {
    paths: []
  },

  mutations: {
    PUSH_COMPETE_PATHS: (state, paths) => {
      paths = paths instanceof Array ? paths : [paths];
      state.paths = state.paths.concat(paths);
    },
    SET_COMPETE_PATHS: (state, paths) => {
      paths = paths instanceof Array ? paths : [paths];
      state.paths = [main].concat(paths);
    },
    SPLIT_COMPETE_PATHS: (state, index) => {
      state.paths.splice(index + 1);
    },
    RESET_COMPETE_PATHS: (state) => {
      state.paths = [main];
    }
  },

  actions: {
    pushCompetePaths(context, paths) {
      context.commit('PUSH_COMPETE_PATHS', paths);
    },
    setCompetePaths(context, paths) {
      context.commit('SET_COMPETE_PATHS', paths);
    },
    splitCompetePaths(context, index) {
      context.commit('SPLIT_COMPETE_PATHS', index);
    },
    resetCompetePaths(context) {
      context.commit('RESET_COMPETE_PATHS');
    }
  }
};

export default compete;
