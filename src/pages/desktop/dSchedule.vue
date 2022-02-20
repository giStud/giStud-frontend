<template>
  <q-page>
    <q-card id="MAIN-PAGE" class="bg-none q-ma-none" flat square>
      <q-card id="REKLAMA" class="center-all page-width" flat>
        <div id="yandex_rtb_R-A-1296363-4"></div>
      </q-card>

      <q-card id="SCHEDULE-SELECT" class="row justify-center items-center center-all page-width" flat>
        <q-card id="SELECT-U" class="fix-pa">
          <q-select v-model="univSelectValue" :options="univFilteredOptions" borderless bottom-slots class="select-ug"
                    fill-input hide-selected
                    label="Выберите университет"
                    option-label="univName"
                    outlined transition-hide="jump-up" transition-show="jump-up"
                    use-input @filter="filterUniversitiesFn"
                    @update:model-value="groupSelectValue = null;">
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
        </q-card>
        <q-card>
          <q-select v-model="groupSelectValue" :options="groupsFilteredOptions" borderless bottom-slots
                    class="select-ug" fill-input hide-selected
                    label="Выберите группу"
                    option-label="groupName"
                    outlined transition-hide="jump-up" transition-show="jump-up"
                    use-input @filter="filterGroupsFn">
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
        </q-card>
      </q-card>
      <q-card id="SCHEDULE-NAVIGATION" class="center-all justify-center items-center page-width fix-pa">
        <q-card class="t-center" style="font-size: 16px; margin-top: -25px">{{ selectedWeek }} неделя,
          {{ weekTypeText }}
        </q-card>

        <q-card id="schedule-nav-btn" class="row center-all justify-between items-center fix-pa">
          <div>
            <q-btn :disable="selectedWeek <= 1" class="buttons-week" flat label="❮ Предыдущая неделя" no-caps
                   rounded @click="loadPreviousWeekLessons"/>

          </div>
          <div>
            <q-btn class="buttons-date q-mx-sm" flat icon="settings" no-caps rounded @click="settingsDialog = true">
              <q-dialog v-model="settingsDialog" v-close-popup>
                <q-card>
                  <q-card-section>
                    <span>Настройки</span>
                  </q-card-section>
                  <q-separator/>
                  <q-card-section>
                    <q-toggle v-model="rawLessonStringMode" :color="theme('primary','white')"
                              label="Режим без обработки: " left-label/>
                  </q-card-section>
                </q-card>
              </q-dialog>
            </q-btn>
            <q-btn
              :class="currentWeekType === 'NUMERATOR' ? theme('btn-selected-schedule-l', 'btn-selected-schedule-d') : theme('text-grey', 'text-grey')"
              class="btn-select-schedule" flat :label="firstWeekButtonToggleName" no-caps
              outline style="width: 120px" @click="toggleWeekBtn('NUMERATOR')"/>

            <q-btn
              :class="currentWeekType === 'DENOMINATOR' ? theme('btn-selected-schedule-l', 'btn-selected-schedule-d') : theme('text-grey', 'text-grey')"
              class="btn-select-schedule q-mx-sm" flat :label="secondWeekButtonToggleName" no-caps
              outline style="width: 120px" @click="toggleWeekBtn('DENOMINATOR')"/>

            <q-btn id="calendar" class="buttons-date" flat icon="today" no-caps rounded>
              <q-popup-proxy transition-hide="scale" transition-show="scale">
                <q-date v-model="datePickerDate"
                        :options="(date)=>{ return date >= '2020/09/01' && date <= '2100/09/01' }">
                  <div class="row items-center justify-end q-gutter-sm">
                    <q-btn v-close-popup color="primary" flat label="Перейти" @click="changeDateFromDatePicker"/>
                    <q-btn v-close-popup color="primary" flat label="Отмена"/>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-btn>
          </div>
          <div>
            <q-btn class="buttons-week" flat label="Следующая неделя ❯" no-caps rounded @click="loadNextWeekLessons"/>
          </div>
        </q-card>

      </q-card>

      <q-card id="MAIN-TABLE" class="center-all justify-center items-center page-width">
        <q-card class="center-all t-center justify-center items-start row fix-py" flat>
          <q-item id="hidden-span-calc" :class="theme('bg-cell-schedule-l', 'bg-cell-schedule-d')"
                  :style="setSquareCellSchedule(columnWidth)" class="t-center q-pa-none pd-cell-around mg-b-inside"
                  style="position:absolute; left:-9999px;">
            <q-card class="max-width-schedule q-pa-none bg-none" flat square>
              <q-card-section :style="getScheduleCellColor(0)" class="q-pa-none font-size-cell time-cell-inside-border">
                <span>00.00 - 00.00</span>
              </q-card-section>
              <q-card-section class="q-pa-none lesson-text font-size-cell q-mt-sm">
                <!--                <span class="lesson-content-schedule">лаб.9 нед. Технология бетона, стр. изделий и конструкций - 2 п/гПРОФ. ПЕРЦЕВ В.Т. а.6163 Теплотехническое оборудование в технологии стр. материалов - 1 п/г ДОЦ. ЧЕРКАСОВ С.В. - а.6171</span>-->
                <span class="lesson-content-schedule">{{ getLessonStringDebug(scheduleInfo.maxLesson) }}</span>
              </q-card-section>
            </q-card>
          </q-item>
          <q-item id="hidden-span-double-calc" :class="theme('bg-cell-schedule-l', 'bg-cell-schedule-d')"
                  :style="setSquareCellSchedule(columnWidth)" class="t-center q-pa-none pd-cell-around mg-b-inside"
                  style="position:absolute; left:-9999px;">
            <q-card class="q-pa-none max-width-schedule bg-none" flat square>
              <q-card-section :style="getScheduleCellColor(0)"
                              class="q-pa-none q-mb-sm font-size-cell time-cell-inside-border">
                <span>00.00 - 00.00</span>
              </q-card-section>
              <q-card-section class="q-pa-none font-size-cell q-mt-sm" lines="4">
                <div class="lesson-text">
                  <span>{{ getLessonStringDebug(scheduleInfo.maxLessonDouble) }}</span>
                  <!--                  <span>лаб.9 нед. Технология бетона, стр. изделий и конструкций - 2 п/гПРОФ. ПЕРЦЕВ В.Т. а.6163 Теплотехническое оборудование в технологии стр. материалов - 1 п/г ДОЦ. ЧЕРКАСОВ С.В. - а.6171</span>-->
                </div>
              </q-card-section>
              <q-card-section class="q-pa-none">
              </q-card-section>
            </q-card>
          </q-item>

          <template v-for="(dayColumn, columnIndex) in scheduleInfo.daysArray" :key="dayColumn">
            <q-list :style="setSquareCellSchedule(columnWidth)" class="q-list-cell-schedule">
              <span style="font-weight: bold; font-size: 16px">{{ getFullDayWeekString(dayColumn.day) }} </span>
              <br>
              <span style="font-size: 14px">{{ datesArray[columnIndex] }}</span>
              <template v-for="(lesson, rowIndex) in dayColumn.lessons" :key="lesson">

                <template v-if="lesson.value.length === 1 || lesson.value.length === 0">
                  <!--       ОБЫЧНАЯ ПАРА           -->
                  <q-item :class="theme('bg-cell-schedule-l', 'bg-cell-schedule-d')"
                          :style="setHeightCellSchedule(scheduleInfo.twinRows, rowIndex)"
                          class="t-center q-pa-none pd-cell-around mg-b-inside" clickable
                          @click="openLessonInfo(lesson.value[0], lesson.time, datesArray[columnIndex], (rowIndex + 1))"
                  >
                    <q-card class="max-width-schedule q-pa-none bg-none" flat square>
                      <q-card-section :style="getScheduleCellColor(lesson.value[0])"
                                      class="q-pa-none font-size-cell time-cell-inside-border">
                        <q-chip
                          v-if="isCurrentLessonGoes(selectedWeek, lesson.value[0], lesson.time.lessonBeginTime, lesson.time.lessonFinishTime)"
                          class="q-my-none q-py-none chip-current-lesson-schedule" color="red" icon="alarm"
                          label="Идёт сейчас" outline square text-color="white">
                        </q-chip>
                        <span v-else>{{ lesson.time.lessonBeginTime }} - {{ lesson.time.lessonFinishTime }}</span>
                      </q-card-section>

                      <q-card-section v-if="isEmptyLesson(lesson)" class="q-pa-none lesson-text font-size-cell q-mt-sm">
                        <span class="lesson-content-schedule">Нет занятий</span>
                      </q-card-section>
                      <q-card-section v-else-if="lesson.value.length === 1" id="default-lesson"
                                      class="q-pa-none lesson-text font-size-cell q-mt-sm">
                        <span class="lesson-content-schedule">{{ getLessonString(lesson.value[0]) }}</span>
                      </q-card-section>
                    </q-card>
                  </q-item>
                </template>

                <template v-else-if="lesson.value.length === 2">
                  <q-item v-for="(les) in lesson.value" :key="les"
                          :class="theme('bg-cell-schedule-l', 'bg-cell-schedule-d')"
                          :style="'height:' + ((doubleCellHeight-4)/2) + 'px'"
                          class="t-center q-pa-none pd-cell-around mg-b-inside" clickable
                          @click="openLessonInfo(les, lesson.time, datesArray[columnIndex], (rowIndex + 1))">
                    <q-card class="q-pa-none max-width-schedule bg-none" flat square>
                      <q-card-section :style="getScheduleCellColor(les)"
                                      class="q-pa-none q-mb-sm font-size-cell time-cell-inside-border">
                        <q-chip
                          v-if="isCurrentLessonGoes(selectedWeek, les, lesson.time.lessonBeginTime, lesson.time.lessonFinishTime)"
                          class="q-my-none q-py-none chip-current-lesson-schedule" color="red" icon="alarm"
                          label="Идёт сейчас" outline square text-color="white">
                        </q-chip>
                        <span v-else>{{ lesson.time.lessonBeginTime }} - {{ lesson.time.lessonFinishTime }}</span>
                      </q-card-section>
                      <q-card-section class="q-pa-none font-size-cell q-mt-sm" lines="4">
                        <div id="top-lesson-text" class="lesson-text">
                          <span>{{ getLessonString(les) }}</span>
                        </div>
                      </q-card-section>
                    </q-card>
                  </q-item>
                </template>
              </template>
            </q-list>
          </template>

          <q-dialog v-model="lessonInfoDialog" @hide="editMode = false">
            <template v-if="!editMode">
              <q-card id="dialog-add-info-schedule" class="q-pa-sm" style="max-width: 1024px;">
                <q-card-section class="row q-pa-none q-px-sm q-ma-none items-center" style="height: 50px;">
                  <q-btn v-close-popup dense flat icon="arrow_back" size="md"/>
                  <span class="title-page-dialog q-px-md">Информация о занятии</span>
                  <q-space/>
                  <template v-if="isAdmin">
                    <q-btn flat icon="edit" size="sm" @click="openEditModeDialog(lessonInfoObject)"/>
                  </template>
                </q-card-section>
                <q-separator class="q-mb-sm"/>
                <template v-if="lessonInfoObject.type">
                  <q-card-section :style="getTypeColorByValue(lessonInfoObject.type)">
                    <span>Тип: {{ getTypeNameByValue(lessonInfoObject.type) }}</span>
                  </q-card-section>
                </template>
                <q-card-section>
                  <span>День: {{ lessonInfoObject.day }}, {{ lessonInfoObject.dateString }}, {{ selectedWeek }} неделя, {{
                      weekTypeText
                    }}</span>
                </q-card-section>
                <q-card-section :style="theme('background-color: rgb(240,242,245)','background-color: rgb(74,79,87')">
                  <span>Время: {{ lessonInfoObject.timeString }}</span>
                  <span v-if="lessonInfoObject.isGoingNow" :class="theme('text-red', '')"> (Идёт сейчас)</span>
                </q-card-section>
                <q-card-section>
                  <span>Номер занятия: {{ lessonInfoObject.numberOfLesson }}</span>
                </q-card-section>
                <q-card-section :style="theme('background-color: rgb(240,242,245)','background-color: rgb(74,79,87')">
                  <span v-if="lessonInfoObject.lessonText.length> 0">Название: {{ lessonInfoObject.lessonText }}</span>
                  <span v-else>Нет занятия</span>
                </q-card-section>
              </q-card>
            </template>
            <template v-else>
              <q-card class="full-width" flat>
                <q-card-section>
                  <q-option-group
                    v-model="editLessonSemesterType"
                    :options="semestersMap"
                    color="primary"
                    inline
                  />
                </q-card-section>
                <q-card-section>
                  <q-input v-model="editLessonName" label="Обработанное занятие"></q-input>
                </q-card-section>
                <q-card-section>
                  <q-input v-model="editRawLessonString" label="Необработанное занятие"></q-input>
                </q-card-section>
                <q-card-section>
                  <q-input v-model="editLessonAudience" label="Аудитория"/>
                </q-card-section>
                <q-card-section>
                  <q-input v-model="editLessonStartTime" :rules="['time']" filled label="Время начала пары" mask="time">
                    <template v-slot:append>
                      <q-icon class="cursor-pointer" name="access_time">
                        <q-popup-proxy transition-hide="scale" transition-show="scale">
                          <q-time v-model="editLessonStartTime">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup color="primary" flat label="Close"/>
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </q-card-section>
                <q-card-section>
                  <q-input v-model="editLessonFinishTime" :rules="['time']" filled label="Время конца пары" mask="time">
                    <template v-slot:append>
                      <q-icon class="cursor-pointer" name="access_time">
                        <q-popup-proxy transition-hide="scale" transition-show="scale">
                          <q-time v-model="editLessonFinishTime">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup color="primary" flat label="Close"/>
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </q-card-section>
                <q-card-section>
                  <q-select
                    v-model="editLessonDay"
                    :options="dayMap"
                    emit-value
                    filled
                    label="День"
                    map-options
                  />
                </q-card-section>
                <q-card-section>
                  <q-select
                    v-model="editLessonNumerator"
                    :options="numeratorMap"
                    emit-value
                    filled
                    label="Числитель"
                    map-options
                  />
                </q-card-section>
                <q-card-section>
                  <q-select
                    v-model="editLessonType"
                    :options="lessonTypes"
                    emit-value
                    filled
                    label="Тип занятия"
                    option-label="typeName"
                  />
                </q-card-section>
                <q-card-section v-if="editLessonNumerator === 'CUSTOM'">
                  <q-select
                    v-model="editLessonSelectedWeeks"
                    :options="editLessonWeeksOptions"
                    filled
                    label="Недели"
                    multiple
                  />
                </q-card-section>
                <q-card-actions>
                  <q-btn flat no-caps
                         @click="handleLessonChanging({editLessonSemesterType,editLessonName, editRawLessonString, editLessonStartTime, editLessonFinishTime, editLessonDay, editLessonAudience, editLessonType, editLessonNumerator, editLessonSelectedWeeks})">
                    Сохранить
                  </q-btn>
                  <q-btn flat no-caps @click="editMode = false">Отмена</q-btn>
                  <q-btn flat icon="delete" @click="handleLessonDeleting"/>
                </q-card-actions>
              </q-card>
            </template>
          </q-dialog>
        </q-card>
      </q-card>

    </q-card>
  </q-page>
</template>

<script>
import {computed, onBeforeUnmount, onMounted, ref, toRefs, watch} from "vue";
import {
  getDateOfMonday,
  getDateString,
  getNumberOfWeek,
  getScheduleCellColor,
  getScheduleInfoByWeekDesktop,
  getTypeOfWeek,
  isCurrentLessonGoes,
  getFullDayWeekString,
  getTypeColorByValue,
  getTypeNameByValue,
  getLessonNumeratorByWeeks,
  getWeeksArrayByLessons, getMonthStringByDate,
  isSelectedUnivEgu
} from "src/composables/schedule/ScheduleTable";
import LessonService from 'src/services/schedule/lessonService'
import GroupService from 'src/services/schedule/groupsService'
import UniversityService from 'src/services/schedule/universityService'
import {useStore} from "vuex";
import {theme} from "src/services/other/tools";
import {useMeta} from "quasar";

function formatDate(date) {
  let dd = date.getDate();
  if (dd < 10) dd = '0' + dd;
  let mm = date.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;
  let yy = date.getFullYear();
  return yy + '/' + mm + '/' + dd;
}

const dayMap = [
  {
    label: 'Понедельник',
    value: 'MONDAY'
  },
  {
    label: 'Вторник',
    value: 'TUESDAY'
  },
  {
    label: 'Среда',
    value: 'WEDNESDAY'
  },
  {
    label: 'Четверг',
    value: 'THURSDAY'
  },
  {
    label: 'Пятница',
    value: 'FRIDAY',
  },
  {
    label: 'Суббота',
    value: 'SATURDAY',
  },
  {
    label: 'Воскресенье',
    value: 'SUNDAY',
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

const meta = {
  title: 'Расписание - GISTUD',
  script: {
    yandex: {
      type: 'application/javascript',
      innerHTML: `window.yaContextCb.push(()=>{ Ya.Context.AdvManager.render({ renderTo: 'yandex_rtb_R-A-1296363-4', blockId: 'R-A-1296363-4' }) })`
    }
  },
  meta: {
    description: {
      name: 'description',
      content: 'Расписание - GISTUD | Удобная информация вашего университета: студенческие новости, расписание и многое другое'
    },
    keywords: {
      name: 'keywords',
      content: 'расписание, информационный сервис, студенты, студенческий сервис, вуз, университет, РФ, Россия, gistud'
    },
  }
}

export default {
  name: "dSchedule",
  props: {
    univId: {
      type: String,
      default: null
    },
    grId: {
      type: String,
      default: null
    }
  },
  setup(props) {
    useMeta(() => meta);
    const store = useStore();
    const isAdmin = ref(computed(() => store.getters['auth/isAdmin']));
    const lessonTypes = ref([]);
    const lessonsToEditArray = ref([]);
    const editLessonSemesterType = ref('AUTUMN');
    const editMode = ref(false);
    const editLessonName = ref('');
    const editRawLessonString = ref('');
    const editLessonStartTime = ref('');
    const editLessonFinishTime = ref('');
    const editLessonType = ref(null);
    const editLessonAudience = ref('');
    const editLessonNumerator = ref('FULL');
    const editLessonDay = ref('');
    const editLessonSelectedWeeks = ref([]);
    const editLessonWeeksOptions = ref([]);
    const lessonInfoObject = ref({});
    const lessonInfoDialog = ref(false);
    const settingsDialog = ref(false);


    const openLessonInfo = (lesson, time, lessonDate, numberOfLesson) => {
      if ((lesson && lesson.name !== '' && time) || isAdmin.value) {
        lessonInfoDialog.value = true;
        const audienceValue = lesson.audienceEntity.audience;
        const typeValue = lesson.typeEntity.typeName;
        const audience = audienceValue !== 'UNKNOWN' && audienceValue !== '' ? audienceValue : null;
        const type = typeValue !== 'UNKNOWN' && typeValue !== '' ? typeValue : null;
        const lessonText = rawLessonStringMode.value ? lesson.rawLessonString : lesson.name;
        const timeString = time.lessonBeginTime + '-' + time.lessonFinishTime;
        const day = getFullDayWeekString(lesson.day);
        const dateArray = lessonDate.split('.');
        const date = new Date(dateArray[1] + '.' + dateArray[0] + '.' + dateArray[2]);
        console.log(date)
        const dateString = date.getDate().toString() + ' ' + getMonthStringByDate(date);
        const isGoingNow = isCurrentLessonGoes(selectedWeek.value, lesson, time.lessonBeginTime, time.lessonFinishTime);

        lessonInfoObject.value = {
          audience,
          type,
          lessonText,
          timeString,
          day,
          dateString,
          numberOfLesson,
          isGoingNow,
          lessonId: lesson.lessonId
        }
      }
    }


    const openEditModeDialog = async (lessonInfoObject) => {
      editMode.value = true;
      try {
        lessonsToEditArray.value = await LessonService.getLessonEditInfoById(lessonInfoObject.lessonId)
        if (lessonsToEditArray.value.length !== 0) {
          const lessonExample = lessonsToEditArray.value[0];
          if (selectedWeek.value) {
            editLessonSemesterType.value = selectedWeek.value < 23 ? 'AUTUMN' : 'SPRING';
          }
          editLessonName.value = lessonExample.name;
          editRawLessonString.value = lessonExample.rawLessonString;
          editLessonStartTime.value = lessonExample.startTime.substr(0, 5);
          editLessonFinishTime.value = lessonExample.finishTime.substr(0, 5);
          editLessonDay.value = lessonExample.day;
          editLessonAudience.value = lessonExample.audienceEntity.audience;
          editLessonType.value = lessonExample.typeEntity;
          editLessonNumerator.value = getLessonNumeratorByWeeks(lessonsToEditArray.value, editLessonSemesterType.value);
          editLessonSelectedWeeks.value = getWeeksArrayByLessons(lessonsToEditArray.value);
          fillEditLessonWeeksOptByLessons(editLessonSemesterType.value);
        }
      } catch (e) {
        console.log(e)
        editMode.value = false;
      }

    }

    watch(editLessonSemesterType, (newVal) => {
      editLessonNumerator.value = getLessonNumeratorByWeeks(lessonsToEditArray.value, editLessonSemesterType.value);
      fillEditLessonWeeksOptByLessons(newVal);
      editLessonSelectedWeeks.value = [];
    })

    const fillEditLessonWeeksOptByLessons = (semester) => {
      let result = [];
      const limit = semester === 'AUTUMN' ? 23 : 45
      for (let i = limit === 23 ? 1 : 23; i < limit; i++) {
        result.push(i);
      }
      editLessonWeeksOptions.value = result;
    }

    const handleLessonChanging = async (newValuesObj) => {
      const data = await LessonService.changeLessonsByNewValues(lessonsToEditArray.value, newValuesObj);
      console.log(data)
      await loadGroupSchedule(groupSelectValue.value);
      editMode.value = false
      lessonInfoDialog.value = false;
    }

    const handleLessonDeleting = async () => {
      await LessonService.deleteLesson(lessonsToEditArray.value);
      await loadGroupSchedule(groupSelectValue.value);
    }

    const groupSelectValue = ref(null);
    const univSelectValue = ref(null);
    const univSelectOptions = ref([]);
    const univFilteredOptions = ref(univSelectOptions.value);
    const groupsSelectOptions = ref([]);
    const groupsFilteredOptions = ref(groupsSelectOptions.value);

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
          localStorage.setItem('lastLoadedGroupNew', JSON.stringify(val));
          scheduleInfo.value = getScheduleInfoByWeekDesktop(selectedGroup.lessons, selectedWeek.value);
          const univ = selectedGroup.universityEntity;
          if (univ && univSelectValue.value && univ.univId !== univSelectValue.value.univId) {
            univSelectValue.value = await UniversityService.getUnivNameById(univ.univId);
          }
          console.log(selectedGroup)
        } else {
          console.log('removeGroup')
          title.value = '';
          localStorage.removeItem("lastLoadedGroupNew");
        }
      } catch (e) {
        console.log(e)
        localStorage.removeItem("lastLoadedGroupNew");
        groupSelectValue.value = null;
      }

    }
    //schedule table start
    const rawLessonStringMode = ref(true)
    const scheduleInfo = ref({});
    const title = ref('');
    const selectedDate = ref(null);
    const selectedWeek = ref(null);
    const datesArray = ref([]);
    const currentWeekType = ref('');
    const datePickerDate = ref(formatDate(new Date()));

    const updateHeadersDates = (date) => {
      if (date !== null) {
        let tempDate = getDateOfMonday(new Date(date));
        datesArray.value[0] = getDateString(tempDate);
        tempDate.setDate(tempDate.getDate() + 1);

        datesArray.value[1] = getDateString(tempDate);
        tempDate.setDate(tempDate.getDate() + 1);

        datesArray.value[2] = getDateString(tempDate);
        tempDate.setDate(tempDate.getDate() + 1);

        datesArray.value[3] = getDateString(tempDate);
        tempDate.setDate(tempDate.getDate() + 1);

        datesArray.value[4] = getDateString(tempDate);
        tempDate.setDate(tempDate.getDate() + 1);

        datesArray.value[5] = getDateString(tempDate);
        tempDate.setDate(tempDate.getDate() + 1);

        datesArray.value[6] = getDateString(tempDate);
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

    const loadNextWeekLessons = () => {
      incrementWeek(1);
    }

    const loadPreviousWeekLessons = () => {
      decrementWeek(1);
    }

    const changeDateFromDatePicker = () => {
      selectedDate.value = getDateOfMonday(new Date(datePickerDate.value));
    }

    const toggleWeekBtn = (val) => {
      const currentWeekType = getTypeOfWeek(selectedWeek.value);

      if (currentWeekType === 'NUMERATOR' && val === 'DENOMINATOR') {
        incrementWeek(1);
      }
      if (currentWeekType === 'DENOMINATOR' && val === 'NUMERATOR') {
        decrementWeek(1);
      }
    }

    watch(rawLessonStringMode, async (newValue) => {
      localStorage.setItem('rawLessonStringMode', newValue)
      await updateCellHeight();
    })
    watch(selectedWeek, async (newValue) => {
      const date = selectedDate.value;
      //const date = getDateOfMonday(new Date(2020,10, 23))
      if (date !== null) {
        updateHeadersDates(date);

        currentWeekType.value = getTypeOfWeek(newValue);
        const selectedGroup = store.getters['schedule/getSelectedGroup'];
        if (selectedGroup.lessons) {
          scheduleInfo.value = getScheduleInfoByWeekDesktop(selectedGroup.lessons, newValue)
        }
        //await updateCellHeight();
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
          if (groupSelectValue.value && groupSelectValue.value.univId !== selectedUnivId) {
            console.log(groupSelectValue.value.univId)
            console.log(selectedUnivId)
            groupSelectValue.value = null;
          }
        }
      } catch (e) {
        localStorage.removeItem("lastLoadedUniv");
      }
    })

    watch(groupSelectValue, async (newValue) => {
      console.log(groupSelectValue.value);
      await loadGroupSchedule(newValue)
      await updateCellHeight();
    });

    watch(selectedDate, (newValue) => {
      if (newValue !== null) {
        localStorage.setItem('selectedDate', newValue.toString())
        selectedWeek.value = getNumberOfWeek(newValue);
      }
    })
    const columnWidth = ref(0);
    const defaultCellHeight = ref(1);
    const doubleCellHeight = ref(1);
    const styleObject = ref({
      defaultCellHeightStyle: computed(() => 'height: ' + defaultCellHeight.value + 'px'),
      doubleCellHeightStyle: computed(() => 'height: ' + doubleCellHeight.value + 'px'),
      columnWidthStyle: computed(() => 'width: ' + columnWidth.value + 'px')
    })

    const updateCellHeight = async () => {
      let cell = await document.getElementById('hidden-span-calc');
      defaultCellHeight.value = cell.clientHeight;
      let cellDouble = await document.getElementById('hidden-span-double-calc');
      doubleCellHeight.value = (cellDouble.clientHeight * 2) + 4;
    }

    const resizeObserver = new ResizeObserver(async (entries) => {
      for (let entry of entries) {
        const innerPadding = 15;
        const marginValue = 4;
        const mainTableNewWidth = entry.contentRect.width;
        columnWidth.value = (mainTableNewWidth - (marginValue * 6 + innerPadding * 2)) / 7;
        await updateCellHeight();
      }
    });

    const {univId, grId} = toRefs(props);

    const loadGroupByPropsId = async (grId) => {
      groupSelectValue.value = await GroupService.getGroupNameById(Number(grId));
    }
    const loadUnivByPropsId = async (univId) => {
      univSelectValue.value = await UniversityService.getUnivNameById(Number(univId));
      if (univSelectValue.value && groupSelectValue.value) {
        if (univSelectValue.value.univId !== groupSelectValue.value.univId) {
          scheduleInfo.value = {};
          localStorage.removeItem('lastLoadedGroupNew');
        }
      }
    }

    watch(grId,async (newVal)=> {
      await loadGroupByPropsId(newVal);
    });
    watch(univId,async (newVal)=> {
      await loadUnivByPropsId(newVal);
    });


    onMounted(async () => {
      univSelectOptions.value = await store.dispatch('schedule/getUniversitiesNamesAction');
      if (isAdmin.value) {
        lessonTypes.value = await store.dispatch('schedule/getLessonTypes');
      }

      const mainTableElement = document.getElementById("MAIN-TABLE")
      resizeObserver.observe(mainTableElement);

      let rlsMode = localStorage.getItem('rawLessonStringMode');
      let dateFromStorage = new Date(localStorage.getItem('selectedDate'));
      let lastLoadedUniv = localStorage.getItem('lastLoadedUniv');
      let lastLoadedGroup = localStorage.getItem('lastLoadedGroupNew');

      if (!rlsMode) {
        rawLessonStringMode.value = true;
      } else {
        rawLessonStringMode.value = rlsMode === 'true';
      }
      localStorage.setItem('rawLessonStringMode', 'true');

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

      if (univId.value) {
        await loadUnivByPropsId(univId.value);
      } else if ((typeof lastLoadedUniv !== 'undefined') && lastLoadedUniv !== null) {
        univSelectValue.value = JSON.parse(lastLoadedUniv);
      }

      if (grId.value) {
        await loadGroupByPropsId(grId.value);
      } else if ((typeof lastLoadedGroup !== 'undefined') && lastLoadedGroup !== null) {
        const group = await JSON.parse(lastLoadedGroup);
        if (group.univId === univSelectValue.value.univId) {
          groupSelectValue.value = group;
        } else {
          localStorage.removeItem('lastLoadedGroupNew');
        }
      }

      await updateCellHeight();
    });

    onBeforeUnmount(() => {
      const mainTableElement = document.getElementById("MAIN-TABLE")
      resizeObserver.unobserve(mainTableElement);
    })

    const setWidthCellSchedule = () => {
      return styleObject.value.columnWidthStyle;
    }

    const setHeightCellSchedule = (twinRows, rowIndex) => {
      if (twinRows.includes(rowIndex)) {
        return styleObject.value.doubleCellHeightStyle
      } else {
        return styleObject.value.defaultCellHeightStyle
      }
    }

    const isEmptyLesson = (lesson) => {
      return lesson.value.length === 0 || (lesson.value[0].rawLessonString === '' || lesson.value[0].name === '');
    }

    const getLessonString = (les) => {
      if (les) {
        return rawLessonStringMode.value ? les.rawLessonString : les.name
      } else {
        return '';
      }
    }

    const getLessonStringDebug = (les) => {
      if (les) {
        return (rawLessonStringMode.value ? les.rawLessonString : les.name) + "ЫЫЫЫЫЫЫ";
      } else {
        return '';
      }
    }

    const weekTypeText = computed(() => {
      if (isSelectedUnivEgu(univSelectValue.value)) {
        return currentWeekType.value === 'NUMERATOR' ? 'знаменатель' : 'числитель';
      }
      return currentWeekType.value === 'NUMERATOR' ? 'числитель' : 'знаменатель';
    });

    const firstWeekButtonToggleName = computed(() => {
      if (isSelectedUnivEgu(univSelectValue.value)) {
        return 'Знаменатель';
      }
      return 'Числитель';
    });

    const secondWeekButtonToggleName = computed(() => {
      if (isSelectedUnivEgu(univSelectValue.value)) {
        return 'Числитель';
      }
      return 'Знаменатель';
    });

    const numeratorMap = computed(() => {
      return [
        {
          label: isSelectedUnivEgu(univSelectValue.value) ? 'Знаменатель' : 'Числитель',
          value: 'NUMERATOR',
        },
        {
          label: isSelectedUnivEgu(univSelectValue.value) ? 'Числитель' : 'Знаменатель',
          value: 'DENOMINATOR',
        },
        {
          label: 'Каждую неделю',
          value: 'FULL',
        },
        {
          label: 'По неделям',
          value: 'CUSTOM',
        }
      ]
    });

    return {
      isAdmin,
      editMode,
      editLessonSemesterType,
      editLessonName,
      editRawLessonString,
      editLessonStartTime,
      editLessonFinishTime,
      editLessonType,
      editLessonAudience,
      editLessonNumerator,
      editLessonDay,
      editLessonWeeksOptions,
      editLessonSelectedWeeks,
      lessonTypes,
      settingsDialog,
      dayMap,
      numeratorMap,
      semestersMap,
      scheduleInfo,
      rawLessonStringMode,
      currentWeekType,
      datesArray,
      lessonInfoDialog,
      lessonInfoObject,
      univSelectValue,
      univFilteredOptions,
      groupSelectValue,
      groupsFilteredOptions,
      selectedWeek,
      datePickerDate,
      columnWidth,
      weekTypeText,
      firstWeekButtonToggleName,
      secondWeekButtonToggleName,
      openEditModeDialog,
      handleLessonChanging,
      handleLessonDeleting,
      filterGroupsFn,
      filterUniversitiesFn,
      loadGroupSchedule,
      openLessonInfo,
      toggleWeekBtn,
      loadNextWeekLessons,
      loadPreviousWeekLessons,
      changeDateFromDatePicker,
      getScheduleCellColor,
      isCurrentLessonGoes,
      getFullDayWeekString,
      theme,
      getNumberOfWeek,
      getTypeColorByValue,
      getTypeNameByValue,
      setSquareCellSchedule: setWidthCellSchedule, setHeightCellSchedule, isEmptyLesson, getLessonString,
      updateCellHeight,
      defaultCellHeight, doubleCellHeight, styleObject, getLessonStringDebug
    }
  }
}
</script>

<style lang="css">
@import 'src/css/main.css';

#MAIN-PAGE {

}

#REKLAMA {
  border-radius: 4px;
  /*background-color: #00e0e3;*/
}

#SCHEDULE-SELECT {
  border-radius: 4px 4px 0 0;
  align-items: center;
}

#SCHEDULE-NAVIGATION {
  border-radius: 0 0 4px 4px;
  margin-top: -15px;
}

#MAIN-TABLE {
  padding: 0;
  border-radius: 4px;

}

.page-width {
  margin: 15px 15px;
}

.select-ug {
  margin: 0 auto;
}

.time-cell-inside-border {
  margin: 0 auto;
}

.pd-cell-around {
  padding: 4px;
}

.mg-b-inside {
  margin-bottom: 4px;
}

.font-size-cell {
  font-size: 13px;
  /*line-height: 10px;*/
}

.q-list-cell-schedule {
  margin: 2px;
  border-collapse: collapse;
}

.bg-cell-schedule-l {
  background-color: #f0f2f5;
}

.bg-cell-schedule-d {
  background-color: #4a4f57;
  color: white;
}

.btn-select-schedule {
  border-radius: 20px;
}

.btn-selected-schedule-l {
  background: #f0f2f5;
}

.btn-selected-schedule-d {
  background: #4a4f57;
}

.max-width-schedule {
  width: 100%;
}

.chip-current-lesson-schedule {
  border: none;
  font-size: 10px
}

#dialog-add-info-schedule div {
  border-radius: 3px;
}

</style>
