<script setup lang="ts">
import type { JsonApiItems, ResourceObject } from "~/types/jsonapi";

interface PropType {
  spotNId: number;
  raw: JsonApiItems;
  translations?: JsonApiItems;
}

const props = withDefaults(defineProps<PropType>(), {
  spotNId: 0,
  raw: () => ({} as JsonApiItems),
  translations: () => ({} as JsonApiItems),
});

const { t } = useI18n();

const headers = [
  {
    title: t("id_yokyoku"),
    value: "field_document",
    sortable: true,
  },
  {
    title: t("Text"),
    value: "field_text",
    sortable: true,
  },
  {
    title: t("Keyword"),
    value: "field_place_form",
    sortable: true,
  },
];

const desserts = computed(() => {
  return props.raw?.data.map((item: any) => {
    return {
      data: item,
      id: item.id,
      field_document: item.attributes.field_document_numbering,
      field_chapter: item.attributes.field_chapter,
      field_page_number: item.attributes.field_page_number,
      field_text: item.attributes.field_text,
      field_place_form: item.attributes.field_place_form,
      drupal_internal__nid: item.attributes.drupal_internal__nid,
    };
  });
});

const selectedPoem = ref<ResourceObject | null>(null);
const documentName = ref<string>("");
const dialog = ref(false);

const selectPoem = (item: ResourceObject, documentName_: string) => {
  selectedPoem.value = item;
  documentName.value = `${documentName_}`;
  dialog.value = true;
};
</script>
<template>
  <div>
    <v-data-table
      density="compact"
      :items-per-page="-1"
      :headers="headers"
      :items="desserts"
    >
      <template v-slot:item.field_text="{ item }: any">
        <div class="dynamic-width">
          <span v-html="item.field_text"></span>
        </div>
      </template>

      <template v-slot:item.field_document="{ item }: any">
        <v-btn
          variant="text"
          color="primary"
          @click="selectPoem(item.data, item.field_document)"
          >{{ item.field_document }}</v-btn
        >
      </template>
    </v-data-table>

    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title class="bg-sub">
          {{ documentName }}
        </v-card-title>
        <v-card-text>
          <PagesSpotsYokyokusDialog
            :item="selectedPoem"
            :translations="translations"
          ></PagesSpotsYokyokusDialog>
        </v-card-text>

        <v-card-actions>
          <v-btn
            block
            :text="$t('close')"
            color="primary"
            variant="flat"
            @click="dialog = false"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
