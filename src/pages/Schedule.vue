<template>
  <q-page>
    <div class="flex column">
      <div class="column q-pa-lg q-col-gutter-y-md">
        <div class="col-12 content-end">
          <div class="">
            <div class="column">
              <div class="col-12">
                <q-select square borderless outlined v-model="selected" use-input hide-selected f
                          ill-input :options="filteredOptions" option-value="groupId"
                          option-label="groupName" map-options emit-value @filter="filterFn" transition-show="jump-up"
                          transition-hide="jump-up" bottom-slots>
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

              <div class="row main-second">
                <div class="col-3" id="prev-week">
                  <q-btn flat no-caps class="buttons-week" label="❮ Предыдущая неделя"
                         @click="loadPreviousWeekLessons"/>
                </div>
                <div id="nav-date" class="col-6">
                  <q-btn flat no-caps class="buttons-date" label="Числитель" @click="loadNumeratorLessons"/>
                  <q-btn flat no-caps class="buttons-date" label="Знаменатель" @click="loadDenominatorLessons"/>
                  <q-btn id="calendar" flat no-caps class="buttons-date" icon="today">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-date v-model="datePickerDate">
                        <div class="row items-center justify-end q-gutter-sm">
                          <q-btn label="Cancel" color="primary" flat v-close-popup/>
                          <q-btn label="OK" color="primary" flat @click="changeDateFromDatePicker" v-close-popup/>
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
          <q-table id="main-table-rasp" flat :rows="rows" :columns="columns" row-key="rowNum" table-colspan="7"
                   :rows-per-page-options="[10,12]" separator="cell" hide-pagination wrap-cells>
            <template v-slot:body="props">
              <q-tr :props="props" :key="props.row.rowNum">
                <q-td id="main-table-rasp-time">{{ props.row.time }}</q-td>
                <q-td v-for="(cell) in props.row.days" :key="cell.day"
                      :style="getScheduleCellStyle(cell[0], cell.length > 1)">
                  <template v-if="cell.length > 1">
                    <q-tab-panels v-model="tab" animated swipeable infinite>
                      <q-tab-panel name="firstLessonTab">
                        <div :style="getScheduleCellStyle(cell[0]) + 'padding: 10px'">
                          {{ rawLessonStringMode ? cell[0].rawLessonString : cell[0].name }}
                          <div>
                            <q-badge color="blue" label="swipe"/>
                          </div>
                        </div>
                      </q-tab-panel>

                      <q-tab-panel name="secondLessonTab">
                        <div :style="getScheduleCellStyle(cell[1]) + 'padding: 10px'">
                          {{ rawLessonStringMode ? cell[1].rawLessonString : cell[1].name }}
                          <div>
                            <q-badge color="blue" label="swipe"/>
                          </div>
                        </div>
                      </q-tab-panel>
                    </q-tab-panels>
                  </template>
                  <template v-else>
                    {{ rawLessonStringMode ? cell[0].rawLessonString : cell[0].name }}
                  </template>
                </q-td>
              </q-tr>
            </template>

            <template v-slot:header="props">
              <q-th>{{ props.cols[0].label }}</q-th>
              <q-th>{{ props.cols[1].label }}<br>{{ mondayDate }}</q-th>
              <q-th>{{ props.cols[2].label }}<br>{{ tuesdayDate }}</q-th>
              <q-th>{{ props.cols[3].label }}<br>{{ wednesdayDate }}</q-th>
              <q-th>{{ props.cols[4].label }}<br>{{ thursdayDate }}</q-th>
              <q-th>{{ props.cols[5].label }}<br>{{ fridayDate }}</q-th>
              <q-th>{{ props.cols[6].label }}<br>{{ saturdayDate }}</q-th>
            </template>

            <template v-slot:top class="row justify-between items-center">
              <div class="col-12 row rasp-title">
                <div class="col-4 q-table__title">{{ title }}</div>
                <div class="col-4" id="selected-week"> {{ selectedWeek }} неделя</div>
                <div class="col-4" id="rawLessonStringMode">
                  <q-toggle v-model="rawLessonStringMode" label="Отображение занятий без обработки: " left-label/>
                </div>
              </div>

            </template>
          </q-table>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import {onMounted, ref, watch} from "vue";
import {useStore} from "vuex";
import {
  getTableRowsFromLessons,
  getDateOfMonday,
  getDateString,
  getTypeOfWeek, getNumberOfWeek,
  getScheduleCellStyle, getStartDateOfWeek
} from "../composables/schedule/ScheduleTable"

const columns = [
  {
    name: 'time',
    label: 'Время',
    align: 'center',
    headerStyle: 'max-width: 100px',
  },
  {
    name: 'monday',
    label: 'Понедельник',
    align: 'center',
    headerStyle: 'max-width: 250px',
  },
  {
    name: 'tuesday',
    label: 'Вторник',
    align: 'center',
    headerStyle: 'max-width: 250px',
  },
  {
    name: 'wednesday',
    label: 'Среда',
    align: 'center',
    headerStyle: 'max-width: 250px',
  },
  {
    name: 'thursday',
    label: 'Четверг',
    align: 'center',
    headerStyle: 'max-width: 250px',
  },
  {
    name: 'friday',
    label: 'Пятница',
    align: 'center',
    headerStyle: 'max-width: 250px',
  },
  {
    name: 'saturday',
    label: 'Суббота',
    align: 'center',
    headerStyle: 'max-width: 250px',
  }
]

export default {
  name: 'GroupSelectingLayout',
  components: {},

  setup() {
    const store = useStore();

    //Group selecting start
    const selected = ref('Выберите группу');
    const options = ref([]);
    const filteredOptions = ref(options.value);

    const filterFn = (val, update, abort) => {
      update(() => {
        const needle = val.toLocaleLowerCase();
        if (needle === '') {
          filteredOptions.value = options.value;
        } else {
          filteredOptions.value = options.value.filter((v) =>
            v.toLowerCase().includes(needle)
          );
        }
      });
    }

    const loadGroupSchedule = async (val) => {
      if (val !== 'Выберите группу') {
        const selectedGroup = await store.dispatch('schedule/getGroupById', {
          grId: val,
        });
        title.value = 'Расписание группы ' + selectedGroup.name + " (" + selectedGroup.universityEntity.name + ")";
        localStorage.setItem('idOfLastLoadedGroup', val);
        rows.value = getTableRowsFromLessons(selectedGroup.lessons, selectedWeek.value);
      } else {
        title.value = '';
        console.log('debil');
      }
    }
    //Group selecting end

    //Schedule table start
    const rawLessonStringMode = ref(null)
    const rows = ref([]);
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
    const datePickerDate = ref(new Date());

    const updateHeadersDates = (date) => {
      if (date !== null) {
        let tempDate = new Date(date);
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

    watch(selectedDate, (newValue) => {
      if (newValue !== null) {
        localStorage.setItem('selectedDate', newValue.toString())
        selectedWeek.value = getNumberOfWeek(newValue);
      }
    })

    const loadNumeratorLessons = () => {
      if (selectedWeek.value !== null) {

        if (getTypeOfWeek(selectedWeek.value) === 'DENOMINATOR') {
          decrementWeek(1);
        }
      }
    }

    const loadDenominatorLessons = () => {
      if (selectedWeek.value !== null) {

        if (getTypeOfWeek(selectedWeek.value) === 'NUMERATOR') {
          incrementWeek(1);
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
      selectedDate.value = new Date(datePickerDate.value);
    }

    watch(rawLessonStringMode, (newValue) => {
      localStorage.setItem('rawLessonStringMode', newValue)
    })

    watch(selectedWeek, (newValue) => {
      const date = selectedDate.value;
      //const date = getDateOfMonday(new Date(2020,10, 23))
      if (date !== null) {
        updateHeadersDates(date);
        currentWeekType.value = getTypeOfWeek(newValue) === 'NUMERATOR' ? 'числитель' : 'знаменатель';
        const selectedGroup = store.getters['schedule/getSelectedGroup'];
        if (selectedGroup.lessons) {
          rows.value = getTableRowsFromLessons(selectedGroup.lessons, newValue)
        }
      }
    })

    watch(selected, (newValue) => {
      loadGroupSchedule(newValue)
    });


    //Schedule table end

    onMounted(async () => {
      await store.dispatch('groups/getGroupNamesAction');
      options.value = store.getters['groups/getGroupNames'];

      console.log(typeof new Date())

      let rlsMode = localStorage.getItem('rawLessonStringMode');
      let dateFromStorage = new Date(localStorage.getItem('selectedDate'));
      let idOfLastSelectedGroup = localStorage.getItem('idOfLastLoadedGroup');

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

      if ((typeof idOfLastSelectedGroup !== 'undefined') && idOfLastSelectedGroup !== null && idOfLastSelectedGroup !== 'Выберите группу') {
        const selectedGroup = await store.dispatch('schedule/getGroupById', {grId: idOfLastSelectedGroup});
        title.value = 'Расписание группы ' + selectedGroup.name + " (" + selectedGroup.universityEntity.name + ")";
        rows.value = getTableRowsFromLessons(selectedGroup.lessons, selectedWeek.value);
      }
    });

    return {
      filteredOptions,
      selected,
      columns,
      rows,
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
      tab: ref('firstLessonTab'),
      filterFn,
      loadGroupSchedule,
      loadNumeratorLessons,
      loadDenominatorLessons,
      loadNextWeekLessons,
      loadPreviousWeekLessons,
      changeDateFromDatePicker,
      getScheduleCellStyle
    };
  },
};
</script>

<style lang="css">
@import 'src/css/style.css';
</style>
