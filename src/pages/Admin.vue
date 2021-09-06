<template>
  <q-page class="q-pa-md" style="min-width: 1248px; padding-left: 24px; padding-right: 24px">


    <q-splitter v-model="splitterModel">

      <template v-slot:before>

        <q-tabs v-model="tab" vertical>

          <q-tab name="bugs" icon="warning" label="Баги"/>
          <q-separator/>
          <q-tab name="news" icon="format_size" label="Новости"/>
          <q-separator/>
          <q-tab name="schedule" icon="schedule" label="Загрузка расписания"/>

        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels v-model="tab" animated swipeable vertical transition-prev="jump-up" transition-next="jump-up">
          <q-tab-panel name="bugs">
            <div class="text-h4 q-mb-md">Баги</div>
            <div class="q-pa-md">
              <q-table bordered flat square title="Багулины" :rows="univRequestsRows"
                       :columns="univRequestsColumns" row-key="requestId" selection="multiple" separator="cell"
                       v-model:selected="selectedUserMessagesRows"
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
              <q-input square outlined filled v-model="newsSource" label="Источник"/>
              <q-select
                filled
                v-model="newsType"
                :options="newsTypesOptions"
                option-value="newsTypeId"
                option-label="type"
                option-disable="inactive"
                emit-value
                map-options
              />
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
              />
            </div>
            <div class="q-pa-md">
              <q-btn color="primary" no-caps label="Добавить"
                     @click="handleNewsCreating(newsTitle,newsImgSrc ,newsShortText, newsText, newsSource, newsType)"/>
            </div>
              <q-input square outlined filled v-model="newsTypeText" label="Новый тип новости"/>
              <q-input square outlined filled v-model="newsTypeIcon" label="Имя иконки для типа новости"/>
            <q-btn color="primary" no-caps label="Добавить"
                   @click="handleNewsTypeCreating(newsTypeText, newsTypeIcon)"/>
            <div>

            </div>
          </q-tab-panel>

          <q-tab-panel name="schedule">
            <div class="text-h4 q-mb-md">Загрузка расписания</div>
            <div>
              <div class="q-pa-md">
                <q-uploader bordered flat square field-name="files" method="POST" :headers="getHeaders"
                            :url="apiPath + '/schedule/schedulesLoading'" label="Загрузка расписания" multiple batch
                            @failed="onFailed"/>
              </div>
              <div class="q-pa-md">
                <q-uploader bordered flat square field-name="zips" method="POST" :headers="getHeaders"
                            :url="apiPath + '/schedule/schedulesLoading/zips'" label="Загрузка архивов" multiple batch
                            @failed="onFailed"/>
              </div>
            </div>
          </q-tab-panel>

        </q-tab-panels>
      </template>

    </q-splitter>

  </q-page>
</template>

<script>
import {computed, onMounted, ref, watch} from "vue";
import UserMessagesService from "../services/other/userMessagesService"
import {getDateString} from "src/composables/schedule/ScheduleTable";
import UtilsService from "../services/other/utilsService"
import NewsService from "../services/news/newsService"
import NewsTypeService from "../services/news/newsTypesService"
import {useQuasar} from "quasar";
import {useStore} from "vuex";
import TokenService from "src/services/auth/tokenService";
import authHeader from "src/services/auth/authHeader";

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
}
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
    const store = useStore();
    const onFailed = ((info) => {
      if (info.xhr.status === 401) {
        const {accessToken, refreshToken} = TokenService.refreshTokens()
        store.dispatch('auth/refreshTokensAction', accessToken, refreshToken);
      }
    })

    const getHeaders = () => {
      return Object.entries(authHeader()).map(([key, value]) => {
        return {name: key, value}
      })
    }
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

    const tab = ref('');
    const newsRows = ref([]);
    const selectedNewsRows = ref([])
    const newsTitle = ref('');
    const newsShortText = ref('');
    const newsImgSrc = ref('');
    const newsSource = ref('');
    const newsText = ref('');
    const newsTypeText = ref('');
    const newsTypeIcon = ref('');
    const newsType = ref(null);
    const newsTypesOptions = ref([]);

    const handleNewsCreating = async (title, img, shortText, fullText, source, typeId) => {
      try {
        console.log(typeId)
        const {data} = await NewsService.saveNews(title, img, shortText, fullText, source, typeId)
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

    const handleNewsTypeCreating = async (type, icon) => {
      try {
        const {data} = await NewsTypeService.saveNewsType(type, icon);
        $q.notify({
          color: "green-4",
          textColor: "white",
          icon: "cloud_done",
          message: "Новый тип успешно добавлен",
        });
        newsTypesOptions.value.push(data);
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

    onMounted(async () => {
      tab.value = localStorage.getItem("adminCurrentTab");
      univRequestsRows.value = await UserMessagesService.getUserMessages();
      newsRows.value = await NewsService.getNews();
      newsTypesOptions.value = await NewsTypeService.getNewsTypes();
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
    watch(tab, (val) => {
      localStorage.setItem("adminCurrentTab", val)
    });

    return {
      tab,
      selectedUserMessagesRows,
      univRequestsRows,
      univRequestsColumns,
      selectedNewsRows,
      newsRows,
      newsColumns,
      newsTitle,
      newsShortText,
      newsImgSrc,
      newsSource,
      newsText,
      newsType,
      newsTypeText,
      newsTypeIcon,
      newsTypesOptions,
      newsEditorFonts,
      newsToolbar,
      onFailed,
      splitterModel: ref(10),
      apiPath: computed(() => process.env.API),
      deleteSelectedUserMessagesRows,
      handleNewsCreating,
      handleNewsTypeCreating,
      deleteSelectedNewsRows,
      getHeaders,
    }
  }
}
</script>

<style scoped>

</style>
