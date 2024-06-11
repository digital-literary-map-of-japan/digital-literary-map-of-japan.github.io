<script setup lang="ts">
import type { ResourceObject } from "~/types/jsonapi";

interface PropType {
  translation: ResourceObject | null;
  type: string;
  label: string;
  nId: number;
}

const props = withDefaults(defineProps<PropType>(), {
  translation: null,
  type: "",
  label: "",
  nId: 0,
});

// const parentId = useRoute().params.id;

const params = {
  "edit[field_poem][widget][0][target_id]": String(props.nId),
  "edit[field_id][widget][0][value]": crypto.randomUUID(),
};
</script>
<template>
  <v-expansion-panels class="mt-10" v-if="translation">
    <v-expansion-panel elevation="0">
      <v-expansion-panel-title class="bg-sub">{{
        $t("translations")
      }}</v-expansion-panel-title>
      <v-expansion-panel-text class="pa-4">
        <template v-if="!translation">
          <CommonBtnAdd
            class="mb-4"
            :label="label"
            :type="type"
            :params="params"
          ></CommonBtnAdd>
        </template>

        <template v-else>
          <div>
            <v-row dense>
              <v-col :md="12" cols="12">
                <b>{{ $t("Text") }}：</b
                >{{ translation.attributes?.field_text }}
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
        </template>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
