<script setup lang="ts">
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
  const url = `https://drupal.aws.ldas.jp/dlm/jsonapi/node/${type_}?filter[field_spot.id]=${spotUuid}&include=field_document&fields[node--documents]=title,field_document_name_romaji`;

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

const item = spot; // spot.data[0];

const attributes = item?.attributes;

const did = attributes?.drupal_internal__nid;

const { t, locale } = useI18n();

const title =
  locale.value === "en"
    ? `Datasheet of "${attributes?.title} / ${attributes?.field_spot_name_romaji}"`
    : `"${attributes?.title} / ${attributes?.field_spot_name_romaji}"の情報`;

const localePath = useLocalePath();

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

const route = useRoute();

const tab = ref(route.query.layout || "basic");

const items: string[] = ["basic", "history", "poems", "sanbuns", "yokyokus"];

const labels: { [key: string]: string } = {
  basic: t("Basic information"),
  history: t("History"),
  poems: t("Poetry"),
  sanbuns: t("Tales, images etc."),
  yokyokus: t("Yōkyoku"),
};

watch(
  () => tab.value,
  (value) => {
    const route = useRoute();
    const router = useRouter();

    router.push(
      localePath({
        path: route.path,
        query: {
          layout: value,
        },
      })
    );
  }
);
</script>
<template>
  <LayoutsCommon :title="title" :items="bh" fluid>
    <v-tabs v-model="tab" grow color="primary">
      <v-tab v-for="item in items" :key="item" :value="item">
        {{ labels[item] }}
        {{ typedValues[item] ? `(${typedValues[item].raw.data.length})` : "" }}
      </v-tab>
    </v-tabs>

    <div class="pa-4">
      <PagesSpotsBasic
        :attributes="attributes"
        v-if="tab === 'basic'"
      ></PagesSpotsBasic>

      <PagesSpotsHistory
        :attributes="attributes"
        v-if="tab === 'history'"
      ></PagesSpotsHistory>

      <PagesSpotsPoems
        :raw="typedValues.poems.raw"
        :translations="typedValues.poems.translations"
        v-if="tab === 'poems'"
      ></PagesSpotsPoems>

      <PagesSpotsSanbuns
        :raw="typedValues.sanbuns.raw"
        :translations="typedValues.sanbuns.translations"
        v-if="tab === 'sanbuns'"
      ></PagesSpotsSanbuns>

      <PagesSpotsYokyokus
        v-if="tab === 'yokyokus'"
        :raw="typedValues.yokyokus.raw"
      ></PagesSpotsYokyokus>
    </div>

    <v-row class="my-4">
      <v-col>
        <CommonBtnBack type="spots" />
      </v-col>
      <v-col>
        <CommonBlockEdit :id="did" />
      </v-col>
    </v-row>
  </LayoutsCommon>
</template>
