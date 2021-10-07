<template>
  <q-page>
    <q-card id="MAIN-PAGE" class="bg-none" flat square>
      <q-card id="REKLAMA" class="center-all page-width fix-my" flat>
        Реклама
      </q-card>

      <q-card id="SCHEDULE-SELECT" class="row justify-center items-center center-all page-width" flat>
        <q-card id="SELECT-U" class="fix-pa">
          <q-select v-model="univSelectValue" :options="univFilteredOptions" borderless bottom-slots class="select-ug"
                    fill-input hide-selected
                    label="Выберите университет"
                    option-label="univName"
                    outlined transition-hide="jump-up" transition-show="jump-up"
                    use-input @filter="filterUniversitiesFn">
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label v-html="scope.opt.univName" />
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
              <q-icon name="search" />
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
                  <q-item-label v-html="scope.opt.groupName" />
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
              <q-icon name="search" />
            </template>
          </q-select>
        </q-card>
      </q-card>
      <q-card id="SCHEDULE-NAVIGATION" class="center-all justify-center items-center page-width fix-pa" flat>
        <q-card class="t-center">НАВИГАЦИЯ</q-card>

        <q-toggle v-model="rawLessonStringMode" :color="theme('primary','white')" label="Режим без обработки: "
                  left-label />

        {{ selectedWeek }} неделя, {{ currentWeekType === 'NUMERATOR' ? 'числитель' : 'знаменатель' }}

        <q-card id="schedule-nav-btn" class="row center-all justify-between items-center fix-pa">
          <div>
            <q-btn class="buttons-week" flat label="❮ Предыдущая неделя" no-caps rounded
                   @click="loadPreviousWeekLessons" />
          </div>
          <div>
            <q-btn :class="currentWeekType === 'NUMERATOR' ? 'text-primary' : ''" flat label="Числитель" no-caps
                   outline @click="toggleWeekBtn('NUMERATOR')" />

            <q-btn :class="currentWeekType === 'DENOMINATOR' ? 'text-primary' :''" flat label="Знаменатель" no-caps
                   outline @click="toggleWeekBtn('DENOMINATOR')" />

            <q-btn id="calendar" class="buttons-date" flat icon="today" no-caps>
              <q-popup-proxy transition-hide="scale" transition-show="scale">
                <q-date v-model="datePickerDate"
                        :options="(date)=>{ return date >= '2020/09/01' && date <= '2100/09/01' }">
                  <div class="row items-center justify-end q-gutter-sm">
                    <q-btn v-close-popup color="primary" flat label="Перейти" @click="changeDateFromDatePicker" />
                    <q-btn v-close-popup color="primary" flat label="Отмена" />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-btn>
          </div>
          <div>
            <q-btn class="buttons-week" flat label="Следующая неделя ❯" no-caps rounded @click="loadNextWeekLessons" />
          </div>
        </q-card>

      </q-card>

      <q-card id="MAIN-TABLE" class="center-all justify-center items-center page-width fix-py" flat>
        <q-card class="center-all t-center justify-center items-start row fix-py" flat square>

          <q-item id="hidden-span-calc" :style="setSquareCellSchedule(columnWidth)"  style="position:absolute; left:-9999px;" class="t-center q-pa-none pd-cell-around mg-b-inside bg-cell-schedule">
            <q-card flat square class="max-width-schedule q-pa-none bg-none">
              <q-card-section :style="getScheduleCellColor(0)" class="q-pa-none text-black font-size-cell time-cell-inside-border">
                <span>00.00 - 00.00</span>
              </q-card-section>
              <q-card-section class="q-pa-none lesson-text font-size-cell q-mt-sm">
<!--                <span class="lesson-content-schedule">лаб.9 нед. Технология бетона, стр. изделий и конструкций - 2 п/гПРОФ. ПЕРЦЕВ В.Т. а.6163 Теплотехническое оборудование в технологии стр. материалов - 1 п/г ДОЦ. ЧЕРКАСОВ С.В. - а.6171</span>-->
                <span class="lesson-content-schedule">{{ scheduleInfo.maxLesson }}</span>
              </q-card-section>
            </q-card>
          </q-item>

          <q-item id="hidden-span-double-calc" :style="setSquareCellSchedule(columnWidth)" style="position:absolute; left:-9999px;" class="t-center q-pa-none pd-cell-around mg-b-inside bg-cell-schedule">
            <q-card flat square class="q-pa-none max-width-schedule bg-none">
              <q-card-section :style="getScheduleCellColor(0)" class="q-pa-none q-mb-sm text-black font-size-cell time-cell-inside-border">
                <span>00.00 - 00.00</span>
              </q-card-section>
              <q-card-section class="q-pa-none font-size-cell q-mt-sm" lines="4">
                <div class="lesson-text">
                  <span>{{ scheduleInfo.maxLessonDouble }}</span>
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
              <template v-for="(day, rowIndex) in dayColumn.lessons" :key="day">

                <template v-if="day.lessons.length === 1 || day.lessons.length === 0">
                  <!--       ОБЫЧНАЯ ПАРА           -->
                  <q-item :style="setHeightCellSchedule(scheduleInfo.twinRows, rowIndex)" class="t-center q-pa-none pd-cell-around mg-b-inside bg-cell-schedule"
                          clickable @click="openLessonInfo(day.lessons[0])"
                  >
                    <q-card flat square class="max-width-schedule q-pa-none bg-none">
                      <q-card-section :style="getScheduleCellColor(day.lessons[0])" class="q-pa-none text-black font-size-cell time-cell-inside-border">
                        <q-chip v-if="isCurrentLessonGoes(selectedWeek, day.lessons[0], day.lessons[0].lessonBeginTime, day.lessons[0].lessonFinishTime)"
                                class="q-my-none q-py-none chip-current-lesson-schedule" color="red" icon="alarm" label="Идёт сейчас" outline square text-color="white">
                        </q-chip>
                        <span v-else>{{ day.lessons[0].lessonBeginTime }} - {{ day.lessons[0].lessonFinishTime }}</span>
                      </q-card-section>

                      <q-card-section v-if="isEmptyLesson(day.lessons)" class="q-pa-none text-grey lesson-text font-size-cell q-mt-sm">
                        <span class="lesson-content-schedule">Нет занятий</span>
                      </q-card-section>
                      <q-card-section  v-else-if="day.lessons.length === 1" id="default-lesson" class="q-pa-none lesson-text font-size-cell q-mt-sm">
                        <span class="lesson-content-schedule">{{ getLessonString(day.lessons[0]) }}</span>
                      </q-card-section>
                    </q-card>
                  </q-item>
                </template>

                <template v-else-if="day.lessons.length === 2">
                  <q-item v-for="(les) in day.lessons" :key="les" :style="'height:' + ((doubleCellHeight-4)/2) + 'px'"
                          class="t-center q-pa-none pd-cell-around mg-b-inside bg-cell-schedule" clickable @click="openLessonInfo(les)">
                    <q-card flat square class="q-pa-none max-width-schedule bg-none">
                      <q-card-section :style="getScheduleCellColor(les)" class="q-pa-none q-mb-sm text-black font-size-cell time-cell-inside-border">
                        <q-chip
                          v-if="isCurrentLessonGoes(selectedWeek, les, les.lessonBeginTime,les.lessonFinishTime)"
                          class="q-my-none q-py-none chip-current-lesson-schedule" color="red" icon="alarm"
                          label="Идёт сейчас" outline square text-color="white">
                        </q-chip>
                        <span v-else>{{ les.lessonBeginTime }} - {{ les.lessonFinishTime }}</span>
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

          <q-dialog v-model="lessonInfoDialog" square @hide="editMode = false">
            <template v-if="!editMode">
              <q-card flat>
                <q-card-section class="row q-pa-none q-ma-none">
                  <q-btn v-close-popup dense flat icon="arrow_back" round style="width: 48px;" />
                  <span class="title-page-dialog">Информация о занятии</span>
                </q-card-section>
                <q-separator />
                <template v-if="lessonInfoObject.type">
                  <q-card-section :style="getTypeColorByValue(lessonInfoObject.type)">
                    {{ getTypeNameByValue(lessonInfoObject.type) }}
                  </q-card-section>
                  <q-separator />
                </template>
                <q-card-section>
                  {{ lessonInfoObject.timeString }}
                </q-card-section>
                <q-card-section>
                  {{ lessonInfoObject.lessonText }}
                </q-card-section>
                <template v-if="isAdmin">
                  <q-btn flat icon="edit" @click="openEditModeDialog(lessonInfoObject)" />
                </template>
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
                  <q-input v-model="editLessonAudience" label="Аудитория" />
                </q-card-section>
                <q-card-section>
                  <q-input v-model="editLessonStartTime" :rules="['time']" filled label="Время начала пары" mask="time">
                    <template v-slot:append>
                      <q-icon class="cursor-pointer" name="access_time">
                        <q-popup-proxy transition-hide="scale" transition-show="scale">
                          <q-time v-model="editLessonStartTime">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup color="primary" flat label="Close" />
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
                              <q-btn v-close-popup color="primary" flat label="Close" />
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
                  <q-btn flat icon="delete" @click="handleLessonDeleting" />
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
import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";
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
  getWeeksArrayByLessons
} from "src/composables/schedule/ScheduleTable";
import LessonService from 'src/services/schedule/lessonService'
import {useStore} from "vuex";
import {theme} from "src/services/other/tools";

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

const numeratorMap = [
  {
    label: 'Числитель',
    value: 'NUMERATOR',
  },
  {
    label: 'Знаменатель',
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
  name: "dSchedule",
  props: {
    univName: {
      type: String,
      default: null
    }
  },
  setup(props) {
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
    const editLessonNumerator = ref('');
    const editLessonDay = ref('');
    const editLessonSelectedWeeks = ref([]);
    const editLessonWeeksOptions = ref([]);
    const lessonInfoObject = ref({});
    const lessonInfoDialog = ref(false);


    const openLessonInfo = (lesson) => {
      if ((lesson && lesson.name !== '' && time) || isAdmin.value) {
        lessonInfoDialog.value = true;
        const audienceValue = lesson.audienceEntity.audience;
        const typeValue = lesson.typeEntity.typeName;
        const audience = audienceValue !== 'UNKNOWN' && audienceValue !== '' ? audienceValue : null;
        const type = typeValue !== 'UNKNOWN' && typeValue !== '' ? typeValue : null;
        const lessonText = rawLessonStringMode.value ? lesson.rawLessonString : lesson.name;
        const timeString = lesson.lessonBeginTime + '-' + lesson.lessonFinishTime;
        lessonInfoObject.value = {
          audience,
          type,
          lessonText,
          timeString,
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
          console.log(scheduleInfo)
        } else {
          title.value = '';
          console.log('Find deleted group');
        }
      } catch (e) {
        console.log(e)
        localStorage.removeItem("lastLoadedGroupNew");
        groupSelectValue.value = null;
      }

    }
    //schedule table start
    const rawLessonStringMode = ref(null)
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

    watch(rawLessonStringMode, (newValue) => {
      localStorage.setItem('rawLessonStringMode', newValue)
    })
    watch(selectedWeek, (newValue) => {
      const date = selectedDate.value;
      //const date = getDateOfMonday(new Date(2020,10, 23))
      if (date !== null) {
        updateHeadersDates(date);

        currentWeekType.value = getTypeOfWeek(newValue);
        const selectedGroup = store.getters['schedule/getSelectedGroup'];
        if (selectedGroup.lessons) {
          scheduleInfo.value = getScheduleInfoByWeekDesktop(selectedGroup.lessons, newValue)
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
    const columnWidth = ref(0);
    const heightRef = ref(0);

    const defaultCellHeight = ref(1);
    const doubleCellHeight = ref(1);

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const innerPadding = 15;
        const marginValue = 4;
        const mainTableNewWidth = entry.contentRect.width;
        columnWidth.value = (mainTableNewWidth - (marginValue * 6 + innerPadding * 2)) / 7;
        heightRef.value = entry.contentRect.height;
        let cell = document.getElementById('hidden-span-calc');
        defaultCellHeight.value = cell.clientHeight;

        let cellDouble = document.getElementById('hidden-span-double-calc');
        doubleCellHeight.value = (cellDouble.clientHeight * 2) + 4;

      }
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

    onBeforeUnmount(() => {
      const mainTableElement = document.getElementById("MAIN-TABLE")
      resizeObserver.unobserve(mainTableElement);
    })

    const heightCell = ref(50);

    const editHCell = () => {
      let div_lesson_top = document.getElementById('top-lesson-text');
      let div_lesson_bot = document.getElementById('bot-lesson-text');

      if (div_lesson_top !== null && div_lesson_bot !== null) {

        let span_top = document.createElement('span');
        let span_bot = document.createElement('span');

        span_top.textContent = div_lesson_top.textContent;
        span_bot.textContent = div_lesson_bot.textContent;

        div_lesson_top.innerHTML = ''
        div_lesson_bot.innerHTML = ''

        div_lesson_top.appendChild(span_top);
        div_lesson_bot.appendChild(span_bot);

        let sizeTop = span_top.getClientRects().length;
        let sizeBot = span_bot.getClientRects().length;

        if (sizeTop >= sizeBot) {
          heightCell.value = sizeTop;
        } else {
          heightCell.value = sizeBot;
        }
      }
    }

    const getHCell = (el) => {
      let size = 1;
      if (el !== '') {
        let element = document.getElementById(el);
        if (element !== null) {
          let span = document.createElement('span');
          span.textContent = element.textContent;
          element.innerHTML = '';
          element.appendChild(span);
          size = span.getClientRects().length;
          if (defaultCellHeight.value < size) {
            defaultCellHeight.value = size;
          }
        }
        //console.log(defaultCellHeight.value)
      }
    }



    const setWidthCellSchedule = (size) => {
      return 'width:' + size + 'px'
    }

    const setHeightCellSchedule = (twinRows, rowIndex) => {
      if (twinRows.includes(rowIndex)) return 'height:' + doubleCellHeight.value + 'px';
      return 'height:' + defaultCellHeight.value + 'px'
    }

    const isEmptyLesson = (day) => {
      return day.lessons.length === 0 || (day.lessons[0].rawLessonString === '' || day.lessons[0].name === '');
    }

    const getLessonString = (les) => {
      return rawLessonStringMode.value ? les.rawLessonString : les.name
    }

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
      heightCell, defaultCellHeight, getHCell,
      cellStyle: {
        width: computed(() => 'width: ' + columnWidth.value + 'px'),
      },
      setSquareCellSchedule: setWidthCellSchedule, setHeightCellSchedule, isEmptyLesson, getLessonString, doubleCellHeight
    }
  }
}
</script>

<style lang="css">
@import 'src/css/main.css';

#REKLAMA {
  height: 90px;
  border-radius: 4px;
  background-color: #00e0e3;
}

#SCHEDULE-SELECT {
  border-radius: 4px;
  align-items: center
}

#SCHEDULE-NAVIGATION {
  margin-top: -15px;
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

.bg-cell-schedule {
  background-color: rgba(27, 99, 212, 0.47)
}

.max-width-schedule {
  width: 100%;
}

.chip-current-lesson-schedule {
  border: none;
  font-size: 10px
}

</style>
