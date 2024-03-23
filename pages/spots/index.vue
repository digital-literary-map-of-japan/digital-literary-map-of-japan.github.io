<script setup lang="ts">
import { mdiMagnify, mdiMap, mdiPencil, mdiPlus } from "@mdi/js";

const { results } = useMap();

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
  ].join(","),
};

const url = "https://drupal.aws.ldas.jp/dlm/";

const endpoint = `${url}jsonapi/node/spots`;

const params: { [key: string]: string } = {
  "page[limit]": "100",
};

for (const key in fields) {
  params[key] = fields[key];
}

const { data }: { [data: string]: any } = await useFetch(endpoint, {
  query: params,
});

results.value = data.value;

const title = "spots";

const localePath = useLocalePath();

const { t } = useI18n();

const bh = [
  {
    title: t("top"),
    disabled: false,
    to: localePath({ name: "index" }),
  },
  {
    title: t("spots"),
    disabled: false,
  },
];

const mode = ref("map");

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
</script>
<template>
  <template v-if="mode === 'map'">
    <!-- :markers="markers"  -->
    <PagesMap full></PagesMap>
  </template>

  <template v-else>
    <LayoutsCommon :title="title" :items="bh" fluid>
      <v-btn
        class="mb-4"
        variant="outlined"
        :to="
          localePath({
            name: 'spots',
            query: { layout: 'map' },
          })
        "
      >
        <v-icon>{{ mdiMap }}</v-icon>
        地図表示
      </v-btn>

      <PagesSpotsTable></PagesSpotsTable>
    </LayoutsCommon>
  </template>
</template>
