<template>
  <q-page>
    <div>
      <q-select square borderless outlined v-model="univSelectValue" use-input hide-selected fill-input
                label="Выберите университет" :options="univFilteredOptions" option-label="univName"
                @filter="filterUniversitiesFn" transition-show="jump-up" transition-hide="jump-up" bottom-slots
                behavior="menu">
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label v-html="scope.opt.univName"/>
              <q-item-label caption>{{ scope.opt.city }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">Не найдено</q-item-section>
          </q-item>
        </template>
        <template v-slot:append>
          <q-icon name="search"/>
        </template>
      </q-select>
      <q-select style="margin-top: -15px; max-height: 100px" square borderless outlined v-model="groupSelectValue"
                use-input
                hide-selected fill-input label="Выберите группу" :options="groupsFilteredOptions"
                option-label="groupName" @filter="filterGroupsFn" transition-show="jump-up" transition-hide="jump-up"
                bottom-slots tabindex="5" behavior="menu">
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label v-html="scope.opt.groupName"/>
              <q-item-label caption>{{ scope.opt.faculty }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">Не найдено</q-item-section>
          </q-item>
        </template>
        <template v-slot:append>
          <q-icon name="search"/>
        </template>
      </q-select>
      <div>
        <q-btn no-caps :label="firstDayButtonString" @click="changeSelectedDateByOffset(-3)"/>
        <q-btn no-caps :label="secondDayButtonString" @click="changeSelectedDateByOffset(-2)"/>
        <q-btn no-caps :label="thirdDayButtonString" @click="changeSelectedDateByOffset(-1)"/>
        <q-btn class="bg-primary" no-caps :label="fourthDayButtonString"/>
        <q-btn no-caps :label="fifthDayButtonString" @click="changeSelectedDateByOffset(1)"/>
        <q-btn no-caps :label="sixthDayButtonString" @click="changeSelectedDateByOffset(2)"/>
        <q-btn no-caps :label="seventhDayButtonString" @click="changeSelectedDateByOffset(3)"/>
      </div>
      <div>
        <q-list>
          <q-item-label id="header-news" style="color: #1976D2; text-align: center" header>
            Последние новости
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
                            v-if="isCurrentLessonGoes(getNumberOfWeek(selectedDate), lesson.lessons[0].day, lesson.time.lessonBeginTime, lesson.time.lessonFinishTime)"
                            outline square color="red" text-color="white" icon="alarm" label="Идёт сейчас"/>
                  </div>
                  <div>
                    <q-item-label class="list-title">{{ lesson.lessons[0].name }}</q-item-label>
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
                    <q-item-label class="list-title">{{ lesson.lessons[0].name }}</q-item-label>
                  </q-item>
                </q-item-section>
                <q-item-section>
                  <q-item>
                    <q-item-label class="list-title">{{ lesson.lessons[1].name }}</q-item-label>
                  </q-item>
                </q-item-section>
              </q-item>
            </template>

            <template v-else>
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
            </template>
          </template>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script>
import {onMounted, ref, watch} from "vue";
import {useStore} from "vuex";
import {
  getLessonFromSelectedDate,
  getNumberOfWeek,
  getTableRowsFromLessons,
  getWeekDayStringFromDate,
  getScheduleCellColor, isCurrentLessonGoes, getDateString, getShortDayOfWeekStringByDayEnum
} from "src/composables/schedule/ScheduleTable";
import {useQuasar} from "quasar";

export default {
  name: "mSchedule.vue",
  setup() {
    const store = useStore();
    const $q = useQuasar();

    const title = ref('');
    const groupSelectValue = ref(null);
    const univSelectValue = ref(null);
    const univSelectOptions = ref([]);
    const univFilteredOptions = ref(univSelectOptions.value);
    const groupsSelectOptions = ref([]);
    const groupsFilteredOptions = ref(groupsSelectOptions.value);
    const currentDayLessons = ref([]);
    const selectedDate = ref(new Date(2021, 8, 6));

    const firstDayButtonString = ref('');
    const secondDayButtonString = ref('');
    const thirdDayButtonString = ref('');
    const fourthDayButtonString = ref('');
    const fifthDayButtonString = ref('');
    const sixthDayButtonString = ref('');
    const seventhDayButtonString = ref('');

    const filterUniversitiesFn = (val, update, abort) => {
      update(() => {
        const needle = val.toLocaleLowerCase();
        if (needle === '') {
          univFilteredOptions.value = univSelectOptions.value;
        } else {
          univFilteredOptions.value = univSelectOptions.value.filter((v) => {
              return v.univName.toLowerCase().includes(needle)
            }
          );
        }
      });
    }

    const filterGroupsFn = (val, update, abort) => {
      update(() => {
        const needle = val.toLocaleLowerCase();
        if (needle === '') {
          groupsFilteredOptions.value = groupsSelectOptions.value;
        } else {
          groupsFilteredOptions.value = groupsSelectOptions.value.filter((v) => {
              return v.groupName.toLowerCase().includes(needle)
            }
          );
        }
      });
    }

    watch(univSelectValue, async (newValue) => {
      try {
        let selectedUnivId;
        if (newValue !== null && (selectedUnivId = newValue.univId)) {
          groupsSelectOptions.value = await store.dispatch('schedule/getGroupNamesByUnivAction', {
            univId: selectedUnivId
          })
          localStorage.setItem('lastLoadedUniv', JSON.stringify(newValue));
        }
      } catch (e) {
        localStorage.removeItem("lastLoadedUniv");
        univSelectValue.value = null;
      }

    })

    const loadGroupSchedule = async (val) => {
      try {
        if (val !== null && val.groupName !== '') {
          const selectedGroupId = val.groupId;
          const selectedGroup = await store.dispatch('schedule/getGroupById', {
            grId: selectedGroupId,
          });
          title.value = 'Группа: ' + selectedGroup.name + " (" + selectedGroup.universityEntity.name + ")";
          localStorage.setItem('lastLoadedGroup', JSON.stringify(val));

          currentDayLessons.value = getLessonFromSelectedDate(selectedGroup.lessons, selectedDate.value);

          //scheduleRows.value = getTableRowsFromLessons(selectedGroup.lessons, selectedWeek.value);
        } else {
          title.value = '';
        }
      } catch (e) {
        localStorage.removeItem("lastLoadedGroup");
        groupSelectValue.value = null;
      }

    }

    const changeSelectedDateByOffset = (offset) => {
      const newDate = new Date(selectedDate.value);
      newDate.setDate(newDate.getDate() + offset);
      selectedDate.value = newDate;
    }

    const getDayButtonDateByOffset = (offset) => {
      let tempDate = new Date(selectedDate.value);
      tempDate.setDate(tempDate.getDate() + offset);
      return tempDate;
    }

    const updateDaysButtonsString = () => {
      const mondayDate = getDayButtonDateByOffset(-3);
      firstDayButtonString.value = mondayDate.getDate() + '\n' + getShortDayOfWeekStringByDayEnum(getWeekDayStringFromDate(mondayDate));

      const tuesdayDate = getDayButtonDateByOffset(-2);
      secondDayButtonString.value = tuesdayDate.getDate() + '\n' + getShortDayOfWeekStringByDayEnum(getWeekDayStringFromDate(tuesdayDate));

      const wednesdayDate = getDayButtonDateByOffset(-1);
      thirdDayButtonString.value = wednesdayDate.getDate() + '\n' + getShortDayOfWeekStringByDayEnum(getWeekDayStringFromDate(wednesdayDate));

      fourthDayButtonString.value = selectedDate.value.getDate() + '\n' + getShortDayOfWeekStringByDayEnum(getWeekDayStringFromDate(selectedDate.value));

      const fridayDate = getDayButtonDateByOffset(1);
      fifthDayButtonString.value = fridayDate.getDate() + '\n' + getShortDayOfWeekStringByDayEnum(getWeekDayStringFromDate(fridayDate));

      const saturdayDate = getDayButtonDateByOffset(2);
      sixthDayButtonString.value = saturdayDate.getDate() + '\n' + getShortDayOfWeekStringByDayEnum(getWeekDayStringFromDate(saturdayDate));

      const sundayDate = getDayButtonDateByOffset(3);
      seventhDayButtonString.value = sundayDate.getDate() + '\n' + getShortDayOfWeekStringByDayEnum(getWeekDayStringFromDate(sundayDate));
    }

    watch(groupSelectValue, (val) => {
      loadGroupSchedule(val)
    })

    watch(selectedDate, (val) => {
      updateDaysButtonsString();
      loadGroupSchedule(groupSelectValue.value)
    })

    onMounted(async () => {
      univSelectOptions.value = await store.dispatch('schedule/getUniversitiesNamesAction');

      let lastLoadedUniv = localStorage.getItem('lastLoadedUniv');
      let lastLoadedGroup = localStorage.getItem('lastLoadedGroup');

      if ((typeof lastLoadedUniv !== 'undefined') && lastLoadedUniv !== null) {
        univSelectValue.value = JSON.parse(lastLoadedUniv);
      }
      if ((typeof lastLoadedGroup !== 'undefined') && lastLoadedGroup !== null) {
        groupSelectValue.value = JSON.parse(lastLoadedGroup);
      }

      updateDaysButtonsString();
    })

    return {
      univSelectValue,
      univFilteredOptions,
      groupSelectValue,
      groupsFilteredOptions,
      currentDayLessons,
      selectedDate,
      firstDayButtonString,
      secondDayButtonString,
      thirdDayButtonString,
      fourthDayButtonString,
      fifthDayButtonString,
      sixthDayButtonString,
      seventhDayButtonString,
      filterUniversitiesFn,
      filterGroupsFn,
      getScheduleCellColor,
      isCurrentLessonGoes,
      getNumberOfWeek,
      changeSelectedDateByOffset,
      debug(val) {
        console.log(val)
      }
    }
  }
}
</script>

<style>

</style>
