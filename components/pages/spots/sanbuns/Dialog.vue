<script setup lang="ts">
import type { ResourceObject } from "~/types/jsonapi";
import { fieldValue } from "~/utils/common";

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
    title: t("Chapter"),
    value: "field_chapter",
  },
  {
    title: t("Page number"),
    value: "field_page_number",
  },
  {
    title: t("Text"),
    value: "field_text",
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
      <v-row dense>
        <v-col :md="12" cols="12">
          <PagesSpotsLabel :field="field"></PagesSpotsLabel>
          <template v-if="field.value === 'field_link'">
            <template v-for="(value, i) in attributes?.[field.value]">
              <a :href="value.uri" target="_blank">{{ value.uri }}</a>
              <span v-if="i !== attributes?.[field.value].length - 1">, </span>
            </template>
          </template>
          <template v-else>
            <span v-html="fieldValue(attributes?.[field.value])"></span>
          </template>
        </v-col>
      </v-row>
    </template>

    <PagesSpotsTranslation
      :translation="props.translation"
      type="sanbuns_translations"
      label=""
      :nId="0"
    ></PagesSpotsTranslation>
  </div>
</template>
