<template>
  <q-page class="flex-center" style=" background-color: rgb(238, 238, 238)">
    <div class="row mobile-hide" id="main">
      <div id="main-left-col" class="col-9">
        <MainNewsOur/>
        <TemplateUniversity/>
        <div class="separator"></div>
      </div>
      <div id="main-right-col" class="col-3">
        <div id="col-ads" class="q-pa-xs">
          <q-card flat class="col-ads">
            <div id="yandex_rtb_R-A-1273406-1"></div>
          </q-card>
          <q-card square @click="getAdsStatic('https://vk.com/studiotag')" flat class="col-ads">
            <q-img src="https://cdn.discordapp.com/attachments/317672589457883136/881961544546660383/tagstudio.jpg">
              <div class="absolute-bottom text-left">
                <span>Закажи дизайн тут!</span>
              </div>
            </q-img>
          </q-card>
        </div>
        <div id="student-news">
          <LastNews/>
        </div>
      </div>
    </div>

    <div class="row desktop-hide">
      <q-card square flat>
        <MainNewsOur/>
        <div style="height: 20px;"></div>
        <q-card flat square class="q-pa-xs">
          <q-card flat class="col-ads">
            <div id="yandex_rtb_R-A-1273406-2"></div>
          </q-card>
          <q-card>
            <q-card-section>
              <q-card square @click="getAdsStatic('https://vk.com/studiotag')" flat class="col-ads">
                <q-img style="max-height: 200px" src="https://cdn.discordapp.com/attachments/317672589457883136/881961544546660383/tagstudio.jpg">
                  <div class="absolute-bottom text-left">
                    <span>Закажи дизайн тут!</span>
                  </div>
                </q-img>
              </q-card>
            </q-card-section>
          </q-card>
        </q-card>
        <div style="height: 20px;"></div>
        <q-card square flat style="text-align: center">
            <LastNews/>
        </q-card>
        <div style="height: 20px;"></div>
        <TemplateUniversity/>
      </q-card>
    </div>

  </q-page>
</template>

<script>
import {defineComponent} from 'vue';
import LastNews from "components/static/LastNews";
import MainNewsOur from "components/static/MainNewsOur";
import TemplateUniversity from "components/static/TemplateUniversity";
import {useMeta} from 'quasar'
//

const meta = {
  title: 'Главная - GISTUD',
  script: {
    ads: {
      type: 'application/javascript',
      innerHTML: `window.yaContextCb.push(()=>{Ya.Context.AdvManager.render({renderTo: 'yandex_rtb_R-A-1273406-1', blockId: 'R-A-1273406-1'})})
                  window.yaContextCb.push(()=>{Ya.Context.AdvManager.render({renderTo: 'yandex_rtb_R-A-1273406-2',blockId: 'R-A-1273406-2'})})
                  window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-L01WVCCRS6');`
    }
  },
  meta: {
    description: {
      name: 'description',
      content: 'Главная страница - GISTUD | Удобная информация вашего университета: студенческие новости, раписание и многое другое'
    },
    keywords: {
      name: 'keywords',
      content: 'расписание, информационный сервис, студенты, студенческий сервис, вуз, университет, РФ, Россия, gistud'
    },
  }
}

export default defineComponent({
  name: 'PageIndex',
  components: {
    LastNews,
    MainNewsOur,
    TemplateUniversity,
  },
  setup() {
    useMeta(() => meta)
    const getAdsStatic = (string) => {
      window.open(string);
    }
    return {
      getAdsStatic
    }
  }
})


</script>

<style lang="css" scoped>
@import 'src/css/home.css';
</style>
