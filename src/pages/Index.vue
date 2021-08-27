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
            <span>Тут могла быть ваша реклама1</span>
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
import {defineComponent, onMounted} from 'vue';
import LastNews from "components/static/LastNews";
import MainNewsOur from "components/static/MainNewsOur";
import TemplateUniversity from "components/static/TemplateUniversity";

export default defineComponent({
  name: 'PageIndex',
  components: {
    LastNews,
    MainNewsOur,
    TemplateUniversity,
  },

  setup() {
    const appendYaMetrix = ()=> {
      console.log("Вызвал")
      const yaDiv = document.getElementById('yandex_rtb_XXXXXX')

      const yaScript = document.createElement('script')
      yaScript.setAttribute('type', 'text/javascript')
      yaScript.innerHTML = `(function(w, d, n, s, t) {
        w[n] = w[n] || [];
        w[n].push(function() {
            Ya.Context.AdvManager.render({
                blockId: "XXXXXX",
                renderTo: "yandex_rtb_XXXXXXX",
                horizontalAlign: false,
                async: true
            });
        });
        t = d.getElementsByTagName("script")[0];
        s = d.createElement("script");
        s.type = "text/javascript";
        s.src = "//an.yandex.ru/system/context.js";
        s.async = true;
        t.parentNode.insertBefore(s, t);
    })(this, this.document, "yandexContextAsyncCallbacks");`

      document.head.appendChild(yaScript)
    }

    onMounted(()=> {
      appendYaMetrix()
    })
    return {

    }
  }
})


</script>

<style lang="css" scoped>
@import 'src/css/home.css';
</style>
