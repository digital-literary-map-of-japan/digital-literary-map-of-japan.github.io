<script setup lang="ts">
import { mdiPencil } from "@mdi/js";

const { isAdmin } = useSettings();

interface PropType {
  id: string | number;
}

const props = withDefaults(defineProps<PropType>(), {
  id: "",
});

const url = `https://literarymaps.sakura.ne.jp/cms/node/${props.id}/edit`;
</script>
<template>
  <v-btn
    v-if="isAdmin"
    :href="url"
    target="_blank"
    color="warning"
    variant="outlined"
    class="ma-2"
  >
    <v-icon>{{ mdiPencil }}</v-icon>
    {{ $t("edit") }}
  </v-btn>
</template>
