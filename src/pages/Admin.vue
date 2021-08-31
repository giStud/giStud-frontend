<template>
  <q-page>
    <div class="q-pa-md">
      <q-table
        title="Заявки по универу"
        :rows="univRequestsRows"
        :columns="univRequestsColumns"
        row-key="requestId"
        selection="multiple"
        separator="cell"
        v-model:selected="selectedRows"
        wrap-cells
      />
    </div>
    <div class="q-pa-md">
      <q-btn color="primary" label="Удалить выбранные записи" @click="deleteSelectedRows"/>
    </div>
  </q-page>
</template>

<script>
import {onMounted, ref} from "vue";
import UserMessagesService from "../services/other/userMessagesService"
import {getDateString} from "src/composables/schedule/ScheduleTable";
import UtilsService from "../services/other/utilsService"

const univRequestsColumns = [
  {
    name: 'id',
    required: true,
    label: 'Id',
    align: 'center',
    field: 'requestId',
    sortable: true
  },
  {
    name: 'text',
    required: true,
    label: 'Текст',
    align: 'center',
    headerStyle : 'width: 500px',
    field: 'text',
    sortable: true
  },
  {
    name: 'email',
    required: true,
    label: 'Email',
    align: 'center',
    field: 'email',
    sortable: true
  },
  {
    name: 'type',
    required: true,
    label: 'Тип сообщения',
    align: 'center',
    field: 'type',
    sortable: true
  },
  {
    name: 'createdTime',
    required: true,
    label: 'Время создания',
    align: 'center',
    field: (row)=> {
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
    onMounted(async ()=> {
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

    return {
      selectedRows,
      univRequestsRows,
      univRequestsColumns,
      deleteSelectedRows
    }
  }
}
</script>

<style scoped>

</style>
