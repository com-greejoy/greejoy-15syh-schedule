const main = {
  to: '/result/medal/educate',
  name: '总榜'
}

const educate = {
  state: {
    paths: []
  },

  mutations: {
    PUSH_EDUCATE_PATHS: (state, paths) => {
      paths = paths instanceof Array ? paths : [paths];
      state.paths = state.paths.concat(paths);
    },
    SET_EDUCATE_PATHS: (state, paths) => {
      paths = paths instanceof Array ? paths : [paths];
      state.paths = [main].concat(paths);
    },
    SPLIT_EDUCATE_PATHS: (state, index) => {
      state.paths.splice(index + 1);
    },
    RESET_EDUCATE_PATHS: (state) => {
      state.paths = [main];
    }
  },

  actions: {
    pushEducatePaths(context, paths) {
      context.commit('PUSH_EDUCATE_PATHS', paths);
    },
    setEducatePaths(context, paths) {
      context.commit('SET_EDUCATE_PATHS', paths);
    },
    splitEducatePaths(context, index) {
      context.commit('SPLIT_EDUCATE_PATHS', index);
    },
    resetEducatePaths(context) {
      context.commit('RESET_EDUCATE_PATHS');
    }
  }
};

export default educate;
