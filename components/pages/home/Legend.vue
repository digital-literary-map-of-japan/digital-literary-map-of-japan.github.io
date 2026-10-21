<script setup lang="ts">
import type { JsonApiItem } from "~/types/jsonapi";

const { locale } = useI18n();
const { fetchPage } = useLocalData();

const contactData = await fetchPage("c1f814ad-9822-4338-9cf1-aebc75da2351", locale.value);

const id = contactData?.data.attributes?.drupal_internal__nid;

const body = contactData?.data.attributes?.body.value
</script>
<template>
  <v-expansion-panels>
    <v-expansion-panel elevation="0">
      <v-expansion-panel-title class="bg-sub">{{
        $t("Explanatory notes")
      }}</v-expansion-panel-title>
      <v-expansion-panel-text class="pa-4">
        <span v-html="body"></span>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
