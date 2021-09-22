<template>
  <q-page>
    <q-card id="MAIN-PAGE" class="bg-none" flat square>
      <q-card id="REKLAMA" class="center-all page-width fix-my" flat>
        Реклама
      </q-card>

      <q-card id="SCHEDULE-SELECT" class="row justify-center items-center center-all page-width" flat>
        <q-card id="SELECT-U" class="fix-pa">
          <q-select v-model="univSelectValue" :options="univFilteredOptions" borderless bottom-slots class="select-ug" fill-input hide-selected
                    label="Выберите университет"
                    option-label="univName"
                    outlined transition-hide="jump-up" transition-show="jump-up"
                    use-input @filter="filterUniversitiesFn">
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
        </q-card>
        <q-card id="SELECT-G" class="fix-pa">
          <q-select v-model="groupSelectValue" :options="groupsFilteredOptions" borderless bottom-slots class="select-ug" fill-input hide-selected
                    label="Выберите группу"
                    option-label="groupName"
                    outlined transition-hide="jump-up" transition-show="jump-up"
                    use-input @filter="filterGroupsFn">
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
        </q-card>
      </q-card>

      <q-card  style="position: sticky ; z-index: 9999" id="SCHEDULE-NAVIGATION" class="center-all justify-center items-center page-width fix-pa" flat>
        <q-card class="t-center">НАВИГАЦИЯ</q-card>

        <q-card id="schedule-nav-btn" class="row center-all justify-between items-center fix-pa">
          <div>
            <q-btn class="buttons-week" flat label="❮ Предыдущая неделя" no-caps rounded />
          </div>
          <div>
            <q-btn :class="selectedWeekBtn ? '' :'text-primary'" flat label="Числитель" no-caps
                   outline @click="toggleWeekBtn(false)" />

            <q-btn :class="selectedWeekBtn ? 'text-primary' :''" flat label="Знаменатель" no-caps
                   outline @click="toggleWeekBtn(true)" />

            <q-btn id="calendar" class="buttons-date" flat icon="today" no-caps>
              <q-popup-proxy transition-hide="scale" transition-show="scale">
                <q-date v-model="datePickerDate"
                        :options="(date)=>{ return date >= '2020/09/01' && date <= '2100/09/01' }">
                  <div class="row items-center justify-end q-gutter-sm">
                    <q-btn v-close-popup color="primary" flat label="Перейти" @click="changeDateFromDatePicker" />
                    <q-btn v-close-popup color="primary" flat label="Отмена" />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-btn>
          </div>
          <div>
            <q-btn class="buttons-week" flat label="Следующая неделя ❯" no-caps rounded />
          </div>
        </q-card>

      </q-card>

      <q-card id="MAIN-TABLE" class="center-all justify-center items-center page-width fix-pa" flat>
        <q-card class="t-center bg-none fix-pb" flat square>ТАБЛИЦА</q-card>
        <q-card class="center-all t-center justify-center items-center row fix-py" flat square>

          <q-list class="row-wc">
            <q-item>Время</q-item>
            <q-item>08:00 - 09:35</q-item>
            <q-item>09:45 - 11:20</q-item>
            <q-item>11:30 - 13:05</q-item>
            <q-item>11:30 - 13:05</q-item>
            <q-item>15:15 - 16:50</q-item>
            <q-item>17:00 - 18:35</q-item>
          </q-list>

          <template v-for="tableVal in table" :key="tableVal">
            <q-list style="margin: 2px; border-collapse: collapse" class="row-wc">
              <span style="font-weight: bold; font-size: 16px">{{ tableVal.day }}</span>
              <q-item style="background-color: rgba(27,99,212,0.47); margin-bottom: 4px;" v-for="lesson in 6" :key="lesson" clickable>Здесь идет пара у нее длинное название очень длинное название которые никуда не влезет </q-item>
            </q-list>
          </template>

        </q-card>
      </q-card>

    </q-card>
  </q-page>
</template>

<script>
import {ref} from "vue";
import {getDateOfMonday, getTypeOfWeek} from "src/composables/schedule/ScheduleTable";
import TemplateUniversity from "components/static/TemplateUniversity";

function formatDate(date) {
  let dd = date.getDate();
  if (dd < 10) dd = '0' + dd;
  let mm = date.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;
  let yy = date.getFullYear();
  return yy + '/' + mm + '/' + dd;
}

const table = [
  {day: 'Понедельник'},
  {day: 'Вторник'},
  {day: 'Среда'},
  {day: 'Четверг'},
  {day: 'Пятница'},
  {day: 'Суббота'},
  {day: 'Воскресенье'},
]

export default {
  name: "dSchedule",
  setup() {
    const univSelectValue = ref('ВГТУ');
    const univFilteredOptions = ref();

    const groupSelectValue = ref('бИВТ-201');
    const groupsFilteredOptions = ref();

    const selectedWeek = ref(2);
    const selectedWeekBtn = ref(false)

    const datePickerDate = ref(formatDate(new Date()));



    const getNumerator = (name, notActive, active) => {
      let classActive = ''
      classActive = selectedWeekBtn.value ? active : notActive;
      return classActive;
    }

    const toggleWeekBtn = (is) => {
      selectedWeekBtn.value = is;
    }

    const changeDateFromDatePicker = () => {
      selectedDate.value = getDateOfMonday(new Date(datePickerDate.value));
    }

    return {
      univSelectValue, univFilteredOptions,
      groupSelectValue, groupsFilteredOptions,
      selectedWeek, selectedWeekBtn, getNumerator, toggleWeekBtn,
      datePickerDate, changeDateFromDatePicker,
      table,
    }
  }
}
</script>

<style lang="css">
@import 'src/css/main.css';

#REKLAMA {
  height: 90px;
  border-radius: 4px;
  background-color: #00e0e3;
}

#SCHEDULE-SELECT {
  border-radius: 4px;
  align-items: center
}

#SCHEDULE-NAVIGATION {
  margin-top: -15px;
}

.page-width {
  max-width: 1400px;
}

.select-ug {
  margin: 0 auto;
}

.row-wc {
  width: 160px;
}


</style>
