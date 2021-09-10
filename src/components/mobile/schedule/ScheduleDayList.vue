<template>
  <q-list v-touch-swipe.right="swipeLeftSchedule" v-touch-swipe.left="swipeRightSchedule">
    <q-item-label id="header-news" style="color: #1976D2; text-align: center" header>
      Расписание
      <q-separator class="q-my-sm" style="margin-left: 50px; margin-right: 50px"/>
    </q-item-label>
    <template v-for="lesson in currentDayLessons" :key="lesson.lessonId">

      <template v-if="lesson.lessons.length === 1">
        <q-item style="text-align: center" clickable :to="'/'">
          <q-item-section style="text-align: left">
            <div>
              <q-item-label>
                <q-chip square :style="getScheduleCellColor(lesson.lessons[0])">
                  {{ lesson.lessonNumber }}
                </q-chip>
              </q-item-label>
              <q-item-label>{{ lesson.time.lessonBeginTime }} - {{ lesson.time.lessonFinishTime }}</q-item-label>
              <q-chip style="border: none; font-size: 12px"
                      v-if="isCurrentLessonGoes(getNumberOfWeek(selectedDateValue), lesson.lessons[0].day, lesson.time.lessonBeginTime, lesson.time.lessonFinishTime)"
                      outline square color="red" text-color="white" icon="alarm" label="Идёт сейчас"/>
            </div>
            <div>
              <q-item-label class="list-title">{{  rawLessonStringMode ? lesson.lessons[0].rawLessonString : lesson.lessons[0].name }}</q-item-label>
            </div>
          </q-item-section>
        </q-item>
      </template>

      <template v-else-if="lesson.lessons.length === 2">
        <q-item style="text-align: center" clickable :to="'/'">
          <q-item-section>
            <div>
              <q-item-label>
                <q-chip square :style="getScheduleCellColor(lesson.lessons[0])">
                  {{ lesson.lessonNumber }}
                </q-chip>
              </q-item-label>
              <q-item-label>{{ lesson.time.lessonBeginTime }} - {{ lesson.time.lessonFinishTime }}</q-item-label>
              <q-chip style="border: none; font-size: 12px"
                      v-if="isCurrentLessonGoes(getNumberOfWeek(selectedDate), lesson.lessons[0].day, lesson.time.lessonBeginTime, lesson.time.lessonFinishTime)"
                      outline square color="red" text-color="white" icon="alarm" label="Идёт сейчас"/>
            </div>
          </q-item-section>
          <q-item-section>
            <q-item>
              <q-item-label class="list-title">{{  rawLessonStringMode ? lesson.lessons[0].rawLessonString : lesson.lessons[0].name }}</q-item-label>
            </q-item>
          </q-item-section>
          <q-item-section>
            <q-item>
              <q-item-label class="list-title">{{  rawLessonStringMode ? lesson.lessons[1].rawLessonString : lesson.lessons[1].name }}</q-item-label>
            </q-item>
          </q-item-section>
        </q-item>
      </template>

      <template v-else>
        <q-item>
          <q-item-section>
            <div>
              <q-item-label>
                <q-chip square color="grey">
                  {{ lesson.lessonNumber }}
                </q-chip>
              </q-item-label>
              <q-item-label>{{ lesson.time.lessonBeginTime }} - {{ lesson.time.lessonFinishTime }}</q-item-label>
            </div>
          </q-item-section>
        </q-item>
      </template>
    </template>
  </q-list>
</template>

<script>
import {toRefs, ref, watch} from 'vue'
import {isCurrentLessonGoes, getNumberOfWeek, getScheduleCellColor} from "src/composables/schedule/ScheduleTable";

export default {
  name: "ScheduleDayList",
  props : {
    lessons : Array,
    selectedDate : Date,
    rlsMode : Boolean,
  },
  setup(props, {emit}) {
    const {lessons, rlsMode, selectedDate} = toRefs(props);

    const swipeRightSchedule = ()=> {
      emit('swipeRightSchedule')
    }

    const swipeLeftSchedule = ()=> {
      emit('swipeLeftSchedule')
    }

    return {
      currentDayLessons : ref(lessons),
      rawLessonStringMode : ref(rlsMode),
      selectedDateValue : ref(selectedDate),
      swipeRightSchedule,
      swipeLeftSchedule,
      isCurrentLessonGoes,
      getNumberOfWeek,
      getScheduleCellColor
    }
  }
}
</script>

<style scoped>

</style>
