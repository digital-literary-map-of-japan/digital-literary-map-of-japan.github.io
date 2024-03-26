<script setup lang="ts">
import { mdiCloseCircle, mdiOpenInNew } from "@mdi/js";
import type { ResourceObject } from "~/types/jsonapi";

const { selectedSpotId, results, spotTypeCount } = useMap();

const menu = ref(false);

const { t, locale } = useI18n();

const spot = ref<ResourceObject | null>(null);

watch(selectedSpotId, () => {
  if (!selectedSpotId.value) {
    if (menu.value === true) {
      menu.value = false;
    }
  } else {
    results.value?.data.map((item: any) => {
      if (item.attributes.field_id === selectedSpotId.value) {
        spot.value = item;
      }
    });

    if (menu.value === false) {
      menu.value = true;
    }
  }
});

const attributes = computed(() => {
  if (!spot.value) {
    return {};
  }

  return spot.value.attributes;
});

const fields = [
  {
    title: t("Name (Rōmaji)"),
    key: "title",
  },
  {
    title: t("Name (Furigana)"),
    key: "field_spot_name_furigana",
  },
  {
    title: t("Name (Rōmaji)"),
    key: "field_spot_name_romaji",
  },
];

const fieldsCount = [
  {
    title: t("Poetry"),
    key: "poems",
  },
  {
    title: t("Tales, images etc."),
    key: "sanbuns",
  },
  {
    title: t("Yōkyoku"),
    key: "yokyokus",
  },
];

const localePath = useLocalePath();

onMounted(() => {
  console.log(results.value);
});
</script>
<template>
  <v-card
    class="position-absolute"
    style="
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      max-height: 50vh;
      overflow-y: auto;
      max-width: 25vh;
    "
    v-if="menu"
  >
    <v-card-text>
      <div class="text-right">
        <v-btn variant="flat" icon @click="menu = false">
          <v-icon>{{ mdiCloseCircle }}</v-icon>
        </v-btn>
      </div>

      <div class="text-center mb-4">
        <h3 class="mb-4">{{ attributes?.title }}</h3>

        <v-btn
          color="primary"
          variant="flat"
          :to="
            localePath({
              name: 'spots-id',
              params: { id: attributes?.field_id },
            })
          "
        >
          <v-icon class="mr-2">
            {{ mdiOpenInNew }}
          </v-icon>
          {{ $t("Show in database") }}
        </v-btn>
      </div>

      <template v-for="field in fields">
        <div class="mb-2">
          <strong>{{ field.title }}:</strong> {{ attributes?.[field.key] }}
        </div>
      </template>

      <template v-for="field in fieldsCount">
        <div class="mb-2">
          <strong>{{ field.title }}:</strong>
          {{ spotTypeCount[attributes?.field_id]?.[field.key] }}
        </div>
      </template>

      <div>
        <strong>{{ $t("History") }}:</strong>
        <p
          v-html="
            attributes?.[
              locale === 'ja' ? 'field_history_ja' : 'field_history_en'
            ].processed
          "
        ></p>
      </div>
    </v-card-text>
  </v-card>
</template>
