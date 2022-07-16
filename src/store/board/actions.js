import CardAttachmentService from '../../services/board/cardAttachmentService'
import CardCategoryService from '../../services/board/cardCategoryService'
import CardService from '../../services/board/cardService'

export async function downloadAttachmentByIdAction({ commit }, id) {
  const {data} = await CardAttachmentService.downloadAttachmentById(id);
  commit('setImage', data)
}

export async function getCardCategories({ commit }) {
  return await CardCategoryService.findAll();
}

export async function createCard({commit}, payload) {
  const card = await CardService.create(payload);
  return card;
}

