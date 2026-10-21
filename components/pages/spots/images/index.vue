<script setup lang="ts">
import { mdiOpenInNew } from "@mdi/js";
import type { JsonApiItems } from "~/types/jsonapi";

interface PropType {
  spotNId: number;
  raw: JsonApiItems;
}

const props = withDefaults(defineProps<PropType>(), {
  spotNId: 0,
  raw: () => ({} as JsonApiItems),
});

const getUrl = (field: any, pos: number = -1) => {
  return `/uv/uv.html#?manifest=${field.manifest}&cv=${
    Number(pos === -1 ? field.pos[0] : pos) - 1
  }`;
};
</script>
<template>
  <div>
    <v-card v-for="value in raw.data" variant="flat">
      <v-card-text v-if="value.attributes">
        <h3>
          <a :href="value.attributes.link" target="_blank"
            >{{ value.attributes.title }}
            <v-icon>{{ mdiOpenInNew }}</v-icon>
          </a>
        </h3>

        <template v-if="value.attributes.manifest">
          <iframe
            class="mt-4"
            :src="getUrl(value.attributes)"
            width="100%"
            height="600"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>

          <p class="mt-4">
            <v-btn
              variant="text"
              color="primary"
              class="mr-4"
              v-for="pos in value.attributes.pos"
              :href="getUrl(value.attributes, pos)"
              target="_blank"
            >
              {{ pos }} {{ $t("コマ") }} <v-icon>{{ mdiOpenInNew }}</v-icon>
            </v-btn>
          </p>
        </template>
      </v-card-text>
      <v-divider class="my-2" />
    </v-card>
  </div>
</template>
