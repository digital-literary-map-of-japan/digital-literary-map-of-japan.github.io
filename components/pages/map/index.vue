<script setup lang="ts">
import { mdiViewList } from "@mdi/js";
const { selectedSpotId, selectedSpotsByDocumentIds } = useMap();

const { results } = useMap();

const zoom = ref(8);

interface Marker {
  lat: number;
  lng: number;
  title: string;
  id?: string;
  icon?: string;
}

interface PropType {
  full?: boolean;
}

const props = withDefaults(defineProps<PropType>(), {
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
      title: `${item.attributes.title} / ${item.attributes.field_spot_name_romaji}`,
      id: item.attributes.field_id, // drupal_internal__nid,
      icon:
        selectedSpotId.value === item.attributes.field_id
          ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png"
          : selectedSpotsByDocumentIds.value.includes(item.attributes.field_id)
          ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png"
          : "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    };
  });
});

const center: any = computed(() => {
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

const height = ref<string>("40vh"); // props.full ? "80vh" : "40vh";

onMounted(() => {
  const windowHeight = window.innerHeight;

  if (props.full) {
    height.value = `${windowHeight - 64}px`;
  }
});

const localePath = useLocalePath();

const selectMarker = (marker: Marker) => {
  const id = marker.id || "";
  selectedSpotId.value = id;
};
</script>
<template>
  <div :style="`height: ${height}; width: 100%`">
    <!--

      <p>選択されたスポットのIDs: {{ selectedSpotsByDocumentIds }}</p>

    <p>選択されたスポットのID: {{ selectedSpotId }}</p>

    <p>サイズ: {{ size }}</p>

    <p>センター: {{ center }}</p>-->
    <PagesMapInfo></PagesMapInfo>

    <LMap ref="map" :zoom="zoom" :center="center">
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        name="OpenStreetMap"
      />

      <!-- :icon="redIcon" -->
      <template v-for="marker in markers">
        <LMarker
          @click="selectMarker(marker)"
          :lat-lng="[marker.lat, marker.lng]"
        >
          <LIcon
            :iconUrl="marker.icon"
            :iconSize="[25, 41]"
            :iconAnchor="[12, 41]"
            :popupAnchor="[1, -34]"
            :tooltipAnchor="[16, -28]"
            shadowUrl="https://esm.sh/leaflet@1.9.2/dist/images/marker-shadow.png"
            :shadowSize="[41, 41]"
            :shadowAnchor="[12, 41]"
          ></LIcon>
          >
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

      <PagesMapDocuments></PagesMapDocuments>
    </LMap>
  </div>
</template>
