<script setup lang="ts">
import { mdiMagnify, mdiViewList, mdiLayers, mdiInformation } from "@mdi/js";

const { selectedSpotId } = useMap();

const zoom = ref(8);

interface Marker {
  lat: number;
  lng: number;
  title: string;
  id?: string;
}

interface PropType {
  markers: Marker[];
}

const props = withDefaults(defineProps<PropType>(), {
  markers: () => [],
});

const center: any = computed(() => {
  if (props.markers.length === 0) {
    return [47.21322, -1.559482];
  }

  if (selectedSpotId.value) {
    const marker = props.markers.find(
      (marker) => marker.id === selectedSpotId.value
    );
    if (marker) {
      return [marker.lat, marker.lng];
    }
  }

  const lat =
    props.markers.reduce((acc, marker) => acc + marker.lat, 0) /
    props.markers.length;
  const lng =
    props.markers.reduce((acc, marker) => acc + marker.lng, 0) /
    props.markers.length;

  return [lat, lng];
});

const height = "40vh";

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
    </LMap>
  </div>
</template>
