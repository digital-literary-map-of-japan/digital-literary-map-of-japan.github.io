<script setup lang="ts">
import { mdiPlus } from "@mdi/js";
// interface
interface PropType {
  type: string;
  label?: string;
}

const props = withDefaults(defineProps<PropType>(), {
  type: "",
  label: "新規追加",
});

const url = `https://drupal.aws.ldas.jp/dlm/node/add/${props.type}`;
</script>
<template>
  <v-btn :href="url" target="_blank" color="success" variant="flat">
    <v-icon>{{ mdiPlus }}</v-icon>
    {{ label }}
  </v-btn>
</template>
