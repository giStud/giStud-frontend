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
            <q-btn round @click="loadGroupSchedule"/>
          </div>
        </div>
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
        />
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
import {getTableRowsFromLessons, getTableColumns} from "../composables/schedule/ScheduleTable"

// const columns = [
//   {
//     name: 'time',
//     label: 'Время',
//     align: 'center',
//     field: 'time',
//   },
//   {
//     name: 'monday',
//     label: 'Понедельник',
//     align: 'center',
//     field: (row) => row.days.monday.name,
//     classes: (row) => row.days.monday.typeEntity.typeName === 'LAB' ? 'bg-red' : 'bg-blue'
//   },
//   {
//     name: 'tuesday',
//     label: 'Вторник',
//     align: 'center',
//     field: (row) => row.days.tuesday.name,
//     classes: (row) => row.days.monday.typeEntity.typeName === 'LAB' ? 'bg-blue' : 'bg-red'
//   },
//   {
//     name: 'wednesday',
//     label: 'Среда',
//     align: 'center',
//     field: (row) => row.days.wednesday.name,
//     classes: (row) => row.days.monday.typeEntity.typeName === 'LAB' ? 'bg-red' : 'bg-blue'
//   },
//   {
//     name: 'thursday',
//     label: 'Четверг',
//     align: 'center',
//     field: (row) => row.days.thursday.name,
//     classes: (row) => row.days.monday.typeEntity.typeName === 'LAB' ? 'bg-red' : 'bg-blue'
//   },
//   {
//     name: 'friday',
//     label: 'Пятница',
//     align: 'center',
//     field: (row) => row.days.friday.name,
//     classes: (row) => row.days.monday.typeEntity.typeName === 'LAB' ? 'bg-red' : 'bg-blue'
//   },
//   {
//     name: 'saturday',
//     label: 'Суббота',
//     align: 'center',
//     field: (row) => row.days.saturday.name,
//     classes: (row) => row.days.monday.typeEntity.typeName === 'LAB' ? 'bg-red' : 'bg-blue'
//   },
// ]


export default {
  name: 'GroupSelectingLayout',
  components: {},

  setup() {
    const store = useStore();
    const selected = ref(null);
    const options = ref([]);
    const columns = ref(getTableColumns());
    const rows = ref([]);
    const title = ref('');
    const date = ref(new Date());

    const filteredOptions = ref(options.value);
    onMounted(async () => {
      await store.dispatch('groups/getGroupNamesAction');
      options.value = store.getters['groups/getGroupNames'];
    });

    const getTitleText = ()=> {
      if (selected.value !== null) {
        title.value = 'Расписание группы ' + selected.value;
      } else {
        title.value = '';
      }
    }

    watch(selected, getTitleText)

    return {
      filteredOptions,
      selected,
      columns,
      rows,
      title,
      getTitleText,
      filterFn(val, update, abort) {
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
      },
      async loadGroupSchedule() {
        if (selected.value !== null) {
          const selectedGroup = await store.dispatch('schedule/getGroupByNameAndUnivAction', {
            groupName: selected.value,
          });
          rows.value = getTableRowsFromLessons(selectedGroup.lessons);
        } else {
          console.log('debil');
        }
      },
    };
  },
};
</script>

<style></style>
