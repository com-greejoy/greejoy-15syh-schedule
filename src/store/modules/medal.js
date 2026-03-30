const main = {
  to: '/result/medal/main',
  name: '总榜'
}

const medal = {
  state: {
    paths: []
  },

  mutations: {
    PUSH_MEDAL_PATHS: (state, paths) => {
      paths = paths instanceof Array ? paths : [paths];
      state.paths = state.paths.concat(paths);
    },
    SET_MEDAL_PATHS: (state, paths) => {
      paths = paths instanceof Array ? paths : [paths];
      state.paths = [main].concat(paths);
    },
    SPLIT_MEDAL_PATHS: (state, index) => {
      state.paths.splice(index + 1);
    },
    RESET_MEDAL_PATHS: (state) => {
      state.paths = [main];
    }
  },

  actions: {
    pushMedalPaths(context, paths) {
      context.commit('PUSH_MEDAL_PATHS', paths);
    },
    setMedalPaths(context, paths) {
      context.commit('SET_MEDAL_PATHS', paths);
    },
    splitMedalPaths(context, index) {
      context.commit('SPLIT_MEDAL_PATHS', index);
    },
    resetMedalPaths(context) {
      context.commit('RESET_MEDAL_PATHS');
    }
  }
};

export default medal;
