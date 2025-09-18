<script setup lang="ts">
const route = useRoute();
const id = route.params.id as string;
const url = "https://drupal.aws.ldas.jp/dlm/";
const endpoint = `${url}jsonapi/node/documents`;
const params: { [key: string]: string } = {
  "filter[field_id]": id,
};
const { data }: { [data: string]: any } = await useFetch(endpoint, {
  query: params,
});
const item = data.value?.data[0];
const attributes = item?.attributes;
const did = attributes?.drupal_internal__nid;
const { t } = useI18n();
const title = `${attributes?.title} / ${attributes?.field_document_name_romaji ?? ""}`;
const fields = [
  {
    title: t("Title"),
    value: "title",
  },
  {
    title: t("Title (Furigana)"),
    value: "field_document_name_furigana",
  },
  {
    title: t("Title (Romaji)"),
    value: "field_document_name_romaji",
  },
  {
    title: t("Year"),
    value: "field_year",
  },
  {
    title: t("Genre"),
    value: "field_genre",
  },
  {
    title: t("Author"),
    value: "field_author_name_kanji",
  },
  {
    title: t("Author (Furigana)"),  // ふりがな用に修正
    value: "field_author_name_furigana",
  },
  {
    title: t("Author (Rōmaji)"),  // ローマ字用に追加
    value: "field_author_name_romaji",  // 実際のローマ字フィールド名に合わせて調整
  },
  {
    title: t("Source text"),
    value: "field_source_text",
  },
  {
    title: t("Publisher"),
    value: "field_publisher",
  },
  {
    title: t("Publication year"),
    value: "field_publication_year",
  },
  {
    title: t("Publication place"),
    value: "field_publication_location",
  },
  {
    title: "URL",
    value: "field_link",
  },
];
const localePath = useLocalePath();
const bh = [
  {
    title: t("top"),
    disabled: false,
    to: localePath({ name: "index" }),
  },
  {
    title: t("Resources"),
    disabled: false,
    to: localePath({ name: "resources" }),
  },
  {
    title: title,
    disabled: false,
  },
];
</script>
<template>
  <LayoutsCommon :title="title" :items="bh">
    <template v-for="field in fields">
      <v-row dense v-if="attributes?.[field.value]">
        <v-col :md="3" cols="12">
          <b>{{ field.title }}：</b>
        </v-col>
        <v-col :md="9" cols="12">
          <template v-if="field.value === 'field_link'">
            <!-- field_linkが配列なので、各要素をループして表示 -->
            <div v-for="(link, index) in attributes[field.value]" :key="index">
              <a v-if="link.uri" :href="link.uri" target="_blank">
                {{ link.title || link.uri }}
              </a>
            </div>
          </template>
          <template v-else>
            {{ attributes?.[field.value] }}
          </template>
        </v-col>
      </v-row>
    </template>
    <v-row class="my-4">
      <v-col>
        <CommonBtnBack type="resources"></CommonBtnBack>
      </v-col>
      <v-col class="text-right">
        <CommonBtnEdit :id="did"></CommonBtnEdit>
      </v-col>
    </v-row>
  </LayoutsCommon>
</template>
