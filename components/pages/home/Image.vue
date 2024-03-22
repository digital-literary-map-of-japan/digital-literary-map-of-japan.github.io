<script setup lang="ts">
const $config = useRuntimeConfig().public;
const appConfig = useAppConfig();

const imageUrl = "/img/KaiseiNifonYochiRoteiZenzu1846.jpg"; // $config.baseURL + appConfig.top_image_url;

const $t = useI18n().t;

const backgroundImageStyle = computed(() => {
  return `background-image: url('${imageUrl}'); background-size: cover; background-position: center;`;
});

const translatedTitle = computed(() => {
  return $t($config.siteName);
});

const localePath = useLocalePath();
</script>
<template>
  <div>
    <div :style="backgroundImageStyle" class="text-center">
      <div class="overlay py-10">
        <v-container>
          <img width="280px" height="280px" contain src="/img/logo.png" />
          <h1 style="font-variant: small-caps; color: #990500">
            {{ $t("Digital Literary Map of Japan") }}
          </h1>

          <!--
        <h2 class="mt-5 text-center text-white">
          らくらく検索で繋がるわくわく
        </h2>
        -->

          <p class="mt-10 text-center">
            <v-btn
              size="x-large"
              style="background-color: #2b3e50"
              class="text-white"
              flat
              :to="localePath({ name: 'spots' })"
              >閲覧する
            </v-btn>
          </p>
        </v-container>
      </div>
    </div>
    <div class="text-right pa-4">
      <small>
        {{
          $t("Title image")
        }}:『改正日本輿地路程全図』（長久保赤水：江戸後期）<img
          draggable="false"
          src="https://literarymaps.nijl.ac.jp/assets/public_domain_mark_white.svg.png"
          width="14px"
        />
        {{ $t("Public domain") }}
      </small>
    </div>

    <div class="text-center">
      <a href="https://www.osaka-u.ac.jp/">
        <img
          class="ma-4"
          height="30px"
          src="https://literarymaps.nijl.ac.jp/assets/logo_handai_B.png"
        />
      </a>
      <a href="https://www.nijl.ac.jp/">
        <img
          class="ma-4"
          height="30px"
          src="https://literarymaps.nijl.ac.jp/assets/logo_nijl.jpg"
        />
      </a>
      <a href="https://www.zo.uni-heidelberg.de/">
        <img
          style="max-width: 80%; max-height: 30px"
          class="ma-4"
          src="https://literarymaps.nijl.ac.jp/assets/logo_uhd.jpeg"
        />
      </a>
    </div>
  </div>
</template>
<style scoped>
.overlay {
  background-color: rgba(255, 255, 255, 0.5);
}

.title-text {
  color: white;
}
</style>
