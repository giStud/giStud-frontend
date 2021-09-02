<template>
  <q-page class="q-pa-md" style="min-width: 1248px; padding-left: 24px; padding-right: 24px">


    <q-splitter v-model="splitterModel">

      <template v-slot:before>

        <q-tabs v-model="tab" vertical>

          <q-tab name="bugs" icon="warning" label="Баги"/>
          <q-separator/>
          <q-tab name="news" icon="format_size" label="Новости"/>

        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels v-model="tab" animated swipeable vertical transition-prev="jump-up" transition-next="jump-up">
          <q-tab-panel name="bugs">
            <div class="text-h4 q-mb-md">Баги</div>
            <div class="q-pa-md">
              <q-table bordered flat square title="Багулины" :rows="univRequestsRows"
                       :columns="univRequestsColumns" row-key="requestId" selection="multiple" separator="cell"
                       v-model:selected="selectedRows" wrap-cells
              />
            </div>
            <div class="q-pa-md">
              <q-btn color="primary" label="Удалить выбранные записи" @click="deleteSelectedRows"/>
            </div>
          </q-tab-panel>

          <q-tab-panel name="news">
            <div class="text-h4 q-mb-md">Новости</div>
            <div class="q-pa-md">
              <q-table bordered flat square title="Список новостей" :rows="newsRequestsRows"
                       :columns="newsRequestsColumns" row-key="requestId" selection="multiple" separator="cell"
                       v-model:selected="selectedNewsRows" wrap-cells
              />
            </div>
            <div class="q-pa-md">
              <q-btn color="primary" label="Удалить выбранные новости" @click="deleteSelectedRowsNews"/>
            </div>
          </q-tab-panel>

        </q-tab-panels>
      </template>

    </q-splitter>

  </q-page>
</template>

<script>
import {onMounted, ref} from "vue";
import UserMessagesService from "../services/other/userMessagesService"
import {getDateString} from "src/composables/schedule/ScheduleTable";
import UtilsService from "../services/other/utilsService"

const newsRequestsColumns = [{
  name: 'id',
  required: true,
  label: 'Id',
  align: 'center',
  field: 'requestId',
  headerStyle: 'width: 200px',
  sortable: true
}, {
  name: 'title',
  required: true,
  label: 'Заголовок',
  align: 'center',
  headerStyle: 'width: 500px',
  field: 'text',
  sortable: true
}, {
  name: 'shortContent',
  required: true,
  label: 'Краткий текст',
  align: 'center',
  headerStyle: 'width: 500px',
  field: 'shortContent',
  sortable: true
}, {
  name: 'content',
  required: true,
  label: 'Основной текст',
  align: 'center',
  headerStyle: 'width: 500px',
  field: 'content',
  sortable: true
}, {
  name: 'img',
  required: true,
  label: 'Ссылка на картинку',
  align: 'center',
  headerStyle: 'width: 500px',
  field: 'img',
  sortable: true
},
]

const univRequestsColumns = [{
  name: 'id',
  required: true,
  label: 'Id',
  align: 'center',
  field: 'requestId',
  sortable: true
}, {
  name: 'text',
  required: true,
  label: 'Текст',
  align: 'center',
  headerStyle: 'width: 500px',
  field: 'text',
  sortable: true
}, {
  name: 'email',
  required: true,
  label: 'Email',
  align: 'center',
  field: 'email',
  sortable: true
}, {
  name: 'type',
  required: true,
  label: 'Тип сообщения',
  align: 'center',
  field: 'type',
  sortable: true
}, {
  name: 'createdTime',
  required: true,
  label: 'Время создания',
  align: 'center',
  field:
    (row) => {
      let result = '';
      const date = new Date(row.createdTime);
      result += getDateString(date) + '\t';
      result += UtilsService.getTimeString(date);
      return result;
    },
  sortable: true
}
]

export default {
  name: "Admin",
  setup() {
    const univRequestsRows = ref([]);
    const selectedRows = ref([])
    const newsRequestsRows = ref([]);
    const selectedNewsRows = ref([])
    onMounted(async () => {
      univRequestsRows.value = await UserMessagesService.getUserMessages();
      console.log(univRequestsRows.value)
    })

    const deleteSelectedRows = async () => {
      if (selectedRows.value.length > 0) {
        for (let selected of selectedRows.value) {
          await UserMessagesService.deleteUserMessageById(selected.requestId)
        }
        univRequestsRows.value = await UserMessagesService.getUserMessages();
      }
    }

    const deleteSelectedNewsRows = async () => {
      if (selectedNewsRows.value.length > 0) {
        for (let selected of selectedNewsRows.value) {
          await UserMessagesService.deleteUserMessageById(selected.requestId)
        }
        newsRequestsRows.value = await UserMessagesService.getUserMessages();
      }
    }

    return {
      selectedRows,
      univRequestsRows,
      univRequestsColumns,
      selectedNewsRows,
      newsRequestsRows,
      newsRequestsColumns,
      deleteSelectedRows,
      deleteSelectedNewsRows,
      tab: ref('bugs'),
      splitterModel: ref(10),
    }
  }
}
</script>

<style scoped>

</style>
