import NewsService from '../../services/news/newsService'
import NewsTypeService from '../../services/news/newsTypesService'

export async function loadNewsPage({commit}, {pageNumber, typeId}) {
  let page;
  if (typeId) {
    page = await NewsService.getNewsPageByType(pageNumber, typeId);
  } else {
    page = await NewsService.getNewsPage(pageNumber);
  }
  commit('addNewsPage', {pageNumber, page})
}

export async function getNewsTypes({commit}) {
  try {
    const data = await NewsTypeService.getNewsTypes()
    commit('setNewsTypes', data)
    return data;
  } catch (e) {
    throw e;
  }
}
