<script setup lang="ts">
import type { JsonApiItems } from "@/types/jsonapi";

const results = ref<JsonApiItems>({} as JsonApiItems);
const route = useRoute();

const endpoint = "https://toyobunko-lab.jp/cbc/jsonapi/index/xiangximulu/";

const configId = "advanced";
const appConfig = useAppConfig();
const config = appConfig[configId] as {
  defaultPerPage: number;
  fields: string[];
  defaultSort: string;
};

const isSearch = ref(false);

const execSearch = async () => {
  isSearch.value = true;
  const routeQuery = route.query;
  const params: Record<string, string> = {
    include: "field_shumingmulu", // "field_waibusaitourl",
    "fields[node--bib_1]": "title,field_shuzhiqingbao_qingqiujihao,field_id",
    "page[limit]":
      (routeQuery["page[limit]"] as string) || config.defaultPerPage.toString(),
    "page[offset]": (routeQuery["page[offset]"] as string) || "0",
  };

  
  params.sort = routeQuery.sort as string || config.defaultSort;
  

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

        const fields = config.fields;

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
  results.value = json;

  isSearch.value = false;
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

/*

const res = await fetch(
  "https://toyobunko-lab.jp/cbc/jsonapi/index/xiangximulu/"
);
const json = await res.json();
*/

const localePath = useLocalePath();
const { t } = useI18n();

const title = "詳細目録";

const bh = [
  {
    title: t("top"),
    disabled: false,
    to: localePath({ name: "index" }),
  },
  {
    title: title,
    disabled: false,
  },
];
</script>
<template>
  <LayoutsCommon :title="title" :items="bh" fluid>
    <PagesSearchMain configId="advanced" :item="results" :isSearch="isSearch">
      <v-table>
        <thead>
          <tr>
            <th width="20%">書名目録</th>
            <th width="5%">冊次</th>
            <th width="40%">著録内容</th>
            <th width="10%">丁数</th>
            <th width="20%">備考（千字文等）</th>
            <th width="5%">画像</th>
          </tr>
        </thead>
        <tbody>
          <PagesAdvancedTr
            v-for="item in results.data"
            :item="item"
            :included="results.included"
          ></PagesAdvancedTr>
        </tbody>
      </v-table>
    </PagesSearchMain>
  </LayoutsCommon>
</template>
