<script setup lang="ts">
import type { JsonApiItem } from "~/types/jsonapi";

const { locale } = useI18n();
const { fetchPage } = useLocalData();

const contact = await fetchPage("70719d64-1529-4fcf-960d-b03c8ed56a96", locale.value);

const id = contact?.data.attributes?.drupal_internal__nid;
</script>
<template>
  <span v-html="contact?.data.attributes?.body.value"></span>
</template>
