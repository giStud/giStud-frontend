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

export async function getNewsPage({commit}, {existingNews}) {
  const data = await NewsService.getNewsExceptExisting(existingNews);
  commit('addNews', data);
  return data;
}

export async function getNewsPageByType({commit}, {existingNews, typeId}) {
  console.log(existingNews)
  const data = await NewsService.getNewsExceptExistingByType(existingNews, typeId);
  commit('addNews', data);
  return data;
}
