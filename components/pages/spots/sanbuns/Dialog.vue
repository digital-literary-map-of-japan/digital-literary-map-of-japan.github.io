<script setup lang="ts">
import type { ResourceObject, JsonApiItems } from "~/types/jsonapi";

interface PropType {
  item: ResourceObject | null;
  translations: JsonApiItems | null;
}

const props = withDefaults(defineProps<PropType>(), {
  item: null,
  translations: null,
});

// const url = `https://drupal.aws.ldas.jp/dlm/jsonapi/node/poems_translations?filter[field_poem.id]=${props.item?.id}`;

// const { data }: { [data: string]: any } = await useFetch(url);

const fields = [
  {
    title: "章段名・章段番号",
    value: "field_chapter",
  },
  {
    title: "活字本頁（『新全集』）",
    value: "field_page_number",
  },
  {
    title: "テクスト",
    value: "field_text",
  },

  {
    title: "URL",
    value: "field_link",
  },
];

const attributes = computed(() => {
  return props.item?.attributes;
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
  </div>
</template>
