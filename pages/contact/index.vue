<script setup lang="ts">
const { t, locale } = useI18n();
const { fetchPage } = useLocalData();
const { setPageMeta, setBreadcrumbJsonLd } = useSeo();

const data = await fetchPage("0a3c695c-d8ba-45c7-9f11-0ec60eabd34c", locale.value);

const attributes = data?.data.attributes;

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

setPageMeta({
  title: t('Contact'),
  description: t('Digital Literary Map of Japan') + ' - ' + t('Coordination and contact'),
});
setBreadcrumbJsonLd(bh);
</script>
<template>
  <LayoutsCommon :title="`${attributes.title}`" :items="bh">
    <PagesContactBlock :attributes="attributes" />
  </LayoutsCommon>
</template>
