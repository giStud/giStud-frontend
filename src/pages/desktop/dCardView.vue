<template>
  <q-card flat square style="text-align: center;"
          class="row justify-evenly q-px-sm">
    <div class="q-pa-md">
      <div class="text-h5 q-mb-md">Добавить новость</div>
      <div class="row justify-evenly">
        <q-input class="q-my-sm" square outlined filled v-model="card.name" label="Заголовок"/>
        <q-file outlined v-model="logoFile" use-chips :filter="checkFileFilters" @rejected="onRejected">
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
        </q-file>
      </div>
      <q-select
        filled
        v-model="card.category"
        :options="categoryOptions"
        label="Standard"
        color="teal"
        clearable
        options-selected-class="text-deep-orange"
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section avatar>
              <q-icon :name="getCategoryIcon(scope.opt.title)" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ scope.opt.title }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-input filled v-model="card.startDate">
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="card.startDate" mask="YYYY-MM-DD HH:mm:ss">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-time v-model="card.startDate" mask="YYYY-MM-DD HH:mm:ss" format24h>
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <q-input filled v-model="card.finishDate">
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="card.finishDate" mask="YYYY-MM-DD HH:mm:ss">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-time v-model="card.finishDate" mask="YYYY-MM-DD HH:mm:ss" format24h>
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <div class="text-h6">Описание</div>
      <q-editor square v-model="card.description" :dense="$q.screen.lt.md" :toolbar="editorToolBar"
                :fonts="editorFonts"/>
      <template v-for="tag in card.tags" :key="tag.title">
        <q-chip removable @remove="onTagRemove(tag.title)" outline color="primary" text-color="white" icon="tag">
          {{ tag.title }}
        </q-chip>
      </template>

      <q-input class="q-my-sm" square outlined filled v-model="tagName" label="Добавить хештег" @focusout="addTag(tagName)">
        <template v-slot:after>
          <q-btn round dense flat icon="check_small" @click="addTag(tagName)"/>
        </template>
      </q-input>
      <div>Как с вами связаться?</div>
      <div class="q-gutter-sm">
        <q-checkbox keep-color v-model="showContactPhone" label="Телефон" color="cyan" />
        <q-checkbox keep-color v-model="showContactMail" label="Почта" color="cyan" />
        <q-checkbox keep-color v-model="contactByChat" disable label="Чат" color="cyan" />
      </div>
      <q-input v-if="showContactPhone" class="q-my-sm" square outlined filled v-model="card.contactPhone" label="Контактный номер" />
      <q-input v-if="showContactMail" class="q-my-sm" square outlined filled v-model="card.contactMail" label="Контактная почта"/>


      <q-file
        v-model="attachments"
        outlined
        multiple
        use-chips
        counter
        max-files="3"
        :filter="checkFileFilters"
        :counter-label="attachmentsCounterLabelFn"
        @rejected="onRejected"
        >
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
      </q-file>
    </div>
    <div class="q-pa-md">
      <template v-if="editMode">
        <q-btn class="btr-square" color="primary" no-caps label="Изменить"
               @click="updateCard()"/>
      </template>
      <template v-else>
        <q-btn class="btr-square" color="primary" no-caps label="Добавить"
               @click="createCard({
                 card,
                 logoFile,
                 attachments
               })"/>
      </template>

    </div>
  </q-card>
</template>

<script>
import {computed, onMounted, ref, watch} from "vue";
import {useQuasar} from "quasar";
import {useStore} from "vuex";
import authHeader from "src/services/auth/authHeader";
import {getEditorToolBar, getEditorFonts} from 'src/services/other/tools';

const categoryIconMap = {
  "SPORT" : "sport",
  "LOVE" : "heart"
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

    const editMode = ref(false);
    const readMode = ref(false);

    const card = ref({
      name: '',
      category: null,
      description: '',
      startDate: '',
      finishDate: '',
      tags : [],
      logoFile : null,
      contactPhone : '',
      contactMail : ''
    });
    const logoFile = ref(null);
    const attachments = ref([]);
    const tagName = ref('');


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
            title : tag
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

    const attachmentsCounterLabelFn = ({ totalSize, filesNumber, maxFiles }) => {
      return `${filesNumber} из ${maxFiles} | ${totalSize}`
    }

    const onRejected = (rejectedEntries) => {
      $q.notify({
        type: 'negative',
        message: `Убедитесь, что файл(ы) имеет формат jpg,jpeg,png и не весит больше 10 МБайт`
      })
    }

    const updateCard = () => {

    }

    const createCard = async (cardPayload) => {
      try {
        const createdCard = await store.dispatch('board/createCard', cardPayload);
      } catch (e)  {
        console.log(e)
      }
    }

    onMounted(async ()=> {
      if (props.id) {
        card.value = await store.dispatch('board/getCardById', props.id);
        readMode.value = true;
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
      readMode,
      getCategoryIcon,
      updateCard,
      createCard,
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
