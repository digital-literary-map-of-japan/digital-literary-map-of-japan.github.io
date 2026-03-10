<script setup lang="ts">
import type { JsonApiItems, ResourceObject } from "~/types/jsonapi";

const { legends } = useSettings();
const { fetchSpot, fetchSpotDetails, fetchDocumentsByIds, fetchTranslationsByIds } = useLocalData();

const publicRuntimeConfig = useRuntimeConfig().public;

legends.value = publicRuntimeConfig.legends as any;

const getSpot = async () => {
  const route = useRoute();
  const id = route.params.id as string;

  return await fetchSpot(id);
};

const convert = (data: JsonApiItems) => {
  const mappings: { [key: string]: any } = {};

  for (const item of data.data) {
    const attributes = item.attributes;

    const links = attributes?.field_link;

    let link = "";

    if (Array.isArray(links) && links.length > 0) {
      link = links[0].uri;
    } else {
      link = links?.uri;
    }

    const title = attributes?.title;

    const manifest = attributes?.field_manifest?.uri;

    const id = `${title}-${manifest}`;

    if (!mappings[id]) {
      mappings[id] = {
        title,
        link,
        manifest,
        pos: [],
      };
    }

    const pos = attributes?.field_pos;
    mappings[id].pos.push(pos);
  }

  const results: JsonApiItems = {
    data: [],
  };

  for (const key of Object.keys(mappings)) {
    results.data.push({
      type: "images",
      id: key,
      attributes: mappings[key],
    });
  }

  return results;
};

const getDocument = async (paramsData: JsonApiItems) => {
  const documents: { [key: string]: number } = {};

  for (const item of paramsData.data) {
    const relationships = item.relationships;

    if (!relationships) {
      continue;
    }

    if (!relationships.field_document) {
      continue;
    }

    const documentId = (relationships.field_document.data as ResourceObject).id;

    if (!documents[documentId]) {
      documents[documentId] = (
        relationships.field_document.data as ResourceObject
      ).attributes?.drupal_internal__nid;
    }
  }

  const documentIds = Object.keys(documents);
  const documentsData = await fetchDocumentsByIds(documentIds);

  paramsData.included = documentsData.data;

  return paramsData;
};

const getData = async (fieldId: string) => {
  return await fetchSpotDetails(fieldId);
};

const getTranslations = async (valueIds: string[], type_: string) => {
  return await fetchTranslationsByIds(valueIds, type_);
};

const spot = await getSpot();

const spotNId = spot?.attributes?.drupal_internal__nid ?? 0;

const data = await getData(spot?.attributes?.field_id ?? "");

const types = ["poems", "sanbuns", "yokyokus", "images"];

const typedValues: { [key: string]: { raw: JsonApiItems; translations: JsonApiItems } } = {};
const typedIds: { [key: string]: string[] } = {};

// 初期化
for (const type of types) {
  typedValues[type] = {
    raw: {
      data: [],
      included: data.included,
    },
    translations: {
      data: [],
    },
  };

  typedIds[type] = [];
}

const sortedItems = data?.data?.sort((a: ResourceObject, b: ResourceObject) => {
  return (a.attributes?.drupal_internal__nid ?? 0) - (b.attributes?.drupal_internal__nid ?? 0);
}) ?? [];

for (const item_ of sortedItems) {
  const type = item_.type.replace("node--", "");
  const tv = typedValues[type];
  if (tv) {
    tv.raw.data.push(item_);
  }
  const ti = typedIds[type];
  if (ti) {
    ti.push(item_.id);
  }
}

const sanbunsTv = typedValues["sanbuns"];
if (sanbunsTv) {
  sanbunsTv.raw = await getDocument(sanbunsTv.raw);
}

// 画像のみ変換
const imagesTv = typedValues["images"];
if (imagesTv) {
  imagesTv.raw = convert(imagesTv.raw);
}

// 翻訳
for (const type_ of ["poems", "sanbuns"]) {
  const ids = typedIds[type_] || [];
  const values = await getTranslations(ids, type_);

  if (typedValues[type_]) {
    typedValues[type_].translations = values as JsonApiItems;
  }
}

const item = spot; // spot.data[0];

const attributes = item?.attributes;

const did = attributes?.drupal_internal__nid;

const { t, locale } = useI18n();

const title = `${attributes?.title} / ${attributes?.field_spot_name_romaji}`;

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

const route = useRoute();

const tab = ref(route.query.layout || "basic");

const items: string[] = ["basic", "history", ...types];

const labels: { [key: string]: string } = {
  basic: t("Basic information"),
  history: t("History"),
  poems: t("Poetry"),
  sanbuns: t("Tales, images etc."),
  yokyokus: t("Yōkyoku"),
  images: t("images"),
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

const { setPageMeta, setBreadcrumbJsonLd } = useSeo();

const spotDescription = [
  attributes?.field_kuni ? `${t('Kuni (Province)')}: ${attributes.field_kuni}` : '',
  attributes?.field_prefecture ? `${t('Prefecture')}: ${attributes.field_prefecture}` : '',
  attributes?.field_utamakura_meaning ? attributes.field_utamakura_meaning.substring(0, 100) : '',
].filter(Boolean).join(' | ');

setPageMeta({
  title,
  description: spotDescription || `${title} - ${t('An annotation tool for Japanese literary places')}`,
});
setBreadcrumbJsonLd(bh);

const showCount = (item: string) => {
  return attributes?.field_no_examples && item === "yokyokus"
    ? t("No examples")
    : typedValues[item]?.raw?.data?.length ?? 0;
};
</script>
<template>
  <LayoutsCommon :title="title" :items="bh" fluid>
    <ClientOnly>
      <v-tabs v-model="tab" grow color="primary">
        <v-tab
          v-for="item in items"
          :key="item"
          :value="item"
          :disabled="
            typedValues[item] &&
            [0, -1].includes(typedValues[item]?.raw?.data?.length ?? 0)
          "
        >
          {{ labels[item] }}
          {{ typedValues[item] ? `(${showCount(item)})` : "" }}
        </v-tab>
      </v-tabs>
    </ClientOnly>

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
        :spotNId="spotNId"
        :raw="typedValues.poems?.raw!"
        :translations="typedValues.poems?.translations!"
        v-if="tab === 'poems'"
      ></PagesSpotsPoems>

      <PagesSpotsSanbuns
        :spotNId="spotNId"
        :raw="typedValues.sanbuns?.raw!"
        :translations="typedValues.sanbuns?.translations!"
        v-if="tab === 'sanbuns'"
      ></PagesSpotsSanbuns>

      <PagesSpotsYokyokus
        :spotNId="spotNId"
        v-if="tab === 'yokyokus'"
        :raw="typedValues.yokyokus?.raw!"
      ></PagesSpotsYokyokus>

      <PagesSpotsImages
        :spotNId="spotNId"
        v-if="tab === 'images'"
        :raw="typedValues.images?.raw!"
      ></PagesSpotsImages>
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
