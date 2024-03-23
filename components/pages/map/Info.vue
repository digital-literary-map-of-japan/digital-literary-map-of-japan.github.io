<script setup lang="ts">
import { mdiMagnify, mdiViewList, mdiLayers, mdiInformation } from "@mdi/js";

const { selectedSpotId } = useMap();

const spots = [
  {
    title: "明石",
    value: "aaa",
  },
];

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
  <LControl position="bottomright">
    <div class="leaflet-bar">
      <v-menu
        :offset="8"
        v-model="menu"
        :close-on-content-click="false"
        location="top"
      >
        <template v-slot:activator="{ props }">
          <a v-bind="props" style="cursor: pointer">
            <v-icon small>{{ mdiInformation }}</v-icon>
          </a>
        </template>

        <v-card min-width="300">
          <v-card-text>
            <v-combobox
              label="Combobox"
              :items="spots"
              variant="outlined"
              v-model="spot"
            ></v-combobox>

            <v-btn color="primary" variant="outlined" @click="selectMarker()">
              <v-icon>{{ mdiMagnify }}</v-icon>
              検索
            </v-btn>
          </v-card-text>
        </v-card>
      </v-menu>
    </div>
  </LControl>
</template>
