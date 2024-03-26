<script setup lang="ts">
import type { ResourceObject } from "~/types/jsonapi";

interface PropType {
  translation: ResourceObject | null;
  type: string;
  label: string;
}

const props = withDefaults(defineProps<PropType>(), {
  translation: null,
  type: "",
  label: "",
});
</script>
<template>
  <v-expansion-panels class="mt-10" v-if="translation">
    <v-expansion-panel elevation="0">
      <v-expansion-panel-title class="bg-sub">{{
        $t("translations")
      }}</v-expansion-panel-title>
      <v-expansion-panel-text class="pa-4">
        <CommonBtnAdd class="mb-4" :label="label" :type="type"></CommonBtnAdd>

        <div>
          <v-row dense>
            <v-col :md="12" cols="12">
              <b>{{ $t("Text") }}：</b>{{ translation.attributes?.field_text }}
            </v-col>
          </v-row>

          <v-row dense>
            <v-col :md="12" cols="12">
              <b>{{ $t("author_source") }}：</b
              >{{ translation.attributes?.field_source }}
            </v-col>
          </v-row>

          <CommonBlockEdit :id="translation.attributes?.drupal_internal__nid">
          </CommonBlockEdit>
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
