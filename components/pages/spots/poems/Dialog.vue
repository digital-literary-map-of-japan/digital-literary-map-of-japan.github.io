<script setup lang="ts">
import type { ResourceObject } from "~/types/jsonapi";

interface PropType {
  item: ResourceObject | null;
}

const props = withDefaults(defineProps<PropType>(), {
  item: null,
});

const url = `https://drupal.aws.ldas.jp/dlm/jsonapi/node/poems_translations?filter[field_poem.id]=${props.item?.id}`;

const { data }: { [data: string]: any } = await useFetch(url);

console.log({ data });

const fields = [
  {
    title: "テクスト",
    value: "field_text",
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
            <a :href="attributes?.[field.value].uri" target="_blank">{{
              attributes?.[field.value].uri
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

          <template v-for="item in data.data">
            <div>
              <v-row dense>
                <v-col :md="12" cols="12">
                  <b>{{ "テクスト" }}：</b>{{ item.attributes.field_text }}
                </v-col>
              </v-row>

              <v-row dense>
                <v-col :md="12" cols="12">
                  <b>{{ "著者・出典" }}：</b>{{ item.attributes.field_source }}
                </v-col>
              </v-row>

              <CommonBlockEdit :id="item.attributes.drupal_internal__nid">
              </CommonBlockEdit>
            </div>
          </template>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>
