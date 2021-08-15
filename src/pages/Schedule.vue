<template>
  <q-page class="flex flex-center">
    <q-card flat>
      <q-card-section>
        <div class="q-pa-md">
          <div class="q-gutter-md column">
            <q-select
              filled
              v-model="selected"
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              :options="filteredOptions"
              @filter="filterFn"
              style="width: 250px; padding-bottom: 32px"
              @change="loadGroupSchedule"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Не найдено
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-btn push color="primary" label="Загрузить расписание" @click="loadGroupSchedule"/>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <q-btn push color="primary" label="Числитель" @click="loadNumeratorLessons"/>
        <q-btn push color="primary" label="Знаменатель" @click="loadDenominatorLessons"/>
        <q-btn icon="today" color="primary">
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-date v-model="datePickerDate">
              <div class="row items-center justify-end q-gutter-sm">
                <q-btn label="Cancel" color="primary" flat v-close-popup />
                <q-btn label="OK" color="primary" flat @click="changeDateFromDatePicker" v-close-popup />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-btn>
        <br>
        <span>Тип недели: {{currentWeekType}}</span>
        <br>
        <span>Номер недели: {{currentWeekNumber}}</span>
      </q-card-section>
      <q-card-section>
        <q-toggle
          v-model="rawLessonStringMode"
          label="Отображение занятий без обработки: "
          left-label
        />
        <q-toggle
          v-model="lessonWeekParsingMode"
          label="Режим обработки недель: "
          left-label
        />
      </q-card-section>
      <q-card-section>
        <q-table
          :title="title"
          :rows="rows"
          :columns="columns"
          row-key="rowNum"
          table-colspan="7"
          :rows-per-page-options="[5,6]"
          hide-pagination
          separator="cell"
          wrap-cells
        >
          <template v-slot:header="props">
            <q-th >{{props.cols[0].label}}</q-th>
            <q-th >{{props.cols[1].label}}<br>{{mondayDate}}</q-th>
            <q-th >{{props.cols[2].label}}<br>{{tuesdayDate}}</q-th>
            <q-th >{{props.cols[3].label}}<br>{{wednesdayDate}}</q-th>
            <q-th >{{props.cols[4].label}}<br>{{thursdayDate}}</q-th>
            <q-th >{{props.cols[5].label}}<br>{{fridayDate}}</q-th>
            <q-th >{{props.cols[6].label}}<br>{{saturdayDate}}</q-th>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
  <q-page-container>
    <router-view/>
  </q-page-container>
</template>

<script>
import {onMounted, ref, watch} from "vue";
import {useStore} from "vuex";
import {
  getTableRowsFromLessons,
  getTableColumns,
  getDateOfMonday,
  getDateString,
  getTypeOfWeek, getNumberOfWeek
} from "../composables/schedule/ScheduleTable"

export default {
  name: 'GroupSelectingLayout',
  components: {},

  setup() {
    const store = useStore();

    //Group selecting start
    const selected = ref(null);
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

     const loadGroupSchedule = async () => {
      if (selected.value !== null) {
        const selectedGroup = await store.dispatch('schedule/getGroupByNameAndUnivAction', {
          groupName: selected.value,
        });
        rows.value = getTableRowsFromLessons(selectedGroup.lessons, selectedDate.value);
      } else {
        console.log('debil');
      }
    }
    //Group selecting end

    //Schedule table start
    const rawLessonStringMode = ref(null)
    const lessonWeekParsingMode = ref(null)
    const columns = ref(getTableColumns(rawLessonStringMode.value));
    const rows = ref([]);
    const title = ref('');
    const selectedDate = ref(null);
    const mondayDate = ref('');
    const tuesdayDate = ref('');
    const wednesdayDate = ref('');
    const thursdayDate = ref('');
    const fridayDate = ref('');
    const saturdayDate = ref('');
    const currentWeekType = ref('');
    const currentWeekNumber = ref(null);
    const datePickerDate = ref(new Date());

    const updateHeadersDates = (date)=> {
      if (date !== null) {
        mondayDate.value = getDateString(date);
        date.setDate(date.getDate() + 1);

        tuesdayDate.value = getDateString(date);
        date.setDate(date.getDate() + 1);

        wednesdayDate.value = getDateString(date);
        date.setDate(date.getDate() + 1);

        thursdayDate.value = getDateString(date);
        date.setDate(date.getDate() + 1);

        fridayDate.value = getDateString(date);
        date.setDate(date.getDate() + 1);

        saturdayDate.value = getDateString(date);
        date.setDate(date.getDate() + 1);
        date.setDate(date.getDate() - 6);
      }
    }

    const getTitleText = ()=> {
      if (selected.value !== null) {
        title.value = 'Расписание группы ' + selected.value;
      } else {
        title.value = '';
      }
    }

    const loadNumeratorLessons = ()=> {
      const selectedGroup = store.getters['schedule/getSelectedGroup'];
      if (selectedDate.value !== null && selectedGroup) {
        let date = new Date(selectedDate.value);
        let numerator = getTypeOfWeek(date);
        if (numerator === 'DENOMINATOR')
        {
          do {
            date.setDate(date.getDate() - 1);
          } while (date.getDay() !== 1)
          selectedDate.value = date;
        }
      }
    }

    const loadDenominatorLessons = ()=> {
      const selectedGroup = store.getters['schedule/getSelectedGroup'];
      if (selectedDate.value !== null && selectedGroup) {
        let date = new Date(selectedDate.value);
        let numerator = getTypeOfWeek(date);
        if (numerator === 'NUMERATOR')
        {
          do {
            date.setDate(date.getDate() + 1);
          } while (date.getDay() !== 1)
          selectedDate.value = date;
        }
      }
    }

    const changeDateFromDatePicker = ()=> {
      selectedDate.value = new Date(datePickerDate.value);
    }

    watch(rawLessonStringMode, (newValue) => {
      if (newValue) {
        lessonWeekParsingMode.value = false;
        localStorage.setItem('rawLessonStringMode', 'true')
        localStorage.setItem('lessonWeekParsingMode', 'false');
        columns.value = getTableColumns(newValue, false);
      }
      if (!newValue && !lessonWeekParsingMode.value) {
        columns.value = getTableColumns(false, false);
        localStorage.setItem('rawLessonStringMode', 'false')
        localStorage.setItem('lessonWeekParsingMode', 'false');
      }
    })
    watch(lessonWeekParsingMode, (newValue) => {
      if (newValue) {
        rawLessonStringMode.value = false;
        localStorage.setItem('lessonWeekParsingMode', 'true')
        localStorage.setItem('rawLessonStringMode', 'false');
        columns.value = getTableColumns(false, newValue);
      }
      if (!newValue && !rawLessonStringMode.value) {
        columns.value = getTableColumns(false, false);
        localStorage.setItem('rawLessonStringMode', 'false')
        localStorage.setItem('lessonWeekParsingMode', 'false');
      }
    })
    watch(selectedDate, (newValue) => {
      const date = getDateOfMonday(newValue)
      //const date = getDateOfMonday(new Date(2020,10, 23))
      updateHeadersDates(date)
      currentWeekType.value = getTypeOfWeek(date) === 'NUMERATOR' ? 'Числитель' : 'Знаменатель';
      currentWeekNumber.value = getNumberOfWeek(date);
      const selectedGroup = store.getters['schedule/getSelectedGroup'];
      if (selectedGroup.lessons) {
        rows.value = getTableRowsFromLessons(selectedGroup.lessons, selectedDate.value)
      }
    })
    watch(selected, getTitleText)

    selectedDate.value = getDateOfMonday(new Date());
    //Schedule table end

    onMounted(async () => {
      await store.dispatch('groups/getGroupNamesAction');
      options.value = store.getters['groups/getGroupNames'];

      let mode1 = localStorage.getItem('rawLessonStringMode');
      let mode2 = localStorage.getItem('lessonWeekParsingMode');

      if (mode1 === 'true') {
        rawLessonStringMode.value = true;
      } else {
        rawLessonStringMode.value = false;
        localStorage.setItem('rawLessonStringMode', 'false');
      }

      if (mode2 === 'true') {
        lessonWeekParsingMode.value = true;
      } else {
        lessonWeekParsingMode.value = false;
        localStorage.setItem('lessonWeekParsingMode', 'false');
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
      lessonWeekParsingMode,
      datePickerDate,
      filterFn,
      loadGroupSchedule,
      getTitleText,
      loadNumeratorLessons,
      loadDenominatorLessons,
      changeDateFromDatePicker
    };
  },
};
</script>

<style></style>
