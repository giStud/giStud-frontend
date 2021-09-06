export function setNews (state, news) {
    state.news = news;
}

export function clearNews(state) {
  while (state.news.length) {
    state.news.pop()
  }
}

export function setNewsTypes (state, types) {
  state.newsTypes = types;
}

export function addNews(state, news) {
  state.news.push.apply(state.news, news);
}
