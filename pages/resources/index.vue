<script setup lang="ts">
import type { CommonBtnAdd, CommonBtnEdit } from "#build/components";
import { mdiMagnify, mdiCheck } from "@mdi/js";

const { isAdmin } = useSettings();

const fields: { [key: string]: string } = {
  "fields[node--documents]": [
    "title",
    "field_document_name_romaji",
    "field_document_name_furigana",
    "field_author_name_kanji",
    "field_id",
    "drupal_internal__nid",
    "field_genre",
    "field_author_name_romaji",
    "field_author_name_furigana",
    "changed",
  ].join(","),
};

const url = "https://drupal.aws.ldas.jp/dlm/";

const endpoint = `${url}jsonapi/node/documents`;

const params: { [key: string]: string } = {
  "page[limit]": "100",
};

for (const key in fields) {
  params[key] = fields[key];
}

const { data }: { [data: string]: any } = await useFetch(endpoint, {
  query: params,
});

const { t } = useI18n();

const title = t("Resources");

const search = ref("");

const headers = [
  { title: t("Title"), value: "title", sortable: true },
  {
    title: t("Title (Romaji)"),
    value: "field_document_name_romaji",
    sortable: true,
  },
  { title: t("Author"), value: "field_author_name_kanji", sortable: true },
  {
    title: t("Author (Rōmaji)"),
    value: "field_author_name_romaji",
    sortable: true,
  },
  { title: t("Genre"), value: "field_genre", sortable: true },
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

const desserts = computed(() => {
  return data.value?.data
    .map((item: any) => {
      const genre = item.attributes.field_genre;

      const fixedGenre = genre.split("（")[0];

      if (
        selectedValues.value.length > 0 &&
        !selectedValues.value.includes(fixedGenre)
      ) {
        return null;
      }

      return {
        title: item.attributes.title,
        field_document_name_romaji: item.attributes.field_document_name_romaji,
        field_author_name_kanji: item.attributes.field_author_name_kanji,
        field_id: item.attributes.field_id,
        drupal_internal__nid: item.attributes.drupal_internal__nid,
        field_genre: item.attributes.field_genre,
        field_author_name_romaji: item.attributes.field_author_name_romaji,
        changed: item.attributes.changed,
        field_author_name_furigana: item.attributes.field_author_name_furigana,
        field_document_name_furigana:
          item.attributes.field_document_name_furigana,
      };
    })
    .filter((item: any) => item != null);
});

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

const selectedValues = ref<string[]>([]);

const update = (item: string) => {
  if (selectedValues.value.includes(item)) {
    selectedValues.value.splice(selectedValues.value.indexOf(item), 1);
  } else {
    selectedValues.value.push(item);
  }
};
</script>
<template>
  <LayoutsCommon :title="title" :items="bh" fluid>
    <div class="mb-10">
      <v-row dense class="mb-4">
        <v-col cols="12" md="4">
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
        <v-col class="text-right">
          <CommonBtnAdd type="documents" label="作品を追加"></CommonBtnAdd>
        </v-col>
      </v-row>

      <div>
        <b>{{ $t("Genre") }}：</b>

        <v-btn
          class="ma-1"
          v-for="item in ['勅撰和歌集', '物語', '謡曲']"
          :variant="selectedValues.includes(item) ? 'flat' : 'outlined'"
          @click="update(item)"
          :color="selectedValues.includes(item) ? 'primary' : 'default'"
        >
          {{ item }}

          <template v-if="selectedValues.includes(item)">
            <v-icon class="ml-2">
              {{ mdiCheck }}
            </v-icon>
          </template>
        </v-btn>
      </div>
    </div>

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
              name: 'resources-id',
              params: { id: item.field_id },
            })
          "
          >{{ item.title }}</nuxt-link
        >
      </template>

      <template v-slot:item.field_id="{ item }: any">
        <CommonBtnEdit :id="item.drupal_internal__nid" />
      </template>
    </v-data-table>
  </LayoutsCommon>
</template>
