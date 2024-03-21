<script setup lang="ts">
const localePath = useLocalePath();

// const { data } = await useAsyncData("home", () => queryContent("/").findOne());
</script>
<template>
  <div>
    <PagesHomeImage></PagesHomeImage>

    <v-container class="my-5">
      <!--
      <v-card variant="outlined">
        <v-card-text>
          
          サイトの説明
        </v-card-text>
      </v-card>
      -->

      <div class="text-center">
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

      <v-alert variant="tonal" dense class="mt-10" type="info">
        <p>
          <template v-if="$i18n.locale === 'ja'">
            アンケートを実施しています。以下のリンクからアンケートにご協力下さい。
          </template>
          <template v-else>
            We are conducting a survey. Please click on the link below to
            complete the survey.
          </template>
        </p>

        <a href="https://forms.gle/1wEiSoheov2ToBFf7" target="_blank"
          >https://forms.gle/1wEiSoheov2ToBFf7</a
        >
      </v-alert>
    </v-container>

    <div class="py-10 bg-sub text-center">
      <!--
      <v-container class="pa-10">
        <p class="mb-5">
          <b>{{ $t("news") }}</b>
          <span class="ml-5"
            ><nuxt-link :to="localePath({ name: 'news' })"
              ><small>{{ $t("all") }}</small></nuxt-link
            ></span
          >
        </p>

        <CommonNewsList :size="5"></CommonNewsList>
      </v-container>
      -->
      <v-container class="py-10">
        <h2>{{ "文学地図" }}</h2>
        <br />
        <!-- <nuxt-content :document="page" /> -->
      </v-container>
    </div>

    <v-sheet class="py-10 text-center">
      <v-container class="py-10">
        <h2>{{ $t("Coordination and contact") }}</h2>
        <br />
        <!-- <nuxt-content :document="page" /> -->
      </v-container>
    </v-sheet>
  </div>
</template>
