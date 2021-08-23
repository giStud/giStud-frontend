<template>
  <div id="box-universities">

    <div class="box-university col-12 row">
      <div class="col-5 img-university">
        <q-img class="img-university-src" src="../../assets/media/universities/VGTU/VGTU.jpg" loading="lazy" spinner-color="white" height="300px"/>
      </div>
      <div class="col-7 content-university">
        <div>
          <span class="title-university">Воронежский государственный технический университет</span>
          <p>
            Воронежский государственный архитектурно-строительный университет — существовавшее самостоятельно до лета
            2016
            года высшее учебное заведение города Воронежа. В настоящее время объединён с Воронежским государственным
            техническим университетом.
          </p>
        </div>
        <div>
          <q-btn flat no-caps class="btn-university">Перейти</q-btn>
          <q-btn flat no-caps class="btn-university">Официальный сайт</q-btn>
        </div>
      </div>
    </div>

    <div class="box-university col-12 row">
      <div class="col-5 img-university">
        <q-img class="img-university-src" src="../../assets/media/universities/VGTU/VGTU.jpg" loading="lazy" spinner-color="white" height="300px"/>
      </div>
      <div class="col-7 content-university">
        <div>
          <span class="title-university">Ваш университет</span>
          <p>
            Вы можете оставить заявку на добавление вашего вуза-гавнуза.
          </p>
        </div>
        <div>
          <q-btn flat no-caps class="btn-university">Оставить заявку</q-btn>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "TemplateUniversity"
}
</script>

<style lang="css">
@import '../../css/home.css';
</style>
