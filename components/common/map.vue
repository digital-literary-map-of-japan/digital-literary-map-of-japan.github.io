<script setup lang="ts">
const zoom = ref(8);
</script>
<template>
  <div style="height: 40vh; width: 100%">
    <LMap ref="map" :zoom="zoom" :center="[47.21322, -1.559482]">
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        layer-type="base"
        name="OpenStreetMap"
      />
    </LMap>
  </div>
</template>
