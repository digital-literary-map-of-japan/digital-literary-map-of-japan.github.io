<script setup lang="ts">
import { mdiMenuUp, mdiMenuDown } from "@mdi/js";
import type { AggregationConfig, Facet } from "~/types/search";

export interface PropType {
  aggregationConfig: AggregationConfig[];
  facets: Facet[];
}

const props = withDefaults(defineProps<PropType>(), {
  aggregationConfig: () => [],
  facets: () => [] as Facet[],
});

const opened = ref<boolean[]>([]);

for (let i = 0; i < props.aggregationConfig.length; i++) {
  opened.value.push(false);
}

const getFacet = (id: string) => {
  return props.facets.find((item) => item.id === id);
};
</script>
<template>
  <div>
    <div class="mb-2 d-flex pr-2 py-2" style="overflow-x: auto">
      <template v-for="(conf, i) in aggregationConfig">
        <template v-if="!conf.hide">
          <v-btn
            class="ma-1"
            rounded
            variant="outlined"
            :active="opened[i]"
            @click="opened[i] = !opened[i]"
          >
            {{ conf.label }}
            <v-icon>{{ opened[i] ? mdiMenuUp : mdiMenuDown }}</v-icon>
          </v-btn>
        </template>
      </template>
    </div>

    <template v-for="(conf, i) in aggregationConfig">
      <PagesSearchFacet
        :label="conf.label"
        :id="conf.id"
        v-if="opened[i]"
        class="mb-5"
        :value="getFacet(conf.id)"
        @close="opened[i] = false"
      ></PagesSearchFacet>
    </template>
  </div>
</template>
