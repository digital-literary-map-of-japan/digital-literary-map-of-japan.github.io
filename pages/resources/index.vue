<script setup lang="ts">
import { mdiMagnify, mdiCheck } from "@mdi/js";

const { isAdmin } = useSettings();
const { fetchDocuments } = useLocalData();
const { t, locale } = useI18n();

const data = ref<any>(null);

// データを取得
const loadData = async () => {
  try {
    const currentLocale = locale.value || 'ja';
    const result = await fetchDocuments(undefined, currentLocale);
    if (result) {
      data.value = result;
    } else {
      console.error('Failed to fetch documents: result is null');
      data.value = { data: [] };
    }
  } catch (error) {
    console.error('Error fetching documents:', error);
    data.value = { data: [] };
  }
};

await loadData();

const title = t("Resources");

const search = ref("");

const headers = [
  { title: t("Title"), value: "title", sortable: true },
  {
    title: t("Title (Romaji)"),
    value: "field_document_name_romaji",
    sortable: true,
  },
  { title: t("Author"), value: "field_author_name_kanji", sortable: true },
  {
    title: t("Author (Rōmaji)"),
    value: "field_author_name_romaji",
    sortable: true,
  },
  { title: t("Genre"), value: "field_genre", sortable: true },
];

if (isAdmin.value) {
  headers.push({
    title: t("updated"),
    value: "changed",
    sortable: true,
  });

  headers.push({
    title: t("action"),
    value: "field_id",
    sortable: false,
  });
}

const genreOrderMap: Record<string, number> = {
  "勅撰和歌集": 0,
  "物語": 1,
  "謡曲": 2,
};

// 二十一代集の歴史的順序
const nijuichidaishuOrder: Record<string, number> = {
  "古今和歌集": 1,
  "後撰和歌集": 2,
  "拾遺和歌集": 3,
  "後拾遺和歌集": 4,
  "金葉和歌集": 5,
  "詞花和歌集": 6,
  "千載和歌集": 7,
  "新古今和歌集": 8,
  "新勅撰和歌集": 9,
  "続後撰和歌集": 10,
  "続古今和歌集": 11,
  "続拾遺和歌集": 12,
  "新後撰和歌集": 13,
  "玉葉和歌集": 14,
  "続千載和歌集": 15,
  "続後拾遺和歌集": 16,
  "風雅和歌集": 17,
  "新千載和歌集": 18,
  "新拾遺和歌集": 19,
  "新後拾遺和歌集": 20,
  "新続古今和歌集": 21,
};

const sortBy = computed(() => {
  const titleKey = locale.value === "ja" ? "field_document_name_furigana" : "field_document_name_romaji";
  return [
    { key: "genreOrder", order: "asc" as const },
    { key: "titleOrder", order: "asc" as const },
    { key: titleKey, order: "asc" as const },
  ];
});

const desserts = computed(() => {
  if (!data.value?.data) return [];

  return data.value.data
    .map((item: any) => {
      const genre = item.attributes.field_genre;

      const fixedGenre = genre?.split("（")[0] ?? "";

      if (
        selectedValues.value.length > 0 &&
        !selectedValues.value.includes(fixedGenre)
      ) {
        return null;
      }

      return {
        title: item.attributes.title,
        field_document_name_romaji: item.attributes.field_document_name_romaji,
        field_author_name_kanji: item.attributes.field_author_name_kanji,
        field_id: item.attributes.field_id,
        drupal_internal__nid: item.attributes.drupal_internal__nid,
        field_genre: item.attributes.field_genre,
        field_author_name_romaji: item.attributes.field_author_name_romaji,
        changed: item.attributes.changed,
        field_author_name_furigana: item.attributes.field_author_name_furigana,
        field_document_name_furigana:
          item.attributes.field_document_name_furigana,
        genreOrder: genreOrderMap[fixedGenre] ?? 99,
        titleOrder: nijuichidaishuOrder[item.attributes.title] ?? 99,
      };
    })
    .filter((item: any) => item != null);
});

const localePath = useLocalePath();

const bh = [
  {
    title: t("top"),
    disabled: false,
    to: localePath({ name: "index" }),
  },
  {
    title,
    disabled: false,
  },
];

const customFilter: any = (
  value: string,
  query: string,
  item: { raw: any }
) => {
  return (
    value != null &&
    query != null &&
    typeof value === "string" &&
    [
      value.toString(),
      item.raw.field_document_name_furigana,
      item.raw.field_author_name_furigana,
    ]
      .join(",")
      .toLowerCase()
      .split(" ")
      .join("")
      .indexOf(query.toLowerCase().split(" ").join("")) !== -1
  );
};

const selectedValues = ref<string[]>([]);

const update = (item: string) => {
  if (selectedValues.value.includes(item)) {
    selectedValues.value.splice(selectedValues.value.indexOf(item), 1);
  } else {
    selectedValues.value.push(item);
  }
};
</script>
<template>
  <LayoutsCommon :title="title" :items="bh" fluid>
    <div class="mb-10">
      <v-row dense class="mb-4">
        <v-col cols="12" md="4">
          <v-text-field
            v-model="search"
            :label="$t('search')"
            :prepend-inner-icon="mdiMagnify"
            variant="outlined"
            hide-details
            single-line
            density="compact"
          ></v-text-field>
        </v-col>
        <v-col class="text-right">
          <PagesResourcesLegend />
          <CommonBtnAdd type="documents" label="作品を追加"></CommonBtnAdd>
        </v-col>
      </v-row>

      <div>
        <b>{{ $t("Genre") }}：</b>

        <v-btn
          class="ma-1"
          v-for="item in ['勅撰和歌集', '物語', '謡曲']"
          :variant="selectedValues.includes(item) ? 'flat' : 'outlined'"
          @click="update(item)"
          :color="selectedValues.includes(item) ? 'primary' : 'default'"
        >
          {{ item }}

          <template v-if="selectedValues.includes(item)">
            <v-icon class="ml-2">
              {{ mdiCheck }}
            </v-icon>
          </template>
        </v-btn>
      </div>
    </div>

    <v-data-table
      density="compact"
      :items-per-page="-1"
      :headers="headers"
      :items="desserts"
      :search="search"
      :custom-filter="customFilter"
      :sort-by="sortBy"
    >
      <template v-slot:item.field_author_name_kanji="{ item }: any">
        <div class="dynamic-width">
          <span v-html="item.field_author_name_kanji"></span>
        </div>
      </template>

      <template v-slot:item.title="{ item }: any">
        <nuxt-link
          :to="
            localePath({
              name: 'resources-id',
              params: { id: item.field_id },
            })
          "
          >{{ item.title }}</nuxt-link
        >
      </template>

      <template v-slot:item.field_id="{ item }: any">
        <CommonBtnEdit :id="item.drupal_internal__nid" />
      </template>
    </v-data-table>
  </LayoutsCommon>
</template>
