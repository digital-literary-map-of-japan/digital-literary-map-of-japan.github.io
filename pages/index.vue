<script setup lang="ts">
import type { JsonApiItem } from "~/types/jsonapi";

const { results } = useMap();
const { fetchSpots, fetchPage } = useLocalData();
const { locale, t } = useI18n();
const { setPageMeta, setOrganizationJsonLd } = useSeo();

const getSpots = async () => {
  const data = await fetchSpots(locale.value);
  results.value = data;
};

getSpots();

const markers = computed(() => {
  if (!results.value) {
    return [];
  }
  return results.value.data.map((item: any) => {
    return {
      lat: item.attributes.field_geo.lat,
      lng: item.attributes.field_geo.lon,
      title: `${item.attributes.title} / ${item.attributes.field_spot_name_romaji}`,
      id: item.attributes.field_id,
    };
  });
});

const contact = await fetchPage("0a3c695c-d8ba-45c7-9f11-0ec60eabd34c", locale.value);

setPageMeta({
  title: t('Digital Literary Map of Japan'),
  description: t('An annotation tool for Japanese literary places'),
});
setOrganizationJsonLd();

// Preload hero background image for LCP improvement
useHead({
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: '/img/KaiseiNifonYochiRoteiZenzu1846.webp',
      type: 'image/webp',
      fetchpriority: 'high',
    },
  ],
});
</script>
<template>
  <div>
    <PagesHomeImage></PagesHomeImage>

    <v-container class="my-5">
      <v-alert variant="tonal" dense type="info">
        <p class="mb-2">
          <template v-if="$i18n.locale === 'ja'">
            アンケートを実施しています。以下のリンクからアンケートにご協力下さい。
          </template>
          <template v-else>
            We are conducting a survey. Please click on the link below to
            complete the survey.
          </template>
        </p>

        <a href="https://forms.gle/1wEiSoheov2ToBFf7" target="_blank"
          >https://forms.gle/1wEiSoheov2ToBFf7</a
        >
      </v-alert>

      <div class="py-10">
        <h2>{{ $t("An annotation tool for Japanese literary places") }}</h2>
        <br />
        <PagesHomeAbout />

        <PagesHomeLegend class="my-10" />
      </div>
    </v-container>

    <div class="py-10 bg-sub">
      <v-container class="py-10">
        <h2>{{ $t("Literary Map (Overview)") }}</h2>
        <br />
        <LazyCommonMap :markers="markers"></LazyCommonMap>
      </v-container>
    </div>

    <v-sheet class="py-10">
      <v-container class="py-10">
        <h2>{{ $t("Coordination and contact") }}</h2>
        <br />
        <PagesContactBlock :attributes="contact?.data.attributes" />
      </v-container>
    </v-sheet>
  </div>
</template>
