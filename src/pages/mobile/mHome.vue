<template>

  <q-page class="body-color">
    <q-card flat>
      <q-card flat style="max-height: 81px;" square>
        <q-card-section :class="theme('color-l', 'color-d')" id="title-page" class="q-ma-none">Главная</q-card-section>
        <q-card-section class="q-pa-none" id="top-nav-div">
          <q-tabs id="asdasdasd" v-model="tab" dense class="text-grey" :active-color="theme('primary', '#d0d0d0')"
                  :indicator-color="theme('primary', '#d0d0d0')"
                  align="justify"
                  narrow-indicator inline-label>
            <q-tab :class="theme('color-l', 'color-d')" class="q-px-sm top-nav tab-btn" no-caps flat name="newsProject">
              Новости проекта
            </q-tab>
            <q-tab :class="theme('color-l', 'color-d')" class="q-px-sm top-nav tab-btn" no-caps flat name="univs">
              Подключенные университеты
            </q-tab>
          </q-tabs>
        </q-card-section>
        <q-separator/>
        <q-tab-panels swipeable v-model="tab" animated>
          <q-tab-panel :class="theme('bg-none-l', 'bg-none-d')" class=" q-px-none q-pt-sm" name="newsProject">
            <q-card square flat :class="theme('bg-none-l', 'bg-none-d')">
              <template v-for="news in texts.newsProject" :key="news">
                <q-card square flat class="q-mb-sm">
                  <q-separator/>
                  <q-card-section>
                    <p :class="theme('color-l', 'color-d')" style="font-size: 15px; margin: 0">{{ news.title }}</p>
                    <p :class="theme('color-l', 'color-d')" style="font-size: 9px; margin: 0;">{{ news.desc }}</p>
                  </q-card-section>
                  <q-card-section class="q-pt-none q-px-none">
                    <q-img :src="news.img"/>
                  </q-card-section>
                  <q-separator/>
                </q-card>
              </template>
            </q-card>
            <div style="height: 50px;"></div>
          </q-tab-panel>
          <q-tab-panel :class="theme('bg-none-l', 'bg-none-d')" class="q-px-none q-pt-sm" name="univs">
            <q-card square flat :class="theme('bg-none-l', 'bg-none-d')">
              <template v-for="news in texts.connectedUniversities" :key="news">
                <q-card square flat class="q-mb-sm">
                  <q-separator/>
                  <q-card-section>
                    <p :class="theme('color-l', 'color-d')" style="font-size: 15px; margin: 0; font-weight: bold">
                      {{ news.title }}</p>
                    <p :class="theme('color-l', 'color-d')" style="font-size: 12px; margin: 0;">{{ news.desc }}</p>
                  </q-card-section>
                  <q-card-section class="q-pt-none q-px-none">
                    <q-img :src="news.img"/>
                    <template v-if="news.btn_url === ''">
                      <q-btn style="margin: 15px 0 0 15px; height: 12px" no-caps flat class="bg-primary"
                             @click="dialogModel = true">
                        <span :class="theme('color-l', 'color-d')"
                              style="color: white; font-size: 12px">{{ news.btn }}</span>
                      </q-btn>
                    </template>
                    <template v-else>
                      <q-btn style="margin: 15px 0 0 15px; height: 12px" no-caps flat class="bg-primary"
                             @click="goUrl(news.btn_url)">
                        <span :class="theme('color-l', 'color-d')"
                              style="color: white; font-size: 12px">{{ news.btn }}</span>
                      </q-btn>
                    </template>
                  </q-card-section>
                  <q-separator/>
                </q-card>
              </template>
            </q-card>
            <div style="height: 40px;"></div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </q-card>

    <UserMessageDialog v-model="dialogModel" :url="'/userMessages/univRequest'">
      <template v-slot:title>
        <div class="text-h6">Введите текст вашей заявки</div>
      </template>
    </UserMessageDialog>

    <!--        <q-btn :style="theme('background-color: #edeef0;', 'background-color: #000;')" @click="$q.dark.toggle()" >asdasd</q-btn>-->

  </q-page>
</template>

<script>
import {onMounted, ref, watch} from "vue";
import {goUrl, theme} from "src/services/other/tools";
import {useQuasar} from "quasar";
import texts from 'src/info/texts.js'
import UserMessageDialog from "components/UserMessageDialog";

export default {
  name: "Home",
  components: {
    UserMessageDialog
  },
  setup() {
    const tab = ref('newsProject');
    const $q = useQuasar();
    onMounted(async () => {
      tab.value = (localStorage.getItem("mHomeCurrentTab") === null) ? 'newsProject' : localStorage.getItem("mHomeCurrentTab");
    });

    watch(tab, (val) => {
      localStorage.setItem("mHomeCurrentTab", val)
    });

    const dialogModel = ref(false);
    const url = (string) => {
      window.open(string);
    };
    return {
      tab,
      theme,
      texts,
      goUrl,
      dialogModel,
      url,
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

.body-color {
  background-color: #edeef0;
  /*background-color: #0047d4;*/
}

#asdasdasd {
  color: #1976D2;
}

#title-page {
  font-size: 18px;
  padding: 14px 15px;
}

#top-nav-div {
  width: auto;
  height: 25px;
  font-size: 10px;
  color: gray;
}

.top-nav {
  width: auto;
  height: 25px;
  font-size: 11px;
  color: gray;
}

.tab-btn {
  font-size: 10px;
}

.color-d {
  color: #d0d0d0;
}

.color-l {
  color: gray;
}
</style>
