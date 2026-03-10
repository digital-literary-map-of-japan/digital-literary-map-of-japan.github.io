<script setup lang="ts">
import { mdiLayers, mdiCloseCircle } from "@mdi/js";

const { selectedDocumentIds, documents } = useMap();

const menu = ref(false);

const { t } = useI18n();

const headers = [
  {
    // title: t("name"),
    key: "name",
  },
];

const desserts = computed(() => {
  return documents.value?.data.map((item: any) => {
    return {
      id: item.attributes.field_id,
      name: item.attributes.title,
    };
  });
});

// const selectedDocumentIds = ref([]);
</script>
<template>
  <LControl position="topright">
    <div class="leaflet-bar">
      <v-menu
        :offset="8"
        v-model="menu"
        :close-on-content-click="false"
        location="top"
      >
        <template v-slot:activator="{ props }">
          <a v-bind="props" style="cursor: pointer" aria-label="Layers">
            <v-icon small>{{ mdiLayers }}</v-icon>
          </a>
        </template>

        <v-card min-width="300">
          <v-card-text>
            <div class="text-right">
              <v-btn variant="flat" icon @click="menu = false" aria-label="Close">
                <v-icon>{{ mdiCloseCircle }}</v-icon>
              </v-btn>
            </div>
            <v-data-table
              density="compact"
              v-model="selectedDocumentIds"
              :headers="headers"
              :items="desserts"
              item-value="id"
              items-per-page="-1"
              show-select
            ></v-data-table>
          </v-card-text>
        </v-card>
      </v-menu>
    </div>
  </LControl>
</template>
