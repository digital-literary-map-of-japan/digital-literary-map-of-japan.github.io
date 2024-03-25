<script setup lang="ts">
import type { ResourceObject, JsonApiItems } from "~/types/jsonapi";

interface PropType {
  item: ResourceObject | null;
  translations: JsonApiItems;
}

const props = withDefaults(defineProps<PropType>(), {
  item: null,
  translations: () => ({} as JsonApiItems),
});

const { t } = useI18n();

const fields = [
  {
    title: t("Volume"),
    value: "field_volume",
  },
  {
    title: t("Kotobagaki"),
    value: "field_kotobagaki",
  },
  {
    title: t("Text"),
    value: "field_text",
  },
  {
    title: t("Text (Rōmaji)"),
    value: "field_text_romaji",
  },
  {
    title: t("Keyword"),
    value: "field_place_form",
  },
  {
    title: t("Author"),
    value: "field_author",
  },
  {
    title: t("Author (Rōmaji)"),
    value: "field_author_romaji",
  },
  {
    title: "URL",
    value: "field_link",
  },
];

const attributes = computed(() => {
  return props.item?.attributes;
});

const manifest = computed(() => {
  const url = attributes.value?.field_link?.uri;

  if (!url) return "";

  const spl = url?.split("/");
  const id = spl?.[spl.length - 3];
  const index = spl?.[spl.length - 1];

  return `https://universalviewer.io/uv.html?manifest=https://kotenseki.nijl.ac.jp/biblio/${id}/manifest#?cv=${
    Number(index) - 1
  }`;
});
</script>
<template>
  <div class="pa-4">
    <template v-for="field in fields">
      <v-row dense>
        <v-col :md="12" cols="12">
          <b>{{ field.title }}：</b
          ><template v-if="field.value === 'field_link'">
            <a :href="attributes?.[field.value]?.uri" target="_blank">{{
              attributes?.[field.value]?.uri
            }}</a>
          </template>
          <template v-else>
            {{ attributes?.[field.value] }}
          </template>
        </v-col>
      </v-row>
    </template>

    <v-expansion-panels class="mt-10">
      <v-expansion-panel elevation="0">
        <v-expansion-panel-title class="bg-sub">{{
          $t("translations")
        }}</v-expansion-panel-title>
        <v-expansion-panel-text class="pa-4">
          <CommonBtnAdd
            class="mb-4"
            label="翻訳を追加"
            type="poems_translations"
          ></CommonBtnAdd>

          <template v-for="item in translations.data">
            <div>
              <v-row dense>
                <v-col :md="12" cols="12">
                  <b>{{ $t("Text") }}：</b>{{ item.attributes?.field_text }}
                </v-col>
              </v-row>

              <v-row dense>
                <v-col :md="12" cols="12">
                  <b>{{ $t("author_source") }}：</b
                  >{{ item.attributes?.field_source }}
                </v-col>
              </v-row>

              <CommonBlockEdit :id="item.attributes?.drupal_internal__nid">
              </CommonBlockEdit>
            </div>
          </template>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <div class="mt-10" v-if="manifest">
      <iframe
        :src="manifest"
        width="100%"
        height="600"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>
