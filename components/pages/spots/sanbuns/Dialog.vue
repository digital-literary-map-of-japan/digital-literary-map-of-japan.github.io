<script setup lang="ts">
import type { ResourceObject } from "~/types/jsonapi";

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
    title: t("Page number_"),
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

    <PagesSpotsTranslation
      :translation="props.translation"
      type="sanbuns_translations"
    ></PagesSpotsTranslation>
  </div>
</template>
