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
      <q-card id="SCHEDULE-NAVIGATION" class="center-all justify-center items-center page-width fix-pa" flat>
        <q-card class="t-center">НАВИГАЦИЯ</q-card>

        <q-toggle :color="theme('primary','white')" v-model="rawLessonStringMode" label="Режим без обработки: "
                  left-label/>

        {{ selectedWeek }} неделя, {{ currentWeekType === 'NUMERATOR' ? 'числитель' : 'знаменатель' }}

        <q-card id="schedule-nav-btn" class="row center-all justify-between items-center fix-pa">
          <div>
            <q-btn class="buttons-week" flat label="❮ Предыдущая неделя" no-caps rounded
                   @click="loadPreviousWeekLessons"/>
          </div>
          <div>
            <q-btn :class="currentWeekType === 'NUMERATOR' ? 'text-primary' : ''" flat label="Числитель" no-caps
                   outline @click="toggleWeekBtn('NUMERATOR')"/>

            <q-btn :class="currentWeekType === 'DENOMINATOR' ? 'text-primary' :''" flat label="Знаменатель" no-caps
                   outline @click="toggleWeekBtn('DENOMINATOR')"/>

            <q-btn id="calendar" class="buttons-date" flat icon="today" no-caps>
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

      <q-card id="MAIN-TABLE" class="center-all justify-center items-center page-width fix-pa" flat>
        <q-card class="t-center bg-none fix-pb" flat square>ТАБЛИЦА</q-card>
        <q-card class="center-all t-center justify-center items-center row fix-py" flat square>


          <template v-for="(dayColumn, index) in scheduleColumns" :key="dayColumn">
            <q-list class="row-wc" style="margin: 2px; border-collapse: collapse">
              <span style="font-weight: bold; font-size: 16px">{{ getFullDayWeekString(dayColumn.day) }} </span>
              <br>
              <span style="font-size: 14px">{{ datesArray[index] }} </span>
              <q-item class="t-center q-pa-none" v-for="lesson in dayColumn.lessons" :key="lesson" clickable
                      style="padding: 8px;height: 190px;background-color: rgba(27,99,212,0.47); margin-bottom: 4px;">

                <template v-if="lesson.value.length === 1">
                  <div style="width: 100%">
                    <q-item-label class="q-mb-sm text-black"
                                  :style="getScheduleCellColor(lesson.value[0])"
                                  style="line-height: 10px">
                      {{ lesson.time.lessonBeginTime }} - {{ lesson.time.lessonFinishTime }}
                    </q-item-label>
                    <q-item-label style="margin-top: 25%; font-size: 12px">
                      <span v-if="lesson.value[0].rawLessonString === '' || lesson.value[0].name === ''"
                            class="text-grey">Нет занятий</span>
                      <span v-else>{{ rawLessonStringMode ? lesson.value[0].rawLessonString : lesson.value[0].name }}
                         <q-chip
                           v-if="isCurrentLessonGoes(selectedWeek, lesson.value[0], lesson.time.lessonBeginTime, lesson.time.lessonFinishTime)"
                           class="q-my-none q-py-none" color="red" icon="alarm" label="Идёт сейчас" outline square
                           style="border: none; font-size: 10px" text-color="white">
                            </q-chip>
                      </span>
                    </q-item-label>
                  </div>

                </template>

                <template v-else-if="lesson.value.length === 2">
                  <div>
                    <q-item-label class="q-mb-sm text-black" style="line-height: 10px"
                                  :style="getScheduleCellColor(lesson.value[0])">{{ lesson.time.lessonBeginTime }} -
                      {{ lesson.time.lessonFinishTime }}
                    </q-item-label>
                    <q-item-label lines="4" style="font-size: 12px">
                      {{ rawLessonStringMode ? lesson.value[0].rawLessonString : lesson.value[0].name }}
                    </q-item-label>
                    <q-separator style="margin: 8px 2%;"/>
                    <q-item-label lines="4" style="font-size: 12px">
                      {{ rawLessonStringMode ? lesson.value[1].rawLessonString : lesson.value[1].name }}
                    </q-item-label>
                    <q-item-label>
                      <q-chip
                        v-if="isCurrentLessonGoes(selectedWeek, lesson.value[0], lesson.time.lessonBeginTime, lesson.time.lessonFinishTime)"
                        class="q-my-none q-py-none" color="red" icon="alarm" label="Идёт сейчас" outline square
                        style="border: none; font-size: 10px" text-color="white">
                      </q-chip>
                    </q-item-label>
                  </div>
                </template>

                <template v-else-if="lesson.value.length === 0">
                  <div style="width: 100%">
                    <q-item-label class="q-mb-sm text-black"
                                  style="background-color: gray;line-height: 10px">
                      {{ lesson.time.lessonBeginTime }} - {{ lesson.time.lessonFinishTime }}
                    </q-item-label>
                    <q-item-label style="margin-top: 25%; font-size: 12px"  class="text-grey">
                      Нет занятий
                    </q-item-label>
                  </div>
                </template>


              </q-item>
            </q-list>
          </template>

        </q-card>
      </q-card>

    </q-card>
  </q-page>
</template>

<script>
import {onMounted, ref, watch} from "vue";
import {
  getDateOfMonday,
  getDateString, getNumberOfWeek, getScheduleCellColor,
  getLessonsFromSelectedWeekDesktop,
  getTypeOfWeek, isCurrentLessonGoes, getFullDayWeekString
} from "src/composables/schedule/ScheduleTable";

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
      console.log(val)
      try {
        if (val !== null && val.groupName !== '') {
          const selectedGroupId = val.groupId;
          const selectedGroup = await store.dispatch('schedule/getGroupById', {
            grId: selectedGroupId,
          });
          title.value = 'Расписание группы ' + selectedGroup.name + " (" + selectedGroup.universityEntity.name + ")";
          localStorage.setItem('lastLoadedGroupNew', JSON.stringify(val));
          scheduleColumns.value = getLessonsFromSelectedWeekDesktop(selectedGroup.lessons, selectedWeek.value);
          console.log(scheduleColumns.value)
        } else {
          title.value = '';
          console.log('Find deleted group');
        }
      } catch (e) {
        localStorage.removeItem("lastLoadedGroupNew");
        groupSelectValue.value = null;
      }

    }
    //schedule table start
    const rawLessonStringMode = ref(null)
    const scheduleColumns = ref([]);
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

        datesArray.value[1]= getDateString(tempDate);
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
        console.log(currentWeekType.value)
        const selectedGroup = store.getters['schedule/getSelectedGroup'];
        if (selectedGroup.lessons) {
          scheduleColumns.value = getLessonsFromSelectedWeekDesktop(selectedGroup.lessons, newValue)
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

    onMounted(async () => {
      univSelectOptions.value = await store.dispatch('schedule/getUniversitiesNamesAction');

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

    return {
      scheduleColumns, rawLessonStringMode, currentWeekType, datesArray,
      univSelectValue, univFilteredOptions, filterUniversitiesFn,
      groupSelectValue, groupsFilteredOptions, filterGroupsFn, loadGroupSchedule,
      selectedWeek, toggleWeekBtn, loadNextWeekLessons, loadPreviousWeekLessons,
      datePickerDate, changeDateFromDatePicker,
      getScheduleCellColor, isCurrentLessonGoes, getFullDayWeekString, theme, getNumberOfWeek,
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
  max-width: 1400px;
}

.select-ug {
  margin: 0 auto;
}

.row-wc {
  width: 190px;
}


</style>
