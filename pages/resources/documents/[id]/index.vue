<script setup lang="ts">
import { mdiArrowLeftBold, mdiPencil } from "@mdi/js";

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

const title = `"${attributes?.title} / ${attributes?.field_document_name_romaji}"の情報`;

const fields = [
  {
    title: "題名",
    value: "title",
  },
  {
    title: "題名（ふりがな）",
    value: "field_document_name_furigana",
  },
  {
    title: "題名（ローマ字）",
    value: "field_document_name_romaji",
  },
  {
    title: "刊・完成・編纂（年）",
    value: "field_year",
  },
  {
    title: "ジャンル",
    value: "field_genre",
  },
  {
    title: "著者",
    value: "field_author_name_kanji",
  },
  {
    title: "著者（ふりがな）",
    value: "field_author_name_furigana",
  },
  {
    title: "依拠本文",
    value: "field_source_text",
  },
  {
    title: "出版社",
    value: "field_publisher",
  },
  {
    title: "出版年",
    value: "field_publication_year",
  },
  {
    title: "出版地",
    value: "field_publication_location",
  },
  {
    title: "URL",
    value: "field_link",
  },
];

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
    to: localePath({ name: "resources-documents" }),
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
            <a :href="attributes?.[field.value].uri" target="_blank">{{
              attributes?.[field.value].uri
            }}</a>
          </template>
          <template v-else>
            {{ attributes?.[field.value] }}
          </template>
        </v-col>
      </v-row>
    </template>

    <v-row class="my-4">
      <v-col>
        <v-btn
          variant="outlined"
          :to="localePath({ name: 'resources-documents' })"
        >
          <v-icon>{{ mdiArrowLeftBold }}</v-icon>
          戻る
        </v-btn>
      </v-col>
      <v-col class="text-right">
        <v-btn
          variant="outlined"
          :href="`${url}node/${did}/edit`"
          target="_blank"
        >
          <v-icon>{{ mdiPencil }}</v-icon>
          編集
        </v-btn>
      </v-col>
    </v-row>
  </LayoutsCommon>
</template>
