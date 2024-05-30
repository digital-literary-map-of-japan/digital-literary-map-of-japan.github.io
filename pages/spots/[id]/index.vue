<script setup lang="ts">
import type { JsonApiItems, ResourceObject } from "~/types/jsonapi";

const { legends } = useSettings();

const publicRuntimeConfig = useRuntimeConfig().public;

legends.value = publicRuntimeConfig.legends;

/*
 */

/*
const getLegend = async (id: string) => {
  const url = `https://drupal.aws.ldas.jp/dlm/jsonapi/node/page/${id}`;

  const { data }: { [data: string]: any } = await useFetch(url);

  return data.value;
};


if (Object.keys(legends.value).length === 0) {
  const legends_: { [key: string]: { [key2: string]: any } } = {
    緯度経度: {
      id: "2bd8d311-6024-4dfc-98c2-f9fd0c4a1477",
    },
    歌枕としての意味: {
      id: "03d91050-7593-49b9-b24d-2e1172555b4b",
    },
    歌枕としての特徴: {
      id: "bb6ff42f-443a-4e7f-bc25-8b6b4a168462",
    },
    連想: {
      id: "e68cd44b-ad42-4bb4-96ca-9df04ccd42a3",
    },
    地誌情報: {
      id: "72528a60-1435-4539-9ad1-ed375aafac7a",
    },
    歴史: {
      id: "6f9a7010-4306-4c7e-9702-c1f5d433d374",
    },
    URL: {
      id: "c332309b-603d-4c40-af9f-947931dd5286",
    },
  };

  for (const key in legends_) {
    legends_[key].value = await getLegend(legends_[key].id);
  }

  legends.value = legends_;
}
*/

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

/*
const getTypedValues = async (spotUuid: string, type_: string) => {
  let url = `https://drupal.aws.ldas.jp/dlm/jsonapi/node/${type_}?filter[field_spot.id]=${spotUuid}`;

  if (type_ !== "images") {
    url += `&include=field_document&fields[node--documents]=title,field_document_name_romaji`;
  }

  const { data }: { [data: string]: any } = await useFetch(url);

  let values = data.value;

  let translations = null;

  if (type_ !== "yokyokus" && type_ !== "images") {
    const valueIds: string[] = [];

    for (const value of values.data) {
      const valueId = value.id;
      valueIds.push(valueId);
    }

    translations = await getTranslations(valueIds, type_);
  }

  if (type_ === "images") {
    values = convert(values);
  }

  return [values, translations];
};
*/

const getDocument = async (paramsData: JsonApiItems) => {
  const documents: string[] = [];
  //

  for (const item of paramsData.data) {
    const relationships = item.relationships;

    if (!relationships) {
      continue;
    }

    if (!relationships.field_document) {
      continue;
    }

    const documentId = (relationships.field_document.data as ResourceObject).id;

    if (!documents.includes(documentId)) {
      documents.push(documentId);
    }
  }

  const url = `https://drupal.aws.ldas.jp/dlm/jsonapi/node/documents`;

  const params: { [key: string]: string } = {
    "filter[name-filter][condition][path]": `id`,
    "filter[name-filter][condition][operator]": "IN",
  };

  for (let i = 0; i < documents.length; i++) {
    params[`filter[name-filter][condition][value][${i + 1}]`] = documents[i];
  }

  const { data }: { [data: string]: any } = await useFetch(url, {
    query: params,
  });

  paramsData.included = data.value.data;

  return paramsData;
};

const getTranslations = async (valueIds: string[], type_: string) => {
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

const url = `https://drupal.aws.ldas.jp/dlm/jsonapi/index/data?filter[field_id]=${spot.attributes.field_id}`;

// &include=field_document&fields[node--documents]=title,field_document_name_romaji

const { data }: { [data: string]: any } = await useFetch(url);

const types = ["poems", "sanbuns", "yokyokus", "images"];

const typedValues: { [key: string]: { [key: string]: JsonApiItems } } = {};
const typedIds: { [key: string]: string[] } = {};

// 初期化
for (const type of types) {
  typedValues[type] = {
    raw: {
      data: [],
      included: data.value.included,
    },
    translations: {
      data: [],
    },
  };

  typedIds[type] = [];
}

for (const item_ of data.value.data) {
  const type = item_.type.replace("node--", "");
  typedValues[type].raw.data.push(item_);
  typedIds[type].push(item_.id);
}

typedValues["sanbuns"].raw = await getDocument(typedValues["sanbuns"].raw);

// 画像のみ変換
typedValues["images"].raw = convert(typedValues["images"].raw);

// 翻訳
for (const type_ of ["poems", "sanbuns"]) {
  const ids = typedIds[type_]; //  || [];
  const values = await getTranslations(ids, type_);

  typedValues[type_].translations = values;
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

      <PagesSpotsImages
        v-if="tab === 'images'"
        :raw="typedValues.images.raw"
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
