<script setup lang="ts">
import { mdiDownload, mdiFileExcel } from "@mdi/js";
import datasetMeta from "~/public/downloads/dataset-meta.json";

const { t, locale } = useI18n();
const localePath = useLocalePath();
const { setPageMeta, setBreadcrumbJsonLd } = useSeo();
const publicRuntimeConfig = useRuntimeConfig().public;
const appURL = (publicRuntimeConfig.appURL as string) || "";

const bh = [
  {
    title: t("top"),
    disabled: false,
    to: localePath({ name: "index" }),
  },
  {
    title: t("dataset"),
    disabled: false,
  },
];

const description =
  locale.value === "ja"
    ? "日本の文学名所（歌枕・名所）に関するデータセットをダウンロードできます。"
    : "Download datasets of Japanese literary places (Utamakura / Meisho).";

setPageMeta({
  title: t("dataset"),
  description,
});
setBreadcrumbJsonLd(bh);

// Build dynamic description from meta
const sheetNameMap: Record<string, { ja: string; en: string }> = {
  "Spots (文学名所)": { ja: "文学名所", en: "Literary Places" },
  "Documents (資料)": { ja: "資料", en: "Documents" },
  "Poems (和歌)": { ja: "和歌", en: "Poems" },
  "Poems Translations (和歌翻訳)": { ja: "和歌翻訳", en: "Poem Translations" },
  "Sanbuns (物語・説話)": { ja: "物語・説話", en: "Tales" },
  "Sanbuns Translations (物語翻訳)": { ja: "物語翻訳", en: "Tale Translations" },
  "Yokyokus (謡曲)": { ja: "謡曲", en: "Yōkyoku" },
  "Images (絵図等)": { ja: "絵図等", en: "Images" },
};

const contentsText = computed(() => {
  return datasetMeta.sheets
    .map((s) => {
      const names = sheetNameMap[s.name] || { ja: s.name, en: s.name };
      const label = locale.value === "ja" ? names.ja : names.en;
      return locale.value === "ja"
        ? `${label} ${s.count.toLocaleString()}件`
        : `${s.count.toLocaleString()} ${label}`;
    })
    .join(" / ");
});

const jsonLdDescription = datasetMeta.sheets
  .map((s) => {
    const names = sheetNameMap[s.name] || { ja: s.name, en: s.name };
    return `${names.ja}${s.count.toLocaleString()}件`;
  })
  .join("、");

useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Dataset",
        name: "Digital Literary Map of Japan Dataset",
        alternateName: "日本のデジタル文学地図 データセット",
        description: `日本の文学名所（歌枕・名所）に関する構造化データ。${jsonLdDescription}のデータを含む。`,
        url: `${appURL}/dataset`,
        license: "https://creativecommons.org/licenses/by/4.0/",
        creator: {
          "@type": "Organization",
          name: "Digital Literary Map of Japan",
          url: appURL,
        },
        inLanguage: ["ja", "en"],
        keywords: [
          "歌枕",
          "名所",
          "和歌",
          "古典文学",
          "文学地図",
          "Utamakura",
          "Meisho",
          "Japanese literature",
          "literary map",
        ],
        distribution: [
          {
            "@type": "DataDownload",
            name: "Excel Dataset",
            contentUrl: `${appURL}/downloads/dlm-dataset.xlsx`,
            encodingFormat:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        ],
      }),
    },
  ],
});

const metadataItems = computed(() => [
  {
    label: t("dataset_name"),
    value:
      locale.value === "ja"
        ? "日本のデジタル文学地図 データセット"
        : "Digital Literary Map of Japan Dataset",
  },
  {
    label: t("dataset_description"),
    value:
      locale.value === "ja"
        ? "日本の文学名所（歌枕・名所）に関する構造化データ。文学名所の地理情報、関連する和歌・物語・謡曲、資料情報を含む。"
        : "Structured data on Japanese literary places (Utamakura / Meisho). Includes geographic information, related poetry, tales, Yōkyoku, and bibliographic data.",
  },
  {
    label: t("dataset_field"),
    value: locale.value === "ja" ? "人文学 (Humanities)" : "Humanities",
  },
  {
    label: t("dataset_contents"),
    value: contentsText.value,
  },
  {
    label: t("dataset_format"),
    value: "Excel (XLSX)",
  },
  {
    label: t("dataset_language"),
    value: locale.value === "ja" ? "日本語・英語" : "Japanese / English",
  },
  {
    label: t("dataset_license"),
    value: "CC BY 4.0",
    link: "https://creativecommons.org/licenses/by/4.0/deed." + locale.value,
  },
  {
    label: t("dataset_publisher"),
    value: "Digital Literary Map of Japan",
    link: appURL,
  },
]);

const sheets = computed(() =>
  datasetMeta.sheets.map((s) => {
    const names = sheetNameMap[s.name] || { ja: s.name, en: s.name };
    return {
      name:
        locale.value === "ja"
          ? `${names.ja} (${names.en})`
          : names.en,
      count: s.count,
    };
  })
);
</script>
<template>
  <LayoutsCommon :title="$t('dataset')" :items="bh">
    <v-container>
      <p class="text-body-1 mb-8">
        {{
          $i18n.locale === "ja"
            ? "日本の文学名所（歌枕・名所）に関するデータセットをダウンロードできます。"
            : "Download datasets of Japanese literary places (Utamakura / Meisho)."
        }}
      </p>

      <h2 class="text-h5 mb-4">{{ $t("download") }}</h2>

      <v-card variant="outlined" max-width="500">
        <v-card-text>
          <div class="d-flex align-center mb-3">
            <v-icon color="green" size="large" class="mr-3">{{
              mdiFileExcel
            }}</v-icon>
            <div>
              <div class="text-subtitle-1 font-weight-bold">
                {{
                  $i18n.locale === "ja"
                    ? "Excel データセット"
                    : "Excel Dataset"
                }}
              </div>
              <div class="text-body-2 text-medium-emphasis">
                {{
                  $i18n.locale === "ja"
                    ? `全データを${datasetMeta.sheetCount}シートにまとめたExcelファイル`
                    : `All data organized in ${datasetMeta.sheetCount} sheets`
                }}
              </div>
            </div>
          </div>

          <v-table density="compact" class="mb-3">
            <tbody>
              <tr v-for="sheet in sheets" :key="sheet.name">
                <td>{{ sheet.name }}</td>
                <td class="text-right">{{ sheet.count.toLocaleString() }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
        <v-card-actions>
          <v-btn
            href="/downloads/dlm-dataset.xlsx"
            download
            color="primary"
            variant="flat"
          >
            <v-icon class="mr-1">{{ mdiDownload }}</v-icon>
            {{ $t("download") }} (XLSX)
          </v-btn>
        </v-card-actions>
      </v-card>

      <h2 class="text-h5 mt-10 mb-4">{{ $t("metadata") }}</h2>

      <v-table density="comfortable">
        <tbody>
          <tr v-for="item in metadataItems" :key="item.label">
            <td class="font-weight-bold" style="width: 200px">
              {{ item.label }}
            </td>
            <td>
              <a
                v-if="item.link"
                :href="item.link"
                target="_blank"
                rel="noopener"
                >{{ item.value }}</a
              >
              <template v-else>{{ item.value }}</template>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-container>
  </LayoutsCommon>
</template>
