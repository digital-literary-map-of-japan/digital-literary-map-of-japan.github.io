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
</script>
<template>
  <v-card
    class="position-absolute spot-info-card"
    v-if="menu"
  >
    <v-card-text class="spot-info-content">
      <v-btn
        variant="flat"
        icon
        size="small"
        @click="menu = false"
        class="close-btn"
      >
        <v-icon>{{ mdiCloseCircle }}</v-icon>
      </v-btn>

      <div class="text-center mb-3">
        <h3 class="mb-2 spot-title">{{ attributes?.title }}</h3>

        <v-btn
          color="primary"
          variant="flat"
          size="small"
          :to="
            localePath({
              name: 'spots-id',
              params: { id: attributes?.field_id },
            })
          "
        >
          <v-icon class="mr-2" v-if="false">
            {{ mdiOpenInNew }}
          </v-icon>
          {{ $t("detail") }}
        </v-btn>
      </div>

      <template v-for="field in fields">
        <div class="mb-1 info-field">
          <strong>{{ field.title }}:</strong> {{ attributes?.[field.key] }}
        </div>
      </template>

      <template v-for="field in fieldsCount">
        <div class="mb-1 info-field">
          <strong>{{ field.title }}:{{ " " }}</strong>
          <template
            v-if="spotTypeCount[attributes?.field_id]?.[field.key] === -1"
          >
            <v-chip size="x-small">{{ $t("No examples") }}</v-chip>
          </template>
          <template v-else>
            {{ spotTypeCount[attributes?.field_id]?.[field.key] }}
          </template>
        </div>
      </template>

      <div class="mt-3">
        <strong>{{ $t("History") }}:</strong>
        <p
          class="history-text"
          v-html="
            attributes?.[
              locale === 'ja' ? 'field_history_ja' : 'field_history_en'
            ].value
          "
        ></p>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.spot-info-card {
  bottom: 120px;
  right: 1vw;
  z-index: 9999;
  max-height: 60vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
}

.spot-info-content {
  position: relative;
  padding-top: 12px !important;
}

.spot-title {
  line-height: 1.3;
  word-break: break-word;
  font-weight: 600;
}

.info-field {
  line-height: 1.5;
}

.history-text {
  margin-top: 8px;
  line-height: 1.6;
}

.history-text p {
  margin-bottom: 8px;
}

/* モバイル（小画面） */
@media (max-width: 599px) {
  .spot-info-card {
    max-width: 85vw;
    width: 85vw;
    right: 2vw;
  }

  .spot-info-content {
    font-size: 15px;
  }

  .spot-info-content h3 {
    font-size: 20px;
  }

  .spot-info-content strong {
    font-size: 15px;
  }
}

/* タブレット（中画面） */
@media (min-width: 600px) and (max-width: 959px) {
  .spot-info-card {
    max-width: 400px;
    width: 400px;
  }

  .spot-info-content {
    font-size: 14px;
  }

  .spot-info-content h3 {
    font-size: 20px;
  }
}

/* デスクトップ（大画面） */
@media (min-width: 960px) {
  .spot-info-card {
    max-width: 450px;
    width: 450px;
  }

  .spot-info-content {
    font-size: 14px;
  }

  .spot-info-content h3 {
    font-size: 22px;
  }
}

/* 超大画面 */
@media (min-width: 1264px) {
  .spot-info-card {
    max-width: 500px;
    width: 500px;
  }

  .spot-info-content {
    font-size: 15px;
  }

  .spot-info-content h3 {
    font-size: 24px;
  }
}
</style>
