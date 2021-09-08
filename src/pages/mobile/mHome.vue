<template>

  <q-page>
    <q-card flat>
      <q-card flat style="max-height: 81px;" square >
        <q-card-section style="font-size: 18px; padding: 14px 15px" class="q-ma-none">Главная</q-card-section>
        <q-card-section class="top-nav q-pa-none" style="overflow-x: scroll; overflow-y: hidden; width: auto; white-space: nowrap;">
        <!--Табы от ДимASS'а-->

<!--          <q-tabs-->
<!--            v-model="tab"-->
<!--            dense-->
<!--            class="text-grey"-->
<!--            active-color="primary"-->
<!--            indicator-color="primary"-->
<!--            align="justify"-->
<!--            narrow-indicator-->
<!--          >-->
<!--            <q-tab class="top-nav" no-caps no-wrap flat  name="all" label="Все" />-->
<!--            <q-tab class="top-nav" no-caps no-wrap flat  name="univs" label="Университеты" />-->
<!--            <q-tab class="top-nav" no-caps no-wrap flat  name="lastNews" label="Последние новости" />-->
<!--            <q-tab class="top-nav" no-caps no-wrap flat  name="lastAnn" label="Последние обьявления" />-->
<!--          </q-tabs>-->


          <q-btn class="top-nav" no-caps no-wrap flat @click="tab = 'all'">Все</q-btn>
          <q-btn class="top-nav" no-caps no-wrap flat @click="tab = 'univs'">Университеты</q-btn>
          <q-btn class="top-nav" no-caps no-wrap flat @click="tab = 'lastNews'">Последние новости</q-btn>
          <q-btn class="top-nav" no-caps no-wrap flat @click="tab = 'lastAnn'">Последние обьявления</q-btn>
        </q-card-section>
        <q-separator/>

        <q-tab-panels style="height: max-content" v-model="tab" animated class="shadow-2 rounded-borders q-mt-lg">
          <q-tab-panel name="all">
            <div class="text-h6">Mails</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>

          <q-tab-panel name="univs">
            <div class="text-h6">Alarms</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>

          <q-tab-panel name="lastNews">
            <div class="text-h6">Movies</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>
          <q-tab-panel name="lastAnn">
            <div class="text-h6">Movies1</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </q-card>
  </q-page>

</template>

<script>
import {ref} from "vue";

export default {
  name: "Home",
  setup() {
    const tab = ref('all');
    return {
      tab
    }
  }
}
</script>

<style scoped>

.top-nav {
  width: auto;
  height: 25px;
  font-size: 12px;
  color: gray;
}

.top-nav::-webkit-scrollbar {
  display: none;
}
</style>
