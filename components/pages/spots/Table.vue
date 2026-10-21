<script setup lang="ts">
import { mdiMagnify, mdiMap } from "@mdi/js";
const { results, spotTypeCount, checkedSpotIds } = useMap();

const { t, locale } = useI18n();

const localePath = useLocalePath();

const search = ref("");

const sortBy = computed(() => {
  if (locale.value === "ja") {
    return [{ key: "field_spot_name_furigana", order: "asc" as const }];
  }
  return [{ key: "field_spot_name_romaji", order: "asc" as const }];
});

const headers = [
  { title: t("Name (Kanji)"), value: "field_spot_name_furigana", sortable: true },
  {
    title: t("Name (Rōmaji)"),
    value: "field_spot_name_romaji",
    sortable: true,
  },
  {
    title: t("Lng / Lat"),
    value: "lonlat",
  },
  {
    title: t("Poetry"),
    value: "poems",
    sortable: true,
  },
  {
    title: t("Tales, images etc."),
    value: "sanbuns",
    sortable: true,
  },
  {
    title: t("Yōkyoku"),
    value: "yokyokus",
    sortable: true,
  },
  // { title: t("updated"), value: "changed", sortable: true },
  // { title: t("action"), value: "field_id" },
];

// props.items
const desserts = computed(() => {
  if (!results.value) return [];
  return results.value.data.map((item: any) => {
    return {
      drupal_internal__nid: item.attributes.drupal_internal__nid,
      title: item.attributes.title,
      field_id: item.attributes.field_id,
      field_spot_name_furigana: item.attributes.field_spot_name_furigana,
      field_spot_name_romaji: item.attributes.field_spot_name_romaji,
      poems: spotTypeCount.value[item.attributes.field_id]?.poems ?? 0,
      sanbuns: spotTypeCount.value[item.attributes.field_id]?.sanbuns ?? 0,
      yokyokus: spotTypeCount.value[item.attributes.field_id]?.yokyokus ?? 0,
      changed: item.attributes.changed,
      lonlat: item.attributes.field_geo
        ? item.attributes.field_geo.lon + " /" + item.attributes.field_geo.lat
        : "",
    };
  });
});

const customFilter: any = (
  _value: any,
  query: string,
  item: { raw: any }
) => {
  if (!query) return true;
  const target = [
    item.raw.title,
    item.raw.field_spot_name_furigana,
    item.raw.field_spot_name_romaji,
  ]
    .filter(Boolean)
    .join(",")
    .toLowerCase()
    .replace(/\s+/g, "");
  return target.includes(query.toLowerCase().replace(/\s+/g, ""));
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
          query: checkedSpotIds.length > 0 ? { checked: checkedSpotIds.join(',') } : {},
        })
      "
    >
      <v-icon class="mr-2">{{ mdiMap }}</v-icon>
      {{ $t("Map view") }}
    </v-btn>
    <v-row dense class="mb-10">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          :label="$t('search')"
          :prepend-inner-icon="mdiMagnify"
          variant="outlined"
          hide-details
          single-line
          density="compact"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-data-table
      v-model="checkedSpotIds"
      density="compact"
      :items-per-page="-1"
      :headers="headers"
      :items="desserts"
      :search="search"
      :custom-filter="customFilter"
      :sort-by="sortBy"
      item-value="field_id"
      show-select
    >
      <template v-slot:item.field_spot_name_furigana="{ item }: any">
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

      <template v-slot:item.yokyokus="{ item }: any">
        <template v-if="item.yokyokus === -1">
          <v-chip>
            {{ $t("No examples") }}
          </v-chip>
        </template>
        <template v-else>{{ item.yokyokus }}</template>
      </template>
    </v-data-table>
  </div>
</template>
