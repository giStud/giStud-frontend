<template>
  <q-page>
    <q-card flat>
      <q-card flat square style="max-height: 81px;">
        <q-card class="row justify-between q-pa-none" flat square>
          <q-card-section class="q-pa-none">
            <q-card-section id="title-page" :class="theme('', 'bg-dark')" class="q-ma-none q-pa-none fix-px fix-pt">
              Расписание
            </q-card-section>
            <q-card-section id="top-nav-div" class="q-pa-none q-pb-sm" @click="groupSelectDialog = true">
              <span v-if="groupSelectValue" :class="theme('', 'text-grey')" class="title-page fix-px">{{ groupName }}</span>
              <span v-else :class="theme('', 'text-grey')" class="title-page fix-px">Выберите группу</span>
            </q-card-section>
          </q-card-section>
          <q-card-section class="q-pa-none q-py-sm q-px-sm">
            <q-btn flat icon="search" round size="16px" @click="groupSelectDialog = true" />
          </q-card-section>
        </q-card>
        <q-separator class="fix-mx" />
        <q-card-section :class="theme('', 'bg-dark')" class="row justify-between fix-pa">
          <q-card class="q-py-sm" flat square>
            <q-card-section class="q-pa-none" style="font-size: 12px">
              Неделя: {{currentWeek}}, {{currentWeekType}}
            </q-card-section>
            <q-card-section class="q-pa-none" style="font-size: 12px">
              День: {{selectedDate.getDate() + ' ' + getMonthStringByDate(selectedDate) }}
            </q-card-section>
          </q-card>
          <q-card flat square class="q-py-sm">
            <q-btn class="q-py-sm" flat icon="help_outline" round size="12px"
                   @click="helpDialog = true" />
            <q-btn class="q-py-sm" flat icon="settings" round size="12px"
                   @click="settingsDialog = true" />
            <q-btn class="q-py-sm" flat icon="today" no-caps round size="12px">
              <q-popup-proxy transition-hide="scale" transition-show="scale">
                <q-date :color="theme('primary','grey')" v-model="datePickerDate"
                        :options="(date)=>{ return date >= '2020/09/01' && date <= '2100/09/01' }">
                  <div class="row items-center justify-end q-gutter-sm">
                    <q-btn v-close-popup :color="theme('primary','white')" flat label="Перейти"
                           @click="selectedDate = new Date(datePickerDate)" />
                    <q-btn v-close-popup :color="theme('primary','white')" flat label="Отмена" />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-btn>
          </q-card>


        </q-card-section>

        <q-card class="q-px-none">
          <q-card flat square>

            <q-card-section class="q-pa-none fix-pb">

              <q-tab-panels v-model="daysButtonsPanel" animated infinite swipeable>
                <q-tab-panel class="q-pa-none" name="weekButtonTab1">
                  <ScheduleWeekButtons :buttons-data="buttonsData" @changeDateByIndex="changeSelectedDateByButtonIndex" @decrementWeek="decrementWeek" @incrementWeek="incrementWeek" />
                </q-tab-panel>
                <q-tab-panel class="q-pa-none" name="weekButtonTab2">
                  <ScheduleWeekButtons :buttons-data="buttonsData" @changeDateByIndex="changeSelectedDateByButtonIndex" @decrementWeek="decrementWeek" @incrementWeek="incrementWeek" />
                </q-tab-panel>

              </q-tab-panels>

            </q-card-section>

          </q-card>
        </q-card>


        <q-tab-panels
          v-model="schedulePanel"
          animated
          infinite
          swipeable
          class="q-pt-sm"
        >
          <q-tab-panel class="q-pa-none" name="scheduleTab1">
            <ScheduleDayList :lessons="currentDayLessons" :rls-mode="rawLessonStringMode" :selected-date="selectedDate"
                             @swipeLeftSchedule="swipeLeftSchedule" @swipeRightSchedule="swipeRightSchedule" />
          </q-tab-panel>
          <q-tab-panel class="q-pa-none" name="scheduleTab2">
            <ScheduleDayList :lessons="currentDayLessons" :rls-mode="rawLessonStringMode" :selected-date="selectedDate"
                             @swipeLeftSchedule="swipeLeftSchedule" @swipeRightSchedule="swipeRightSchedule" />
          </q-tab-panel>
        </q-tab-panels>
        <div style="height: 40px;"></div>
      </q-card>
    </q-card>

    <q-dialog v-model="groupSelectDialog" maximized square transition-hide="slide-right"
              transition-show="slide-left">
      <q-card flat square>
        <q-card-section class="row q-pa-none q-ma-none">
          <q-btn v-close-popup dense flat icon="arrow_back" round style="width: 48px;" />
          <span class="title-page-dialog">Выбор группы</span>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <span style="font-size: 12px">ВЫБОР УНИВЕРСИТЕТА:</span>
          <q-select :color="theme('primary','white')" v-model="univSelectValue" :options="univFilteredOptions" behavior="menu" borderless bottom-slots dense fill-input hide-selected
                    option-label="univName" outlined
                    square transition-hide="jump-up" transition-show="jump-up" use-input
                    @filter="filterUniversitiesFn">
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label v-html="scope.opt.univName" />
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
              <q-icon name="search" />
            </template>
          </q-select>
          <span style="font-size: 12px">ВЫБОР ГРУППЫ:</span>
          <q-select :color="theme('primary','white')" v-model="groupSelectValue" :options="groupsFilteredOptions" behavior="menu" borderless
                    bottom-slots
                    dense
                    fill-input hide-selected option-label="groupName" outlined
                    square style="max-height: 100px" tabindex="5"
                    transition-hide="jump-up"
                    transition-show="jump-up" use-input @filter="filterGroupsFn">
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label v-html="scope.opt.groupName" />
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
              <q-icon name="search" />
            </template>
          </q-select>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="settingsDialog" maximized square transition-hide="slide-right" transition-show="slide-left">
      <q-card flat>
        <q-card-section class="row q-pa-none q-ma-none">
          <q-btn v-close-popup dense flat icon="arrow_back" round style="width: 48px;" />
          <span class="title-page-dialog">Настройки</span>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-toggle :color="theme('primary','white')" v-model="rawLessonStringMode" label="Режим без обработки: " left-label />
        </q-card-section>
        <q-card-section class="q-pa-none ">
          <q-item class="q-pa-none q-ma-none" clickable style="text-align: center">
            <q-item-section class="q-pb-md" style="text-align: left">
              <div style="text-align: center">Пример:</div>
              <div> <!-- Див для одной строчки -->
                <q-item-label class="row justify-between">
                  <div class="row justify-start items-center">
                    <q-chip class="q-ma-none q-px-md q-py-sm chip-number" size="12px" square style="background-color: rgba(248,201,201,0.9)">
                      1
                    </q-chip>
                    <q-item-label class="q-px-sm q-py-none">
                      <span>08:30</span>
                      <span style="color: gray"> - 09.45</span>
                    </q-item-label>
                  </div>
                </q-item-label>
              </div>
              <q-item class="q-pa-none fix-px q-ma-none q-py-sm items-center" clickable :style="theme('background-color: #e6edf5', 'background-color: gray')">
                <span>
                  <template v-if="rawLessonStringMode">
                    2п (пр) Электротех. и электроника асс.Белых М.А. ауд.307/3 числитель
                  </template>
                  <template v-else>
                    2п Электротех. и электроника асс.Белых М.А. ауд.307/3
                  </template>
                </span>
              </q-item>
            </q-item-section>
          </q-item>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="helpDialog" maximized square>
      <q-card flat>
        <q-card-section class="row q-pa-none q-ma-none">
          <q-btn v-close-popup dense flat icon="arrow_back" round style="width: 48px;" />
          <span class="title-page-dialog">Справка</span>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <span>Функционал расписания:</span>
          <q-img style="border: 1px solid black" src="https://cdn.discordapp.com/attachments/887281514809802806/887790479477969026/gif.gif"/>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import {onMounted, ref, watch} from "vue";
import {useStore} from "vuex";
import {
  getDateOfMonday,
  getLessonFromSelectedDate,
  getMonthStringByDate,
  getNumberOfWeek,
  getScheduleCellColor,
  getTypeOfWeek
} from "src/composables/schedule/ScheduleTable";
import {useQuasar} from "quasar";
import ScheduleWeekButtons from "components/mobile/schedule/ScheduleWeekButtons";
import ScheduleDayList from "components/mobile/schedule/ScheduleDayList";
import UtilsService from "src/services/other/utilsService";
import {customClass, theme} from "src/services/other/tools";

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
  components: {
    ScheduleWeekButtons,
    ScheduleDayList
  },
  setup() {
    const store = useStore();
    const $q = useQuasar();

    const groupName = ref('');
    const groupSelectValue = ref(null);
    const univSelectValue = ref(null);
    const univSelectOptions = ref([]);
    const univFilteredOptions = ref(univSelectOptions.value);
    const groupsSelectOptions = ref([]);
    const groupsFilteredOptions = ref(groupsSelectOptions.value);
    const currentDayLessons = ref([]);
    const selectedDate = ref(new Date());
    const datePickerDate = ref(formatDate(new Date()));
    const rawLessonStringMode = ref(false);
    const groupSelectDialog = ref(false)
    const settingsDialog = ref(false);
    const helpDialog = ref(false);
    const currentWeekType = ref('');
    const currentWeek = ref(getNumberOfWeek(getDateOfMonday(new Date())));

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
          groupName.value = 'Группа: ' + selectedGroup.name /*+ " (" + selectedGroup.universityEntity.name + ")"*/;
          localStorage.setItem('lastLoadedGroupNew', JSON.stringify(val));

          currentDayLessons.value = getLessonFromSelectedDate(selectedGroup.lessons, selectedDate.value);
        } else {
          groupName.value = '';
        }
      } catch (e) {
        localStorage.removeItem("lastLoadedGroupNew");
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

    const decrementWeek = async () => {
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

    const swipeRightSchedule = async () => {
      await UtilsService.sleep(150);
      let tempDate = new Date(selectedDate.value);
      tempDate.setDate(tempDate.getDate() + 1)
      selectedDate.value = tempDate;
    }

    const swipeLeftSchedule = async () => {
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
      } else if (index < indexOfSelectedDate) {
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
        localStorage.setItem('selectedDate', val.toString())

        const oldWeek = getNumberOfWeek(getDateOfMonday(currentWeek.value));
        currentWeek.value = getNumberOfWeek(getDateOfMonday(val));
        if (currentWeek.value !== oldWeek) {
          updateButtonsDataString();
          currentWeekType.value = getTypeOfWeek(getNumberOfWeek(getDateOfMonday(val))) === 'NUMERATOR' ? 'числитель' : 'знаменатель';
        }

        const selectedGroup = store.getters['schedule/getSelectedGroup'];
        if (selectedGroup.lessons) {
          currentDayLessons.value = getLessonFromSelectedDate(selectedGroup.lessons, selectedDate.value);
        }
      }
    })

    onMounted(async () => {
      store.commit('globalState/changeCurrentPage','schedule');

      univSelectOptions.value = await store.dispatch('schedule/getUniversitiesNamesAction');

      let lastLoadedUniv = localStorage.getItem('lastLoadedUniv');
      let lastLoadedGroup = localStorage.getItem('lastLoadedGroupNew');

      let dateFromStorage = new Date(localStorage.getItem('selectedDate'));
      if (dateFromStorage !== null) {
        let currentDate = new Date();
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
      //selectedDate.value = new Date(2021, 8, 12);
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
      currentWeekType,
      currentWeek,
      groupName,
      groupSelectDialog,
      settingsDialog,
      helpDialog,
      filterUniversitiesFn,
      filterGroupsFn,
      getScheduleCellColor,
      getNumberOfWeek,
      decrementWeek,
      incrementWeek,
      changeSelectedDateByButtonIndex,
      swipeRightSchedule,
      swipeLeftSchedule,
      getMonthStringByDate,
      theme,
      customClass
    }
  }
}
</script>

<style>
.bg-none-l {
  background-color: rgb(238, 238, 238);
}

.bg-none-d {
  background-color: #2f3136;
}

#title-page {
  font-size: 18px;
}

#top-nav-div {
  width: auto;
  font-size: 10px;
  color: #1976D2;
}

.title-page {
  font-size: 12px;
  line-height: 13px;
}

.title-page-dialog {
  font-size: 18px;
  padding: 14px 15px;
  line-height: 20px;
}

.fix-pa {
  padding: 15px;
}

.fix-py {
  padding-top: 15px;
  padding-bottom: 15px;
}

.fix-px {
  padding-right: 15px;
  padding-left: 15px;
}

.fix-mx {
  margin-right: 15px;
  margin-left: 15px;
}

.fix-pt {
  padding-top: 15px;
}

.fix-pb {
  padding-bottom: 15px;
}

.fix-pr {
  padding-right: 15px;
}

.fix-pl {
  padding-left: 15px;
}

.chip-number {
  border-radius: 0 5px 5px 0;
}

.color-d {
  color: #d0d0d0;
}

.color-l {
  color: gray;
}
</style>
