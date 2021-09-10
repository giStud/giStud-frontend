<template>
  <q-page>
    <div>
      <q-dialog maximized square v-model="groupSelectDialog" transition-show="slide-left" transition-hide="slide-right">
       <q-card flat>
         <q-card-section class="row q-pa-none q-ma-none">
           <q-btn style="width: 48px;" flat round icon="arrow_back" dense v-close-popup/>
           <span class="title-page">Выбор группы</span>
         </q-card-section>
         <q-separator/>
         <q-card-section>
           <q-select square borderless outlined dense v-model="univSelectValue" use-input hide-selected fill-input
                     :options="univFilteredOptions" option-label="univName"
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
                     hide-selected fill-input dense :options="groupsFilteredOptions"
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
         </q-card-section>
       </q-card>
      </q-dialog>

      <q-dialog maximized square v-model="settingsDialog" transition-show="slide-left" transition-hide="slide-right">
        <q-card flat>
          <q-card-section class="row q-pa-none q-ma-none">
            <q-btn style="width: 48px;" flat round icon="arrow_back" dense v-close-popup/>
            <span class="title-page">Выбор группы</span>
          </q-card-section>
          <q-separator/>
          <q-card-section>
            <q-toggle v-model="rawLessonStringMode" label="Режим без обработки: " left-label/>
          </q-card-section>
          <q-card-section>
            <template v-if="rawLessonStringMode">
              2п (л/р ) Электротех. и электроника асс.Белых М.А. ауд.307/3 числитель
            </template>
            <template v-else>
              2п Электротех. и электроника асс.Белых М.А. ауд.307/3
            </template>
          </q-card-section>
        </q-card>
      </q-dialog>

      <div>
        {{ selectedDate.getDate() + ' ' + getMonthStringByDate(selectedDate) + ',' + currentWeekType }}
      </div>

      <div>
        <q-btn class="" color="black" round flat no-caps icon="today">
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-date v-model="datePickerDate"
                    :options="(date)=>{ return date >= '2020/09/01' && date <= '2100/09/01' }">
              <div class="row items-center justify-end q-gutter-sm">
                <q-btn label="Перейти" color="primary" flat @click="selectedDate = new Date(datePickerDate)" v-close-popup/>
                <q-btn label="Отмена" color="primary" flat v-close-popup/>
              </div>
            </q-date>
          </q-popup-proxy>
        </q-btn>
      </div>

      <q-btn @click="groupSelectDialog = true">GAVNO</q-btn>
      <q-btn @click="settingsDialog = true">GAVNO SETTINGS</q-btn>
      <q-tab-panels
        v-model="daysButtonsPanel"
        animated
        swipeable
        infinite
      >
        <q-tab-panel name="weekButtonTab1">
          <ScheduleWeekButtons :buttons-data="buttonsData" @incrementWeek="incrementWeek" @decrementWeek="decrementWeek" @changeDateByIndex="changeSelectedDateByButtonIndex"/>
        </q-tab-panel>

        <q-tab-panel name="weekButtonTab2">
          <ScheduleWeekButtons :buttons-data="buttonsData" @incrementWeek="incrementWeek" @decrementWeek="decrementWeek" @changeDateByIndex="changeSelectedDateByButtonIndex"/>
        </q-tab-panel>

      </q-tab-panels>
      <q-tab-panels
        v-model="schedulePanel"
        animated
        swipeable
        infinite

      >
        <q-tab-panel name="scheduleTab1" class="q-pa-none">
          <ScheduleDayList :lessons="currentDayLessons" :rls-mode="rawLessonStringMode" :selected-date="selectedDate" @swipeRightSchedule="swipeRightSchedule" @swipeLeftSchedule="swipeLeftSchedule"/>
        </q-tab-panel>
        <q-tab-panel name="scheduleTab2" class="q-pa-none">
          <ScheduleDayList :lessons="currentDayLessons" :rls-mode="rawLessonStringMode" :selected-date="selectedDate" @swipeRightSchedule="swipeRightSchedule" @swipeLeftSchedule="swipeLeftSchedule"/>
        </q-tab-panel>
      </q-tab-panels>
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
  getScheduleCellColor,
  isCurrentLessonGoes,
  getDateString,
  getShortDayWeekString,
  getDateOfMonday,
  getMonthStringByDate, getTypeOfWeek
} from "src/composables/schedule/ScheduleTable";
import {useQuasar} from "quasar";
import ScheduleWeekButtons from "components/mobile/schedule/ScheduleWeekButtons";
import ScheduleDayList from "components/mobile/schedule/ScheduleDayList";
import UtilsService from "src/services/other/utilsService";

function formatDate(date) {
  let dd = date.getDate();
  if (dd < 10) dd = '0' + dd;
  let mm = date.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;
  let yy = date.getFullYear();
  return yy + '/' + mm + '/' + dd;
}

export default {
  name: "mSchedule.vue",
  components : {
    ScheduleWeekButtons,
    ScheduleDayList
  },
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
    const datePickerDate = ref(formatDate(new Date()));
    const rawLessonStringMode = ref(false);
    const groupSelectDialog = ref(false)
    const settingsDialog = ref(false);
    const currentWeekType = ref('');

    const daysButtonsPanel = ref('weekButtonTab1');
    const schedulePanel = ref('scheduleTab1');
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
    }

    const decrementWeek = async ()=> {
      await UtilsService.sleep(200);
      let tempDate = new Date(selectedDate.value);
      tempDate.setDate(tempDate.getDate() - 7)
      selectedDate.value = tempDate;
    }

    const incrementWeek = async () => {
      await UtilsService.sleep(200);
      let tempDate = new Date(selectedDate.value);
      tempDate.setDate(tempDate.getDate() + 7)
      selectedDate.value = tempDate;
    }

    const swipeRightSchedule = async() => {
      await UtilsService.sleep(150);
      let tempDate = new Date(selectedDate.value);
      tempDate.setDate(tempDate.getDate() + 1)
      selectedDate.value = tempDate;
    }

    const swipeLeftSchedule = async() => {
      await UtilsService.sleep(150);
      let tempDate = new Date(selectedDate.value);
      tempDate.setDate(tempDate.getDate() - 1)
      selectedDate.value = tempDate;
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

    watch(groupSelectValue, (val) => {
      loadGroupSchedule(val)
      groupSelectDialog.value = false;
    })

    watch(selectedDate, (val) => {
      if (val) {
        updateButtonsDataString();
        loadGroupSchedule(groupSelectValue.value)
        currentWeekType.value = getTypeOfWeek(getNumberOfWeek(val)) === 'NUMERATOR' ? 'числитель' : 'знаменатель';
      }
    })

    onMounted(async () => {
      univSelectOptions.value = await store.dispatch('schedule/getUniversitiesNamesAction');

      let lastLoadedUniv = localStorage.getItem('lastLoadedUniv');
      let lastLoadedGroup = localStorage.getItem('lastLoadedGroup');

      let dateFromStorage = new Date(localStorage.getItem('selectedDate'));
      if (dateFromStorage !== null) {
        let currentDate = getDateOfMonday(new Date());
        if (dateFromStorage < currentDate) {
          selectedDate.value = currentDate;
        } else {
          selectedDate.value = dateFromStorage;
        }
      } else {
        selectedDate.value = new Date();
      }

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
      rawLessonStringMode,
      datePickerDate,
      daysButtonsPanel,
      schedulePanel,
      groupSelectDialog,
      settingsDialog,
      currentWeekType,
      filterUniversitiesFn,
      filterGroupsFn,
      getScheduleCellColor,
      isCurrentLessonGoes,
      getNumberOfWeek,
      decrementWeek,
      incrementWeek,
      changeSelectedDateByButtonIndex,
      swipeRightSchedule,
      swipeLeftSchedule,
      getMonthStringByDate,
      debug(val) {
        console.log(val)
      }
    }
  }
}
</script>

<style>

</style>
