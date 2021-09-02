<template>
  <q-table flat :rows="rows" :columns="scheduleColumns" row-key="rowNum"
           table-colspan="7"
           :rows-per-page-options="[10,12]" separator="cell" hide-pagination wrap-cells
           no-data-label="Для отображения расписания выберите группу">
    <template v-slot:body="props">
      <q-tr>
        <q-td>{{ props.row.time }}</q-td>
        <q-td :style="props.row.lessons.length !== 0 ? getScheduleCellColor(props.row.lessons[0], props.row.lessons.length > 1) : ''">
          <template v-if="props.row.lessons.length > 1">
            <div style="height: 100%;">
              <q-list style="height: 100%">
                <q-item :style="getScheduleCellColor(props.row.lessons[0])">
                  {{ rawLessonStringMode ? props.row.lessons[0].rawLessonString : props.row.lessons[0].name }}
                </q-item>
                <q-separator/>
                <q-item :style="getScheduleCellColor(props.row.lessons[1])">
                  {{ rawLessonStringMode ? props.row.lessons[1].rawLessonString : props.row.lessons[1].name }}
                </q-item>
              </q-list>
            </div>
          </template>
          <template v-else-if="props.row.lessons.length !== 0">
            {{ rawLessonStringMode ? props.row.lessons[0].rawLessonString : props.row.lessons[0].name }}
          </template>
        </q-td>
      </q-tr>
    </template>

    <template v-slot:top class="row justify-between items-center">
      <div class="col-12 row rasp-title">
        <div>{{ dayString }}</div>
        <div>{{ dateString }}</div>
      </div>
    </template>
  </q-table>
</template>

<script>
import {ref, watch} from 'vue'
import {toRefs} from 'vue'
import {getScheduleCellColor} from "src/composables/schedule/ScheduleTable";

const scheduleColumns = [
  {
    name: 'time',
    label: 'Время',
    align: 'center',
    headerStyle: 'width: 120px',
  },
  {
    name: 'lesson',
    label: 'Занятие',
    align: 'center',
  }
]

export default {

  name: "ScheduleDayTable",
  props: {
    day: String,
    date: String,
    rows: Array,
    rlsMode: Boolean
  },
  setup(props) {
    const {rows, rlsMode, date} = toRefs(props)

    return {
      dayString: ref(props.day),
      dateString: ref(date),
      rowsArray: ref(rows),
      rawLessonStringMode: ref(rlsMode),
      scheduleColumns,
      getScheduleCellColor,
    }
  }
}
</script>

<style scoped>

</style>
