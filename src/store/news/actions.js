import NewsService from '../../services/news/newsService'
import NewsTypeService from '../../services/news/newsTypesService'

export async function getNewsTypes({commit}) {
  try {
    const data = await NewsTypeService.getNewsTypes()
    commit('setNewsTypes', data)
    return data;
  } catch (e) {
    throw e;
  }
}

export async function downloadAllNews({commit}) {
  const data = await NewsService.getNews();
  commit('setNews', data);
  return data;
}

export async function getNewsPage({commit}, {existingNews}) {
  const data = await NewsService.getNewsExceptExisting(existingNews);
  commit('addNews', data);
  return data;
}

export async function getNewsPageByType({commit}, {existingNews, typeId}) {
  const data = await NewsService.getNewsExceptExistingByType(existingNews, typeId);
  commit('addNews', data);
  return data;
}

export async function updateNewsEntity({commit}, {id, newValue}) {
  const data = await NewsService.updateNewsEntity(id, newValue);
  commit('editNews', {id, data});
  return data;
}
