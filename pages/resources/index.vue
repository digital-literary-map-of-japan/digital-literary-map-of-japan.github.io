<script setup lang="ts">
import { mdiMagnify, mdiPencil, mdiPlus } from "@mdi/js";

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

const title = "資料";

const search = ref("");

const headers = [
  { title: "タイトル", value: "title", sortable: true },
  {
    title: "題名（ローマ字）",
    value: "field_document_name_romaji",
    sortable: true,
  },
  { title: "著者", value: "field_author_name_kanji", sortable: true },
  {
    title: "著者（ローマ字）",
    value: "field_author_name_romaji",
    sortable: true,
  },
  { title: "ジャンル", value: "field_genre", sortable: true },
  { title: "更新日", value: "changed", sortable: true },
  { title: "アクション", value: "field_id" },
];

const desserts = computed(() => {
  return data.value?.data.map((item: any) => {
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
    title: t("documents"),
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
          :href="`${url}node/add/documents`"
          target="_blank"
        >
          <v-icon>{{ mdiPlus }}</v-icon>
          作品を追加
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
              name: 'resources-id',
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
