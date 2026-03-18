<script setup lang="ts">
const { checkedSpotIds } = useMap();
const { loadSpotData } = useSpotData();

await loadSpotData();

definePageMeta({
  layout: "no-footer",
});

const { t } = useI18n();

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

const { setPageMeta } = useSeo();

setPageMeta({
  title: t('spots'),
  description: t('Digital Literary Map of Japan') + ' - ' + t('spots'),
});
</script>
<template>
  <PagesMap full></PagesMap>
</template>
