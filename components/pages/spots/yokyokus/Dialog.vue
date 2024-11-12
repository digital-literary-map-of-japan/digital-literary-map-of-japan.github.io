<script setup lang="ts">
import type { ResourceObject, JsonApiItems } from "~/types/jsonapi";

import { isDisplay } from "~/utils/common";

interface PropType {
  item: ResourceObject | null;
  translations?: JsonApiItems | null;
}

const props = withDefaults(defineProps<PropType>(), {
  item: null,
  translations: null,
});

const { t } = useI18n();

const fields = ref([
  {
    title: t("line"),
    value: "field_line",
  },
  {
    title: t("Text"),
    value: "field_text",
  },
  {
    title: t("Keyword"),
    value: "field_place_form",
  },
  {
    title: t("Context"),
    value: "field_context",
  },
  {
    title: `${t("Scene Description")}(${t("ja")})`,
    value: "field_scene_description",
  },
  {
    title: `${t("Scene Description")}(${t("en")})`,
    value: "field_scene_description_eng",
  },
  {
    title: `${t("commentary")}(${t("ja")})`,
    value: "field_commentary",
  },
  {
    title: `${t("commentary")}(${t("en")})`,
    value: "field_commentary_eng",
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
</script>
<template>
  <div class="pa-4">
    <template v-for="field in fields">
      <v-row v-if="isDisplay(attributes?.[field.value])">
        <v-col :md="12" cols="12">
          <PagesSpotsLabel :field="field"></PagesSpotsLabel>
          <template v-if="field.value === 'field_link'">
            <a :href="attributes?.[field.value]?.uri" target="_blank">{{
              attributes?.[field.value]?.uri
            }}</a>
          </template>
          <template v-else-if="attributes?.[field.value].format">
            <!-- processed -->
            <span v-html="attributes?.[field.value].value"></span>
          </template>
          <template v-else>
            <span v-html="attributes?.[field.value]"></span>
          </template>
        </v-col>
      </v-row>
    </template>
  </div>
</template>
