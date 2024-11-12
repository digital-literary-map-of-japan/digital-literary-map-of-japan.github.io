<script setup lang="ts">
import type { JsonApiItems, ResourceObject } from "~/types/jsonapi";

const { legends } = useSettings();

const publicRuntimeConfig = useRuntimeConfig().public;

legends.value = publicRuntimeConfig.legends as any;

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

  const url = `https://drupal.aws.ldas.jp/dlm/jsonapi/node/documents`;

  const params: { [key: string]: string } = {
    "filter[name-filter][condition][path]": `id`,
    "filter[name-filter][condition][operator]": "IN",
  };

  let i = 0;

  for (const key in documents) {
    params[`filter[name-filter][condition][value][${i + 1}]`] = key;
    i++;
  }

  const { data }: { [data: string]: any } = await useFetch(url, {
    query: params,
  });

  paramsData.included = data.value.data;

  return paramsData;
};

const getData = async (url: string) => {
  let offset = 0;
  let limit = 50;

  // JsonApiItems型のデータオブジェクトを初期化
  const accumulatedData: JsonApiItems = {
    data: [],
    included: [],
  };

  while (true) {
    const { data }: { data: any } = await useFetch(url, {
      query: {
        "page[offset]": offset,
        "page[limit]": limit,
      },
    });

    // データをaccumulatedDataに追加
    accumulatedData.data = accumulatedData.data.concat(data.value.data);

    if (data.value.included) {
      accumulatedData.included = accumulatedData.included.concat(
        data.value.included
      );
    }

    // すべてのデータを取得した場合は終了
    if (data.value.data.length < limit) {
      break;
    }

    offset += limit;
  }

  return accumulatedData;
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

const spotNId = spot.attributes.drupal_internal__nid;

const url = `https://drupal.aws.ldas.jp/dlm/jsonapi/index/data?filter[field_id]=${spot.attributes.field_id}`;

// const { data }: { [data: string]: any } = await useFetch(url);

const data = await getData(url);

const types = ["poems", "sanbuns", "yokyokus", "images"];

const typedValues: { [key: string]: { [key: string]: JsonApiItems } } = {};
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

for (const item_ of data.data) {
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

const seoTitle = `${title} - ${t(publicRuntimeConfig.siteName)}`;

useHead({
  title: seoTitle,
  meta: [
    {
      property: "og:title",
      content: seoTitle,
    },
    {
      property: "og:url",
      content: route.fullPath,
    },
    {
      property: "og:locale",
      content: locale.value === "ja" ? "ja_JP" : "en_US",
    },
  ],
});

const showCount = (item: string) => {
  return attributes.field_no_examples && item === "yokyokus"
    ? t("No examples")
    : typedValues[item].raw.data.length;
};
</script>
<template>
  <LayoutsCommon :title="title" :items="bh" fluid>
    <v-tabs v-model="tab" grow color="primary">
      <v-tab
        v-for="item in items"
        :key="item"
        :value="item"
        :disabled="
          typedValues[item] &&
          [0, -1].includes(typedValues[item].raw.data.length)
        "
      >
        {{ labels[item] }}
        {{ typedValues[item] ? `(${showCount(item)})` : "" }}
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
        :spotNId="spotNId"
        :raw="typedValues.poems.raw"
        :translations="typedValues.poems.translations"
        v-if="tab === 'poems'"
      ></PagesSpotsPoems>

      <PagesSpotsSanbuns
        :spotNId="spotNId"
        :raw="typedValues.sanbuns.raw"
        :translations="typedValues.sanbuns.translations"
        v-if="tab === 'sanbuns'"
      ></PagesSpotsSanbuns>

      <PagesSpotsYokyokus
        :spotNId="spotNId"
        v-if="tab === 'yokyokus'"
        :raw="typedValues.yokyokus.raw"
      ></PagesSpotsYokyokus>

      <PagesSpotsImages
        :spotNId="spotNId"
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
