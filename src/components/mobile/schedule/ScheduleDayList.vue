<template>
  <q-list v-touch-swipe.left="swipeRightSchedule" v-touch-swipe.right="swipeLeftSchedule">
    <template v-for="lesson in currentDayLessons" :key="lesson.lessonId">

      <template v-if="lesson.lessons.length === 1">
        <q-item class="q-pa-none q-ma-none" clickable style="text-align: center">
          <q-item-section class="q-pb-md" style="text-align: left">
            <div> <!-- Див для одной строчки -->
              <q-item-label class="row justify-between">
                <div class="row justify-start items-center">
                  <q-chip :style="getScheduleCellColor(lesson.lessons[0])" class="q-ma-none q-px-md q-py-sm chip-number" size="12px" square>
                    {{ lesson.lessonNumber }}
                  </q-chip>
                  <q-item-label class="q-px-sm q-py-none">
                    <span>{{ lesson.time.lessonBeginTime }}</span>
                    <span style="color: gray"> - {{ lesson.time.lessonFinishTime }}</span>
                  </q-item-label>
                </div>
                <q-chip v-if="isCurrentLessonGoes(getNumberOfWeek(selectedDateValue), lesson.lessons[0], lesson.time.lessonBeginTime, lesson.time.lessonFinishTime)" class="q-my-none q-py-none" color="red" icon="alarm" label="Идёт сейчас" outline square style="border: none; font-size: 10px" text-color="white">
                </q-chip>
              </q-item-label>
            </div>
            <q-item class="q-pa-none fix-px q-ma-none q-py-sm items-center" clickable :style="theme('background-color: #e6edf5', 'background-color: #2f3136')" @click="openLessonInfoDialog(lesson.lessons[0], lesson.time)">
              <span v-if="lesson.lessons[0].rawLessonString === '' || lesson.lessons[0].name === ''" class="text-grey">Нет занятий</span>
              <span v-else>{{ rawLessonStringMode ? lesson.lessons[0].rawLessonString : lesson.lessons[0].name }}</span>
            </q-item>
          </q-item-section>
        </q-item>
      </template>

      <template v-else-if="lesson.lessons.length === 2">
        <q-item class="q-pa-none q-ma-none" clickable style="text-align: center">
          <q-item-section class="q-pb-md" style="text-align: left">
            <div> <!-- Див для одной строчки -->
              <q-item-label class="row justify-between">
                <div class="row justify-start items-center">
                  <q-chip :style="getScheduleCellColor(lesson.lessons[0])" class="q-ma-none q-px-md q-py-sm chip-number" size="12px" square>
                    {{ lesson.lessonNumber }}
                  </q-chip>
                  <q-item-label class="q-px-sm q-py-none" >
                    <span>{{ lesson.time.lessonBeginTime }}</span>
                    <span style="color: gray"> - {{ lesson.time.lessonFinishTime }}</span>
                  </q-item-label>
                </div>
                <q-chip v-if="isCurrentLessonGoes(getNumberOfWeek(selectedDateValue), lesson.lessons[0], lesson.time.lessonBeginTime, lesson.time.lessonFinishTime)" class="q-my-none q-py-none" color="red" icon="alarm" label="Идёт сейчас" outline square style="border: none; font-size: 10px" text-color="white">
                </q-chip>
              </q-item-label>
            </div>
            <div class="q-pa-none fix-px q-ma-none" :style="theme('background-color: #e6edf5', 'background-color: #2f3136')">
              <q-item class="q-pa-none q-py-sm  items-center" clickable @click="openLessonInfoDialog(lesson.lessons[0], lesson.time)">
                <span v-if="lesson.lessons[0].rawLessonString === '' || lesson.lessons[0].name === ''" class="text-grey">Нет занятий</span>
                <span v-else>{{
                    rawLessonStringMode ? lesson.lessons[0].rawLessonString : lesson.lessons[0].name
                  }}</span>
              </q-item>
              <q-separator class="" />
              <q-item class="q-pa-none q-py-s items-center" clickable @click="openLessonInfoDialog(lesson.lessons[1], lesson.time)">
                <span v-if="lesson.lessons[1].rawLessonString === '' || lesson.lessons[1].name === ''" class="text-grey" style="line-height: 14px">Нет занятий</span>
                <span v-else style="line-height: 14px">{{
                    rawLessonStringMode ? lesson.lessons[1].rawLessonString : lesson.lessons[1].name
                  }}</span>
              </q-item>
            </div>
          </q-item-section>
        </q-item>
      </template>

      <template v-else>
        <q-item class="q-pa-none q-ma-none" clickable style="text-align: center">
          <q-item-section class="q-pb-md" style="text-align: left">
            <div> <!-- Див для одной строчки -->
              <q-item-label class="row justify-between">
                <div class="row justify-start items-center">
                  <q-chip class="q-ma-none q-px-md q-py-sm chip-number" size="12px" square :style="theme('', 'background-color: gray')">
                    {{ lesson.lessonNumber }}
                  </q-chip>
                  <q-item-label class="q-px-sm q-py-none" >
                    <span>{{ lesson.time.lessonBeginTime }}</span>
                    <span style="color: gray"> - {{ lesson.time.lessonFinishTime }}</span>
                  </q-item-label>
                </div>
              </q-item-label>
            </div>
            <q-item class="q-pa-none fix-px q-ma-none q-py-sm items-center" clickable :style="theme('background-color: #e6edf5', 'background-color: #2f3136')">
              <span class="text-grey">Нет занятий</span>
            </q-item>
          </q-item-section>
        </q-item>
      </template>

    </template>
  </q-list>

  <q-dialog v-model="lessonInfoDialog" position="bottom" square>
    <q-card flat>
      <q-card-section class="row q-pa-none q-ma-none">
        <q-btn v-close-popup dense flat icon="arrow_back" round style="width: 48px;" />
        <span class="title-page-dialog">Информация о занятии</span>
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
import {theme} from "src/services/other/tools";

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
        const typeValue = lesson.typeEntity.typeName;
        lessonInfoAudience.value = lesson.audience;
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
      getTypeColorByValue,
      theme
    }
  }
}
</script>

<style scoped>
.chip-number {
  border-radius: 0 5px 5px 0;
}

.fix-px {
  padding-right: 15px;
  padding-left: 15px;
}

.fix-mx {
  margin-right: 15px;
  margin-left: 15px;
}
.title-page-dialog {
  font-size: 18px;
  padding: 14px 15px;
  line-height: 20px;
}
</style>
