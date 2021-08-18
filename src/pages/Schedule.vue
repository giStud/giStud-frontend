<template>
  <q-page>
    <div class="flex column">
      <div class="column q-pa-lg q-col-gutter-y-md">
        <div class="col-12 content-end">
          <div class="">
            <div class="column">
              <div class="col-12" style="margin-top: 30px">

              </div>
              <div class="row" style="height: 50px">
                <!--                <div class="col-4" style="padding-top: 21px">-->
                <!--                  <q-btn color="primary" label="Загрузить расписание" style="box-shadow: 0 0 10px rgba(0,0,0,0.5);" @click="loadGroupSchedule" />-->
                <!--                </div>-->
                <q-select
                  rounded
                  outlined
                  v-model="selected"
                  use-input
                  hide-selected
                  fill-input
                  input-debounce="0"
                  :options="filteredOptions"
                  option-value="groupId"
                  option-label="groupName"
                  map-options
                  emit-value
                  @filter="filterFn"
                  style="width: 250px; padding-bottom: 32px"
                  transition-show="jump-up"
                  transition-hide="jump-up"
                  bottom-slots
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        Не найдено
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:append>
                    <q-icon name="search"/>
                  </template>
                  <template v-slot:hint>
                    Поиск группы
                  </template>
                </q-select>
                <div class="col-4" style="padding-top: 31px; text-align: center; font-size: 18px">
                  <div class="content-end">
                    <span> {{ currentWeekNumber }} неделя, {{ currentWeekType }}</span>
                  </div>
                </div>
                <div class="col-4" style="padding-top: 21px">
                  <div class="row justify-end">

                    <div>

                      <div>
                        <q-btn color="primary" label="Числитель" @click="loadNumeratorLessons"
                               style="margin-right: 8px;  box-shadow: 0 0 10px rgba(0,0,0,0.5);"/>
                        <q-btn color="primary" label="Знаменатель" @click="loadDenominatorLessons"
                               style="margin-right: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.5);"/>
                        <q-btn icon="today" color="primary" style="box-shadow: 0 0 10px rgba(0,0,0,0.5);">
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12">
          <q-table
            :rows="rows"
            :columns="columns"
            row-key="rowNum"
            table-colspan="7"
            :rows-per-page-options="[10,12]"
            separator="cell"
            hide-pagination
            wrap-cells
          >
            <template v-slot:body="props">
              <q-tr :props="props" :key="props.row.rowNum">
                <q-td><pre>{{props.cols}}</pre></q-td>
                <q-td style="text-align: center; align-items: center">{{ props.row.time }}</q-td>
                <q-td v-for="cell in props.row.days" :key="cell.day" :style="getColorOfCellFromType(cell[0])">
                  <template v-if="cell.length > 1">
                    <template v-if="rawLessonStringMode">
                      {{ cell[0].rawLessonString }}
                      {{ cell[1].rawLessonString }}
                    </template>
                    <template v-else>
                      {{ cell[0].name}}
                      {{ cell[1].name}}
                    </template>

                  </template>
                  <template v-else>
                    <template v-if="rawLessonStringMode">
                      {{ cell[0].rawLessonString }}
                    </template>
                    <template v-else>
                      {{ cell[0].name}}
                    </template>
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
              <div class="row-4 q-table__title">{{ title }}</div>

              <q-space/>

              <div class="row-4 order-last">
                <q-toggle
                  v-model="rawLessonStringMode"
                  label="Отображение занятий без обработки: "
                  left-label
                />
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
  getTableColumns,
  getDateOfMonday,
  getDateString,
  getTypeOfWeek, getNumberOfWeek,
  getColorOfCellFromType
} from "../composables/schedule/ScheduleTable"

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
        console.log(selectedGroup)
        title.value = 'Расписание группы ' + selectedGroup.name;
        localStorage.setItem('idOfLastLoadedGroup', val);
        rows.value = getTableRowsFromLessons(selectedGroup.lessons, selectedDate.value);
      } else {
        title.value = '';
        console.log('debil');
      }
    }
    //Group selecting end

    //Schedule table start
    const rawLessonStringMode = ref(null)
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

    const updateHeadersDates = (date) => {
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

    const loadNumeratorLessons = () => {
      const selectedGroup = store.getters['schedule/getSelectedGroup'];
      if (selectedDate.value !== null && selectedGroup) {
        let date = new Date(selectedDate.value);
        let numerator = getTypeOfWeek(date);
        if (numerator === 'DENOMINATOR') {
          do {
            date.setDate(date.getDate() - 1);
          } while (date.getDay() !== 1)
          selectedDate.value = date;
        }
      }
    }

    const loadDenominatorLessons = () => {
      const selectedGroup = store.getters['schedule/getSelectedGroup'];
      if (selectedDate.value !== null && selectedGroup) {
        let date = new Date(selectedDate.value);
        let numerator = getTypeOfWeek(date);
        if (numerator === 'NUMERATOR') {
          do {
            date.setDate(date.getDate() + 1);
          } while (date.getDay() !== 1)
          selectedDate.value = date;
        }
      }
    }

    const changeDateFromDatePicker = () => {
      selectedDate.value = new Date(datePickerDate.value);
    }

    watch(rawLessonStringMode, (newValue) => {
      columns.value = getTableColumns(newValue)
      localStorage.setItem('rawLessonStringMode', newValue.toString)
    })
    watch(selectedDate, (newValue) => {
      const date = getDateOfMonday(newValue)
      //const date = getDateOfMonday(new Date(2020,10, 23))
      updateHeadersDates(date)
      currentWeekType.value = getTypeOfWeek(date) === 'NUMERATOR' ? 'числитель' : 'знаменатель';
      currentWeekNumber.value = getNumberOfWeek(date);
      const selectedGroup = store.getters['schedule/getSelectedGroup'];
      if (selectedGroup.lessons) {
        rows.value = getTableRowsFromLessons(selectedGroup.lessons, selectedDate.value)
      }
    })

    watch(selected, (newValue) => {
      loadGroupSchedule(newValue)
    });

    selectedDate.value = getDateOfMonday(new Date());
    //Schedule table end

    onMounted(async () => {
      await store.dispatch('groups/getGroupNamesAction');
      options.value = store.getters['groups/getGroupNames'];

      let mode1 = localStorage.getItem('rawLessonStringMode');
      let idOfLastSelectedGroup = localStorage.getItem('idOfLastLoadedGroup');

      if (mode1 === 'true') {
        rawLessonStringMode.value = true;
      } else {
        rawLessonStringMode.value = false;
        localStorage.setItem('rawLessonStringMode', 'false');
      }

      if ((typeof idOfLastSelectedGroup !== 'undefined') && idOfLastSelectedGroup !== null && idOfLastSelectedGroup !== 'Выберите группу') {
        console.log(idOfLastSelectedGroup)
        const selectedGroup = await store.dispatch('schedule/getGroupById', {grId: idOfLastSelectedGroup});
        title.value = 'Расписание группы ' + selectedGroup.name + " (" + selectedGroup.universityEntity.name + ")";
        console.log(selectedGroup)
        rows.value = getTableRowsFromLessons(selectedGroup.lessons, selectedDate.value);
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
      filterFn,
      loadGroupSchedule,
      loadNumeratorLessons,
      loadDenominatorLessons,
      changeDateFromDatePicker,
      getColorOfCellFromType
    };
  },
};
</script>

<style></style>
