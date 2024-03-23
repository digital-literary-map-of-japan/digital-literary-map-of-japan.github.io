<script setup lang="ts">
import type { ResourceObject } from "~/types/jsonapi";

interface PropType {
  uuid: string;
}

const props = withDefaults(defineProps<PropType>(), {
  uuid: "",
});

const url = `https://drupal.aws.ldas.jp/dlm/jsonapi/node/poems?filter[field_spot.id]=${props.uuid}`;

const { data }: { [data: string]: any } = await useFetch(url);

const headers = [
  {
    title: "ID（国歌大観番号）",
    value: "field_document_numbering",
    sortable: true,
  },
  {
    title: "詞書",
    value: "field_kotobagaki",
    sortable: false,
  },
  {
    title: "テクスト",
    value: "field_text",
    sortable: false,
  },
  {
    title: "アクション",
    value: "field_id",
    sortable: false,
  },
];

const desserts = computed(() => {
  return data.value?.data.map((item: any) => {
    return {
      data: item,
      id: item.id,
      field_document_numbering: item.attributes.field_document_numbering,
      field_kotobagaki: item.attributes.field_kotobagaki,
      field_text: item.attributes.field_text,
      drupal_internal__nid: item.attributes.drupal_internal__nid,
    };
  });
});

// const localePath = useLocalePath();

const selectedPoem = ref<ResourceObject | null>(null);
const dialog = ref(false);

const selectPoem = (item: ResourceObject) => {
  selectedPoem.value = item;
  dialog.value = true;
};
</script>
<template>
  <div>
    <div class="mb-4 text-right">
      <CommonBtnAdd type="poems"></CommonBtnAdd>
    </div>

    <v-data-table
      density="compact"
      :items-per-page="-1"
      :headers="headers"
      :items="desserts"
    >
      <template v-slot:item.field_document_numbering="{ item }: any">
        <v-btn variant="text" color="primary" @click="selectPoem(item.data)">{{
          item.field_document_numbering
        }}</v-btn>
      </template>

      <template v-slot:item.field_id="{ item }: any">
        <CommonBlockEdit class="ma-1" :id="item.drupal_internal__nid" />
      </template>
    </v-data-table>

    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title class="bg-sub">
          {{ selectedPoem?.attributes?.field_document_numbering }}
        </v-card-title>
        <v-card-text>
          <PagesSpotsPoemsDialog :item="selectedPoem"></PagesSpotsPoemsDialog>
        </v-card-text>

        <v-card-actions>
          <v-btn
            block
            text="Close Dialog"
            color="primary"
            variant="flat"
            @click="dialog = false"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
