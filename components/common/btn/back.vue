<script setup lang="ts">
import { mdiArrowLeftBold } from "@mdi/js";

const localePath = useLocalePath();

interface PropType {
  type: string;
}

withDefaults(defineProps<PropType>(), {
  type: "",
});
</script>
<template>
  <v-btn variant="flat" color="primary" :to="localePath({ name: type })">
    <v-icon>{{ mdiArrowLeftBold }}</v-icon>
    {{ $t("Back") }}
  </v-btn>
</template>
