<template>
  <q-page class="flex flex-center">
    <q-card flat>
      <q-card-section>
        <div class="q-pa-md">
          <div class="q-gutter-md row">
            <q-select
              filled
              v-model="selected"
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              :options="filteredOptions"
              @filter="filterFn"
              style="width: 250px; padding-bottom: 32px"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Не найдено
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-btn round @click="loadGroupSchedule" />
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <thead>
        <tr>
          <th v-for="head in headers" :key="head.title">{{ head.label }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="lesson in lessons" :key="lesson.lessonId">
          <td v-for="col in headers" :key="col.title">{{ lesson[col.field] }}</td>
        </tr>
        </tbody>
      </q-card-section>
    </q-card>
  </q-page>
  <q-page-container>
    <router-view />
  </q-page-container>
</template>

<script>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import EventBus from "../common/eventBus"

export default {
  name: "GroupSelectingLayout",
  components: {},

  setup() {
    const store = useStore();
    const selected = ref(null);
    const options = ref([]);
    const lessons = ref([]);

    const filteredOptions = ref(options.value);
    onMounted(async () => {
      await store.dispatch("groups/getGroupNamesAction");
      options.value = store.getters["groups/getGroupNames"];
    });

    return {
      headers: [
        { title: "name", label: "Название", field: "name" },
        { title: "day", label: "День", field: "day" },
        { title: "time", label: "Время", field: "time" }
      ],
      filteredOptions,
      selected,
      lessons,
      filterFn(val, update, abort) {
        update(() => {
          const needle = val.toLocaleLowerCase();
          if (needle === '') {
            filteredOptions.value = options.value;
          } else {
            filteredOptions.value = options.value.filter((v) =>
              v.toLowerCase().includes(needle)
            );
          }
        });
      },
      async loadGroupSchedule() {
        if (selected.value !== null) {
          try {
              const selectedGroup = await store.dispatch("schedule/getGroupByNameAndUnivAction", {
              groupName: selected.value,
            });
              const lessonsFromGroup = selectedGroup.lessons;
              lessons.value = lessonsFromGroup;
              console.log(selectedGroup);
              console.log(lessonsFromGroup);
            // const state = store.state.schedule.selectedGroup;
            // const selectedGroup = store.getters['schedule/getSelectedGroup'];
            // //store.commit('schedule/setSelectedGroup', {group : "groupGavna"})
            // store.dispatch("schedule/getGroupByNameAndUnivAction", {
            //   groupName: selected.value,
            // });
          } catch (e) {
            // if (e.response && e.response.status === 403) {
            //   EventBus.dispatch("logout");
            // }
          }

          //console.log(store.state.schedule.selectedGroup);
        } else {
          console.log("debil");
        }
      },
    };
  },
};
</script>

<style></style>
