<script setup lang="ts">
import { mdiMagnify, mdiMap } from "@mdi/js";
const { isAdmin } = useSettings();
const { results, spotTypeCount } = useMap();

const { t } = useI18n();

const localePath = useLocalePath();

const search = ref("");

const headers = [
  { title: t("Name (Kanji)"), value: "title", sortable: true },
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

if (isAdmin.value) {
  headers.push({
    title: t("updated"),
    value: "changed",
    sortable: true,
  });

  headers.push({
    title: t("action"),
    value: "field_id",
    sortable: false,
  });
}

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
      yokyokus: item.attributes.field_no_examples
        ? -1
        : spotTypeCount.value[item.attributes.field_id]
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

      <v-col cols="12" md="6" class="text-right">
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

      <template v-slot:item.yokyokus="{ item }: any">
        <template v-if="item.yokyokus === -1">
          <v-chip>
            {{ $t("No examples") }}
          </v-chip>
        </template>
        <template v-else>{{ item.yokyokus }}</template>
      </template>

      <template v-slot:item.field_id="{ item }: any">
        <CommonBtnEdit :id="item.drupal_internal__nid" />
      </template>
    </v-data-table>
  </div>
</template>
