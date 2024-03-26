<script setup lang="ts">
const { t, locale } = useI18n();

const url = `https://drupal.aws.ldas.jp/dlm/${
  locale.value === "en" ? "en/" : ""
}jsonapi/node/page/0a3c695c-d8ba-45c7-9f11-0ec60eabd34c`;

const { data }: { [data: string]: any } = await useFetch(url);

const attributes = data.value?.data.attributes;

const localePath = useLocalePath();

const bh = [
  {
    title: t("top"),
    disabled: false,
    to: localePath({ name: "index" }),
  },
  {
    title: attributes.title,
    disabled: false,
  },
];
</script>
<template>
  <LayoutsCommon :title="`${attributes.title}`" :items="bh">
    <PagesContactBlock :attributes="attributes" />
  </LayoutsCommon>
</template>
