import CardAttachmentService from '../../services/board/cardAttachmentService'

export async function downloadAttachmentByIdAction({ commit }, id) {
  const {data} = await CardAttachmentService.downloadAttachmentById(id);
  commit('setImage', data)
}


