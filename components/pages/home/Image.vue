<script setup lang="ts">
const imageUrl = "/img/KaiseiNifonYochiRoteiZenzu1846.webp";

const $t = useI18n().t;

const backgroundImageStyle = computed(() => {
  return `background-image: url('${imageUrl}'); background-size: cover; background-position: center;`;
});

const localePath = useLocalePath();
</script>
<template>
  <div>
    <div :style="backgroundImageStyle" class="text-center">
      <div class="overlay py-10">
        <v-container>
          <img width="280px" height="280px" src="/img/logo.webp" alt="Digital Literary Map of Japan" fetchpriority="high" />
          <h1 style="font-variant: small-caps; color: #990500">
            {{ $t("Digital Literary Map of Japan") }}
          </h1>

          <p class="mt-10 text-center">
            <v-btn
              size="x-large"
              style="background-color: #2b3e50"
              class="text-white"
              flat
              :to="localePath({ name: 'spots' })"
              >{{ $t("Explore") }}
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
          src="/assets/public_domain_mark_white.webp"
          width="14"
          height="14"
          alt="Public Domain Mark"
          loading="lazy"
        />
        {{ $t("Public domain") }}
      </small>
    </div>

    <div class="text-center">
      <a href="https://www.osaka-u.ac.jp/">
        <img
          class="ma-4"
          height="30px"
          src="/assets/logo_handai_B.webp"
          alt="大阪大学"
          loading="lazy"
        />
      </a>
      <a href="https://www.nijl.ac.jp/">
        <img
          class="ma-4"
          height="30px"
          src="/assets/logo_nijl.webp"
          alt="国文学研究資料館"
          loading="lazy"
        />
      </a>
      <a href="https://www.zo.uni-heidelberg.de/">
        <img
          style="max-width: 80%; max-height: 30px"
          class="ma-4"
          src="/assets/logo_uhd.webp"
          alt="Universität Heidelberg"
          loading="lazy"
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
