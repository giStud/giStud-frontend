export function setNews (state, news) {
    state.news = news;
}

export function setNewsTypes (state, types) {
  state.newsTypes = types;
}

export function addNews(state, news) {
  state.news.push.apply(state.news, news);
}
