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
      <q-card flat square style="text-align: center;" class="row justify-between q-px-sm" >
        <template v-for="(data, index) in buttonsData" :key="data" >
          <q-btn style="height: 14px; width: 14px; border: 1px solid #1976D2" flat no-caps :class="data.selected ? 'bg-primary' : ''" @click="changeSelectedDateByButtonIndex(index)">
            <q-card style="background-color: rgba(255,255,255,0);" :style="data.selected ? 'color: white' : ''" :class="data.selected ? 'bg-primary' : ''" flat class="q-pa-none">
              <q-card-section style="line-height: 13px; font-size: 9px;" class="q-pa-none">{{ data.date }}</q-card-section>
              <q-card-section style="line-height: 12px;font-size: 8px; " class="q-pa-none">{{ data.day }}</q-card-section>
            </q-card>
          </q-btn>
        </template>
      </q-card>
      <div>
        <q-btn @click="decrWeek">Decr</q-btn>
        <q-btn @click="incrWeek">Incr</q-btn>
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
  getScheduleCellColor, isCurrentLessonGoes, getDateString, getShortDayWeekString, getDateOfMonday
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
    const selectedDate = ref(new Date(2021, 8, 10));

    const buttonsData = ref([]);

    for (let i = 0; i < 7; i++) {
      let buttonDataObject = {}
      buttonDataObject['day'] = '';
      buttonDataObject['date'] = ''
      buttonDataObject['offset'] = 0;
      buttonDataObject['center'] = false;
      buttonsData.value[i] = buttonDataObject;
    }

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

    const changeSelectedDateByButtonIndex = (index) => {
      index++;
      let indexOfSelectedDate = [7, 1, 2, 3, 4, 5, 6][selectedDate.value.getDay()];

      if (index > indexOfSelectedDate) {
        changeSelectedDateByOffset(index - indexOfSelectedDate)
      } else if(index < indexOfSelectedDate){
        changeSelectedDateByOffset(-(indexOfSelectedDate - index))
        console.log(-(indexOfSelectedDate - index))
      }
    }

    const incrWeek = ()=> {
      let tempDate = new Date(selectedDate.value);
      tempDate.setDate(tempDate.getDate() + 7)
      selectedDate.value = tempDate;
    }

    const decrWeek = ()=> {
      let tempDate = new Date(selectedDate.value);
      tempDate.setDate(tempDate.getDate() - 7)
      selectedDate.value = tempDate;
    }

    const updateButtonsDataString = () => {
      let tempDate = getDateOfMonday(selectedDate.value);

      buttonsData.value[0].day = 'Пн';
      buttonsData.value[0].date = tempDate.getDate().toString();
      buttonsData.value[0].selected = tempDate.toString() === selectedDate.value.toString();
      tempDate.setDate(tempDate.getDate() + 1)


      buttonsData.value[1].day = 'Вт';
      buttonsData.value[1].date = tempDate.getDate().toString();
      buttonsData.value[1].selected = tempDate.toString() === selectedDate.value.toString();
      tempDate.setDate(tempDate.getDate() + 1)

      buttonsData.value[2].day = 'Ср';
      buttonsData.value[2].date = tempDate.getDate().toString();
      buttonsData.value[2].selected = tempDate.toString() === selectedDate.value.toString();
      tempDate.setDate(tempDate.getDate() + 1)

      buttonsData.value[3].day = 'Чт';
      buttonsData.value[3].date = tempDate.getDate().toString();
      buttonsData.value[3].selected = tempDate.toString() === selectedDate.value.toString();
      tempDate.setDate(tempDate.getDate() + 1)

      buttonsData.value[4].day = 'Пт';
      buttonsData.value[4].date = tempDate.getDate().toString();
      buttonsData.value[4].selected = tempDate.toString() === selectedDate.value.toString();
      tempDate.setDate(tempDate.getDate() + 1)


      buttonsData.value[5].day = 'Сб';
      buttonsData.value[5].date = tempDate.getDate().toString();
      buttonsData.value[5].selected = tempDate.toString() === selectedDate.value.toString();
      tempDate.setDate(tempDate.getDate() + 1)

      buttonsData.value[6].day = 'Вс'
      buttonsData.value[6].date = tempDate.getDate().toString();
      buttonsData.value[6].selected = tempDate.toString() === selectedDate.value.toString();
      console.log(selectedDate.value)
    }

    watch(groupSelectValue, (val) => {
      loadGroupSchedule(val)
    })

    watch(selectedDate, (val) => {
      updateButtonsDataString();
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

      updateButtonsDataString();
    })

    return {
      univSelectValue,
      univFilteredOptions,
      groupSelectValue,
      groupsFilteredOptions,
      currentDayLessons,
      selectedDate,
      buttonsData,
      filterUniversitiesFn,
      filterGroupsFn,
      getScheduleCellColor,
      isCurrentLessonGoes,
      getNumberOfWeek,
      changeSelectedDateByButtonIndex,
      incrWeek,
      decrWeek,
      debug(val) {
        console.log(val)
      }
    }
  }
}
</script>

<style>

</style>
