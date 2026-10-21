<script setup lang="ts">
const id = useRoute().params.slug;

const url =
  "https://toyobunko-lab.jp/cbc/jsonapi/node/fodianshuzhidb_ozhirase/" + id;
const res = await fetch(url);
const json = await res.json();
const item = json.data.attributes;

const did = item.drupal_internal__nid;

const localePath = useLocalePath();
const { t } = useI18n();
const { setPageMeta, setBreadcrumbJsonLd } = useSeo();

const bh = [
  {
    title: t("top"),
    disabled: false,
    to: localePath({ name: "index" }),
  },
  {
    title: t("news"),
    disabled: false,
    to: localePath({ name: "news" }),
  },
  {
    title: item.title,
    disabled: false,
  },
];

const isoDateString = item.created;
const date = new Date(isoDateString);
// ユーザーのローカルタイムゾーンに合わせて日時を表示
const localDateString = date.toLocaleString().split(" ")[0];

const bodyText = item.body?.value?.replace(/<[^>]*>/g, '')?.substring(0, 160) || '';
setPageMeta({
  title: item.title,
  description: bodyText,
});
setBreadcrumbJsonLd(bh);
</script>
<template>
  <LayoutsCommon :title="`${localDateString} ${item.title}`" :items="bh">
    <!-- <ContentRenderer :value="item" /> -->

    <span v-html="item.body.value"></span>
  </LayoutsCommon>
</template>
