<script setup lang="ts">
interface PropType {
  attributes: any;
}

const props = withDefaults(defineProps<PropType>(), {
  attributes: () => ({}),
});

const { t } = useI18n();

const fields = ref([
  {
    title: t("Name (Kanji)"),
    value: "title",
  },
  {
    title: t("Name (Furigana)"),
    value: "field_spot_name_furigana",
  },
  {
    title: t("Name (Rōmaji)"),
    value: "field_spot_name_romaji",
  },
  {
    title: t("Kuni (Province)"),
    value: "field_kuni",
  },
  {
    title: t("Prefecture"),
    value: "field_prefecture",
  },
  {
    title: t("Lng / Lat"),
    value: "field_geo",
    info: "緯度経度",
    menu: false,
  },
  {
    title: t("Utamakura"),
    value: "field_utamakura",
  },
  {
    title: t("Meisho"),
    value: "field_meisho",
  },
  {
    title: t("Utamakura meaning"),
    value: "field_utamakura_meaning",
    info: "歌枕としての意味",
    menu: false,
  },
  {
    title: t("Utamakura features"),
    value: "field_utamakura_features",
    info: "歌枕としての特徴",
    menu: false,
  },
  {
    title: t("Utamakura associations"),
    value: "field_utamakura_associations",
    info: "連想",
    menu: false,
  },
  /*
  {
    title: "URL",
    value: "field_link",
  },
  */
]);

const markers = [
  {
    lat: props.attributes?.field_geo?.lat,
    lng: props.attributes?.field_geo?.lon,
    title: `${props.attributes?.title} / ${props.attributes?.field_spot_name_romaji}`,
  },
];
</script>

<template>
  <CommonMap class="mb-4" :markers="markers"></CommonMap>

  <div class="mt-4">
    <template v-for="field in fields">
      <v-row v-if="attributes?.[field.value]">
        <v-col :md="3" cols="12">
          <PagesSpotsLabel :field="field"></PagesSpotsLabel>
        </v-col>
        <v-col :md="9" cols="12">
          <template v-if="field.value === 'field_link'">
            <a :href="attributes?.[field.value].uri" target="_blank">{{
              attributes?.[field.value].uri
            }}</a>
          </template>
          <template v-else-if="field.value === 'field_geo'">
            <b>{{ $t("Latitude") }}：</b>
            {{ attributes?.[field.value]?.lat }}&nbsp;
            <b>{{ $t("Longitude") }}：</b>
            {{ attributes?.[field.value]?.lon }}
          </template>
          <template v-else>
            <template
              v-if="
                ['true', 'false'].includes(String(attributes?.[field.value]))
              "
            >
              {{ $t(String(attributes?.[field.value])) }}
            </template>
            <template v-else>
              {{ attributes?.[field.value] }}
            </template>
          </template>
        </v-col>
      </v-row>
    </template>
  </div>
</template>
