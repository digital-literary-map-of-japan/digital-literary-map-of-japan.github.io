<script setup lang="ts">
import { mdiArrowLeftBold } from "@mdi/js";
import type { JsonApiItems } from "~/types/jsonapi";

const getSpot = async () => {
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

  return data.value.data[0];
};

const getTypedValues = async (spotUuid: string, type_: string) => {
  const url = `https://drupal.aws.ldas.jp/dlm/jsonapi/node/${type_}?filter[field_spot.id]=${spotUuid}&include=field_document&fields[node--documents]=title`;

  const { data }: { [data: string]: any } = await useFetch(url);

  const values = data.value;

  const valueIds: string[] = [];

  for (const value of values.data) {
    const valueId = value.id;
    valueIds.push(valueId);
  }

  const translations = await getTranslations(valueIds, type_);

  return [values, translations];
};

const getTranslations = async (valueIds: string[], type_: string) => {
  if (type_ === "yokyokus") {
    return null;
  }

  const type_single = type_.substring(0, type_.length - 1);
  const url = `https://drupal.aws.ldas.jp/dlm/jsonapi/node/${type_}_translations`;

  const params: { [key: string]: string } = {
    "filter[name-filter][condition][path]": `field_${type_single}.id`,
    "filter[name-filter][condition][operator]": "IN",
  };

  for (let i = 0; i < valueIds.length; i++) {
    params[`filter[name-filter][condition][value][${i + 1}]`] = valueIds[i];
  }

  const { data }: { [data: string]: any } = await useFetch(url, {
    query: params,
  });

  return data.value;
};

const spot = await getSpot();

const typedValues: { [key: string]: { [key: string]: JsonApiItems } } = {};

const types = ["poems", "sanbuns", "yokyokus"];

for (const type_ of types) {
  const [raw, translations] = await getTypedValues(spot.id, type_);

  typedValues[type_] = {
    raw,
    translations,
  };
}

// const item = data.value?.data[0];
const item = spot; // spot.data[0];

const attributes = item?.attributes;

const did = attributes?.drupal_internal__nid;

const title = `"${attributes?.title} / ${attributes?.field_spot_name_romaji}"の情報`;

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
    to: localePath({ name: "spots" }),
  },
  {
    title: title,
    disabled: false,
  },
];

// const tab = ref("poems");
const tab = ref("basic");

const items: string[] = ["basic", "history", "poems", "sanbuns", "yokyokus"];
</script>
<template>
  <LayoutsCommon :title="title" :items="bh" fluid>
    <v-tabs v-model="tab" grow color="primary">
      <v-tab v-for="item in items" :key="item" :value="item">
        {{ item }}
        {{ typedValues[item] ? `(${typedValues[item].raw.data.length})` : "" }}
      </v-tab>
    </v-tabs>

    <v-window v-model="tab" class="pa-4">
      <v-window-item :value="'basic'">
        <PagesSpotsBasic :attributes="attributes"></PagesSpotsBasic>
      </v-window-item>

      <v-window-item :value="'history'">
        <PagesSpotsBasic :attributes="attributes"></PagesSpotsBasic>
      </v-window-item>

      <v-window-item :value="'poems'">
        <PagesSpotsPoems
          :raw="typedValues.poems.raw"
          :translations="typedValues.poems.translations"
        ></PagesSpotsPoems>
      </v-window-item>

      <v-window-item :value="'sanbuns'">
        <PagesSpotsSanbuns
          :raw="typedValues.sanbuns.raw"
          :translations="typedValues.sanbuns.translations"
        ></PagesSpotsSanbuns>
      </v-window-item>

      <v-window-item :value="'yokyukus'">
        <PagesSpotsYokyokus
          :raw="typedValues.yokyokus.raw"
        ></PagesSpotsYokyokus>
      </v-window-item>
    </v-window>

    <v-row class="my-4">
      <v-col>
        <v-btn
          variant="flat"
          color="primary"
          :to="localePath({ name: 'spots' })"
        >
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
