<template>
  <q-page>
    <div id="top-adw" :class="customClass('main-row q-mt-sm', 'q-mt-md q-px-sm')" class="q-mb-none" :style="customStyle('min-width: 1250px', '')">
      <q-card square flat class="bg-none">
        <q-card-section class="q-px-none">
          <div id="yandex_rtb_R-A-1273406-3"></div>
        </q-card-section>
      </q-card>

    </div>
    <!--MOBILE-->
    <div class="desktop-hide">
      <div class="q-pa-sm q-mt-none">

        <q-select square borderless outlined v-model="univSelectValue" use-input hide-selected fill-input
                  label="Выберите университет" :options="univFilteredOptions" option-label="univName"
                  @filter="filterUniversitiesFn" transition-show="jump-up" transition-hide="jump-up" bottom-slots>
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
        <q-select style="margin-top: -15px" square borderless outlined v-model="groupSelectValue" use-input
                  hide-selected fill-input label="Выберите группу" :options="groupsFilteredOptions"
                  option-label="groupName" @filter="filterGroupsFn" transition-show="jump-up" transition-hide="jump-up"
                  bottom-slots>
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label v-html="scope.opt.groupName"/>
                <q-item-label caption>{{ scope.opt.faculty }}</q-item-label>
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
      </div>
      <div id="main-schedule-mobile">
        <div class="row justify-center" id="mobile-buttons-week" style="text-align: center">
          <q-btn icon="west" style="width: 10%; font-size: 25px" flat no-caps class=" border-radius-inherit q-mx-sm"
                 color="black"
                 @click="loadPreviousWeekLessons"/>

          <div style="padding-top: 20px" class="q-mx-lg">
            <span>{{ selectedWeek }} неделя, {{ currentWeekType }}</span>
          </div>

          <q-btn icon="east" style="width: 10%; font-size: 25px" flat no-caps class=" border-radius-inherit q-mx-sm"
                 color="black"
                 @click="loadNextWeekLessons"/>
        </div>
        <div class="q-my-lg" style="text-align: center">
        </div>
        <div class="q-my-lg" style="text-align: center">

        </div>

        <div id="schedule-table-mobile" class="q-pa-sm">

          <div class="row q-px-sm" style="width: 100%; margin-bottom: -20px">
            <div style="width: 50%; text-align: left;">
              <q-btn class="" color="black" round flat no-caps icon="today">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="datePickerDate"
                          :options="(date)=>{ return date >= '2020/09/01' && date <= '2100/09/01' }">
                    <div class="row items-center justify-end q-gutter-sm">
                      <q-btn label="Перейти" color="primary" flat @click="changeDateFromDatePicker" v-close-popup/>
                      <q-btn label="Отмена" color="primary" flat v-close-popup/>
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-btn>
            </div>

            <div style="width: 50%; text-align: right;">
              <q-toggle style="font-size: 12px; margin-bottom: -20px;" v-model="rawLessonStringMode"
                        label="Режим без обработки: " left-label/>
            </div>
          </div>


          <ScheduleDayTable class="q-my-lg" :day="'Понедельник'" :date="mondayDate" :rows="mobileMondayTableRows"
                            :rls-mode="rawLessonStringMode"/>
          <ScheduleDayTable class="q-my-lg" :day="'Вторник'" :date="tuesdayDate" :rows="mobileTuesdayTableRows"
                            :rls-mode="rawLessonStringMode"/>
          <ScheduleDayTable class="q-my-lg" :day="'Среда'" :date="wednesdayDate" :rows="mobileWednesdayTableRows"
                            :rls-mode="rawLessonStringMode"/>
          <ScheduleDayTable class="q-my-lg" :day="'Четверг'" :date="thursdayDate" :rows="mobileThursdayTableRows"
                            :rls-mode="rawLessonStringMode"/>
          <ScheduleDayTable class="q-my-lg" :day="'Пятница'" :date="fridayDate" :rows="mobileFridayTableRows"
                            :rls-mode="rawLessonStringMode"/>
          <ScheduleDayTable class="q-my-lg" :day="'Суббота'" :date="saturdayDate" :rows="mobileSaturdayTableRows"
                            :rls-mode="rawLessonStringMode"/>
        </div>

        <q-page-sticky position="bottom-right" :offset="[8, 8]">
          <q-btn @click="legendDialog = true" style="height: 8px; width: 8px;" round icon="menu_book" color="primary"/>
        </q-page-sticky>
        <q-dialog full-width v-model="legendDialog" square>
          <q-card>
            <q-table
              :rows="lessonTypesRows"
              :columns="lessonTypesColumnsMobile"
              row-key="type"
              separator="cell"
              hide-pagination
              flat
              :rows-per-page-options="[15,20]"
            />
          </q-card>
        </q-dialog>
      </div>
    </div>

    <!--DESKTOP-->
    <div class="flex column mobile-hide">
      <div class="column q-pa-lg q-col-gutter-y-md">
        <div class="col-12 content-end" style="padding: 0">
          <div class="">
            <div class="column">
              <div class="row">

                <div class="col-6">
                  <q-select square borderless outlined v-model="univSelectValue" use-input hide-selected fill-input
                            label="Выберите университет"
                            :options="univFilteredOptions"
                            option-label="univName" @filter="filterUniversitiesFn" transition-show="jump-up"
                            transition-hide="jump-up" bottom-slots>
                    <template v-slot:option="scope">
                      <q-item v-bind="scope.itemProps">
                        <q-item-section>
                          <q-item-label v-html="scope.opt.univName"/>
                          <q-item-label caption>{{ scope.opt.city }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                    <q-tooltip max-width="400px" class="text-body2 bg-primary" :delay="2000" transition-show="scale"
                               transition-hide="scale">
                      <div style="text-align: center">
                        Из выпадающего списка выберите ваш университет
                      </div>
                    </q-tooltip>
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">Не найдено</q-item-section>
                      </q-item>
                    </template>
                    <template v-slot:append>
                      <q-icon name="search"/>
                    </template>
                  </q-select>
                </div>

                <div class="col-6">
                  <q-select square borderless outlined v-model="groupSelectValue" use-input hide-selected fill-input
                            label="Выберите группу"
                            :options="groupsFilteredOptions"
                            option-label="groupName" @filter="filterGroupsFn" transition-show="jump-up"
                            transition-hide="jump-up" bottom-slots>
                    <template v-slot:option="scope">
                      <q-item v-bind="scope.itemProps">
                        <q-item-section>
                          <q-item-label v-html="scope.opt.groupName"/>
                          <q-item-label caption>{{ scope.opt.faculty }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                    <q-tooltip max-width="400px" class="text-body2 bg-primary" :delay="2000" transition-show="scale"
                               transition-hide="scale">
                      <div style="text-align: center">
                        Из выпадающего списка выберите вашу группу
                      </div>
                    </q-tooltip>
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">Не найдено</q-item-section>
                      </q-item>
                    </template>
                    <template v-slot:append>
                      <q-icon name="search"/>
                    </template>
                  </q-select>
                </div>
              </div>

              <div class="row main-second">
                <div class="col-3" id="prev-week">
                  <q-btn flat no-caps class="buttons-week" label="❮ Предыдущая неделя"
                         @click="loadPreviousWeekLessons"/>
                </div>
                <div id="nav-date" class="col-6">

                  <q-btn-toggle
                    fab
                    class="buttons-date-numerator"
                    v-model="numeratorButtonsToggle"
                    no-caps
                    unelevated
                    toggle-color="primary"
                    @update:model-value="val => updateNumeratorsButton(val)"
                    :options="[{label: 'Числитель', value: 'NUMERATOR'},{label: 'Знаменатель', value: 'DENOMINATOR'}]"
                  >
                    <q-tooltip max-width="400px" class="text-body2 bg-primary" :delay="1000" transition-show="scale"
                               transition-hide="scale">
                      <div style="text-align: center">
                        Числитель - номер нечетной недели (прим. 1,3,5) Знаменатель - номер четной недели (прим. 2,4,6)
                      </div>
                    </q-tooltip>
                  </q-btn-toggle>
                  <q-btn id="calendar" flat no-caps class="buttons-date" icon="today">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-date v-model="datePickerDate"
                              :options="(date)=>{ return date >= '2020/09/01' && date <= '2100/09/01' }">
                        <div class="row items-center justify-end q-gutter-sm">
                          <q-btn label="Перейти" color="primary" flat @click="changeDateFromDatePicker" v-close-popup/>
                          <q-btn label="Отмена" color="primary" flat v-close-popup/>
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-btn>
                </div>
                <div class="col-3" id="next-week">
                  <q-btn flat no-caps class="buttons-week" label="Следующая неделя ❯" @click="loadNextWeekLessons"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12">
          <q-table style="border-color: #959595;" id="main-table-rasp" flat :rows="scheduleRows"
                   :columns="scheduleColumns" row-key="rowNum"
                   table-colspan="7"
                   :rows-per-page-options="[10,12]" separator="cell" hide-pagination wrap-cells
                   no-data-label="Для отображения расписания выберите группу">
            <template v-slot:body="props">
              <q-tr :props="props" :key="props.row.rowNum">
                <q-td style="border-color: #959595;" id="main-table-rasp-time">{{ props.row.time }}</q-td>
                <q-td style="border-color: #959595;" id="main-table-lesson-cell" v-for="(cell) in props.row.days"
                      :key="cell.day"
                      :style="cell.length !== 0 ? getScheduleCellColor(cell[0], cell.length > 1) : ''">
                  <template v-if="cell.length > 1">
                    <div class="col-12" style="height: 100%;">
                      <q-list style="height: 100%">
                        <q-item style="border-color: #959595;" id="main-table-before-cell"
                                :style="getScheduleCellColor(cell[0])">
                          {{ rawLessonStringMode ? cell[0].rawLessonString : cell[0].name }}
                        </q-item>
                        <q-separator/>
                        <q-item style="border-color: #959595;" id="main-table-after-cell"
                                :style="getScheduleCellColor(cell[1])">
                          {{ rawLessonStringMode ? cell[1].rawLessonString : cell[1].name }}
                        </q-item>
                      </q-list>
                    </div>
                  </template>
                  <template v-else-if="cell.length !== 0">
                    {{ rawLessonStringMode ? cell[0].rawLessonString : cell[0].name }}
                  </template>
                </q-td>
              </q-tr>
            </template>

            <template v-slot:header="props">
              <q-th style="border-color: #959595; border-top: 1px solid #959595">{{ props.cols[0].label }}</q-th>
              <q-th style="border-color: #959595; border-top: 1px solid #959595">{{
                  props.cols[1].label
                }}<br>{{ mondayDate }}
              </q-th>
              <q-th style="border-color: #959595; border-top: 1px solid #959595">{{
                  props.cols[2].label
                }}<br>{{ tuesdayDate }}
              </q-th>
              <q-th style="border-color: #959595; border-top: 1px solid #959595">{{
                  props.cols[3].label
                }}<br>{{ wednesdayDate }}
              </q-th>
              <q-th style="border-color: #959595; border-top: 1px solid #959595">{{
                  props.cols[4].label
                }}<br>{{ thursdayDate }}
              </q-th>
              <q-th style="border-color: #959595; border-top: 1px solid #959595">{{
                  props.cols[5].label
                }}<br>{{ fridayDate }}
              </q-th>
              <q-th style="border-color: #959595; border-top: 1px solid #959595">{{
                  props.cols[6].label
                }}<br>{{ saturdayDate }}
              </q-th>
            </template>

            <template v-slot:top class="row justify-between items-center">
              <div class="col-12 row rasp-title">
                <div class="col-4 q-table__title">{{ title }}</div>
                <div class="col-4" id="selected-week"> {{ selectedWeek }} неделя, {{ currentWeekType }}</div>
                <div class="col-4" id="rawLessonStringMode">
                  <q-icon size="1.3rem" class="q-mr-sm" name="help_outline">
                    <q-tooltip max-width="400px" class="text-body2 bg-primary" transition-show="scale"
                               transition-hide="scale">
                      <div style="text-align: center">
                        Данный режим отображает занятия также, как они выглядят в файле расписания, без форматирования
                      </div>
                    </q-tooltip>
                  </q-icon>
                  <q-toggle v-model="rawLessonStringMode" label="Режим без обработки: " left-label/>
                </div>
              </div>

            </template>
          </q-table>
        </div>
        <div class="col-12">
          <q-expansion-item
            @after-show="scrollToElement('footer')"
            label="Цветовые обозначения типов занятий"
            id="lessons-type-info"
          >
            <q-table
              :rows="lessonTypesRows"
              :columns="lessonTypesColumns"
              row-key="type"
              separator="cell"
              hide-pagination
              flat
              :rows-per-page-options="[15,20]"
              id="lessons-type-table"
            />
          </q-expansion-item>
        </div>
      </div>
    </div>
  </q-page>
  <div><img src="https://mc.yandex.ru/watch/84689620" style="position:absolute; left:-9999px;" alt=""/></div>
  <div id="footer"></div>
</template>

<script>
import {onMounted, ref, watch} from "vue";
import {useStore} from "vuex";
import {
  getDateOfMonday,
  getDateString,
  getNumberOfWeek,
  getScheduleCellColor,
  getTableRowsFromLessons,
  getTypeOfWeek,
  getTableRowsFromLessonsMobile
} from "../composables/schedule/ScheduleTable"
import ModalWindow from "components/ModalWindow";
import ScheduleDayTable from "components/mobile/ScheduleDayTable";
import {useMeta} from 'quasar'
import {customClass, customStyle} from "src/services/other/tools";

const meta = {
  title: 'Расписание - GISTUD',
  script: {
    yandexMetrika: {
      type: 'application/javascript',
      innerHTML: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");ym(84689620, "init", {clickmap:true,trackLinks:true,accurateTrackBounce:true});
                  window.yaContextCb.push(()=>{Ya.Context.AdvManager.render({renderTo: 'yandex_rtb_R-A-1273406-3', blockId: 'R-A-1273406-3'})})
    `
    }
  },
  meta: {
    description: {
      name: 'description',
      content: 'Расписание занятий - GISTUD | Удобная информация вашего университета: студенческие новости, расписание и многое другое'
    },
    keywords: {
      name: 'keywords',
      content: 'расписание, информационный сервис, студенты, студенческий сервис, вуз, университет, РФ, Россия, gistud'
    },
  }

}

const scheduleColumns = [
  {
    name: 'time',
    label: 'Время',
    align: 'center',
    headerStyle: 'width: 120px;',
  },
  {
    name: 'monday',
    label: 'Понедельник',
    align: 'center',
    headerStyle: 'width: 250px;',
  },
  {
    name: 'tuesday',
    label: 'Вторник',
    align: 'center',
    headerStyle: 'width: 250px;',
  },
  {
    name: 'wednesday',
    label: 'Среда',
    align: 'center',
    headerStyle: 'width: 250px;',
  },
  {
    name: 'thursday',
    label: 'Четверг',
    align: 'center',
    headerStyle: 'width: 250px;',
  },
  {
    name: 'friday',
    label: 'Пятница',
    align: 'center',
    headerStyle: 'width: 250px;',
  },
  {
    name: 'saturday',
    label: 'Суббота',
    align: 'center',
    headerStyle: 'width: 250px;',
  }
]

const lessonTypesColumns = [
  {
    name: 'color',
    label: 'Цветовое обозначение',
    align: 'center',
    field: 'example',
    headerStyle: 'width: 160px',
    style: row => row.color + 'width: 160px'
  },
  {
    name: 'type',
    label: 'Тип занятия',
    align: 'left',
    field: 'type'
  }
]
const lessonTypesColumnsMobile = [
  {
    name: 'color',
    label: 'Цвет',
    align: 'center',
    field: 'example',
    headerStyle: 'width: 40px',
    style: row => row.color + 'width: 40px'
  },
  {
    name: 'type',
    label: 'Тип занятия',
    align: 'left',
    field: 'type'
  }
]

const lessonTypesRows = [
  {
    color: 'background-color: rgba(204,220,236,0.9);',
    type: 'Лабораторная работа'
  },
  {
    color: 'background-color: rgba(213,218,175,0.9);',
    type: 'Лекция'
  },
  {
    color: 'background-color: rgba(248,201,201,0.9);',
    type: 'Практика'
  },
  {
    color: 'background-color: rgba(41, 58, 128, 0.4);',
    type: 'Физическая культура'
  },
  {
    color: 'background-color: rgba(201,177,222,0.9);',
    type: 'Иностранный язык'
  },
  {
    color: 'background-color: rgba(195,236,198,0.9);',
    type: 'Лекция и лабораторная работа'
  },
  {
    color: 'background-color: rgba(253,237,185,0.9);',
    type: 'Практика и лекция'
  },
  {
    color: 'background-color: rgba(191,253,222,0.9);',
    type: 'Лабораторная работа и практика'
  },
  {
    color: 'background-color:  rgba(203,182,155,0.9);',
    type: 'Военная подготовка'
  },
  {
    color: 'background-color:  rgba(227,176,0,0.4);',
    type: 'Переезд',
  }
]

function formatDate(date) {
  let dd = date.getDate();
  if (dd < 10) dd = '0' + dd;
  let mm = date.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;
  let yy = date.getFullYear();
  return yy + '/' + mm + '/' + dd;
}

function scrollToElement(el) {
  const element = document.getElementById(el);
  element.scrollIntoView({behavior: "smooth"});
}

export default {
  name: 'GroupSelectingLayout',
  components: {
    // ModalWindow,
    ScheduleDayTable
  },
  props: {
    univName: {
      type: String,
      default: null
    }
  },
  setup(props) {
    const store = useStore();
    useMeta(() => meta);

    //Group selecting start
    const groupSelectValue = ref(null);
    const univSelectValue = ref(null);
    const univSelectOptions = ref([]);
    const univFilteredOptions = ref(univSelectOptions.value);
    const groupsSelectOptions = ref([]);
    const groupsFilteredOptions = ref(groupsSelectOptions.value);

    const mobileMondayTableRows = ref([]);
    const mobileTuesdayTableRows = ref([]);
    const mobileWednesdayTableRows = ref([]);
    const mobileThursdayTableRows = ref([]);
    const mobileFridayTableRows = ref([]);
    const mobileSaturdayTableRows = ref([]);
    const legendDialog = ref(false);

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

    const filterGroupsFn = (val, update, abort) => {
      update(() => {
        const needle = val.toLocaleLowerCase();
        if (needle === '') {
          groupsFilteredOptions.value = groupsSelectOptions.value;
        } else {
          groupsFilteredOptions.value = groupsSelectOptions.value.filter((v) => {
              return v.groupName.toLowerCase().includes(needle)
            }
          );
        }
      });
    }

    const loadGroupSchedule = async (val) => {
      try {
        if (val !== null && val.groupName !== '') {
          const selectedGroupId = val.groupId;
          const selectedGroup = await store.dispatch('schedule/getGroupById', {
            grId: selectedGroupId,
          });
          title.value = 'Расписание группы ' + selectedGroup.name + " (" + selectedGroup.universityEntity.name + ")";
          localStorage.setItem('lastLoadedGroup', JSON.stringify(val));
          scheduleRows.value = getTableRowsFromLessons(selectedGroup.lessons, selectedWeek.value);
          mobileMondayTableRows.value = getTableRowsFromLessonsMobile(selectedGroup.lessons, selectedWeek.value, 'MONDAY');
          mobileTuesdayTableRows.value = getTableRowsFromLessonsMobile(selectedGroup.lessons, selectedWeek.value, 'TUESDAY');
          mobileWednesdayTableRows.value = getTableRowsFromLessonsMobile(selectedGroup.lessons, selectedWeek.value, 'WEDNESDAY');
          mobileThursdayTableRows.value = getTableRowsFromLessonsMobile(selectedGroup.lessons, selectedWeek.value, 'THURSDAY');
          mobileFridayTableRows.value = getTableRowsFromLessonsMobile(selectedGroup.lessons, selectedWeek.value, 'FRIDAY');
          mobileSaturdayTableRows.value = getTableRowsFromLessonsMobile(selectedGroup.lessons, selectedWeek.value, 'SATURDAY');
        } else {
          title.value = '';
          console.log('Find deleted group');
        }
      } catch (e) {
        localStorage.removeItem("lastLoadedGroup");
        groupSelectValue.value = null;
      }

    }
    //Group selecting end

    //Schedule table start
    const rawLessonStringMode = ref(null)
    const scheduleRows = ref([]);
    const title = ref('');
    const selectedDate = ref(null);
    const selectedWeek = ref(null);
    const mondayDate = ref('');
    const tuesdayDate = ref('');
    const wednesdayDate = ref('');
    const thursdayDate = ref('');
    const fridayDate = ref('');
    const saturdayDate = ref('');
    const currentWeekType = ref('');
    const currentWeekNumber = ref(null);
    const datePickerDate = ref(formatDate(new Date()));
    const numeratorButtonsToggle = ref(null);

    const updateHeadersDates = (date) => {
      if (date !== null) {
        let tempDate = getDateOfMonday(new Date(date));
        mondayDate.value = getDateString(tempDate);
        tempDate.setDate(tempDate.getDate() + 1);

        tuesdayDate.value = getDateString(tempDate);
        tempDate.setDate(tempDate.getDate() + 1);

        wednesdayDate.value = getDateString(tempDate);
        tempDate.setDate(tempDate.getDate() + 1);

        thursdayDate.value = getDateString(tempDate);
        tempDate.setDate(tempDate.getDate() + 1);

        fridayDate.value = getDateString(tempDate);
        tempDate.setDate(tempDate.getDate() + 1);

        saturdayDate.value = getDateString(tempDate);
        tempDate.setDate(tempDate.getDate() + 1);
      }
    }

    const incrementWeek = (incrementValue) => {
      let tempDate = new Date(selectedDate.value);
      tempDate.setDate(tempDate.getDate() + (7 * incrementValue));
      //selected date watcher setting the week value after updating date
      selectedDate.value = tempDate;
    }

    const decrementWeek = (decrementValue) => {
      let tempDate = new Date(selectedDate.value);
      tempDate.setDate(tempDate.getDate() - (7 * decrementValue));
      //selected date watcher setting the week value after updating date
      selectedDate.value = tempDate;
    }

    const updateNumeratorsButton = (val) => {
      if (selectedWeek.value !== 0) {
        const currentWeekType = getTypeOfWeek(selectedWeek.value);

        if (currentWeekType === 'NUMERATOR' && val === 'DENOMINATOR') {
          incrementWeek(1);
        }
        if (currentWeekType === 'DENOMINATOR' && val === 'NUMERATOR') {
          decrementWeek(1);
        }
      }
    }

    const loadNextWeekLessons = () => {
      incrementWeek(1);
    }

    const loadPreviousWeekLessons = () => {
      decrementWeek(1);
    }

    const changeDateFromDatePicker = () => {
      selectedDate.value = getDateOfMonday(new Date(datePickerDate.value));
    }

    watch(rawLessonStringMode, (newValue) => {
      localStorage.setItem('rawLessonStringMode', newValue)
    })

    watch(selectedWeek, (newValue) => {
      const date = selectedDate.value;
      //const date = getDateOfMonday(new Date(2020,10, 23))
      if (date !== null) {
        updateHeadersDates(date);

        numeratorButtonsToggle.value = getTypeOfWeek(newValue);
        currentWeekType.value = getTypeOfWeek(newValue) === 'NUMERATOR' ? 'числитель' : 'знаменатель';
        const selectedGroup = store.getters['schedule/getSelectedGroup'];
        if (selectedGroup.lessons) {
          scheduleRows.value = getTableRowsFromLessons(selectedGroup.lessons, newValue)
          mobileMondayTableRows.value = getTableRowsFromLessonsMobile(selectedGroup.lessons, newValue, 'MONDAY');
          mobileTuesdayTableRows.value = getTableRowsFromLessonsMobile(selectedGroup.lessons, newValue, 'TUESDAY');
          mobileWednesdayTableRows.value = getTableRowsFromLessonsMobile(selectedGroup.lessons, newValue, 'WEDNESDAY');
          mobileThursdayTableRows.value = getTableRowsFromLessonsMobile(selectedGroup.lessons, newValue, 'THURSDAY');
          mobileFridayTableRows.value = getTableRowsFromLessonsMobile(selectedGroup.lessons, newValue, 'FRIDAY');
          mobileSaturdayTableRows.value = getTableRowsFromLessonsMobile(selectedGroup.lessons, newValue, 'SATURDAY');
        }
      }
    })

    watch(univSelectValue, async (newValue) => {
      try {
        let selectedUnivId;
        if (newValue !== null && (selectedUnivId = newValue.univId)) {
          groupsSelectOptions.value = await store.dispatch('schedule/getGroupNamesByUnivAction', {
            univId: selectedUnivId
          })
          localStorage.setItem('lastLoadedUniv', JSON.stringify(newValue));
        }
      } catch (e) {
        localStorage.removeItem("lastLoadedUniv");
        univSelectValue.value = null;
      }

    })

    watch(groupSelectValue, (newValue) => {
      loadGroupSchedule(newValue)
    });

    watch(selectedDate, (newValue) => {
      if (newValue !== null) {
        localStorage.setItem('selectedDate', newValue.toString())
        selectedWeek.value = getNumberOfWeek(newValue);
      }
    })


    //Schedule table end

    onMounted(async () => {
      univSelectOptions.value = await store.dispatch('schedule/getUniversitiesNamesAction');

      let rlsMode = localStorage.getItem('rawLessonStringMode');
      let dateFromStorage = new Date(localStorage.getItem('selectedDate'));
      let lastLoadedUniv = localStorage.getItem('lastLoadedUniv');
      let lastLoadedGroup = localStorage.getItem('lastLoadedGroup');

      if (rlsMode === 'true') {
        rawLessonStringMode.value = true;
      } else {
        rawLessonStringMode.value = false;
        localStorage.setItem('rawLessonStringMode', 'false');
      }

      if (dateFromStorage !== null) {
        let currentDate = getDateOfMonday(new Date());
        if (dateFromStorage < currentDate) {
          selectedDate.value = currentDate;
        } else {
          selectedDate.value = dateFromStorage;
        }
      } else {
        selectedDate.value = getDateOfMonday(new Date());
      }

      if ((typeof lastLoadedUniv !== 'undefined') && lastLoadedUniv !== null) {
        univSelectValue.value = JSON.parse(lastLoadedUniv);
      }
      if ((typeof lastLoadedGroup !== 'undefined') && lastLoadedGroup !== null) {
        groupSelectValue.value = JSON.parse(lastLoadedGroup);
      }

      const univNameFromPath = props.univName;
      if (univNameFromPath !== null) {
        for (const univObject of univSelectOptions.value) {
          if (univObject.univName === univNameFromPath) {
            univSelectValue.value = univObject;
          }
        }
      }
    });

    return {
      univFilteredOptions,
      groupsFilteredOptions,
      groupSelectValue,
      univSelectValue,
      scheduleColumns,
      scheduleRows,
      title,
      mondayDate,
      tuesdayDate,
      wednesdayDate,
      thursdayDate,
      fridayDate,
      saturdayDate,
      currentWeekType,
      currentWeekNumber,
      rawLessonStringMode,
      datePickerDate,
      selectedWeek,
      splitterRatio: ref(50),
      numeratorButtonsToggle,
      lessonTypesColumns,
      lessonTypesColumnsMobile,
      lessonTypesRows,
      mobileMondayTableRows,
      mobileTuesdayTableRows,
      mobileWednesdayTableRows,
      mobileThursdayTableRows,
      mobileFridayTableRows,
      mobileSaturdayTableRows,
      filterUniversitiesFn,
      filterGroupsFn,
      loadGroupSchedule,
      updateNumeratorsButton,
      loadNextWeekLessons,
      loadPreviousWeekLessons,
      changeDateFromDatePicker,
      getScheduleCellColor,
      scrollToElement,
      legendDialog,
      customStyle,
      customClass,
    };
  },
};
</script>

<style lang="css" scoped>
@import 'src/css/style.css';

.bg-none {
  background-color: rgb(238, 238, 238);
}

.border {
  border: 1px solid black;
}

#top-adw {
  margin-bottom: 10px;
}

.main-row {
  padding-right: 24px;
  padding-left: 24px;

}
</style>
