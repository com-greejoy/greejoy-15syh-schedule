const game = {
  state: {
    game: {},
    categoryId: null
  },

  mutations: {
    SET_GAME: (state, game) => {
      state.game = game;
      //如果已有的categoryId不属于该game，则重置为null
      if (!game.categoryList.length || !game.categoryList.find(i => i.id === state.categoryId)) {
        state.categoryId = null;
      }
      if (!state.categoryId && game.categoryList.length > 0) {
        state.categoryId = game.categoryList[0].id;
      }
    },
    SET_CATEGORY_ID: (state, categoryId) => {
      state.categoryId = categoryId;
    }
  },

  actions: {
    setGame(context, game) {
      context.commit('SET_GAME', game);
    },
    setCategoryId(context, categoryId) {
      context.commit('SET_CATEGORY_ID', categoryId);
    }
  }
};

export default game;
