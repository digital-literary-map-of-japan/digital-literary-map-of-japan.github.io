<script setup lang="ts">
const route = useRoute();
const id = route.params.id;

const endpoint = "https://toyobunko-lab.jp/cbc/jsonapi/index/xiangximulu/";

const configId = "advanced";
const appConfig = useAppConfig();
const config = appConfig[configId] as {
  defaultPerPage: number;
  fields: string[];
  defaultSort: string;
};

const routeQuery = route.query;

const params: Record<string, string> = {
  // include: "field_shumingmulu", // "field_waibusaitourl",
  // "fields[node--bib_1]": "title,field_shuzhiqingbao_qingqiujihao,field_id",
  "page[limit]":
    (routeQuery["page[limit]"] as string) || config.defaultPerPage.toString(),
  "page[offset]": (routeQuery["page[offset]"] as string) || "0",
  "filter[item_id]": String(id),
};

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
const advanced = json.data;
</script>
<template>
  <v-table density="compact" class="my-4">
    <thead>
      <tr>
        <th width="5%">冊次</th>
        <th width="40%">著録内容</th>
        <th width="10%">丁数</th>
        <th width="40%">備考（千字文等）</th>
        <th width="5%">画像</th>
      </tr>
    </thead>
    <tbody>
      <PagesAdvancedTr v-for="item in advanced" :item="item"></PagesAdvancedTr>
    </tbody>
  </v-table>
</template>
