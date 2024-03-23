<script setup lang="ts">
import { mdiMagnify, mdiViewList, mdiLayers, mdiInformation } from "@mdi/js";

const { selectedSpotId } = useMap();

const { results } = useMap();

const size = computed(() => {
  if (!results.value) {
    return 0;
  }
  return results.value.data.length;
});

const zoom = ref(8);

interface Marker {
  lat: number;
  lng: number;
  title: string;
  id?: string;
}

interface PropType {
  // markers?: Marker[];
  full?: boolean;
}

const props = withDefaults(defineProps<PropType>(), {
  // markers: () => [],
  full: false,
});

const markers = computed(() => {
  if (!results.value) {
    return [];
  }
  return results.value.data.map((item: any) => {
    return {
      lat: item.attributes.field_geo.lat,
      lng: item.attributes.field_geo.lon,
      title: item.attributes.title,
      id: item.attributes.field_id, // drupal_internal__nid,
    };
  });
});

const center: any = computed(() => {
  console.log(markers.value.length, selectedSpotId.value);
  if (markers.value.length === 0) {
    return [47.21322, -1.559482];
  }

  if (selectedSpotId.value) {
    const marker = markers.value.find(
      (marker) => marker.id === selectedSpotId.value
    );
    if (marker) {
      return [marker.lat, marker.lng];
    }
  }

  const lat =
    markers.value.reduce((acc, marker) => acc + marker.lat, 0) /
    markers.value.length;
  const lng =
    markers.value.reduce((acc, marker) => acc + marker.lng, 0) /
    markers.value.length;

  return [lat, lng];
});

const height = props.full ? "100vh" : "40vh";

const updateLayout = () => {
  // zoom.value = zoom.value === 8 ? 12 : 8;
  console.log("table");
};

const localePath = useLocalePath();

const selectMarker = (marker: Marker) => {
  const id = marker.id || "";
  selectedSpotId.value = id;
};

/*
watch(
  () => selectedSpotId.value,
  () => {
    
  }
);
*/

const menu = ref(false);
</script>
<template>
  <div :style="`height: ${height}; width: 100%`">
    <p>選択されたスポットのID: {{ selectedSpotId }}</p>

    <p>サイズ: {{ size }}</p>

    <p>センター: {{ center }}</p>

    <LMap ref="map" :zoom="zoom" :center="center">
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        name="OpenStreetMap"
      />

      <template v-for="marker in markers">
        <LMarker
          @click="selectMarker(marker)"
          :lat-lng="[marker.lat, marker.lng]"
        >
          <LPopup>
            {{ marker.title }}
          </LPopup>
        </LMarker>
      </template>

      <LControl position="topleft">
        <div class="leaflet-bar">
          <!-- @click="updateLayout()" -->
          <nuxt-link
            :to="
              localePath({
                name: 'spots',
                query: {
                  layout: 'table',
                },
              })
            "
            style="cursor: pointer"
          >
            <v-icon small>{{ mdiViewList }}</v-icon>
          </nuxt-link>
        </div>
      </LControl>

      <PagesMapSearch></PagesMapSearch>

      <LControl position="topright">
        <div class="leaflet-bar">
          <a @click="updateLayout()" style="cursor: pointer">
            <v-icon small>{{ mdiLayers }}</v-icon>
          </a>
        </div>
      </LControl>

      <PagesMapInfo></PagesMapInfo>
    </LMap>
  </div>
</template>
