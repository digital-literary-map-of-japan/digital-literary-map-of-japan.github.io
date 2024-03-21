<script setup lang="ts">
interface Item {
  title: string;
  value: string;
}

const { mode } = useSettings();

const { t } = useI18n();

const appConfig = useAppConfig();

const modes = appConfig.default.modes as Item[];

const items: Item[] = [];

for (const item of modes) {
  items.push({
    title: t(item.title),
    value: item.value,
  });
}
</script>
<template>
  <v-select v-if="items.length > 0"
    rounded
    v-model="mode"
    density="compact"
    variant="outlined"
    hide-details
    outlined
    :items="items"
    dense
  ></v-select>
</template>
