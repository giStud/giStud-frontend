<template>
  <q-page class="flex-center" style=" background-color: rgb(238, 238, 238)">
    <div class="row " id="main">
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
          <q-card square id="static-ads" @click="getAdsStatic('https://vk.com/studiotag')" flat class="col-ads q-pa-xs">
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
      innerHTML: `window.yaContextCb.push(()=>{Ya.Context.AdvManager.render({renderTo: 'yandex_rtb_R-A-1273406-1', blockId: 'R-A-1273406-1'})})`
    }
  },
  meta: {
    description: { name: 'description', content: 'Главная страница - GISTUD | Удобная информация вашего университета: студенческие новости, раписание и многое другое' },
    keywords: { name: 'keywords', content: 'расписание, информационный сервис, студенты, студенческий сервис, вуз, университет, РФ, Россия, gistud' },
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
