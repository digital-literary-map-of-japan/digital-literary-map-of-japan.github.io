<script setup lang="ts">
import { mdiArrowLeftBold } from "@mdi/js";

const route = useRoute();

const id = route.params.id as string;

const url = "https://drupal.aws.ldas.jp/dlm/";

const endpoint = `${url}jsonapi/node/spots`;

const params: { [key: string]: string } = {
  "filter[field_id]": id,
};

const { data }: { [data: string]: any } = await useFetch(endpoint, {
  query: params,
});

const item = data.value?.data[0];

const attributes = item?.attributes;

const did = attributes?.drupal_internal__nid;

const title = `"${attributes?.title} / ${attributes?.field_spot_name_romaji}"の情報`;

const fields = [
  {
    title: "地名（漢字）",
    value: "title",
  },
  {
    title: "地名（ふりがな）",
    value: "field_spot_name_furigana",
  },
  {
    title: "地名（ローマ字）",
    value: "field_spot_name_romaji",
  },
  {
    title: "旧国名",
    value: "field_kuni",
  },
  {
    title: "都道府県",
    value: "field_prefecture",
  },
  {
    title: "「緯度経度」",
    value: "field_geo",
  },
  {
    title: "歌枕",
    value: "field_utamakura",
  },
  {
    title: "名所",
    value: "field_meisho",
  },
  {
    title: "歌枕としての意味",
    value: "field_utamakura_meaning",
  },
  {
    title: "歌枕としての特徴",
    value: "field_utamakura_features",
  },
  {
    title: "連想（歌枕として何を呼び起こしているか）",
    value: "field_utamakura_associations",
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
    to: localePath({ name: "resources" }),
  },
  {
    title: title,
    disabled: false,
  },
];

// const tab = ref("poems");
const tab = ref("basic");

const items: string[] = ["basic", "poems"];

const markers = [
  {
    lat: attributes?.field_geo?.lat,
    lng: attributes?.field_geo?.lon,
    title: attributes?.title,
  },
];
</script>
<template>
  <LayoutsCommon :title="title" :items="bh" fluid>
    <v-tabs v-model="tab" grow color="primary">
      <v-tab v-for="item in items" :key="item" :value="item">
        {{ item }}
      </v-tab>
    </v-tabs>

    <v-window v-model="tab" class="pa-4">
      <v-window-item :value="'basic'">
        <CommonMap class="mb-4" :markers="markers"></CommonMap>

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
              <template v-else-if="field.value === 'field_geo'">
                <b>緯度：</b> {{ attributes?.[field.value]?.lat }}&nbsp;
                <b>経度：</b> {{ attributes?.[field.value]?.lon }}
              </template>
              <template v-else>
                {{ attributes?.[field.value] }}
              </template>
            </v-col>
          </v-row>
        </template>
      </v-window-item>

      <v-window-item :value="'poems'">
        <PagesSpotsPoems :uuid="item.id"></PagesSpotsPoems>
      </v-window-item>
    </v-window>

    <v-row class="my-4">
      <v-col>
        <v-btn variant="outlined" :to="localePath({ name: 'resources' })">
          <v-icon>{{ mdiArrowLeftBold }}</v-icon>
          戻る
        </v-btn>
      </v-col>
      <v-col>
        <CommonBlockEdit :id="did" />
      </v-col>
    </v-row>
  </LayoutsCommon>
</template>
