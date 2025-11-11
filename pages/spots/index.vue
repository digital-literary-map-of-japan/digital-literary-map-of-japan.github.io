<script setup lang="ts">
const { results, documents, documentSpotMap, spotTypeCount, mode} = useMap();
const { fetchSpots, fetchDocuments, fetchApiData } = useLocalData();

const getSpots = async () => {
  const data = await fetchSpots();
  results.value = data;
};

const getDocuments = async () => {
  const data = await fetchDocuments();
  documents.value = data;
};

getSpots();
getDocuments();

const types = ["poems", "sanbuns", "yokyokus"];

const _documentSpotMap: { [key: string]: string[] } = {};
const _spotTypeCount: { [key: string]: { [key: string]: number } } = {};

for (const type_ of types) {
  const data = await fetchApiData(type_);

  if (!data) continue;

  for (const item of data) {
    const spot = item.spot_id;
    const document = item.document_id;
    if (!_documentSpotMap[document]) {
      _documentSpotMap[document] = [];
    }
    if (!_documentSpotMap[document].includes(spot)) {
      _documentSpotMap[document].push(spot);
    }

    if (!_spotTypeCount[spot]) {
      // 初期化

      const spotAttributes = results.value?.data.find(
        (spot_: any) => spot_?.attributes?.field_id === spot
      )?.attributes;

      _spotTypeCount[spot] = {};
      for (const type_ of types) {
        _spotTypeCount[spot][type_] = 0;
      }

      // 例がない場合は -1 にする
      if (spotAttributes?.field_no_examples) {
        _spotTypeCount[spot].yokyokus = -1;
      }
    }

    _spotTypeCount[spot][type_] += 1;
  }
}

documentSpotMap.value = _documentSpotMap;
spotTypeCount.value = _spotTypeCount;

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
  },
];

const route = useRoute();

watch(
  () => route.query,
  (val) => {
    if (val.layout) {
      mode.value = val.layout as string;
    }
  },
  { immediate: true }
);

useHead({
  link: [
    {
      rel: "canonical",
      href: process.env.BASE_URL + route.path,
    },
  ],
});
</script>
<template>
  <template v-if="mode === 'table'">
    <LayoutsCommon :title="title" :items="bh" fluid>
      <PagesSpotsTable></PagesSpotsTable>
    </LayoutsCommon>
  </template>

  <template v-else>
    <PagesMap full></PagesMap>
  </template>
</template>
