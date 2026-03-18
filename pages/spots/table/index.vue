<script setup lang="ts">
const { checkedSpotIds } = useMap();
const { loadSpotData } = useSpotData();

await loadSpotData();

const { t } = useI18n();
const title = t("spots");

const localePath = useLocalePath();

const bh = [
  {
    title: t("top"),
    disabled: false,
    to: localePath({ name: "index" }),
  },
  {
    title,
    disabled: false,
    to: localePath({ name: "spots" }),
  },
  {
    title: t("Table view"),
    disabled: false,
  },
];

const route = useRoute();
const router = useRouter();

watch(
  () => route.query,
  (val) => {
    if (val.checked) {
      const ids = (val.checked as string).split(",").filter(Boolean);
      checkedSpotIds.value = ids;
    }
  },
  { immediate: true }
);

watch(
  checkedSpotIds,
  (val) => {
    const query = { ...route.query };
    if (val.length > 0) {
      query.checked = val.join(",");
    } else {
      delete query.checked;
    }
    router.replace({ query });
  },
  { deep: true }
);

const { setPageMeta, setBreadcrumbJsonLd } = useSeo();

setPageMeta({
  title: t('spots') + ' - ' + t('Table view'),
  description: t('Digital Literary Map of Japan') + ' - ' + t('spots'),
});
setBreadcrumbJsonLd(bh);
</script>
<template>
  <LayoutsCommon :title="title" :items="bh" fluid>
    <PagesSpotsTable></PagesSpotsTable>
  </LayoutsCommon>
</template>
