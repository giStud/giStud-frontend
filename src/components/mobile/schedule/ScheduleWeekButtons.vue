<template>
  <q-card v-touch-swipe.right="decrementWeek" v-touch-swipe.left="incrementWeek" flat square style="text-align: center;" class="row justify-between q-px-sm" >
    <template v-for="(data, index) in buttonsData" :key="data" >
      <q-btn style="height: 14px; width: 14px; border: 1px solid #1976D2" flat no-caps :class="data.selected ? 'bg-primary' : ''" @click="changeSelectedDateByButtonIndex(index)">
        <q-card style="background-color: rgba(255,255,255,0);" :style="data.selected ? 'color: white' : ''" :class="data.selected ? 'bg-primary' : ''" flat class="q-pa-none">
          <q-card-section style="line-height: 13px; font-size: 9px;" class="q-pa-none">{{ data.date }}</q-card-section>
          <q-card-section style="line-height: 12px;font-size: 8px; " class="q-pa-none">{{ data.day }}</q-card-section>
        </q-card>
      </q-btn>
    </template>
  </q-card>
</template>

<script>
import {toRefs, ref, watch} from 'vue'

export default {
  name: "ScheduleWeekButtons",
  props : {
    buttonsData : Array,
  },
  setup(props, {emit}) {
    const {buttonsData} = toRefs(props);

    const incrementWeek = ()=> {
      emit('incrementWeek')
    }

    const decrementWeek = () => {
      emit('decrementWeek')
    }

    const changeSelectedDateByButtonIndex = (index)=> {
      emit('changeDateByIndex', index)
    }

    return {
      buttonsDataValue : ref(buttonsData),
      decrementWeek,
      incrementWeek,
      changeSelectedDateByButtonIndex
    }
  }
}
</script>

<style scoped>

</style>
