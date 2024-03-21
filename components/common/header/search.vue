<script setup lang="ts">
import { mdiClose, mdiMagnify, mdiOpenInNew } from "@mdi/js";

const emits = defineEmits<{ (e: string): void }>();

const close = () => {
  emits("close");
};
</script>
<template>
  <v-btn icon @click="/*isSearch = true*/close()"
    ><v-icon>{{ mdiMagnify }}</v-icon></v-btn
  >
</template>
