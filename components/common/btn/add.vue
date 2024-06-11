<script setup lang="ts">
import { mdiPlus } from "@mdi/js";

const { isAdmin } = useSettings();

interface PropType {
  type: string;
  label?: string;
  params?: { [key: string]: string };
}

const props = withDefaults(defineProps<PropType>(), {
  type: "",
  label: "add", // t("add"),
  params: () => ({} as { [key: string]: string }),
});

// URLにクエリパラメータを追加する関数
const createURLWithParams = (
  baseURL: string,
  params: { [key: string]: string }
) => {
  const url = new URL(baseURL);
  Object.keys(params).forEach((key) => {
    if (params[key]) url.searchParams.append(key, params[key]);
  });
  return url.toString();
};

const url = computed(() =>
  createURLWithParams(
    `https://drupal.aws.ldas.jp/dlm/node/add/${props.type}`,
    props.params
  )
);
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
