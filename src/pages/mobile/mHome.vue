<template>
  <q-page class="body-color">
    <q-card flat>
      <q-card flat square style="max-height: 81px;">
        <q-card-section id="title-page" :class="theme('color-l', 'color-d')" class="q-ma-none">Главная</q-card-section>
        <q-card-section id="top-nav-div" class="q-pa-none">
          <q-tabs id="asdasdasd" v-model="tab" :active-color="theme('primary', '#d0d0d0')" :indicator-color="theme('primary', '#d0d0d0')" align="justify"
                  class="text-grey"
                  dense
                  inline-label narrow-indicator>
            <q-tab :class="theme('color-l', 'color-d')" class="q-px-sm top-nav tab-btn" flat name="newsProject" no-caps>
              Новости проекта
            </q-tab>
            <q-tab :class="theme('color-l', 'color-d')" class="q-px-sm top-nav tab-btn" flat name="univs" no-caps>
              Подключенные университеты
            </q-tab>
          </q-tabs>
        </q-card-section>
        <q-separator v-if="!Dark.isActive" />
        <q-tab-panels v-model="tab" animated swipeable>
          <q-tab-panel :class="theme('bg-none-l', 'bg-none-d')" class=" q-px-none q-pt-sm" name="newsProject">

            <q-card :class="theme('bg-none-l', 'bg-none-d')" flat square>
                <q-card class="q-mb-sm" flat square>
                  <q-separator v-if="!Dark.isActive" />
                  <q-card-section>
                    <p :style="theme('color: gray', 'color: #d0d0d0')" class="text-justify" style="font-size: 16px; margin: 0; font-weight: 400">Реклама</p>
                  </q-card-section>
                  <q-card-section class="q-pt-none q-px-none">
                    <div id="yandex_rtb_R-A-1296363-1"></div>
                  </q-card-section>
                  <q-separator v-if="!Dark.isActive" />
                </q-card>
            </q-card>

            <q-card :class="theme('bg-none-l', 'bg-none-d')" flat square>
              <template v-for="news in texts.newsProject" :key="news">
                <q-card class="q-mb-sm" flat square>
                  <q-separator v-if="!Dark.isActive" />
                  <q-card-section>
                    <p :class="theme('color-l', 'color-d')" class="text-justify" style="font-size: 16px; margin: 0; font-weight: bold">
                      {{ news.title }}</p>
                    <p :class="theme('color-l', 'color-d')" class="text-justify q-pt-sm" style="font-size: 14px; margin: 0;">
                      {{ news.desc }}</p>
                  </q-card-section>
                  <q-card-section class="q-pt-none q-px-none">
                    <q-img :src="news.img" />
                  </q-card-section>
                  <q-separator v-if="!Dark.isActive" />
                </q-card>
              </template>
            </q-card>
            <div style="height: 50px;"></div>
          </q-tab-panel>
          <q-tab-panel :class="theme('bg-none-l', 'bg-none-d')" class="q-px-none q-pt-sm" name="univs">
            <q-card :class="theme('bg-none-l', 'bg-none-d')" flat square>
              <template v-for="news in texts.connectedUniversities" :key="news">
                <q-card class="q-mb-sm" flat square>
                  <q-separator v-if="!Dark.isActive" />
                  <q-card-section>
                    <p :class="theme('color-l', 'color-d')" class="text-justify" style="font-size: 16px; margin: 0; font-weight: bold">
                      {{ news.title }}</p>
                    <p :class="theme('color-l', 'color-d')" class="text-justify q-pt-sm" style="font-size: 14px; margin: 0;">
                      {{ news.desc }}</p>
                  </q-card-section>
                  <q-card-section class="q-pt-none q-px-none">
                    <q-img :src="news.img" />
                    <template v-if="news.btn_url === ''">
                      <q-btn :class="theme('bg-primary', 'bg-white')" flat no-caps style="margin: 15px 0 0 15px; height: 12px"
                             @click="dialogModel = true">
                        <span :class="theme('color-l', 'text-black')"
                              style="color: white; font-size: 12px">{{ news.btn }}</span>
                      </q-btn>
                    </template>
                    <template v-else>
                      <q-btn :class="theme('bg-primary', 'bg-white')" flat no-caps style="margin: 15px 0 0 15px; height: 12px"
                             @click="goUrl(news.btn_url)">
                        <span :class="theme('color-l', 'text-black')"
                              style="color: white; font-size: 12px">{{ news.btn }}</span>
                      </q-btn>
                    </template>
                  </q-card-section>
                  <q-separator v-if="!Dark.isActive" />
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
import {Dark, useMeta, useQuasar} from "quasar";
import texts from 'src/info/texts.js'
import UserMessageDialog from "components/UserMessageDialog";
import {useStore} from "vuex";

const meta = {
  title: 'Главная - GISTUD',
  script: {
    yandex: {
      type: 'application/javascript',
      innerHTML: `window.yaContextCb.push(()=>{ Ya.Context.AdvManager.render({ renderTo: 'yandex_rtb_R-A-1296363-1', blockId: 'R-A-1296363-1' }) })`
    }
  },
  meta: {
    description: {
      name: 'description',
      content: 'Главная - GISTUD | Удобная информация вашего университета: студенческие новости, расписание и многое другое'
    },
    keywords: {
      name: 'keywords',
      content: 'расписание, информационный сервис, студенты, студенческий сервис, вуз, университет, РФ, Россия, gistud'
    },
  }
}

export default {
  name: "Home",
  components: {
    UserMessageDialog
  },
  setup() {
    useMeta(() => meta);
    const store = useStore();
    const $q = useQuasar();
    const tab = ref('newsProject');

    onMounted(async () => {
      store.commit('globalState/changeCurrentPage', 'home');
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
      Dark,
    }
  }
}
</script>

<style scoped>

.bg-none {
  background: none;
}

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
  color: #000000;
}
</style>
