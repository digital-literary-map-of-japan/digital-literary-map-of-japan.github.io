<script setup lang="ts">
import type { JsonApiItems } from "@/types/jsonapi";

const route = useRoute();
const id = route.params.id;

const results = ref<JsonApiItems>({} as JsonApiItems);

const endpoint = `https://toyobunko-lab.jp/cbc/jsonapi/node/bib_1`; // `https://toyobunko-lab.jp/cbc/jsonapi/node/bib_1/${id}`;

const configId = "default";
const appConfig = useAppConfig();
const config = appConfig[configId] as {
  defaultPerPage: number;
  defaultSort: string;
};

const execSearch = async () => {
  const routeQuery = route.query;
  const params: Record<string, string> = {
    include: "field_waibusaitourl,field_xiangximulu",
    "page[limit]":
      (routeQuery["page[limit]"] as string) || config.defaultPerPage.toString(),
    "page[offset]": (routeQuery["page[offset]"] as string) || "0",
    "filter[field_id]": String(id),
  };

  if (routeQuery.sort) {
    params.sort = (routeQuery.sort as string) || config.defaultSort;
  }

  // const paramsData = {}

  for (const key in routeQuery) {
    if (key.startsWith("filter[")) {
      // params[key] = routeQuery[key] as string;
      const paramOriginalKey = key.replace("filter[", "").replace("]", "");
      let paramKey = paramOriginalKey;
      let paramOperator = "";
      const paramValue = routeQuery[key] as string;
      const paramValues = paramValue.split(",");

      if (paramKey.endsWith(".in")) {
        paramKey = paramKey.replace(".in", "");
        paramOperator = "in";
      }

      if (paramOperator === "in") {
        params[`filter[${paramOriginalKey}][condition][path]`] = paramKey;
        params[`filter[${paramOriginalKey}][condition][operator]`] = "IN";
        for (let i = 0; i < paramValues.length; i++) {
          params[`filter[${paramOriginalKey}][condition][value][${i}]`] =
            paramValues[i];
        }
      } else {
        const groupName = "search";
        params[`filter[${groupName}][group][conjunction]`] = "OR";

        const fields = [
          "field_shuzhiqingbao_shumingjuans",
          "field_shuzhiqingbao_suozangjigua",
          "field_shuzhiqingbao_shuxiechuban",
          "field_shuzhiqingbao_bianzhezhesh",
          //
          "field_xingzhuang",
          "field_suozai",
        ];

        for (const field of fields) {
          params[`filter[${field}][condition][path]`] = field;
          params[`filter[${field}][condition][operator]`] = "=";
          params[`filter[${field}][condition][value]`] = paramValue;
          params[`filter[${field}][condition][memberOf]`] = groupName;
        }
      }
    }
  }

  const paramsArray = [];

  for (let key in params) {
    paramsArray.push(`${key}=${params[key]}`);
  }

  let paramsString = paramsArray.join("&");

  if (paramsString) {
    paramsString = `?${paramsString}`;
  }

  const url = `${endpoint}${paramsString}`;

  const res = await fetch(url);
  const json = await res.json();

  json.data = json.data; // [json.data];

  results.value = json;
};

watch(
  () => route.query,
  () => {
    execSearch();
  },
  {
    immediate: true,
  }
);

const advanced_ = computed(() => {
  /*
  const json = results.value;

  if (!json.data) {
    return [];
  }

  const data = json.data;

  if (!data) {
    return [];
  }

  const item = data[0];

  const relationships = item.relationships;

  const field_xiangximulu = relationships?.field_xiangximulu?.data;

  const included = json.included;

  if (!included) {
    return [];
  }

  if (!field_xiangximulu) {
    return [];
  }

  if (!Array.isArray(field_xiangximulu)) {
    return [];
  }

  const advancedResults = [];

  for (const obj of field_xiangximulu) {
    const id = obj.id;

    const included_ = included.find((item) => item.id === id);

    if (!included_) {
      continue;
    }

    advancedResults.push(included_);
  }

  return advancedResults;
  */

  return [];
});

const title = "書誌目録";

const localePath = useLocalePath();
const { t } = useI18n();

const bh = [
  {
    title: t("top"),
    disabled: false,
    to: localePath({ name: "index" }),
  },
  {
    title: t("書名目録"),
    disabled: false,
    to: localePath({ name: "basic" }),
  },
  {
    title: t(title),
    disabled: false,
  },
];
</script>
<template>
  <LayoutsCommon :title="title" :items="bh" fluid>
    <div class="my-4">
      <h2>【 書名目録 】</h2>
    </div>

    <v-table density="compact" class="my-4">
      <thead>
        <tr>
          <th width="10%">書名・巻数</th>
          <th width="10%">編著者事項</th>

          <th width="40%">書写・出版事項</th>
          <th width="5%">冊数</th>

          <th width="10%">所蔵機関</th>

          <th width="10%">請求記号</th>

          <th width="10%">所蔵機関の書誌情報</th>

          <th width="5%">詳細</th>
        </tr>
      </thead>
      <tbody>
        <PagesBibTr
          v-for="item in results.data"
          :item="item"
          :included="results.included"
          :bib="false"
        ></PagesBibTr>
      </tbody>
    </v-table>

    <div class="my-4 pt-10">
      <h2>【 詳細目録 】</h2>
    </div>

    <PagesBibAdvanced></PagesBibAdvanced>
  </LayoutsCommon>
</template>
