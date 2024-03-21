<script setup lang="ts">
import type { BhItem } from "~/types";
import type { JsonApiObject } from "~/types/jsonapi";

interface To {
  name: string;
}

// interface
interface PropType {
  title: string;
  bh: BhItem[];
  results: JsonApiObject;
  toDetail: To;
}

const props = withDefaults(defineProps<PropType>(), {
  title: "",
  bh: () => [] as BhItem[],
  results: () => ({} as JsonApiObject),
  toDetail: () => ({} as To),
});

// functions
const getList = (results: JsonApiObject) => {
  const data = results.data;
  if (Array.isArray(data)) {
    return data;
  } else {
    return [];
  }
};

// computed
const total = computed(() => props.results.meta?.total || 0);
</script>
<template>
  <LayoutsCommon :title="title" :items="bh" fluid>
    <v-row dense>
      <v-col sm="6" offset-sm="3">
        <!-- :label="appConfig.custom_search_label || null" -->
        <PagesSearchFullTextSearch
          :to="{
            name: 'edu',
          }"
        ></PagesSearchFullTextSearch>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col sm="10" offset-sm="1">
        <PagesSearchFilter></PagesSearchFilter>

        <!--

        <PagesSearchFacets
          :aggregation-config="aggregationConfig"
          :aggregations="aggregations"
        ></PagesSearchFacets>

        -->
      </v-col>
    </v-row>

    <v-container v-if="results" fluid>
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

        <div class="ma-1">
          <PagesSearchSort></PagesSearchSort>
        </div>

        <!--
            <div class="ml-2">
                
            </div>
            -->
      </div>

      <!-- 
      <div class="mt-4">
        <PagesSearchTotal :value="total"></PagesSearchTotal>
      </div>

      -->

      <!--
        {
          name: 'edu-id',
        }
      -->

      <PagesSearchLayoutList
        :items="getList(results)"
        :to="toDetail"
        class="mt-5 mb-5"
      ></PagesSearchLayoutList>

      <!--
      -->

      <!-- 頁ネーション -->
      <PagesSearchPagination
        :total="total"
        class="pt-5 my-5"
      ></PagesSearchPagination>
    </v-container>
  </LayoutsCommon>
</template>
