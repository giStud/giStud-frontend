<template>
  <q-card v-touch-swipe.right="decrementWeek" v-touch-swipe.left="incrementWeek" flat square style="text-align: center;"
          class="row justify-evenly q-px-sm">
    <template v-for="(data, index) in buttonsData" :key="data">
      <q-btn style="height: 14px; width: 14px;" :style="theme('border: 1px solid #1976D2', 'border: 1px solid white')" flat no-caps
             :class="data.selected ? theme('bg-primary', 'bg-white') : ''" @click="changeSelectedDateByButtonIndex(index)">
        <q-card style="background-color: rgba(255,255,255,0);" :style="data.selected ? 'color: white' : ''"
                :class="data.selected ? theme('bg-primary', 'bg-white') : ''" flat class="q-pa-none">
          <q-card-section :class="data.selected ? theme('', 'text-black') : ''" style="background-color: rgba(255,255,255,0); line-height: 13px; font-size: 9px;" class="q-pa-none">{{ data.date }}</q-card-section>
          <q-card-section :class="data.selected ? theme('', 'text-black') : ''" style="background-color: rgba(255,255,255,0); line-height: 12px;font-size: 8px; " class="q-pa-none">{{ data.day }}</q-card-section>
        </q-card>
      </q-btn>
    </template>
  </q-card>
</template>

<script>
import {ref, toRefs} from 'vue'
import {theme} from "src/services/other/tools";

export default {
  name: "ScheduleWeekButtons",
  props: {
    buttonsData: Array,
  },
  emits: [
    'incrementWeek',
    'decrementWeek',
    'changeDateByIndex'
  ],
  setup(props, {emit}) {
    const {buttonsData} = toRefs(props);

    const incrementWeek = () => {
      emit('incrementWeek')
    }

    const decrementWeek = () => {
      emit('decrementWeek')
    }

    const changeSelectedDateByButtonIndex = (index) => {
      emit('changeDateByIndex', index)
    }

    return {
      buttonsDataValue: ref(buttonsData),
      decrementWeek,
      incrementWeek,
      changeSelectedDateByButtonIndex,
      theme,
    }
  }
}
</script>

<style scoped>

</style>
