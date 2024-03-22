<script setup lang="ts">
const url =
  "https://drupal.aws.ldas.jp/dlm/jsonapi/node/page/0a3c695c-d8ba-45c7-9f11-0ec60eabd34c";
const res = await fetch(url);
const json = await res.json();

const item = json.data.attributes;

const localePath = useLocalePath();
const { t } = useI18n();

const bh = [
  {
    title: t("top"),
    disabled: false,
    to: localePath({ name: "index" }),
  },
  {
    title: item.title,
    disabled: false,
  },
];
</script>
<template>
  <LayoutsCommon :title="`${item.title}`" :items="bh">
    <PagesContactBlock :item="item" />
  </LayoutsCommon>
</template>
