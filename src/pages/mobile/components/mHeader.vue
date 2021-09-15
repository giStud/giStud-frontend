<template>
  <q-card square :class="theme('bg-none-l', 'bg-none-d')" class="row q-ma-none q-pa-none justify-between" style="max-height: 50px ; text-align: center">
    <q-btn :to="'/'" round no-caps class="q-ml-sm nav-btn" flat>
      <q-icon :class="getButtonColor('home')" class="nav-icon" name="home" />
      <span :class="getButtonColor('home')">Главная</span>
    </q-btn>
    <q-btn :to="'/schedule'" round no-caps class="nav-btn" flat>
      <q-icon :class="getButtonColor('schedule')" class="nav-icon" name="calendar_view_month" />
      <span :class="getButtonColor('schedule')" >Расписание</span>
    </q-btn>
    <q-btn :to="'/news'" round no-caps class="nav-btn" flat>
      <q-icon :class="getButtonColor('news')" class="nav-icon" name="feed" />
      <span :class="getButtonColor('news')">Новости</span>
    </q-btn>
    <q-btn disable :to="'/announcement'" round no-caps class="nav-btn" flat>
      <q-icon :class="getButtonColor('announcement')" class="nav-icon" name="campaign" />
      <span :class="getButtonColor('announcement')">Объявления</span>
    </q-btn>
    <q-btn :to="'/profile'" round no-caps class="q-mr-sm nav-btn" flat>
      <q-icon :class="getButtonColor('profile')" class="nav-icon" name="badge" />
      <span :class="getButtonColor('profile')">Профиль</span>
    </q-btn>
  </q-card>
</template>

<script>
import {theme} from "src/services/other/tools";
import {useStore} from "vuex";
import {computed, onMounted, watch} from "vue";

export default {
  name: "mHeader",
  setup() {
    const store = useStore();
    const currentPage = computed(()=>store.getters['globalState/getCurrentPage']);

    const getButtonColor = (page)=> {
      if (currentPage.value === page) {
        return 'color-active';
      } else {
        return theme('color-l','color-d');
      }
    }

    return {
      getButtonColor,
      theme,
    }
  }
}
</script>

<style scoped>

.bg-none-l {
  background-color: rgb(238, 238, 238);
}
.bg-none-d {
  background-color: #2f3136;
}

.nav-btn {
  height: 50px;
  width: 50px;
  background-color: rgba(255, 255, 255, 0);
}
.nav-icon {
  margin-bottom: -10px;
}
.nav-btn span {
  font-size: 9px;
  margin-bottom: -2px;
}

.color-active {
  color: #3584e3;
}

.color-d {
  color: #d0d0d0;
}

.color-l {
  color: gray;
}
</style>
