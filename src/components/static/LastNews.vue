<template>
  <div class="q-pa-md">
    <q-list>
      <q-item-label id="header-news" header>Последние новости</q-item-label>

      <q-item clickable @click="url('http://www.rsci.ru/grants/grant_news/297/243693.php')">
        <q-item-section>
          <q-item-label class="list-title" >Конкурс «Transport & Mobility»</q-item-label>
          <q-item-label lines="2">
            Отбор участников акселерационной программы по направлениям транспорт и мобильность (Transport&Mobility).
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable @click="url('http://www.rsci.ru/grants/grant_news/284/243691.php')">
        <q-item-section>
          <q-item-label class="list-title">Конкурс «Старт-ИИ-1»</q-item-label>
          <q-item-label lines="2">
            Конкурс «Старт-ИИ-1» (очередь II) в рамках федерального проекта «Искусственный интеллект» национальной программы «Цифровая экономика».
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable @click="url('http://www.rsci.ru/grants/grant_news/284/243691.php')">
        <q-item-section>
          <q-item-label class="list-title" >Конкурс «Интеллект»</q-item-label>
          <q-item-label lines="2">
            Гранты молодым ученым на проведение исследований в области искусственного интеллекта и когнитивных систем.
          </q-item-label>
        </q-item-section>
      </q-item>

    </q-list>
  </div>
</template>

<script>

export default {
  name: "LastNews",
  setup() {
    const url = (string) => {
      window.open(string);
    };
    return {
      url
    }
  }
}
</script>

<style lang="css">
@import 'src/css/home.css';
</style>
