<script setup lang="ts">
interface PropType {
  attributes: any;
}

const props = withDefaults(defineProps<PropType>(), {
  attributes: () => ({}),
});

const { t } = useI18n();

const fields: { [key: string]: string }[] = [
  {
    title: `${t("Topography")} (${t("ja")})`,
    value: "field_topography_ja",
  },
  {
    title: `${t("Topography")} (${t("en")})`,
    value: "field_topography_en",
  },
  {
    title: `${t("History")} (${t("ja")})`,
    value: "field_history_ja",
  },
  {
    title: `${t("History")} (${t("en")})`,
    value: "field_history_en",
  },
];
</script>

<template>
  <div class="mt-4">
    <template v-for="field in fields">
      <v-row v-if="attributes?.[field.value]">
        <v-col :md="3" cols="12">
          <b>{{ field.title }}：</b>
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
              <span v-html="attributes?.[field.value].processed"></span>
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
