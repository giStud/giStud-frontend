<template>
  <q-page class="q-pa-md" style="min-width: 1248px; padding-left: 24px; padding-right: 24px">


    <q-splitter v-model="splitterModel">

      <template v-slot:before>

        <q-tabs v-model="tab" vertical>

          <q-tab name="bugs" icon="warning" label="Баги"/>
          <q-separator/>
          <q-tab name="news" icon="format_size" label="Новости"/>

        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels v-model="tab" animated swipeable vertical transition-prev="jump-up" transition-next="jump-up">
          <q-tab-panel name="bugs">
            <div class="text-h4 q-mb-md">Баги</div>
            <div class="q-pa-md">
              <q-table bordered flat square title="Багулины" :rows="univRequestsRows"
                       :columns="univRequestsColumns" row-key="requestId" selection="multiple" separator="cell"
                       v-model:selected="selectedUserMessagesRows" wrap-cells
              />
            </div>
            <div class="q-pa-md">
              <q-btn color="primary" label="Удалить выбранные записи" @click="deleteSelectedUserMessagesRows"/>
            </div>
          </q-tab-panel>

          <q-tab-panel name="news">
            <div class="text-h4 q-mb-md">Новости</div>
            <div class="q-pa-md">
              <q-table bordered flat square title="Список новостей" :rows="newsRows"
                       :columns="newsColumns" row-key="newsId" selection="multiple" separator="cell"
                       v-model:selected="selectedNewsRows" wrap-cells
              />
            </div>
            <div class="q-pa-md">
              <q-btn color="primary" no-caps label="Удалить выбранные новости" @click="deleteSelectedNewsRows"/>
            </div>
            <div class="q-pa-md">

              <div class="text-h5 q-mb-md">Добавить новость</div>
              <q-input square outlined filled v-model="newsTitle" label="Заголовок"/>
              <q-input square outlined filled v-model="newsImgSrc" label="Ссылка на фотографию"/>
              <div class="text-h6">Короткий текст</div>
              <q-editor
                v-model="newsShortText"
                :dense="$q.screen.lt.md"
                :toolbar="newsToolbar"
                :fonts="newsEditorFonts"
              />
              <div class="text-h6">Полный текст</div>
              <q-editor
                v-model="newsText"
                :dense="$q.screen.lt.md"
                :toolbar="newsToolbar"
                :fonts="newsEditorFonts"
                style="height: 500px"
              />
            </div>
            <div class="q-pa-md">
              <q-btn color="primary" no-caps label="Добавить" @click="handleNewsCreating(newsTitle,newsImgSrc ,newsShortText, newsText)"/>
            </div>
            <div v-html="newsExample">
            </div>
          </q-tab-panel>

        </q-tab-panels>
      </template>

    </q-splitter>

  </q-page>
</template>

<script>
import {onMounted, ref} from "vue";
import UserMessagesService from "../services/other/userMessagesService"
import {getDateString} from "src/composables/schedule/ScheduleTable";
import UtilsService from "../services/other/utilsService"
import NewsService from  "../services/other/newsService"
import {useQuasar} from "quasar";

const newsEditorFonts = {
  arial: 'Arial',
  arial_black: 'Arial Black',
  comic_sans: 'Comic Sans MS',
  courier_new: 'Courier New',
  impact: 'Impact',
  lucida_grande: 'Lucida Grande',
  times_new_roman: 'Times New Roman',
  verdana: 'Verdana'
}

const newsColumns = [{
  name: 'id',
  required: true,
  label: 'Id',
  align: 'center',
  field: 'newsId',
  headerStyle: 'width: 200px',
  sortable: true
}, {
  name: 'title',
  required: true,
  label: 'Заголовок',
  align: 'center',
  headerStyle: 'width: 500px',
  field: 'title',
  sortable: true
}, {
  name: 'shortContent',
  required: true,
  label: 'Краткий текст',
  align: 'center',
  headerStyle: 'width: 500px',
  field: 'shortText',
  sortable: true
}, {
  name: 'content',
  required: true,
  label: 'Основной текст',
  align: 'center',
  headerStyle: 'width: 500px',
  field: 'fullText',
  sortable: true
}, {
  name: 'img',
  required: true,
  label: 'Ссылка на картинку',
  align: 'center',
  headerStyle: 'width: 500px',
  field: 'imgSrc',
  sortable: true
},
]

const univRequestsColumns = [{
  name: 'id',
  required: true,
  label: 'Id',
  align: 'center',
  field: 'requestId',
  sortable: true
}, {
  name: 'text',
  required: true,
  label: 'Текст',
  align: 'center',
  headerStyle: 'width: 500px',
  field: 'text',
  sortable: true
}, {
  name: 'email',
  required: true,
  label: 'Email',
  align: 'center',
  field: 'email',
  sortable: true
}, {
  name: 'type',
  required: true,
  label: 'Тип сообщения',
  align: 'center',
  field: 'type',
  sortable: true
}, {
  name: 'createdTime',
  required: true,
  label: 'Время создания',
  align: 'center',
  field:
    (row) => {
      let result = '';
      const date = new Date(row.createdTime);
      result += getDateString(date) + '\t';
      result += UtilsService.getTimeString(date);
      return result;
    },
  sortable: true
}
]

export default {
  name: "Admin",
  setup() {
    const $q = useQuasar();
    const univRequestsRows = ref([]);
    const selectedUserMessagesRows = ref([])

    const deleteSelectedUserMessagesRows = async () => {
      if (selectedUserMessagesRows.value.length > 0) {
        for (let selected of selectedUserMessagesRows.value) {
          await UserMessagesService.deleteUserMessageById(selected.requestId)
        }
        univRequestsRows.value = await UserMessagesService.getUserMessages();
      }
    }

    const newsRows = ref([]);
    const selectedNewsRows = ref([])
    const newsTitle = ref('');
    const newsShortText = ref('');
    const newsImgSrc = ref('');
    const newsText = ref('');
    const newsExample = ref('');

    const handleNewsCreating = async (title, img, shortText, fullText) => {
      try {
        const {data} = await NewsService.saveNews(title, img, shortText, fullText)
        $q.notify({
          color: "green-4",
          textColor: "white",
          icon: "cloud_done",
          message: "Новость успешно добавлена",
        });
        newsRows.value.push(data);
      } catch (e) {
        console.log(e)
      }
    }

    const deleteSelectedNewsRows = async () => {
      if (selectedNewsRows.value.length > 0) {
        for (let selected of selectedNewsRows.value) {
          await NewsService.deleteNewsEntityById(selected.newsId)
        }
        newsRows.value = await NewsService.getNews();
      }
    }

    onMounted( async () => {
      univRequestsRows.value = await UserMessagesService.getUserMessages();
      newsRows.value = await NewsService.getNews();
      newsExample.value = newsRows.value[1].shortText;
    })

      const newsToolbar = [
      [
        {
          label: $q.lang.editor.align,
          icon: $q.iconSet.editor.align,
          fixedLabel: true,
          list: 'only-icons',
          options: ['left', 'center', 'right', 'justify']
        },
        {
          label: $q.lang.editor.align,
          icon: $q.iconSet.editor.align,
          fixedLabel: true,
          options: ['left', 'center', 'right', 'justify']
        }
      ],
        ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
        ['token', 'hr', 'link', 'custom_btn'],
        ['print', 'fullscreen'],
        [
          {
            label: $q.lang.editor.formatting,
            icon: $q.iconSet.editor.formatting,
            list: 'no-icons',
            options: [
              'p',
              'h1',
              'h2',
              'h3',
              'h4',
              'h5',
              'h6',
              'code'
            ]
          },
          {
            label: $q.lang.editor.fontSize,
            icon: $q.iconSet.editor.fontSize,
            fixedLabel: true,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'size-1',
              'size-2',
              'size-3',
              'size-4',
              'size-5',
              'size-6',
              'size-7'
            ]
          },
          {
            label: $q.lang.editor.defaultFont,
            icon: $q.iconSet.editor.font,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'default_font',
              'arial',
              'arial_black',
              'comic_sans',
              'courier_new',
              'impact',
              'lucida_grande',
              'times_new_roman',
              'verdana'
            ]
          },
          'removeFormat'
        ],
        ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

        ['undo', 'redo'],
        ['viewsource']
      ]

    return {
      selectedUserMessagesRows,
      univRequestsRows,
      univRequestsColumns,
      selectedNewsRows,
      newsRows,
      newsColumns,
      newsTitle,
      newsShortText,
      newsImgSrc,
      newsText,
      newsEditorFonts,
      newsToolbar,
      newsExample,
      deleteSelectedUserMessagesRows,
      handleNewsCreating,
      deleteSelectedNewsRows,
      tab: ref('bugs'),
      splitterModel: ref(10),
    }
  }
}
</script>

<style scoped>

</style>
