<template>
  <q-page>
    <div class="q-pa-md">
      <q-table
        title="Treats"
        :rows="univRequestsRows"
        :columns="univRequestsColumns"
        row-key="id"
        hide-header
        hide-bottom
        selection="multiple"
        v-model:selected="selectedRows"
      />
    </div>
  </q-page>
</template>

<script>
import {onMounted, ref} from "vue";
import UnivRequestService from "../services/other/univRequestService"

const univRequestsColumns = [
  {
    name: 'id',
    required: true,
    label: 'Id',
    align: 'center',
    field: 'id',
    sortable: true
  },
  {
    name: 'text',
    required: true,
    label: 'Текст',
    align: 'center',
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
    name: 'createdTime',
    required: true,
    label: 'Время создания',
    align: 'center',
    field: 'time',
    sortable: true
  }
]

export default {
  name: "Admin",
  setup() {
    const univRequestsRows = ref([]);
    onMounted(async ()=> {
      univRequestsRows.value = await UnivRequestService.getUnivRequests();
      console.log(univRequestsRows.value)
    })

    const selectedRows = ref([])
    return {
      selectedRows,
      univRequestsRows,
      univRequestsColumns
    }
  }
}
</script>

<style scoped>

</style>
