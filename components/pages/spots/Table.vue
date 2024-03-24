<script setup lang="ts">
import { mdiMagnify, mdiMap, mdiPencil, mdiPlus } from "@mdi/js";
import type { JsonApiItems, ResourceObject } from "~/types/jsonapi";

const { results, spotTypeCount } = useMap();

/*
interface PropType {
  items: ResourceObject[];
}

const props = withDefaults(defineProps<PropType>(), {
  items: () => [],
});
*/

const localePath = useLocalePath();

const url = "https://drupal.aws.ldas.jp/dlm/";

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
  {
    title: "和歌・漢詩・俳諧",
    value: "poems",
    sortable: true,
  },
  {
    title: "物語・説話",
    value: "sanbuns",
    sortable: true,
  },
  {
    title: "謡曲",
    value: "yokyokus",
    sortable: true,
  },
  { title: "更新日時", value: "changed", sortable: true },
  { title: "アクション", value: "field_id" },
];

// props.items
const desserts = computed(() => {
  if (!results.value) return [];
  return results.value.data.map((item: any) => {
    return {
      drupal_internal__nid: item.attributes.drupal_internal__nid,
      title: item.attributes.title,
      field_id: item.attributes.field_id,
      field_spot_name_romaji: item.attributes.field_spot_name_romaji,
      poems: spotTypeCount.value[item.attributes.field_id]
        ? spotTypeCount.value[item.attributes.field_id].poems
        : 0,
      sanbuns: spotTypeCount.value[item.attributes.field_id]
        ? spotTypeCount.value[item.attributes.field_id].sanbuns
        : 0,
      yokyokus: spotTypeCount.value[item.attributes.field_id]
        ? spotTypeCount.value[item.attributes.field_id].yokyokus
        : 0,
      changed: item.attributes.changed,
      lonlat: item.attributes.field_geo
        ? item.attributes.field_geo.lon + " /" + item.attributes.field_geo.lat
        : "",
    };
  });
});

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
  <div>
    <v-btn
      class="mb-4"
      variant="flat"
      color="primary"
      :active="false"
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
      <v-col> </v-col>

      <v-col class="text-right">
        <CommonBtnAdd type="spots"></CommonBtnAdd>
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
  </div>
</template>
