<script setup lang="ts">
import { mdiMagnify, mdiPencil, mdiPlus } from "@mdi/js";

const fields: { [key: string]: string } = {
  "fields[node--documents]": [
    "title",
    "field_id",
    "field_spots_name_furigana",
    "drupal_internal__nid",
    "changed",
    "field_geo",
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

const title = "spots";

const search = ref("");

const headers = [
  { title: "地名（漢字）", value: "title", sortable: true },
  {
    title: "地名（ローマ字）",
    value: "field_spot_name_romaji",
    sortable: true,
  },
  {
    title: "経緯度",
    value: "lonlat",
  },
  { title: "更新日", value: "changed", sortable: true },
  { title: "アクション", value: "field_id" },
];

const desserts = computed(() => {
  return data.value?.data.map((item: any) => {
    return {
      drupal_internal__nid: item.attributes.drupal_internal__nid,
      title: item.attributes.title,
      field_id: item.attributes.field_id,
      field_spot_name_romaji: item.attributes.field_spot_name_romaji,
      changed: item.attributes.changed,
      lonlat: item.attributes.field_geo
        ? item.attributes.field_geo.lon + " /" + item.attributes.field_geo.lat
        : "",
    };
  });
});

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

const customFilter: any = (
  value: string,
  query: string,
  item: { raw: any }
) => {
  return (
    value != null &&
    query != null &&
    typeof value === "string" &&
    [
      value.toString(),
      item.raw.field_document_name_furigana,
      item.raw.field_author_name_furigana,
    ]
      .join(",")
      .toLowerCase()
      .split(" ")
      .join("")
      .indexOf(query.toLowerCase().split(" ").join("")) !== -1
  );
};
</script>
<template>
  <LayoutsCommon :title="title" :items="bh" fluid>
    <v-row dense class="mb-10">
      <v-col>
        <v-text-field
          v-model="search"
          label="Search"
          :prepend-inner-icon="mdiMagnify"
          variant="outlined"
          hide-details
          single-line
          density="compact"
        ></v-text-field>
      </v-col>
      <v-col class="text-right">
        <v-btn
          color="primary"
          variant="outlined"
          :href="`${url}node/add/spots`"
          target="_blank"
        >
          <v-icon>{{ mdiPlus }}</v-icon>
          文学名所を追加
        </v-btn>
      </v-col>
    </v-row>

    <v-data-table
      density="compact"
      :items-per-page="-1"
      :headers="headers"
      :items="desserts"
      :search="search"
      :custom-filter="customFilter"
    >
      <template v-slot:item.title="{ item }: any">
        <nuxt-link
          :to="
            localePath({
              name: 'spots-id',
              params: { id: item.field_id },
            })
          "
          >{{ item.title }}</nuxt-link
        >
      </template>

      <template v-slot:item.field_id="{ item }: any">
        <v-btn
          size="small"
          variant="outlined"
          color="warning"
          target="_blank"
          :href="`${url}/node/${item.drupal_internal__nid}/edit`"
        >
          <v-icon>{{ mdiPencil }}</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </LayoutsCommon>
</template>
