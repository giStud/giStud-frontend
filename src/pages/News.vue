<template>
  <q-page>
    <div id="top-adw" class="main-row">
      <q-card square flat class="bg-none border">
        <q-card-section class="q-px-none">
          <!--Реклама-->
        </q-card-section>
      </q-card>

    </div>

    <div class="row main-row ">

      <q-card square flat class="col-md-auto q-pr-sm bg-none" id="main-center-row">
        <q-card>
          <q-card-section horizontal>
            <q-card-section class="col-6 q-pt-xs">
              <div class="text-h5 q-mt-sm q-mb-xs">
                %Название%
              </div>
              <div class="text-caption text-grey"><br>
                %Текст новости%
              </div>
            </q-card-section>
            <q-card-section class="col-6 mobile-hide">
              <q-img height="250px" src="http://www.rsci.ru/upload/iblock/f55/f55b6c86e18069eb74beae7495db8424.jpg"/>
            </q-card-section>
          </q-card-section>
          <q-separator/>
          <q-card-actions class="justify-between">
            <q-btn flat color="primary">Читать</q-btn>
            <div>
              <q-btn flat round icon="event"/>
              <q-btn flat> 01.09.2021</q-btn>
            </div>
          </q-card-actions>
          <div class="news-p bg-none"></div>
        </q-card>
      </q-card>

      <q-card square flat class="col q-pl-sm card-reklama bg-none">
        <q-card class="border">
          <q-card-section>
            <!--Реклама-->
          </q-card-section>
        </q-card>
      </q-card>

    </div>

  </q-page>
</template>

<script>

</script>

<style lang="css">
@import 'src/css/news.css';
</style>
