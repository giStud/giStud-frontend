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
              hint="Text autocomplete"
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

  methods: {},

  setup() {
    const store = useStore();
    const selected = ref(null);
    const options = ref([]);

    const filteredOptions = ref(options.value);
    onMounted(async () => {
      await store.dispatch("groups/getGroupNamesAction");
      options.value = store.getters["groups/getGroupNames"];
    });

    return {
      filteredOptions,
      selected,
      filterFn(val, update, abort) {
        update(() => {
          const needle = val.toLocaleLowerCase();
          if (needle === "") {
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
              await store.dispatch("schedule/getGroupByNameAndUnivAction", {
              groupName: selected.value,
            });
          } catch (e) {
            // if (e.response && e.response.status === 403) {
            //   EventBus.dispatch("logout");
            // }
          }

          console.log(store.state.schedule.selectedGroup);
        } else {
          console.log("debil");
        }
      },
    };
  },
};
</script>

<style></style>
