<template>
  <q-page class="flex flex-center">
    <q-card flat>
      <q-card-section>
        <div class="q-pa-md">
          <div class="q-gutter-md row">
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
        <div>

        </div>
        <q-btn push color="primary" label="Числитель" @click="loadNumeratorLessons"/>
        <q-btn push color="primary" label="Знаменатель" @click="loadDenominatorLessons"/>
        <br>
        <span>Тип недели: {{currentWeekType}}</span>
        <br>
        <span>Номер недели: {{currentWeekNumber}}</span>
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
    onMounted(async () => {
      await store.dispatch('groups/getGroupNamesAction');
      options.value = store.getters['groups/getGroupNames'];
    });

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
    const columns = ref(getTableColumns());
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

    const updateHeadersDates = (newValue)=> {
      if (newValue !== null) {
        const date = getDateOfMonday(newValue)
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

        currentWeekType.value = getTypeOfWeek(date) === 'NUMERATOR' ? 'Числитель' : 'Знаменатель';
        currentWeekNumber.value = getNumberOfWeek(date);
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
        console.log(date)
        let numerator = getTypeOfWeek(date);
        if (numerator === 'DENOMINATOR')
        {
          do {
            date.setDate(date.getDate() - 1);
          } while (date.getDay() !== 1)
          rows.value = getTableRowsFromLessons(selectedGroup.lessons, date)
          console.log(selectedDate.value)
          selectedDate.value = date;
          console.log(selectedDate.value)
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
          rows.value = getTableRowsFromLessons(selectedGroup.lessons, date)
          selectedDate.value = date;
        }
      }
    }

    watch(selectedDate, (newValue, oldValue) => {updateHeadersDates(newValue)})
    watch(selected, getTitleText)

    selectedDate.value = new Date();
    //Schedule table end

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
      filterFn,
      loadGroupSchedule,
      getTitleText,
      loadNumeratorLessons,
      loadDenominatorLessons
    };
  },
};
</script>

<style></style>
