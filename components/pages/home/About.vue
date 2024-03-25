<script setup lang="ts">
import type { JsonApiItem } from "~/types/jsonapi";

const { locale } = useI18n();

const url = `https://drupal.aws.ldas.jp/dlm/${
  locale.value === "en" ? "en/" : ""
}jsonapi/node/page/70719d64-1529-4fcf-960d-b03c8ed56a96`;

const { data: contact } = await useFetch<JsonApiItem>(url);

const id = contact.value?.data.attributes?.drupal_internal__nid;
</script>
<template>
  <CommonBlockEdit :id="id">
    <span v-html="contact?.data.attributes?.body.value"></span>
  </CommonBlockEdit>
</template>
