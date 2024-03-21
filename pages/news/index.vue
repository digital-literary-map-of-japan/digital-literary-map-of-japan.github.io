<script setup lang="ts">
const localePath = useLocalePath();
const { t } = useI18n();
const bh = [
  {
    title: t("top"),
    disabled: false,
    to: localePath({ name: "index" }),
  },
  {
    title: t("news"),
    disabled: false,
  },
];
</script>
<template>
  <LayoutsCommon :title="$t('news')" :items="bh">
    <CommonNewsList></CommonNewsList>
  </LayoutsCommon>
</template>
