<script setup lang="ts">
import type { ResourceObject } from "~/types/jsonapi";

interface PropType {
  item: ResourceObject | null;
}

const props = withDefaults(defineProps<PropType>(), {
  item: null,
});

// const url = `https://drupal.aws.ldas.jp/dlm/jsonapi/node/poems?filter[field_spot.id]=${props.uuid}`;

// const { data }: { [data: string]: any } = await useFetch(url);

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
  <div>
    <template v-for="field in fields">
      <v-row dense>
        <v-col :md="3" cols="12">
          <b>{{ field.title }}：</b>
        </v-col>
        <v-col :md="9" cols="12">
          <template v-if="field.value === 'field_link'">
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
  </div>
</template>
