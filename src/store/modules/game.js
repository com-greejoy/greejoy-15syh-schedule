function getAllowedCategories() {
  const raw = process.env.VUE_APP_ALLOWED_CATEGORIES;
  if (!raw) return [];
  return raw.split(',').map(s => s.trim()).filter(Boolean);
}

function filterCategoryList(list) {
  const allowed = getAllowedCategories();
  if (!allowed.length) return list;
  return list.filter(c => allowed.includes(c.code));
}

const game = {
  state: {
    game: {},
    categoryId: null
  },

  mutations: {
    SET_GAME: (state, game) => {
      state.game = game;
      const visibleList = filterCategoryList(game.categoryList || []);
      if (!visibleList.length || !visibleList.find(i => i.id === state.categoryId)) {
        state.categoryId = null;
      }
      if (!state.categoryId && visibleList.length > 0) {
        state.categoryId = visibleList[0].id;
      }
    },
    SET_CATEGORY_ID: (state, categoryId) => {
      state.categoryId = categoryId != null ? Number(categoryId) : categoryId;
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
