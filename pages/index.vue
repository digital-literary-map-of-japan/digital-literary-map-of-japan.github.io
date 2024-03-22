<script setup lang="ts">
import type { JsonApiItem, JsonApiObject } from "~/types/jsonapi";

const localePath = useLocalePath();

// const { data } = await useAsyncData("home", () => queryContent("/").findOne());

const url =
  "https://drupal.aws.ldas.jp/dlm/jsonapi/node/page/0a3c695c-d8ba-45c7-9f11-0ec60eabd34c";

const { data: contact } = await useFetch<JsonApiItem>(url);
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

      <v-alert variant="tonal" dense type="info">
        <p class="mb-2">
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

      <div class="py-10">
        <h2>{{ $t("歌枕・名所アノテーションツール") }}</h2>
        <br />
        <!-- <nuxt-content :document="page" /> -->
        <PagesHomeAbout />

        <PagesHomeLegend class="my-10" />
      </div>
    </v-container>

    <div class="py-10 bg-sub">
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
        <CommonMap></CommonMap>
      </v-container>
    </div>

    <v-sheet class="py-10">
      <v-container class="py-10">
        <h2>{{ $t("Coordination and contact") }}</h2>
        <br />
        <!-- <nuxt-content :document="page" /> -->
        <PagesContactBlock :item="contact" />
      </v-container>
    </v-sheet>
  </div>
</template>
