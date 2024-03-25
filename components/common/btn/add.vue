<script setup lang="ts">
import { mdiPlus } from "@mdi/js";

const { isAdmin } = useSettings();

interface PropType {
  type: string;
  label?: string;
}

const props = withDefaults(defineProps<PropType>(), {
  type: "",
  label: "add", // t("add"),
});

const url = `https://drupal.aws.ldas.jp/dlm/node/add/${props.type}`;
</script>
<template>
  <v-btn
    :href="url"
    target="_blank"
    color="success"
    variant="flat"
    v-if="isAdmin"
  >
    <v-icon>{{ mdiPlus }}</v-icon>
    {{ $t(label) }}
  </v-btn>
</template>
