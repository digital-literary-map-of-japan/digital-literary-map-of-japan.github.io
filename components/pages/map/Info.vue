<script setup lang="ts">
import { mdiCloseCircle, mdiOpenInNew } from "@mdi/js";
import type { ResourceObject } from "~/types/jsonapi";

const { selectedSpotId, results, spotTypeCount } = useMap();

const menu = ref(false);

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
    title: "地名（漢字）",
    key: "title",
  },
  {
    title: "地名（ふりがな）",
    key: "field_spot_name_furigana",
  },
  {
    title: "地名（ローマ字）",
    key: "field_spot_name_romaji",
  },
];

const fieldsCount = [
  {
    title: "和歌・漢詩・俳諧",
    key: "poems",
  },
  {
    title: "物語・説話",
    key: "sanbuns",
  },
  {
    title: "謡曲",
    key: "yokyokus",
  },
];

const localePath = useLocalePath();
</script>
<template>
  <v-card
    class="position-absolute"
    style="bottom: 20px; right: 20px; z-index: 1000; min-width: 300px"
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
          <v-icon>
            {{ mdiOpenInNew }}
          </v-icon>
          データベースで表示
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
        <strong>{{ "歴史" }}:</strong>
        <p>
          {{ attributes?.field_history }}
        </p>
      </div>
    </v-card-text>
  </v-card>
</template>
