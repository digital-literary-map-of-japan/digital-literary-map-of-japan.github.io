<script setup lang="ts">
import type { ResourceObject } from "~/types/jsonapi";

interface PropType {
  uuid: string;
}

const props = withDefaults(defineProps<PropType>(), {
  uuid: "",
});

const getSanbuns = async () => {
  const type_ = "sanbuns";

  const url = `https://drupal.aws.ldas.jp/dlm/jsonapi/node/${type_}?filter[field_spot.id]=${props.uuid}&include=field_document&fields[node--documents]=title`;

  const { data }: { [data: string]: any } = await useFetch(url);

  return data.value;
};

const getTranslations = async (uuid: string) => {
  const url = `https://drupal.aws.ldas.jp/dlm/jsonapi/node/poems_translations?filter[field_poem.id]=${uuid}`;

  const { data }: { [data: string]: any } = await useFetch(url);

  return data.value;
};

const sanbuns = await getSanbuns();
const translations = await getTranslations(sanbuns.data.id);

console.log({ sanbuns, translations });

const headers = [
  {
    title: "作品",
    value: "field_document",
    sortable: true,
  },

  {
    title: "章段名・章段番号",
    value: "field_chapter",
    sortable: false,
  },
  {
    title: "活字本頁（『新全集』）",
    value: "field_page_number",
    sortable: false,
  },
  {
    title: "テクスト",
    value: "field_text",
    sortable: false,
  },
  {
    title: "キーワード",
    value: "field_place_form",
    sortable: false,
  },
  {
    title: "アクション",
    value: "field_id",
    sortable: false,
  },
];

const desserts = computed(() => {
  return sanbuns?.data.map((item: any) => {
    const documentId = item.relationships.field_document.data.id;

    const documentName = sanbuns?.included.map((i: ResourceObject) => {
      if (i.id === documentId) {
        return i.attributes?.title;
      }
    });

    // console.log({ documentName });

    return {
      data: item,
      id: item.id,
      field_document: documentName.join(","),
      field_chapter: item.attributes.field_chapter,
      field_page_number: item.attributes.field_page_number,
      field_text: item.attributes.field_text,
      drupal_internal__nid: item.attributes.drupal_internal__nid,
    };
  });
});

// const localePath = useLocalePath();

const selectedPoem = ref<ResourceObject | null>(null);
const documentName = ref<string>("");
const dialog = ref(false);

const selectPoem = (item: ResourceObject, documentName_: string) => {
  selectedPoem.value = item;
  documentName.value = `${documentName_} ${item.attributes?.field_chapter} ${item.attributes?.field_page_number}`;
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
      <template v-slot:item.field_document="{ item }: any">
        <v-btn
          variant="text"
          color="primary"
          @click="selectPoem(item.data, item.field_document)"
          >{{ item.field_document }}</v-btn
        >
      </template>

      <template v-slot:item.field_id="{ item }: any">
        <CommonBlockEdit class="ma-1" :id="item.drupal_internal__nid" />
      </template>
    </v-data-table>

    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title class="bg-sub">
          {{ documentName }}
        </v-card-title>
        <v-card-text>
          <PagesSpotsSanbunsDialog
            :item="selectedPoem"
            :translations="translations"
          ></PagesSpotsSanbunsDialog>
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
