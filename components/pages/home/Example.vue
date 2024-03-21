<script setup lang="ts">
const localePath = useLocalePath();

interface Item {
  text: string;
  to: any;
}
const items: Item[] = [];
const fields = [
  {
    text: "ワークショップ",
    value: "ワークショップ",
  },
  {
    text: "学校種別",
    value: "学校種別",
  },
  {
    text: "教材製作者",
    value: "教材製作者",
  },
  {
    text: "教科",
    value: "教科",
  },
  {
    text: "学年",
    value: "学年",
  },
  {
    text: "時代",
    value: "時代",
  },
  {
    text: "地域",
    value: "地理情報_都道府県",
  },
  {
    text: "キーワード",
    value: "キーワード",
  },
  {
    text: "問いの種類",
    value: "問いの種類",
  },
  {
    text: "指導要領の評価観点",
    value: "指導要領の評価観点",
  },
  {
    text: "授業場面",
    value: "授業場面",
  },
  {
    text: "視点",
    value: "視点",
  },
  {
    text: "文化名",
    value: "文化名",
  },
  {
    text: "育みたいコンピテンシー",
    value: "育みたいコンピテンシー",
  },
];

for (const field of fields) {
  items.push({
    text: field.text,
    to: {
      name: "slug",
      params: { slug: field.value },
      query: {
        [`page[limit]`]: 120,
      },
    },
  });
}

/*
const items: Item[] = [
  {
    text: "教材製作者",
    to: {
      name: "slug",
      params: { slug: "教材製作者" },
      query: {
        [`page[limit]`]: 120
      }
    }
  },
  {
    text: "指導要領の評価観点",
    to: {
      name: "slug",
      params: { slug: "指導要領の評価観点" },
      query: {
        [`page[limit]`]: 120
      }
    }
  },
  
];
*/
</script>
<template>
  <div class="text-center">
    <v-btn
      :to="localePath(item.to)"
      class="ma-1"
      v-for="item in items"
      flat
      color="warning"
      rounded
      >{{ item.text }}</v-btn
    >
  </div>
</template>
