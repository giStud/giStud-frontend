<template>
  <q-card flat>
    <q-card-section>
      <q-select v-model="univSelectValue" :options="univFilteredOptions" borderless bottom-slots
                class="select-ug"
                fill-input hide-selected
                label="Выберите университет"
                option-label="univName"
                outlined transition-hide="jump-up" transition-show="jump-up"
                use-input @filter="filterUniversitiesFn">
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
    </q-card-section>
    <q-card-section>
      <q-select v-model="facultySelectValue" :options="facultyFilteredOptions" borderless bottom-slots
                class="select-ug"
                option-label="faculty"
                label="Выберите факультет"
                multiple
                use-chips
                stack-label
                outlined transition-hide="jump-up" transition-show="jump-up"
                use-input @filter="filterFacultiesFn"
      >
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
    <q-card-section>
      <q-input outlined v-model="year" label="Год"  />
    </q-card-section>
    <q-card-section>
      <q-input outlined v-model="period" label="Период в секундах" />
    </q-card-section>
    <q-card-section>
      <q-input outlined v-model="offset" label="Оффсет"  />
    </q-card-section>
    <q-card-section>
      <q-select map-options emit-value :options="semestersMap" v-model="semester"/>
    </q-card-section>
    <q-card-actions class="justify">
      <q-btn @click="createNewScheduleTask({year,period,offset,semester,facultySelectValue})" label="Создать"/>
    </q-card-actions>
  </q-card>
</template>

<script>
import {computed, onMounted, ref, watch} from "vue";
import {useQuasar} from "quasar";
import {useStore} from "vuex";
import {semestersMap} from "../../../composables/schedule/ScheduleTable"

export default {
  name: "SchedulesTasksCreating",
  setup() {
    const store = useStore();
    const $q = useQuasar();

    const univSelectValue = ref([]);
    const facultySelectValue = ref([]);
    const univSelectOptions = ref([]);
    const univFilteredOptions = ref(univSelectOptions.value);
    const facultySelectOptions = ref([]);
    const facultyFilteredOptions = ref(facultySelectOptions.value);
    const year = ref(new Date().getFullYear());
    const period = ref(0);
    const offset = ref(0);
    const semester = ref('Осенний семестр')

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

    const filterFacultiesFn = (val, update, abort) => {
      update(() => {
        const needle = val.toLocaleLowerCase();
        if (needle === '') {
          facultyFilteredOptions.value = facultySelectOptions.value;
        } else {
          facultyFilteredOptions.value = facultySelectOptions.value.filter((v) => {
              return v.toLowerCase().includes(needle)
            }
          );
        }
      });
    }

    const createNewScheduleTask = async (task) => {
      let facIds = [];
      for (let faculty of task.facultySelectValue) {
        facIds.push(faculty.facId);
      }
      task.facIds = facIds;
      await store.dispatch('schedule/createNewScheduleTask', task);
    }

    watch(univSelectValue, async (newValue) => {
      try {
        let selectedUnivId;
        if (newValue !== null && (selectedUnivId = newValue.univId)) {
          facultySelectOptions.value = await store.dispatch('schedule/getFacNamesByUnivAction', {
            univId: selectedUnivId
          })
        }
      } catch (e) {
        univSelectValue.value = null;
      }
    })

    watch(facultySelectValue, (value => {
      console.log(value)
    }))

    onMounted(async () => {
      console.log(semestersMap)
      univSelectOptions.value = await store.dispatch('schedule/getUniversitiesNamesAction');
    })

    return {
      univSelectValue,
      facultySelectValue,
      facultyFilteredOptions,
      univFilteredOptions,
      semestersMap,
      year,
      period,
      offset,
      semester,
      createNewScheduleTask,
      filterUniversitiesFn,
      filterFacultiesFn
    }
  }
}
</script>

<style scoped>

</style>
