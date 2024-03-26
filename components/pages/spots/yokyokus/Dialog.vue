<script setup lang="ts">
import type { ResourceObject, JsonApiItems } from "~/types/jsonapi";

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
    title: `${t("commentary")}(${t("en")})`,
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
      <v-row v-if="attributes?.[field.value]">
        <v-col :md="12" cols="12">
          <PagesSpotsLabel :field="field"></PagesSpotsLabel>
          <template v-if="field.value === 'field_link'">
            <a :href="attributes?.[field.value]?.uri" target="_blank">{{
              attributes?.[field.value]?.uri
            }}</a>
          </template>
          <template v-else-if="attributes?.[field.value].format">
            <span v-html="attributes?.[field.value].processed"></span>
          </template>
          <template v-else>
            {{ attributes?.[field.value] }}
          </template>
        </v-col>
      </v-row>
    </template>

    <!--
    <v-expansion-panels class="mt-10" v-if="false">
      <v-expansion-panel elevation="0">
        <v-expansion-panel-title class="bg-sub">翻訳</v-expansion-panel-title>
        <v-expansion-panel-text class="pa-4">
          <CommonBtnAdd
            class="mb-4"
            label="翻訳を追加"
            type="poems_translations"
          ></CommonBtnAdd>

          <template v-for="translation in translations?.data">
            <div>
              <v-row dense>
                <v-col :md="12" cols="12">
                  <b>{{ "テクスト" }}：</b
                  >{{ translation.attributes?.field_text }}
                </v-col>
              </v-row>

              <v-row dense>
                <v-col :md="12" cols="12">
                  <b>{{ "著者・出典" }}：</b
                  >{{ translation.attributes?.field_source }}
                </v-col>
              </v-row>

              <CommonBlockEdit
                :id="translation.attributes?.drupal_internal__nid"
              >
              </CommonBlockEdit>
            </div>
          </template>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    -->
  </div>
</template>
