<template>
  <q-list v-touch-swipe.right="swipeLeftSchedule" v-touch-swipe.left="swipeRightSchedule">
    <q-item-label id="header-news" style="color: #1976D2; text-align: center" header>
      Расписание
      <q-separator class="q-my-sm" style="margin-left: 50px; margin-right: 50px"/>
    </q-item-label>
    <template v-for="lesson in currentDayLessons" :key="lesson.lessonId">

      <template v-if="lesson.lessons.length === 1">
        <q-item style="text-align: center" clickable @click="openLessonInfoDialog(lesson.lessons[0], lesson.time)">
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
        <q-item style="text-align: center">
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
            <q-item clickable @click="openLessonInfoDialog(lesson.lessons[0], lesson.time)">
              <q-item-label class="list-title">{{  rawLessonStringMode ? lesson.lessons[0].rawLessonString : lesson.lessons[0].name }}</q-item-label>
            </q-item>
          </q-item-section>
          <q-item-section>
            <q-item clickable @click="openLessonInfoDialog(lesson.lessons[1], lesson.time)">
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
  <q-dialog square v-model="lessonInfoDialog" position="bottom">
    <q-card flat>
      <q-card-section class="row q-pa-none q-ma-none" >
        <q-btn style="width: 48px;" flat round icon="arrow_back" dense v-close-popup/>
        <span class="title-page">Информация о занятии</span>
      </q-card-section>
      <q-separator/>
      <template v-if="lessonInfoType">
        <q-card-section :style="getTypeColorByValue(lessonInfoType)">
          {{getTypeNameByValue(lessonInfoType)}}
        </q-card-section>
        <q-separator/>
      </template>
      <q-card-section>
        {{lessonInfoTimeString}}
      </q-card-section>
      <q-card-section>
        {{lessonInfoText}}
      </q-card-section>
<!--      <template v-if="lessonInfoAudience">-->
<!--        <q-separator/>-->
<!--        <q-card-section >-->
<!--          {{lessonInfoAudience}}-->
<!--        </q-card-section>-->
<!--      </template>-->
    </q-card>
  </q-dialog>
</template>

<script>
import {toRefs, ref, watch} from 'vue'
import {isCurrentLessonGoes, getNumberOfWeek, getScheduleCellColor,getTypeNameByValue, getTypeColorByValue} from "src/composables/schedule/ScheduleTable";

export default {
  name: "ScheduleDayList",
  props : {
    lessons : Array,
    selectedDate : Date,
    rlsMode : Boolean,
  },
  emits : [
    'swipeRightSchedule',
    'swipeLeftSchedule'
  ],
  setup(props, {emit}) {
    const {lessons, rlsMode, selectedDate} = toRefs(props);
    const rawLessonStringMode = ref(rlsMode);
    const lessonInfoDialog = ref(false);
    const lessonInfoType = ref(null);
    const lessonInfoText = ref('');
    const lessonInfoAudience = ref('');
    const lessonInfoTimeString = ref('');

    const swipeRightSchedule = ()=> {
      emit('swipeRightSchedule')
    }

    const swipeLeftSchedule = ()=> {
      emit('swipeLeftSchedule')
    }

    const openLessonInfoDialog = (lesson, time) => {
      if (lesson.name && lesson.name !== '' && time) {
        lessonInfoDialog.value = true;
        const audienceValue = lesson.audienceEntity.audience;
        const typeValue =  lesson.typeEntity.typeName;
        lessonInfoAudience.value = audienceValue !== 'UNKNOWN' &&  audienceValue !== '' ? audienceValue : null;
        lessonInfoType.value = typeValue !== 'UNKNOWN' &&  typeValue !== '' ? typeValue : null;
        lessonInfoText.value = rawLessonStringMode.value ? lesson.rawLessonString : lesson.name;
        lessonInfoTimeString.value = time.lessonBeginTime +  '-'  + time.lessonFinishTime;
    }
    }

    return {
      rawLessonStringMode,
      lessonInfoDialog,
      lessonInfoText,
      lessonInfoType,
      lessonInfoAudience,
      lessonInfoTimeString,
      currentDayLessons : ref(lessons),
      selectedDateValue : ref(selectedDate),
      swipeRightSchedule,
      swipeLeftSchedule,
      isCurrentLessonGoes,
      getNumberOfWeek,
      getScheduleCellColor,
      openLessonInfoDialog,
      getTypeNameByValue,
      getTypeColorByValue
    }
  }
}
</script>

<style scoped>

</style>
