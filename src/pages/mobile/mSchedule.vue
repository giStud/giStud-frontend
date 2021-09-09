<template>
  <q-page>
    <div>
      <q-select square borderless outlined v-model="univSelectValue" use-input hide-selected fill-input
                label="Выберите университет" :options="univFilteredOptions" option-label="univName"
                @filter="filterUniversitiesFn" transition-show="jump-up" transition-hide="jump-up" bottom-slots>
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
      <q-select style="margin-top: -15px" square borderless outlined v-model="groupSelectValue" use-input
                hide-selected fill-input label="Выберите группу" :options="groupsFilteredOptions"
                option-label="groupName" @filter="filterGroupsFn" transition-show="jump-up" transition-hide="jump-up"
                bottom-slots>
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
<!--      <div>-->
<!--        <q-btn :class="$q.dark.isActive ? 'buttonTest&#45;&#45;dark' : 'buttonTest&#45;&#45;light'" @click="toggleDarkMode" label="Режим тьмы"></q-btn>-->
<!--        <q-btn id="parasha" @click="toggleDarkMode" label="Режим тьмы"></q-btn>-->
<!--      </div>-->
    </div>
  </q-page>
</template>

<script>
import {onMounted, ref, watch} from "vue";
import {useStore} from "vuex";
import {getTableRowsFromLessons} from "src/composables/schedule/ScheduleTable";
import {useQuasar} from "quasar";

export default {
  name: "mSchedule.vue",
  setup() {
    const store = useStore();
    const $q = useQuasar();

    const groupSelectValue = ref(null);
    const univSelectValue = ref(null);
    const univSelectOptions = ref([]);
    const univFilteredOptions = ref(univSelectOptions.value);
    const groupsSelectOptions = ref([]);
    const groupsFilteredOptions = ref(groupsSelectOptions.value);
    const scheduleRows = ref([]);

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
          // title.value = 'Расписание группы ' + selectedGroup.name + " (" + selectedGroup.universityEntity.name + ")";
          localStorage.setItem('lastLoadedGroup', JSON.stringify(val));
          console.log(selectedGroup)
          scheduleRows.value = getTableRowsFromLessons(selectedGroup.lessons, selectedWeek.value);
        } else {
          // title.value = '';
          console.log('Find deleted group');
        }
      } catch (e) {
        localStorage.removeItem("lastLoadedGroup");
        groupSelectValue.value = null;
      }

    }

    const toggleDarkMode = ()=> {
      $q.dark.toggle();
    }

    watch(scheduleRows,(val) => {
      console.log(val)})

    watch(groupSelectValue, (val)=>{
      loadGroupSchedule(val)
    })

    onMounted(async ()=>{
      univSelectOptions.value = await store.dispatch('schedule/getUniversitiesNamesAction');

      let lastLoadedUniv = localStorage.getItem('lastLoadedUniv');
      let lastLoadedGroup = localStorage.getItem('lastLoadedGroup');

      if ((typeof lastLoadedUniv !== 'undefined') && lastLoadedUniv !== null) {
        univSelectValue.value = JSON.parse(lastLoadedUniv);
      }
      if ((typeof lastLoadedGroup !== 'undefined') && lastLoadedGroup !== null) {
        groupSelectValue.value = JSON.parse(lastLoadedGroup);
      }
    })

    return {
      univSelectValue,
      univFilteredOptions,
      groupSelectValue,
      groupsFilteredOptions,
      scheduleRows,
      toggleDarkMode,
      filterUniversitiesFn,
      filterGroupsFn
    }
  }
}
</script>

<style>
body.body--dark {
  background-color: black;

}
body.body--light {
  /*background-color: rgb(238, 238, 238);*/
  background-color: rgb(238, 238, 238);
}

.buttonTest--light {
  background-color: gray;
}

.buttonTest--dark {
  background-color: blue;
}


</style>
