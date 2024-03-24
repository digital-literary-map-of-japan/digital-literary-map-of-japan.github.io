<script setup lang="ts">
interface PropType {
  attributes: any;
}

const props = withDefaults(defineProps<PropType>(), {
  attributes: () => ({}),
});

const fields = [
  {
    title: "地名（漢字）",
    value: "title",
  },
  {
    title: "地名（ふりがな）",
    value: "field_spot_name_furigana",
  },
  {
    title: "地名（ローマ字）",
    value: "field_spot_name_romaji",
  },
  {
    title: "旧国名",
    value: "field_kuni",
  },
  {
    title: "都道府県",
    value: "field_prefecture",
  },
  {
    title: "「緯度経度」",
    value: "field_geo",
  },
  {
    title: "歌枕",
    value: "field_utamakura",
  },
  {
    title: "名所",
    value: "field_meisho",
  },
  {
    title: "歌枕としての意味",
    value: "field_utamakura_meaning",
  },
  {
    title: "歌枕としての特徴",
    value: "field_utamakura_features",
  },
  {
    title: "連想（歌枕として何を呼び起こしているか）",
    value: "field_utamakura_associations",
  },
  {
    title: "URL",
    value: "field_link",
  },
];

const markers = [
  {
    lat: props.attributes?.field_geo?.lat,
    lng: props.attributes?.field_geo?.lon,
    title: props.attributes?.title,
  },
];
</script>

<template>
  <CommonMap class="mb-4" :markers="markers"></CommonMap>

  <template v-for="field in fields">
    <v-row dense v-if="attributes?.[field.value]">
      <v-col :md="3" cols="12">
        <b>{{ field.title }}：</b>
      </v-col>
      <v-col :md="9" cols="12">
        <template v-if="field.value === 'field_link'">
          <a :href="attributes?.[field.value].uri" target="_blank">{{
            attributes?.[field.value].uri
          }}</a>
        </template>
        <template v-else-if="field.value === 'field_geo'">
          <b>緯度：</b> {{ attributes?.[field.value]?.lat }}&nbsp;
          <b>経度：</b> {{ attributes?.[field.value]?.lon }}
        </template>
        <template v-else>
          {{ attributes?.[field.value] }}
        </template>
      </v-col>
    </v-row>
  </template>
</template>
