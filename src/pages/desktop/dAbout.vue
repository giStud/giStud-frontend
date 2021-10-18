<template>
  <q-page>
    <q-card id="MAIN-PAGE" class="bg-none" flat square>

      <q-card id="MAIN" class="center-all container-base fix-my fix-pa" flat>

        <q-card id="TITLE" square flat>
          <q-card-section>О проекте</q-card-section>



        </q-card>


      </q-card>

      </q-card>
  </q-page>
</template>

<script>
import {ref} from "vue";
import {goUrl, theme} from "src/services/other/tools";
import texts from "src/info/texts";
import {useMeta} from "quasar";

const meta = {
  title: 'О проекте - GISTUD',
  meta: {
    description: {
      name: 'description',
      content: 'О проекте - GISTUD | Удобная информация вашего университета: студенческие новости, расписание и многое другое'
    },
    keywords: {
      name: 'keywords',
      content: 'расписание, информационный сервис, студенты, студенческий сервис, вуз, университет, РФ, Россия, gistud'
    },
  }
}

export default {
  name: "dAbout",
  components: {
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

#MAIN {
  border-radius: 4px;
  height: 1200px;
}

#TITLE {
  font-size: 25px;
  text-align: center;
  text-transform: uppercase;
  font-weight: bold;
}

.container-base {
  max-width: 1140px;
}
</style>
