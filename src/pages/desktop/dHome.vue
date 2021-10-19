<template>
  <q-page>
    <q-card id="MAIN-PAGE" class="bg-none" flat square>

      <q-card id="REKLAMA" class="center-all container-base fix-ma" flat>
        <div id="yandex_rtb_R-A-1296363-3"></div>
      </q-card>

      <q-card id="NEWS-CONTAINER" class="center-all container-base bg-none row justify-evenly" flat>

        <q-card id="NEWS-PROJECT" class="q-ma-none q-pa-none fix-mr fix-pa">
          <q-carousel v-model="slide" :autoplay="50000" animated arrows class="q-pa-none" height="270px" infinite>
            <q-carousel-slide :name="1" class="q-pa-none" img-src="../../assets/media/news/1.jpg" />
            <q-carousel-slide :name="2" class="q-pa-none" img-src="../../assets/media/news/2.jpg" />
          </q-carousel>
        </q-card>

        <q-card id="NEWS-STUDENTS" class="q-ma-none q-pa-none fix-pa">
          <MainPageNews />
        </q-card>

      </q-card>

      <q-card id="MIXED-CONTAINER" class="fix-my center-all container-base bg-none row justify-start" flat>
        <q-card id="UNIVERSITIES" class="q-ma-none q-pa-none fix-mr fix-px fix-pt">
          <template v-for="news in texts.connectedUniversities" :key="news">
            <q-card class="row justify-start" flat square style="border: 1px solid rgba(189,189,189,0.47); margin-bottom: 15px">
              <q-card>
                <q-img :src="news.img" style="height: 200px; width: 345px" />
              </q-card>
              <q-card style="height: 200px; width: 450px">
                <q-card-section class="q-pa-sm q-pl-md">{{ news.title }}</q-card-section>
                <q-card-section class="q-pa-sm q-pl-md" style="font-size: 12px">{{ news.desc }}</q-card-section>
                <q-card-section class="q-pa-sm q-pl-md">
                  <template v-if="news.btn_url === ''">
                    <q-btn :class="theme('bg-primary', 'bg-white')" flat no-caps size="sm" @click="dialogModel = true">
                      <span :class="theme('text-white', 'text-black')">{{ news.btn }}</span>
                    </q-btn>
                  </template>
                  <template v-else>
                    <q-btn :class="theme('bg-primary', 'bg-white')" flat no-caps size="sm" @click="goUrl(news.btn_url)">
                      <span :class="theme('text-white', 'text-black')">{{ news.btn }}</span>
                    </q-btn>
                  </template>
                </q-card-section>
              </q-card>
            </q-card>
          </template>
        </q-card>
        <q-card id="ANNOUNCES" class="q-ma-none q-pa-none fix-pa hidden">
          <MainPageNews />
        </q-card>
      </q-card>

      <q-card flat class="bg-none fix-my" style="min-height: 1px"> </q-card>

    </q-card>

    <UserMessageDialog v-model="dialogModel" :url="'/userMessages/univRequest'">
      <template v-slot:title>
        <div class="text-h6">Введите текст вашей заявки</div>
      </template>
    </UserMessageDialog>

  </q-page>
</template>

<script>
import MainPageNews from "components/static/MainPageNews";
import UserMessageDialog from "components/UserMessageDialog";
import {ref} from "vue";
import {goUrl, theme} from "src/services/other/tools";
import texts from "src/info/texts";
import {useMeta} from "quasar";

const meta = {
  title: 'Главная - GISTUD',
  script: {
    yandex: {
      type: 'application/javascript',
      innerHTML: `window.yaContextCb.push(()=>{ Ya.Context.AdvManager.render({ renderTo: 'yandex_rtb_R-A-1296363-3', blockId: 'R-A-1296363-3' }) })`
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
  name: "dHome",
  components: {
    MainPageNews,
    UserMessageDialog,
  },
  setup() {
    useMeta(() => meta);
    return {
      slide: ref(1),
      dialogModel: ref(false),
      texts,
      theme,
      goUrl,
    }
  }
}
</script>

<style lang="css">
@import 'src/css/main.css';
#REKLAMA {
  border-radius: 4px;
  /*background-color: #00e0e3;*/
}

#NEWS-PROJECT {
  height: 302px;
  width: 848px;
  border-radius: 4px;
}

#NEWS-STUDENTS {
  height: 302px;
  width: 277px;
  border-radius: 4px;
}

#UNIVERSITIES {
  min-height: 302px;
  width: 848px;
  border-radius: 4px;
}

#ANNOUNCES {
  height: 302px;
  width: 277px;
  border-radius: 4px;
}

.container-base {
  max-width: 1140px;
}
</style>
