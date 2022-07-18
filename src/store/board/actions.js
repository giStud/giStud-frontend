import CardAttachmentService from '../../services/board/cardAttachmentService'
import CardCategoryService from '../../services/board/cardCategoryService'
import CardService, {CARD_STATUS} from '../../services/board/cardService'
import {ATTACHMENT_TYPE} from "src/services/other/attachmentService";

export async function downloadAttachmentByIdAction({ commit }, id) {
  return await CardAttachmentService.downloadAttachmentById(id);
}

export async function getCardById({ commit }, id) {
  return await CardService.getCardById(id);
}

export async function getCardCategories({ commit }) {
  return await CardCategoryService.findAll();
}

export async function getCardAttachments({commit}, id) {
  return await CardAttachmentService.getCardAttachments(id);
}

export async function updateCard({commit}, payload) {
  try {
    return await CardService.update(payload);
  } catch (e) {
    throw e;
  }
}

export async function createCard({commit}, payload) {
  try {
    const card = await CardService.create(payload);
    if (payload.attachments) {
      const attachments = await CardAttachmentService.addAttachmentsToCard(card.id, payload.attachments,
        ATTACHMENT_TYPE.CARD_ATTACHMENT)
    }
    const result = await CardService.updateStatus(card.id, CARD_STATUS.WAITING_APPROVAL);
    return card;
  } catch (e) {
    throw e;
  }
}

export async function getCardsPage({commit}, payload) {
  return await CardService.getCardPage(payload);
}
