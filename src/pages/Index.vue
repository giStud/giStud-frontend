<template>
  <q-page class="flex-center" style=" background-color: rgb(238, 238, 238)">
    <div class="row " id="main">
      <div id="main-left-col" class="col-9">
        <MainNewsOur/>
        <TemplateUniversity/>
        <div class="separator"></div>
      </div>
      <div id="main-right-col" class="col-3">
        <div id="col-ads">
          <div class="col-ads">
            <div id="col-ads-1"></div>
          </div>
          <div class="col-ads">
            <span>Тут могла быть ваша реклама2</span>
          </div>
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

// const meta = {
//   script: {
//     ads: {
//       type: 'application/javascript',
//       innerHTML: `window.yaContextCb.push(()=>{Ya.Context.AdvManager.render({renderTo: 'yandex_rtb_R-A-1273406-1', blockId: 'R-A-1273406-1'})})`
//     }
//   }
// }

export default defineComponent({
  name: 'PageIndex',
  components: {
    LastNews,
    MainNewsOur,
    TemplateUniversity,
  },
  setup() {
    // useMeta(() => meta)
    //window.yaContextCb.push(()=>{Ya.Context.AdvManager.render({renderTo: 'yandex_rtb_R-A-1273406-1', blockId: 'R-A-1273406-1'})})
    return {}
  }
})


</script>

<style lang="css" scoped>
@import 'src/css/home.css';
</style>
