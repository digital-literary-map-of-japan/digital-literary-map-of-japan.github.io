<script setup lang="ts">
import { mdiPencil } from "@mdi/js";
// interface
interface PropType {
  id: string | number;
}

const props = withDefaults(defineProps<PropType>(), {
  id: "",
});

const url = `https://drupal.aws.ldas.jp/dlm/node/${props.id}/edit`;
</script>
<template>
  <v-btn
    :href="url"
    target="_blank"
    color="warning"
    variant="outlined"
    class="ma-2"
  >
    <v-icon>{{ mdiPencil }}</v-icon>
    編集
  </v-btn>
</template>
