<script setup lang="ts">
import type { AggregationConfig } from "@/types/search";
import type { JsonApiItems } from "@/types/jsonapi";
import type { SelectItem as Item } from "@/types/search";

export interface PropType {
  configId: string;
  item: JsonApiItems;
  isSearch?: boolean;
}

const props = withDefaults(defineProps<PropType>(), {
  configId: "",
  item: () => ({} as JsonApiItems),
  isSearch: () => false,
});

const appConfig = useAppConfig();
const configId = props.configId;

const config = appConfig[configId] as {
  aggregations: AggregationConfig[];
  sorts: Item[];
  defaultSort: string;
};

// const isSearch = ref(false);

const aggregationConfig = computed(() => {
  if (!configId || !config) {
    return [];
  }

  const conf = config.aggregations;

  if (!conf) {
    return [];
  }

  return conf;
});

const sorts = computed(() => {
  if (!configId || !config) {
    return [];
  }

  const conf = config.sorts;

  if (!conf) {
    return [];
  }

  return conf;
});

const defaultSort = computed(() => {
  if (!configId || !config) {
    return "";
  }

  const conf = config.defaultSort;

  if (!conf) {
    return "";
  }

  return conf;
});

/*
const aggregationConfig = computed(() => {
  if (!configId || !config) {
    return [];
  }

  const conf = config.aggregations;

  if (!conf) {
    return [];
  }

  return conf;
});
*/

const total = computed(() => props.item.meta?.count || 0);

const isFirst = computed(() => {
  return total.value === -1;
});
</script>
<template>
  <div>
    <v-row dense>
      <v-col sm="6" offset-sm="3">
        <PagesSearchFullTextSearch></PagesSearchFullTextSearch>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col sm="10" offset-sm="1">
        <PagesSearchFilter :aggregationConfig="aggregationConfig"></PagesSearchFilter>

        <PagesSearchFacets
          :aggregation-config="aggregationConfig"
            :facets="item.meta?.facets"
        ></PagesSearchFacets>
      </v-col>
    </v-row>

    <v-container
      fluid
      :style="isSearch && !isFirst ? 'pointer-events: none; opacity: 0.5;' : ''"
    >
      <template v-if="isFirst">
        <div class="pa-10 text-center">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
      </template>
      <template v-else-if="total === 0 && !isSearch">
        <v-container>
          <v-card variant="outlined" flat>
            <v-card-text class="text-center pa-4">
              検索条件に適合するデータがありませんでした。
            </v-card-text>
          </v-card>
        </v-container>
      </template>
      <template v-else>
        <div class="d-flex flex-wrap">
          <PagesSearchTotal
            :value="total"
            class="me-auto ma-1"
          ></PagesSearchTotal>

          <div class="ma-1">
            <PagesSearchPagination :total="total"></PagesSearchPagination>
          </div>

          <div class="ma-1">
            <PagesSearchPerPage></PagesSearchPerPage>
          </div>

          <div class="ma-1" v-if="sorts.length > 0">
            <PagesSearchSort
              :items="sorts"
              :default-sort="defaultSort"
            ></PagesSearchSort>
          </div>

          <div class="ma-1">
            <PagesSearchMode></PagesSearchMode>
          </div>
        </div>

        <slot />

        <!-- 頁ネーション -->
        <PagesSearchPagination
          :total="total"
          class="pt-5 my-5"
        ></PagesSearchPagination>
      </template>
    </v-container>
  </div>
</template>
