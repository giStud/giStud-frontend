<template>
  <q-card square :class="theme('bg-none-l', 'bg-none-d')" class="row q-ma-none q-pa-none justify-between" style="max-height: 50px ; text-align: center">
    <q-btn :to="'/'" round no-caps class="q-ml-sm nav-btn" flat>
      <q-icon :class="theme('color-l','color-d')" class="nav-icon" name="home" />
      <span :class="theme('color-l','color-d')">Главная</span>
    </q-btn>
    <q-btn :to="'/schedule'" round no-caps class="nav-btn" flat>
      <q-icon :class="theme('color-l','color-d')" class="nav-icon" name="calendar_view_month" />
      <span :class="theme('color-l','color-d')" >Расписание</span>
    </q-btn>
    <q-btn :to="'/news'" round no-caps class="nav-btn" flat>
      <q-icon :class="theme('color-l','color-d')" class="nav-icon" name="feed" />
      <span :class="theme('color-l','color-d')">Новости</span>
    </q-btn>
    <q-btn disable :to="'/announcement'" round no-caps class="nav-btn" flat>
      <q-icon :class="theme('color-l','color-d')" class="nav-icon" name="campaign" />
      <span :class="theme('color-l','color-d')">Объявления</span>
    </q-btn>
    <q-btn :to="'/profile'" round no-caps class="q-mr-sm nav-btn" flat>
      <q-icon :class="theme('color-l','color-d')" class="nav-icon" name="badge" />
      <span :class="theme('color-l','color-d')">Профиль</span>
    </q-btn>
  </q-card>
</template>

<script>
import {theme} from "src/services/other/tools";

export default {
  name: "mHeader",
  setup() {
    return {
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

.color-d {
  color: #d0d0d0;
}

.color-l {
  color: gray;
}
</style>
