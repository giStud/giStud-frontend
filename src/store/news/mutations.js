export function addNewsPage(state, {pageNumber, page}) {
  state.news.set(pageNumber, page);
}

export function clearNewsMap(state) {
  state.news.clear();
}

export function setNewsTypes (state, types) {
  state.newsTypes = types;
}

export function setAdminNews(state, news) {
  state.adminNews = news;
}

export function editNews(state, {id, data}) {
  for (let item in state.adminNews) {
    let val = state.adminNews[item];
    if (val.newsId === id) {
      state.adminNews[item] = data;
    }
  }
}
