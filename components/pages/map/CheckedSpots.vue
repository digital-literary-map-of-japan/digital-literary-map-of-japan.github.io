<script setup lang="ts">
import { mdiClose, mdiDeleteSweep } from "@mdi/js";

const { checkedSpotIds, selectedSpotId, results } = useMap();

const { t } = useI18n();

const checkedSpots = computed(() => {
  if (!results.value) return [];
  return results.value.data
    .filter((item: any) =>
      checkedSpotIds.value.includes(item.attributes.field_id)
    )
    .map((item: any) => ({
      id: item.attributes.field_id,
      title: item.attributes.title,
    }));
});

const removeSpot = (id: string) => {
  checkedSpotIds.value = checkedSpotIds.value.filter((v) => v !== id);
};

const clearAll = () => {
  checkedSpotIds.value = [];
};

const selectSpot = (id: string) => {
  selectedSpotId.value = id;
};
</script>
<template>
  <LControl position="bottomleft" v-if="checkedSpots.length > 0">
    <v-card class="checked-spots-card" density="compact">
      <v-card-title class="d-flex align-center pa-2" style="font-size: 13px;">
        <span>{{ t("Checked spots") }} ({{ checkedSpots.length }})</span>
        <v-spacer />
        <v-btn
          variant="text"
          size="x-small"
          density="compact"
          @click="clearAll"
          :title="t('Clear all')"
        >
          <v-icon size="small">{{ mdiDeleteSweep }}</v-icon>
          {{ t("Clear all") }}
        </v-btn>
      </v-card-title>
      <v-divider />
      <v-list density="compact" class="pa-0 checked-spots-list">
        <v-list-item
          v-for="spot in checkedSpots"
          :key="spot.id"
          density="compact"
          class="px-2"
          style="min-height: 28px;"
        >
          <template #default>
            <a
              class="checked-spot-link"
              @click.prevent="selectSpot(spot.id)"
            >
              {{ spot.title }}
            </a>
          </template>
          <template #append>
            <v-btn
              icon
              variant="text"
              size="x-small"
              density="compact"
              @click="removeSpot(spot.id)"
              aria-label="Remove"
            >
              <v-icon size="small">{{ mdiClose }}</v-icon>
            </v-btn>
          </template>
        </v-list-item>
      </v-list>
    </v-card>
  </LControl>
</template>

<style scoped>
.checked-spots-card {
  max-width: 280px;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.checked-spots-list {
  max-height: 140px;
  overflow-y: auto;
}

.checked-spot-link {
  cursor: pointer;
  color: inherit;
  text-decoration: none;
  font-size: 12px;
}

.checked-spot-link:hover {
  text-decoration: underline;
}
</style>
