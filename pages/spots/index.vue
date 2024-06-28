<script setup lang="ts">
const { results, documents, documentSpotMap, spotTypeCount, mode } = useMap();

const getSpots = async () => {
  const fields: { [key: string]: string } = {
    "fields[node--spots]": [
      "title",
      "field_id",
      "field_spots_name_furigana",
      "drupal_internal__nid",
      "changed",
      "field_geo",
      "field_spot_name_furigana",
      "field_spot_name_romaji",
      "field_history_ja",
      "field_history_en",
    ].join(","),
  };

  const url = "https://drupal.aws.ldas.jp/dlm/";

  const endpoint = `${url}jsonapi/node/spots`;

  const params: { [key: string]: string } = {
    "page[limit]": "500",
  };

  for (const key in fields) {
    params[key] = fields[key];
  }

  const { data }: { [data: string]: any } = await useFetch(endpoint, {
    query: params,
  });

  results.value = data.value;
};

const getDocuments = async () => {
  const fields: { [key: string]: string } = {
    "fields[node--documents]": ["title", "field_id"].join(","),
  };

  const url = "https://drupal.aws.ldas.jp/dlm/";

  const endpoint = `${url}jsonapi/node/documents`;

  const params: { [key: string]: string } = {
    "page[limit]": "500",
  };

  for (const key in fields) {
    params[key] = fields[key];
  }

  const { data }: { [data: string]: any } = await useFetch(endpoint, {
    query: params,
  });

  documents.value = data.value;
};

getSpots();
getDocuments();

const types = ["poems", "sanbuns", "yokyokus"];

const _documentSpotMap: { [key: string]: string[] } = {};
const _spotTypeCount: { [key: string]: { [key: string]: number } } = {};

for (const type_ of types) {
  /*
  const fields: { [key: string]: string } = {
    [`fields[node--${type_}]`]: ["field_poem", "field_document"].join(","),
  };
  */

  const url = "https://drupal.aws.ldas.jp/dlm/";

  const endpoint = `${url}api/${type_}`;

  const { data }: { [data: string]: any } = await useFetch(endpoint);

  if (!data?.value) continue;

  for (const item of data?.value) {
    const spot = item.spot_id;
    const document = item.document_id;
    if (!_documentSpotMap[document]) {
      _documentSpotMap[document] = [];
    }
    if (!_documentSpotMap[document].includes(spot)) {
      _documentSpotMap[document].push(spot);
    }

    if (!_spotTypeCount[spot]) {
      _spotTypeCount[spot] = {};
      for (const type_ of types) {
        _spotTypeCount[spot][type_] = 0;
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
