<script setup lang="ts">
import { mdiPencil } from "@mdi/js";

const { t } = useI18n();
const localePath = useLocalePath();
const { isAdmin, initEditMode, toggleEditMode } = useSettings();
const { setPageMeta, setBreadcrumbJsonLd } = useSeo();

onMounted(() => {
  initEditMode();
});

const bh = [
  {
    title: t("top"),
    disabled: false,
    to: localePath({ name: "index" }),
  },
  {
    title: t("Admin"),
    disabled: false,
  },
];

setPageMeta({
  title: t('Admin'),
  noindex: true,
});
setBreadcrumbJsonLd(bh);
</script>
<template>
  <LayoutsCommon :title="$t('Admin')" :items="bh">
    <v-card max-width="600" class="mx-auto">
      <v-list>
        <v-list-item @click="toggleEditMode">
          <template #prepend>
            <v-icon class="mr-2">{{ mdiPencil }}</v-icon>
          </template>
          {{ $t("Edit mode") }}
          <template #append>
            <v-switch
              :model-value="isAdmin"
              hide-details
              density="compact"
              color="warning"
              class="ml-2"
              @click.stop="toggleEditMode"
            ></v-switch>
          </template>
        </v-list-item>
      </v-list>
    </v-card>
  </LayoutsCommon>
</template>
