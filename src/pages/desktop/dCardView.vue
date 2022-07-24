<template>
  <q-card flat square style="text-align: center;"
          class="q-px-sm q-py-md">
    <q-card-section class="row justify-end">
      <q-btn v-if="showEditButton" flat color="grey" icon="edit" class="q-pa-sm q-ma-none" @click="editMode=!editMode" />
      <q-btn v-if="showDeleteButton" flat color="red-5" icon="delete" class="q-pa-sm q-ma-none" @click="deleteCard(card.id)"/>
    </q-card-section>
    <q-card-section class="row justify-evenly">
      <q-input class="q-my-sm" square outlined :readonly="!editMode" filled v-model="card.name" label="Заголовок"/>
      <q-file v-if="editMode"
              outlined
              v-model="logoFile"
              use-chips
              :filter="checkFileFilters"
              @rejected="onRejected"
              accept=".jpg, image/*">
        <template v-slot:file="{ file }">
          <q-chip
            class="full-width q-my-xs"
            removable
            square
            @remove="onLogoCancel(file)"
          >
            <div class="ellipsis relative-position">
              {{ file.name }}
            </div>

            <q-tooltip>
              {{ file.name }}
            </q-tooltip>
          </q-chip>
        </template>
        <template v-slot:prepend>
          <q-icon name="attach_file"/>
        </template>
      </q-file>
    </q-card-section>
    <q-card-section v-if="!editMode">
      <q-img :src="viewLogoImgUrl"> LOGO</q-img>
    </q-card-section>
    <q-card-section>
      <q-select
        filled
        v-model="card.category"
        :options="categoryOptions"
        label="Standard"
        color="teal"
        clearable
        options-selected-class="text-deep-orange"
        :readonly="!editMode"
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section avatar>
              <q-icon :name="getCategoryIcon(scope.opt.title)"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ scope.opt.title }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </q-card-section>
    <q-card-section class="row justify-evenly">
      <q-input filled v-model="card.startDate" :readonly="!editMode">
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="card.startDate" mask="YYYY-MM-DD HH:mm">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat/>
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-time v-model="card.startDate" mask="YYYY-MM-DD HH:mm" format24h>
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat/>
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <q-input filled v-model="card.finishDate" :readonly="!editMode">
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="card.finishDate" mask="YYYY-MM-DD HH:mm">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat/>
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-time v-model="card.finishDate" mask="YYYY-MM-DD HH:mm" format24h>
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat/>
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </q-card-section>
    <q-card-section>
      <template v-if="editMode">
        <q-editor v-if="editMode" square v-model="card.description" :dense="$q.screen.lt.md" :toolbar="editorToolBar"
                  :fonts="editorFonts"/>
      </template>
      <template v-else>
        <div v-html="card.description"></div>
      </template>
    </q-card-section>
    <q-card-section>
      <template v-for="tag in card.tags" :key="tag.title">
        <q-chip :removable="editMode" @remove="onTagRemove(tag.title)" outline color="primary" text-color="white" icon="tag">
          {{ tag.title }}
        </q-chip>
      </template>
    </q-card-section>
    <q-card-section>
      <q-input v-if="editMode" class="q-my-sm" square outlined filled v-model="tagName" label="Добавить хештег"
               @focusout="addTag(tagName)">
        <template v-slot:after>
          <q-btn round dense flat icon="check_small" @click="addTag(tagName)"/>
        </template>
      </q-input>
    </q-card-section>
    <q-card-section>
      <div>Как с вами связаться?</div>
      <div class="q-gutter-sm">
        <q-checkbox keep-color v-model="showContactPhone" label="Телефон" color="cyan" :disable="!editMode"/>
        <q-checkbox keep-color v-model="showContactMail" label="Почта" color="cyan" :disable="!editMode"/>
        <q-checkbox keep-color v-model="contactByChat" disable label="Чат" color="cyan"/>
      </div>
      <q-input v-if="showContactPhone" class="q-my-sm" square outlined filled v-model="card.contactPhone"
               label="Контактный номер" :readonly="!editMode"/>
      <q-input v-if="showContactMail" class="q-my-sm" square outlined filled v-model="card.contactMail"
               label="Контактная почта" :readonly="!editMode"/>
    </q-card-section>
    <q-card-section>
      <template v-if="editMode">
        <q-file
          v-model="attachments"
          outlined
          multiple
          use-chips
          counter
          max-files="3"
          append
          accept=".jpg, image/*"
          :filter="checkFileFilters"
          :counter-label="attachmentsCounterLabelFn"
          @rejected="onRejected"
        >
          <template v-slot:file="{ index, file }">
            <q-chip
              class="full-width q-my-xs"
              removable
              square
              @remove="onAttachmentCancel(index, file)"
            >
              <div class="ellipsis relative-position">
                {{ file.name }}
              </div>

              <q-tooltip>
                {{ file.name }}
              </q-tooltip>
            </q-chip>
          </template>

          <template v-slot:prepend>
            <q-icon name="attach_file"/>
          </template>
        </q-file>
      </template>
      <template v-else>
        <q-carousel v-model="attachmentsSlide" animated arrows class="q-pa-none" infinite  height="270px">
          <template v-for="(index, attachmentUrl) of viewAttachmentsImgUrls" :key="attachmentUrl">
            <q-carousel-slide
              :name="index"
              :img-src="attachmentUrl"
            />
          </template>
        </q-carousel>
      </template>
    </q-card-section>
    <q-card-section>
      <div v-if="editMode && !showCreateButton">
        <q-btn class="btr-square" color="primary" no-caps label="Сохранить"
               @click="updateCard({
                  card,
                  logo : logoFile,
                  attachments
               })"/>
        <q-btn class="btr-square" color="red" no-caps label="Отмена"
               @click="editMode = false"/>
      </div>
      <div v-if="showCreateButton">
        <q-btn class="btr-square" color="primary" no-caps label="Добавить"
               @click="createCard({
                 card,
                 logoFile,
                 attachments
               })"/>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import {computed, onMounted, ref, watch} from "vue";
import {useQuasar} from "quasar";
import {useStore} from "vuex";
import {getImageUrlByByteArray, getFileAndDataUrlByByteArray} from "src/composables/board/boardUtils";
import {getEditorToolBar, getEditorFonts} from 'src/services/other/tools';
import {ATTACHMENT_TYPE} from "src/services/other/attachmentService";

const categoryIconMap = {
  "SPORT": "sport",
  "LOVE": "heart"
}

export default {
  name: "dCardView",
  props: {
    id: {
      type: Number,
      default: null
    }
  },
  setup(props) {
    const store = useStore();
    const $q = useQuasar();

    const showEditButton = ref(false);
    const showDeleteButton = ref(false);
    const showCreateButton = ref(true);
    const editMode = ref(false);

    const card = ref({
      id: null,
      name: '',
      category: null,
      description: '',
      startDate: '',
      finishDate: '',
      tags: [],
      logoImage: null,
      contactPhone: '',
      contactMail: '',
      createdByUser : null
    });
    const logoFile = ref(null);
    const attachments = ref([]);
    const tagName = ref('');
    const attachmentsSlide = ref(0);

    const categoryOptions = ref([]);
    const editorToolBar = getEditorToolBar($q);
    const editorFonts = getEditorFonts();
    const showContactPhone = ref(false);
    const showContactMail = ref(false);
    const contactByChat = ref(true);

    const addTag = (tag) => {
      if (tag && tag !== '') {
        if (!card.value.tags.map(tag => tag.title).includes(tag)) {
          card.value.tags.push({
            id: null,
            title: tag
          })
        }
        tagName.value = '';
      }
    }

    const onTagRemove = (tag) => {
      const index = card.value.tags.map(tag => tag.title).indexOf(tag);
      if (index > -1) {
        card.value.tags.splice(index, 1);
      }
    }

    const getCategoryIcon = (name) => {
      return categoryIconMap[name];
    }

    const checkFileFilters = (files) => {
      return files.filter(file => file.size < 10480) &&
        files.filter(file => file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg');
    }

    const attachmentsCounterLabelFn = ({totalSize, filesNumber, maxFiles}) => {
      return `${filesNumber} из ${maxFiles} | ${totalSize}`
    }

    const onRejected = (rejectedEntries) => {
      $q.notify({
        type: 'negative',
        message: `Убедитесь, что файл(ы) имеет формат jpg, jpeg, png и их размер не превышает 10 МБайт`
      })
    }

    const viewLogoImgUrl = ref('');
    const viewAttachmentsImgUrls = ref([]);
    const downloadedFilesFromServer = ref({});
    const attachmentsToDelete = ref([]);

    const checkCanceledFile = (file) => {
      const attachment = downloadedFilesFromServer[file.name];
      if (attachment && attachment.size === file.size) {
        attachmentsToDelete.value.push(attachment);
      }
    }

    const onLogoCancel = (file) => {
      logoFile.value = null;
      checkCanceledFile(file);
    }

    const onAttachmentCancel = (index, file) => {
      attachments.value.splice(index, 1);
      checkCanceledFile(file);
    }

    const updateCard = async ({card, logo, attachments}) => {
      const logoAttachment = logo ? downloadedFilesFromServer[logo.name] : null;
      const updatedLogo = !logoAttachment || logoAttachment.size !== logo.size ? logo : null;

      let newAttachments = [];
      for (let attachment of attachments) {
        const downloadedFile = downloadedFilesFromServer[attachment.name];
        if (!downloadedFile || downloadedFile.size !== attachment.size) {
          newAttachments.push(attachment);
        }
      }
      if (newAttachments.length === 0) newAttachments = null;

      const updatedCard = await store.dispatch('board/updateCard', {
        card,
        newLogo: updatedLogo,
        newAttachments,
        attachmentsToDelete: attachmentsToDelete.value
      })
      editMode.value = false;
      await fillCardViewByData(updatedCard);
    }

    const deleteCard = async (id) => {
      try {
        await store.dispatch('board/deleteCardById', id);
      } catch (e) {
        console.log(e)
      }
    }

    const createCard = async (cardPayload) => {
      try {
        const createdCard = await store.dispatch('board/createCard', cardPayload);
      } catch (e) {
        console.log(e)
      }
    }

    const fillCardViewByData = async (data) => {
      card.value = data;

      if (data.contactMail) {
        showContactMail.value = true;
      }
      if (data.contactPhone) {
        showContactPhone.value = true;
      }

      if (data.logoImage) {
        const {byteArray, fileName} = await store.dispatch('board/downloadAttachmentByIdAction', data.logoImage.id);
        const {dataUrl, file} = await getFileAndDataUrlByByteArray(byteArray, fileName);
        viewLogoImgUrl.value = dataUrl;
        logoFile.value = file;
        downloadedFilesFromServer[fileName] = data.logoImage;
      }

      const cardAttachments = await store.dispatch('board/getCardAttachments', {
        id: data.id,
        type: ATTACHMENT_TYPE.CARD_ATTACHMENT
      });
      if (cardAttachments && cardAttachments.length !== 0) {
        for (let attachment of cardAttachments) {
          const {byteArray, fileName} = await store.dispatch('board/downloadAttachmentByIdAction', attachment.id);
          const {dataUrl, file} = await getFileAndDataUrlByByteArray(byteArray, fileName);
          viewAttachmentsImgUrls.value.push(dataUrl);
          attachments.value.push(file);
          downloadedFilesFromServer[fileName] = attachment;
        }
      }
    }

    onMounted(async () => {
      if (props.id) {
        const data = await store.dispatch('board/getCardById', props.id);
        const currentUser = store.getters['auth/getCurrentUser'];
        const isAdmin = store.getters['auth/isAdmin'];
        if (currentUser && currentUser.username === data.createdByUser.username
          || isAdmin) {
          showEditButton.value = true;
          showDeleteButton.value = true;
        }
        showCreateButton.value = false;
        await fillCardViewByData(data);
      } else {
        editMode.value = true;
        showCreateButton.value = true;
      }

      categoryOptions.value = await store.dispatch('board/getCardCategories');
    })

    return {
      card,
      logoFile,
      attachments,
      categoryOptions,
      editorToolBar,
      editorFonts,
      editMode,
      tagName,
      showContactPhone,
      showContactMail,
      contactByChat,
      viewLogoImgUrl,
      viewAttachmentsImgUrls,
      showEditButton,
      showDeleteButton,
      showCreateButton,
      attachmentsSlide,
      onAttachmentCancel,
      onLogoCancel,
      getCategoryIcon,
      updateCard,
      createCard,
      deleteCard,
      checkFileFilters,
      onRejected,
      attachmentsCounterLabelFn,
      addTag,
      onTagRemove
    }
  }
}
</script>

<style scoped>

</style>
