<script setup lang="ts">
import type { ResourceObject } from "~/types/jsonapi";

import { isDisplay } from "~/utils/common";

interface PropType {
  item: ResourceObject | null;
  translation: ResourceObject | null;
}

const props = withDefaults(defineProps<PropType>(), {
  item: null,
  translation: null,
});

const { t } = useI18n();

const fields = ref([
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
    info: "URL",
    menu: false,
  },
]);

const attributes = computed(() => {
  return props.item?.attributes;
});

const manifest = computed(() => {
  const links = attributes.value?.field_link;

  if (links.length === 0) return "";

  const url = links[0]?.uri;

  if (!url) return "";

  const spl = url?.split("/");
  const id = spl?.[spl.length - 3];
  const index = spl?.[spl.length - 1];

  return `https://universalviewer.io/uv.html?manifest=https://kotenseki.nijl.ac.jp/biblio/${id}/manifest#?cv=${
    Number(index) - 1
  }`;
});

const nId = props.item?.attributes?.drupal_internal__nid;
</script>
<template>
  <div class="pa-4">
    <template v-for="field in fields">
      <v-row dense v-if="isDisplay(attributes?.[field.value])">
        <v-col :md="12" cols="12">
          <PagesSpotsLabel :field="field"></PagesSpotsLabel>
          <template v-if="field.value === 'field_link'">
            <template v-for="(value, i) in attributes?.[field.value]">
              <a :href="value.uri" target="_blank">{{ value.uri }}</a>
              <span v-if="i !== attributes?.[field.value].length - 1">, </span>
            </template>
          </template>
          <template v-else>
            {{ attributes?.[field.value] }}
          </template>
        </v-col>
      </v-row>
    </template>

    <PagesSpotsTranslation
      :translation="props.translation"
      type="poems_translations"
      :nId="nId"
    ></PagesSpotsTranslation>

    <div class="mt-4" v-if="manifest">
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
