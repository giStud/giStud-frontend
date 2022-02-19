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
