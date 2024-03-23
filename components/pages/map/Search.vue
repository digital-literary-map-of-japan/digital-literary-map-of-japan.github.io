<script setup lang="ts">
import { mdiMagnify, mdiViewList, mdiLayers } from "@mdi/js";

const { selectedSpotId } = useMap();

const { results } = useMap();

/*
const spots = computed(() => {
  if (!results.value) {
    return [];
  }
  return results.value.data.map((item: any) => {
    return {
      title: item.attributes.title,
      value: item.attributes.field_id,
    };
  });
});
*/

const spots = ref<{ title: string; value: string }[]>([]);

watch(
  results,
  () => {
    if (!results.value) {
      return;
    }
    spots.value = results.value.data.map((item: any) => {
      return {
        title: `${item.attributes.title} ${item.attributes.field_spot_name_furigana} ${item.attributes.field_spot_name_romaji}`,
        value: item.attributes.field_id,
      };
    });
  },
  { immediate: true }
);

const spot = ref<{ title: string; value: string } | null>(null);

const menu = ref(false);

const selectMarker = () => {
  if (!spot.value) return;
  selectedSpotId.value = spot.value.value;
};

/*
@click="updateLayout()" 
const updateLayout = () => {
  // zoom.value = zoom.value === 8 ? 12 : 8;
  console.log("table");
};
*/
</script>
<template>
  <LControl position="topleft">
    <div class="leaflet-bar">
      <v-menu
        :offset="8"
        v-model="menu"
        :close-on-content-click="false"
        location="end"
      >
        <template v-slot:activator="{ props }">
          <a v-bind="props" style="cursor: pointer">
            <v-icon small>{{ mdiMagnify }}</v-icon>
          </a>
        </template>

        <v-card min-width="300">
          <v-card-text>
            <v-combobox
              :items="spots"
              variant="outlined"
              v-model="spot"
            ></v-combobox>

            <v-btn
              :disabled="!spot?.value"
              color="primary"
              variant="outlined"
              @click="selectMarker()"
            >
              <v-icon>{{ mdiMagnify }}</v-icon>
              検索
            </v-btn>
          </v-card-text>
        </v-card>
      </v-menu>
    </div>
  </LControl>
</template>
