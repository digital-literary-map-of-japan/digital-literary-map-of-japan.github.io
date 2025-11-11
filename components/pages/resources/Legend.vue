<script setup lang="ts">
const { fetchPageByFieldId } = useLocalData();
const { locale } = useI18n();

const data = await fetchPageByFieldId("legend_yokyoku", locale.value);

const item = data?.data;
</script>
<template>
  <v-dialog>
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        class="text-white"
        style="background-color: #2b3e50"
        flat
      >
        {{ $t("legend") }}
      </v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card :title="item.attributes.title">
        <v-card-text v-html="item.attributes.body.value"> </v-card-text>

        <v-card-actions>
          <v-btn
            block
            class="text-white"
            style="background-color: #2b3e50"
            :text="$t('close')"
            @click="isActive.value = false"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
