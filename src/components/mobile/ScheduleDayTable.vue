<template>

  <q-table style="border: 1px solid #959595" class="bg-white" square flat :rows="rows" :columns="scheduleColumns" row-key="rowNum"
           table-colspan="7"
           :rows-per-page-options="[10,12]" separator="cell" hide-pagination wrap-cells
           no-data-label="Для отображения расписания выберите группу">
    <template v-slot:body="props" >
      <q-tr >
        <q-td style="border-color: #959595 ; text-align: center; width: 30px; padding: 0; font-size: 12px">{{ props.row.time }}</q-td>
        <q-td style="border-color: #959595 ; text-align: center; font-size: 12px" :style="props.row.lessons.length !== 0 ? getScheduleCellColor(props.row.lessons[0], props.row.lessons.length > 1) : ''">
          <template v-if="props.row.lessons.length > 1">
            <div>
              <q-list >
                <q-item class="justify-center items-center" :style="getScheduleCellColor(props.row.lessons[0])">
                  {{ rawLessonStringMode ? props.row.lessons[0].rawLessonString : props.row.lessons[0].name }}
                </q-item>
                <q-separator style="background-color:#c1d2d7"/>
                <q-item class="justify-center items-center" :style="getScheduleCellColor(props.row.lessons[1])">
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
    <template v-slot:top>
      <div class="row" style="width: 100%">
        <div style="width: 50%; text-align: left; font-weight: 600; font-size: 15px" >{{ dayString }}</div>
        <div style="width: 50%; text-align: right; font-weight: 600; font-size: 15px">{{ dateString }}</div>
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
    headerStyle: 'border-color: #959595;border-top: 1px solid #959595'
  },
  {
    name: 'lesson',
    label: 'Занятие',
    align: 'center',
    headerStyle: 'border-color: #959595;border-top: 1px solid #959595;'
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
