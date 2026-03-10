<script setup lang="ts">
const localePath = useLocalePath();
const { t } = useI18n();
const { setPageMeta, setBreadcrumbJsonLd } = useSeo();

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

setPageMeta({
  title: t('news'),
  description: t('Digital Literary Map of Japan') + ' - ' + t('news'),
});
setBreadcrumbJsonLd(bh);
</script>
<template>
  <LayoutsCommon :title="$t('news')" :items="bh">
    <CommonNewsList></CommonNewsList>
  </LayoutsCommon>
</template>
