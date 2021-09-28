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
          <q-separator/>
          <q-tab name="groupCreating" icon="group" label="Создание группы"/>

        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels v-model="tab" animated swipeable vertical transition-prev="jump-up" transition-next="jump-up">
          <q-tab-panel class="bg-none" name="bugs">
            <div class="text-h4 q-mb-md">Баги</div>
            <div class="q-pa-md">
              <q-table bordered flat square title="Багулины" :rows="univRequestsRows"
                       :columns="univRequestsColumns" row-key="requestId" selection="multiple" separator="cell"
                       v-model:selected="selectedUserMessagesRows"
              />
            </div>
            <div class="q-pa-md">
              <q-btn class="btr-square" color="primary" label="Удалить выбранные записи"
                     @click="deleteSelectedUserMessagesRows"/>
            </div>
          </q-tab-panel>

          <q-tab-panel class="bg-none" name="news">
            <q-card flat square class="bg-none">
              <q-tabs v-model="newsProperty" dense active-color="primary" indicator-color="primary" align="justify"
                      narrow-indicator>
                <q-tab name="newsList" label="Список новостей"/>
                <q-tab name="newsAdd" label="Редактор новостей"/>
                <q-tab name="newsType" label="Редактор типов новостей"/>
              </q-tabs>

              <q-separator/>

              <q-tab-panels v-model="newsProperty" animated>
                <q-tab-panel class="bg-none" name="newsList">
                  <!--news table-->
                  <div class="text-h4 q-mb-md">Новости</div>
                  <div class="q-pa-md">
                    <q-table bordered flat square title="Список новостей" :rows="newsRows"
                             :columns="newsColumns" row-key="newsId" selection="multiple" separator="cell"
                             v-model:selected="selectedNewsRows" wrap-cells
                    />
                  </div>
                  <div class="q-pa-md">
                    <q-btn class="btr-square" color="primary" no-caps label="Удалить выбранные новости"
                           @click="deleteSelectedNewsRows"/>
                    <q-btn class="btr-square q-mx-lg" color="primary" no-caps label="Изменить выбранную новость"
                           :disable="selectedNewsRows.length !== 1"
                           @click="changeSelectedNewsItem(selectedNewsRows[0])"/>
                  </div>
                </q-tab-panel>

                <q-tab-panel class="bg-none" name="newsAdd">
                  <!--news edit-->
                  <div class="q-pa-md">
                    <div class="text-h5 q-mb-md">Добавить новость</div>
                    <q-input class="q-my-sm" square outlined filled v-model="newsTitle" label="Заголовок"/>
                    <q-input class="q-my-sm" square outlined filled v-model="newsImgSrc" label="Ссылка на фотографию"/>
                    <q-input class="q-my-sm" square outlined filled v-model="newsSource" label="Источник"/>
                    <q-select class="q-my-sm" square label="Выберите тип новости" filled v-model="newsType"
                              :options="newsTypesOptions" option-label="type"
                              option-disable="inactive" emit-value/>
                    <div class="text-h6">Короткий текст</div>
                    <q-editor square v-model="newsShortText" :dense="$q.screen.lt.md" :toolbar="newsToolbar"
                              :fonts="newsEditorFonts"/>
                    <div class="text-h6">Полный текст</div>
                    <q-editor square v-model="newsText" :dense="$q.screen.lt.md" :toolbar="newsToolbar"
                              :fonts="newsEditorFonts"/>
                  </div>
                  <div class="q-pa-md">
                    <template v-if="editMode">
                      <q-btn class="btr-square" color="primary" no-caps label="Изменить"
                             @click="handleNewsChange(changeNewsId, { newsTitle,newsImgSrc ,newsShortText, newsText , newsSource, type : newsType })"/>
                    </template>
                    <template v-else>
                      <q-btn class="btr-square" color="primary" no-caps label="Добавить"
                             @click="handleNewsCreating(newsTitle,newsImgSrc ,newsShortText, newsText, newsSource, newsType)"/>
                    </template>

                  </div>
                </q-tab-panel>

                <q-tab-panel class="bg-none" name="newsType">
                  <!--news types-->
                  <div class="q-pa-md">
                    <q-table bordered flat square title="Список новостей" :rows="newsTypesOptions"
                             :columns="newsTypesColumns" row-key="newsTypeId" selection="multiple" separator="cell"
                             v-model:selected="newsTypesSelected" wrap-cells
                    >
                      <template v-slot:body-cell-icon="props">
                        <q-td :props="props">
                          <div>
                            <q-icon :name="props.row.iconName"></q-icon>
                          </div>
                        </q-td>
                      </template>
                    </q-table>
                  </div>

                  <div class="q-pa-md">
                    <q-btn class="btr-square" color="primary" no-caps label="Удалить выбранные новости"
                           @click="deleteSelectedNewsTypesRows"/>
                  </div>

                  <q-input class="q-ma-sm" square outlined filled v-model="newsTypeText" label="Новый тип новости"/>
                  <q-input class="q-ma-sm" square outlined filled v-model="newsTypeIcon"
                           label="Имя иконки для типа новости"/>
                  <div class="q-pa-sm">
                    <q-btn class="btr-square" color="primary" no-caps label="Добавить"
                           @click="handleNewsTypeCreating(newsTypeText, newsTypeIcon)"/>
                    <q-icon :name="newsTypeIcon"/>
                    {{ newsTypeText }}
                  </div>
                </q-tab-panel>

              </q-tab-panels>
            </q-card>
          </q-tab-panel>

          <q-tab-panel class="bg-none" name="schedule">
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
          <q-tab-panel class="bg-none" name="groupCreating">
            <q-card flat>
              <q-card-section class="text-h4 q-mb-md">Создать группу</q-card-section>
              <q-card-section>
                <q-option-group
                  v-model="groupCreatingSemester"
                  :options="semestersMap"
                  color="primary"
                  inline
                />
              </q-card-section>
              <q-card-section>
                <q-select v-model="univSelectValue" :options="univFilteredOptions" borderless bottom-slots
                          class="select-ug"
                          fill-input hide-selected
                          label="Выберите университет"
                          option-label="univName"
                          outlined transition-hide="jump-up" transition-show="jump-up"
                          use-input @filter="filterUniversitiesFn">
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label v-html="scope.opt.univName"/>
                        <q-item-label caption>{{ scope.opt.city }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">Не найдено</q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:append>
                    <q-icon name="search"/>
                  </template>
                </q-select>
              </q-card-section>
              <q-card-section>
                <q-select v-model="facultySelectValue" :options="facultyFilteredOptions" borderless bottom-slots
                          class="select-ug" fill-input hide-selected
                          label="Выберите факультет"
                          outlined transition-hide="jump-up" transition-show="jump-up"
                          use-input @filter="filterFacultiesFn">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">Не найдено</q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:append>
                    <q-icon name="search"/>
                  </template>
                </q-select>
              </q-card-section>
              <q-card-section>
                <q-input v-model="creatingGroupName" label="Имя группы"/>
              </q-card-section>
              <q-card-section>
                <q-input filled v-model="groupTimeArray[0]" mask="time" :rules="['time']" label="Время начала 1 пары" style="width: 250px">
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-time v-model="groupTimeArray[0]">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat/>
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </q-card-section><q-card-section>
                <q-input filled v-model="groupTimeArray[1]" mask="time" :rules="['time']" label="Время начала 2 пары" style="width: 250px">
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-time v-model="groupTimeArray[1]">
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
                <q-input filled v-model="groupTimeArray[2]" mask="time" :rules="['time']" label="Время начала 3 пары" style="width: 250px">
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-time v-model="groupTimeArray[2]">
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
                <q-input filled v-model="groupTimeArray[3]" mask="time" :rules="['time']" label="Время начала 4 пары" style="width: 250px">
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-time v-model="groupTimeArray[3]">
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
                <q-input filled v-model="groupTimeArray[4]" mask="time" :rules="['time']" label="Время начала 5 пары" style="width: 250px">
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-time v-model="groupTimeArray[4]">
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
                <q-input filled v-model="groupTimeArray[5]" mask="time" :rules="['time']" label="Время начала 6 пары" style="width: 250px">
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-time v-model="groupTimeArray[5]">
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
                <q-input filled v-model="groupTimeArray[6]" mask="time" :rules="['time']" label="Время начала 7 пары" style="width: 250px">
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-time v-model="groupTimeArray[6]">
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
                <q-input filled v-model="groupTimeArray[7]" mask="time" :rules="['time']" label="Время начала 8 пары" style="width: 250px">
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-time v-model="groupTimeArray[7]">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat/>
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </q-card-section>
              <q-card-actions>
                <q-btn flat icon="create" @click="handleGroupCreating({univ : univSelectValue, facName : facultySelectValue, name : creatingGroupName, timeArray : groupTimeArray}, groupCreatingSemester)"/>
              </q-card-actions>
            </q-card>
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
import GroupService from "src/services/schedule/groupsService"
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

const newsColumns = [
  {
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
    field: 'title',
    headerStyle: 'width: 500px',
    sortable: true
  }
]

const newsTypesColumns = [
  {
    name: 'id',
    required: true,
    label: 'Id',
    align: 'center',
    field: 'newsTypeId',
    headerStyle: 'width: 200px',
    sortable: true
  }, {
    name: 'name',
    required: true,
    label: 'Имя',
    align: 'center',
    headerStyle: 'width: 500px',
    field: 'type',
    sortable: true
  },
  {
    name: 'icon',
    required: true,
    label: 'Иконка',
    align: 'center',
    headerStyle: 'width: 500px',
    sortable: true
  }
]

const univRequestsColumns = [
  {
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

const semestersMap = [
  {
    label: 'Осенний семестр',
    value: 'AUTUMN'
  },
  {
    label: 'Весенний семестр',
    value: 'SPRING'
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

    const univSelectValue = ref(null);
    const facultySelectValue = ref('');
    const univSelectOptions = ref([]);
    const univFilteredOptions = ref(univSelectOptions.value);
    const facultySelectOptions = ref([]);
    const facultyFilteredOptions = ref(facultySelectOptions.value);
    const creatingGroupName = ref('');
    const groupCreatingSemester = ref('AUTUMN');
    const groupTimeArray = ref(['08:00','09:45','11:30','13:30','15:15','17:00','','']);

    const handleGroupCreating = async (group, semester) => {
      await GroupService.createGroup(group, semester);
    }

    const filterUniversitiesFn = (val, update, abort) => {
      update(() => {
        const needle = val.toLocaleLowerCase();
        if (needle === '') {
          univFilteredOptions.value = univSelectOptions.value;
        } else {
          univFilteredOptions.value = univSelectOptions.value.filter((v) => {
              return v.univName.toLowerCase().includes(needle)
            }
          );
        }
      });
    }

    const filterFacultiesFn = (val, update, abort) => {
      update(() => {
        const needle = val.toLocaleLowerCase();
        if (needle === '') {
          facultyFilteredOptions.value = facultySelectOptions.value;
        } else {
          facultyFilteredOptions.value = facultySelectOptions.value.filter((v) => {
            return v.toLowerCase().includes(needle)
            }
          );
        }
      });
    }

    watch(univSelectValue, async (newValue) => {
      console.log(1)
      try {
        let selectedUnivId;
        if (newValue !== null && (selectedUnivId = newValue.univId)) {
          console.log(2)
          facultySelectOptions.value = await store.dispatch('schedule/getFacNamesByUnivAction', {
            univId: selectedUnivId
          })
          console.log(facultySelectOptions.value)
        }
      } catch (e) {
        univSelectValue.value = null;
      }
    })

    const tab = ref('');
    const newsRows = ref([]);
    const selectedNewsRows = ref([])
    const newsTitle = ref('');
    const newsShortText = ref('');
    const newsImgSrc = ref('');
    const newsSource = ref('');
    const newsText = ref('');
    const changeNewsId = ref(null);
    const editMode = ref(false);

    const handleNewsCreating = async (title, img, shortText, fullText, source, typeId) => {
      try {
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

    const changeSelectedNewsItem = (val) => {
      newsProperty.value = 'newsAdd';
      changeNewsId.value = val.newsId;
      newsTitle.value = val.title;
      newsImgSrc.value = val.imgSrc;
      newsSource.value = val.source;
      newsType.value = val.newsTypesEntity;
      newsShortText.value = val.shortText;
      newsText.value = val.fullText;
      editMode.value = true;
    }

    const handleNewsChange = async (id, newValue) => {
      try {
        await store.dispatch('news/updateNewsEntity', {id, newValue});
        $q.notify({
          color: "green-4",
          textColor: "white",
          icon: "cloud_done",
          message: "Запись успешно обновлена",
        });
      } catch (e) {
        console.log(e)
      }
      editMode.value = false;
    }

    const deleteSelectedNewsRows = async () => {
      if (selectedNewsRows.value.length > 0) {
        for (let selected of selectedNewsRows.value) {
          await NewsService.deleteNewsEntityById(selected.newsId)
        }
        newsRows.value = await NewsService.getNews();
      }
    }


    const newsTypeText = ref('');
    const newsTypeIcon = ref('');
    const newsType = ref(null);
    const newsTypesOptions = ref([]);
    const newsProperty = ref('');
    const newsTypesSelected = ref([]);

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

    const deleteSelectedNewsTypesRows = async () => {
      if (newsTypesSelected.value.length > 0) {
        for (let selected of newsTypesSelected.value) {
          await NewsTypeService.deleteNewsTypeById(selected.newsTypeId)
        }
        newsTypesOptions.value = await NewsTypeService.getNewsTypes();
      }
    }

    onMounted(async () => {
      tab.value = localStorage.getItem("adminCurrentTab");

      newsProperty.value = localStorage.getItem("adminNewsCurrentTab");
      univRequestsRows.value = await UserMessagesService.getUserMessages();

      await store.dispatch('news/downloadAllNews');
      newsRows.value = store.getters['news/getNews'];
      newsTypesOptions.value = await NewsTypeService.getNewsTypes();

      univSelectOptions.value = await store.dispatch('schedule/getUniversitiesNamesAction');
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

    watch(newsProperty, (val) => {
      localStorage.setItem("adminNewsCurrentTab", val)
    });

    return {
      tab,
      semestersMap,
      groupCreatingSemester,
      groupTimeArray,
      univSelectValue,
      univFilteredOptions,
      facultySelectValue,
      facultyFilteredOptions,
      creatingGroupName,
      newsProperty,
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
      changeNewsId,
      editMode,
      newsType,
      newsTypeText,
      newsTypeIcon,
      newsTypesOptions,
      newsTypesSelected,
      newsTypesColumns,
      newsEditorFonts,
      newsToolbar,
      onFailed,
      splitterModel: ref(10),
      apiPath: computed(() => process.env.API),
      handleGroupCreating,
      filterUniversitiesFn,
      filterFacultiesFn,
      deleteSelectedUserMessagesRows,
      deleteSelectedNewsTypesRows,
      handleNewsCreating,
      handleNewsChange,
      changeSelectedNewsItem,
      handleNewsTypeCreating,
      deleteSelectedNewsRows,
      getHeaders,
    }
  }
}
</script>

<style scoped>

.bg-none {
  background-color: rgb(238, 238, 238);
}

.btr-square {
  border-radius: 0;
}

</style>
