<script setup lang="ts">
interface PropType {
  attributes: any;
}

withDefaults(defineProps<PropType>(), {
  attributes: () => ({}),
});

const { t } = useI18n();

const fields = ref<{ [key: string]: any }[]>([
  {
    title: `${t("Topography")} (${t("ja")})`,
    value: "field_topography_ja",
    info: "地誌情報",
    menu: false,
  },
  {
    title: `${t("Topography")} (${t("en")})`,
    value: "field_topography_en",
    info: "地誌情報",
    menu: false,
  },
  {
    title: `${t("History")} (${t("ja")})`,
    value: "field_history_ja",
    info: "歴史",
    menu: false,
  },
  {
    title: `${t("History")} (${t("en")})`,
    value: "field_history_en",
    info: "歴史",
    menu: false,
  },
]);
</script>

<template>
  <div class="mt-4">
    <template v-for="field in fields">
      <v-row v-if="attributes?.[field.value]">
        <v-col :md="3" cols="12">
          <PagesSpotsLabel :field="field"></PagesSpotsLabel>
        </v-col>
        <v-col :md="9" cols="12">
          <template v-if="field.value === 'field_link'">
            <a :href="attributes?.[field.value].uri" target="_blank">{{
              attributes?.[field.value].uri
            }}</a>
          </template>
          <template v-else-if="field.value === 'field_geo'">
            <b>{{ $t("Latitude") }}：</b>
            {{ attributes?.[field.value]?.lat }}&nbsp;
            <b>{{ $t("Longitude") }}：</b>
            {{ attributes?.[field.value]?.lon }}
          </template>
          <template v-else>
            <template v-if="attributes?.[field.value].processed">
              <!-- processed -->
              <span v-html="attributes?.[field.value].value"></span>
            </template>
            <template v-else>
              {{ attributes?.[field.value] }}
            </template>
          </template>
        </v-col>
      </v-row>
    </template>
  </div>
</template>
