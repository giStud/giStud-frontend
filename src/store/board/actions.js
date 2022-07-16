import CardAttachmentService from '../../services/board/cardAttachmentService'
import CardCategoryService from '../../services/board/cardCategoryService'

export async function downloadAttachmentByIdAction({ commit }, id) {
  const {data} = await CardAttachmentService.downloadAttachmentById(id);
  commit('setImage', data)
}

export async function getCardCategories({ commit }) {
  return await CardCategoryService.findAll();
}

