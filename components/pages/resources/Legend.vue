<script setup lang="ts">
const url = "https://drupal.aws.ldas.jp/dlm/";

const endpoint = `${url}jsonapi/node/page`;

const params: { [key: string]: string } = {
  "filter[field_id]": "legend_yokyoku",
};

const {
  data,
}: {
  [data: string]: any;
} = await useFetch(endpoint, {
  query: params,
});

const item = data.value?.data[0];
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
