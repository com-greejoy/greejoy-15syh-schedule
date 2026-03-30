const getters = {
  game: state => state.game.game,
  categoryId: state => state.game.categoryId,
  categoryCode: (state) => {
    if (state.game.game && state.game.game.categoryList && state.game.categoryId) {
      const c = state.game.game.categoryList.find(i => i.id === state.game.categoryId);
      if (c) {
        return c.code;
      } else {
        return '';
      }
    }
    return '';
  },
  categoryName: (state) => {
    if (state.game.game && state.game.game.categoryList && state.game.categoryId) {
      const c = state.game.game.categoryList.find(i => i.id === state.game.categoryId);
      if (c) {
        return c.name;
      } else {
        return '';
      }
    }
    return '';
  },
  medalPaths: state => state.medal.paths,
  scorePaths: state => state.score.paths,
  competePaths: state => state.compete.paths,
  educatePaths: state => state.educate.paths
}
export default getters;
