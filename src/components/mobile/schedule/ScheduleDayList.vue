<template>
  <q-list v-touch-swipe.left="swipeRightSchedule" v-touch-swipe.right="swipeLeftSchedule">
    <template v-for="lesson in currentDayLessons" :key="lesson.lessonId">

      <template v-if="lesson.lessons.length === 1">
        <q-item class="q-pa-none q-ma-none" clickable style="text-align: center" @click="openLessonInfoDialog(lesson.lessons[0], lesson.time)">
          <q-item-section style="text-align: left">
            <div> <!-- Див для одной строчки -->
              <q-item-label class="row justify-between">
                <div class="row justify-start items-center">
                  <q-chip size="10px" :style="getScheduleCellColor(lesson.lessons[0])" class="q-ma-none q-px-md q-py-sm chip-number" square>
                    {{ lesson.lessonNumber }}
                  </q-chip>
                  <q-item-label class="q-px-sm q-py-sm">
                    <span>{{ lesson.time.lessonBeginTime }}</span><span style="color: gray"> - {{ lesson.time.lessonFinishTime }}</span>
                  </q-item-label>
                </div>
                <q-chip v-if="isCurrentLessonGoes(getNumberOfWeek(selectedDateValue), lesson.lessons[0].day, lesson.time.lessonBeginTime, lesson.time.lessonFinishTime)" color="red" icon="alarm" label="Идёт сейчас" outline square style="border: none; font-size: 12px" text-color="white">
                </q-chip>
              </q-item-label>
            </div>
              <div class="q-pa-none q-ma-none" style="min-height: 10px">
                {{ rawLessonStringMode ? lesson.lessons[0].rawLessonString : lesson.lessons[0].name }}
              </div>
          </q-item-section>
        </q-item>
      </template>

      <template v-else-if="lesson.lessons.length === 2">
        <q-item style="text-align: center">
          <q-item-section>
            <div>
              <q-item-label>
                <q-chip :style="getScheduleCellColor(lesson.lessons[0])" square>
                  {{ lesson.lessonNumber }}
                </q-chip>
              </q-item-label>
              <q-item-label>{{ lesson.time.lessonBeginTime }} - {{ lesson.time.lessonFinishTime }}</q-item-label>
              <q-chip v-if="isCurrentLessonGoes(getNumberOfWeek(selectedDate), lesson.lessons[0].day, lesson.time.lessonBeginTime, lesson.time.lessonFinishTime)" color="red" icon="alarm" label="Идёт сейчас" outline square style="border: none; font-size: 12px" text-color="white" />
            </div>
          </q-item-section>
          <q-item-section>
            <q-item clickable @click="openLessonInfoDialog(lesson.lessons[0], lesson.time)">
              <q-item-label class="list-title">
                {{ rawLessonStringMode ? lesson.lessons[0].rawLessonString : lesson.lessons[0].name }}
              </q-item-label>
            </q-item>
          </q-item-section>
          <q-item-section>
            <q-item clickable @click="openLessonInfoDialog(lesson.lessons[1], lesson.time)">
              <q-item-label class="list-title">
                {{ rawLessonStringMode ? lesson.lessons[1].rawLessonString : lesson.lessons[1].name }}
              </q-item-label>
            </q-item>
          </q-item-section>
        </q-item>
      </template>

      <template v-else>
        <q-item>
          <q-item-section>
            <div>
              <q-item-label>
                <q-chip color="grey" square>
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
  <q-dialog v-model="lessonInfoDialog" position="bottom" square>
    <q-card flat>
      <q-card-section class="row q-pa-none q-ma-none">
        <q-btn v-close-popup dense flat icon="arrow_back" round style="width: 48px;" />
        <span class="title-page">Информация о занятии</span>
      </q-card-section>
      <q-separator />
      <template v-if="lessonInfoType">
        <q-card-section :style="getTypeColorByValue(lessonInfoType)">
          {{ getTypeNameByValue(lessonInfoType) }}
        </q-card-section>
        <q-separator />
      </template>
      <q-card-section>
        {{ lessonInfoTimeString }}
      </q-card-section>
      <q-card-section>
        {{ lessonInfoText }}
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
import {ref, toRefs} from 'vue'
import {
  getNumberOfWeek,
  getScheduleCellColor,
  getTypeColorByValue,
  getTypeNameByValue,
  isCurrentLessonGoes
} from "src/composables/schedule/ScheduleTable";

export default {
  name: "ScheduleDayList",
  props: {
    lessons: Array,
    selectedDate: Date,
    rlsMode: Boolean,
  },
  emits: [
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

    const swipeRightSchedule = () => {
      emit('swipeRightSchedule')
    }

    const swipeLeftSchedule = () => {
      emit('swipeLeftSchedule')
    }

    const openLessonInfoDialog = (lesson, time) => {
      if (lesson.name && lesson.name !== '' && time) {
        lessonInfoDialog.value = true;
        const audienceValue = lesson.audienceEntity.audience;
        const typeValue = lesson.typeEntity.typeName;
        lessonInfoAudience.value = audienceValue !== 'UNKNOWN' && audienceValue !== '' ? audienceValue : null;
        lessonInfoType.value = typeValue !== 'UNKNOWN' && typeValue !== '' ? typeValue : null;
        lessonInfoText.value = rawLessonStringMode.value ? lesson.rawLessonString : lesson.name;
        lessonInfoTimeString.value = time.lessonBeginTime + '-' + time.lessonFinishTime;
      }
    }

    return {
      rawLessonStringMode,
      lessonInfoDialog,
      lessonInfoText,
      lessonInfoType,
      lessonInfoAudience,
      lessonInfoTimeString,
      currentDayLessons: ref(lessons),
      selectedDateValue: ref(selectedDate),
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
.chip-number {
  border-radius: 0 5px 5px 0;
}
</style>
