<script setup lang="ts">
import type { CommonBtnEdit } from "#build/components";
import { mdiInformation } from "@mdi/js";

const { legends } = useSettings();

interface PropType {
  field: { [key: string]: any };
}

withDefaults(defineProps<PropType>(), {
  field: () => ({}),
});
</script>
<template>
  <b
    >{{ field.title
    }}<template v-if="field.info"
      ><v-menu
        v-model="field.menu"
        :close-on-content-click="false"
        location="end"
      >
        <template v-slot:activator="{ props }">
          <v-icon
            style="vertical-align: bottom"
            class="mx-1"
            v-bind="props"
            color="success"
            >{{ mdiInformation }}</v-icon
          >

          <v-btn v-bind="props" variant="flat" size="small" v-if="false">
            <!-- text -->
          </v-btn>
        </template>

        <v-card max-width="300">
          <CommonBtnEdit
            :id="legends[field.info].value.attributes.drupal_internal__nid"
          />

          <v-card-text
            v-html="legends[field.info].value.attributes.body.processed"
          ></v-card-text>

          <!--
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              block
              variant="text"
              @click="field.menu = false"
            >
              {{ $t("close") }}
            </v-btn>
          </v-card-actions>
          -->
        </v-card>
      </v-menu></template
    >：</b
  >
</template>
