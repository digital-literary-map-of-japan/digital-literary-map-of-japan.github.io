<script setup lang="ts">
import type { JsonApiItem } from "~/types/jsonapi";

const { locale } = useI18n();

const url = `https://drupal.aws.ldas.jp/dlm/${
  locale.value === "en" ? "en/" : ""
}jsonapi/node/page/c1f814ad-9822-4338-9cf1-aebc75da2351`;

const { data: contact } = await useFetch<JsonApiItem>(url);

const id = contact.value?.data.attributes?.drupal_internal__nid;
</script>
<template>
  <v-expansion-panels>
    <v-expansion-panel elevation="0">
      <v-expansion-panel-title class="bg-sub">{{
        $t("Explanatory notes")
      }}</v-expansion-panel-title>
      <v-expansion-panel-text class="pa-4">
        <CommonBlockEdit :id="id">
          <span v-html="contact?.data.attributes?.body.value"></span>
        </CommonBlockEdit>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
