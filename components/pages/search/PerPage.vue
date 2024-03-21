<script setup lang="ts">
interface Item {
  title: string;
  value: number;
}

/*
interface PropType {
  modelValue: number;
  items: Item[];
}

const props = withDefaults(defineProps<PropType>(), {
  modelValue: () => 0,
  items: () => [],
});
*/

const { t } = useI18n();

const appConfig = useAppConfig();

const perPageItems = appConfig.default.perPageItems;

const items: Item[] = [];

for (const item of perPageItems) {
  items.push({
    title: item + t("results_top"),
    value: item,
  });
}

/*
const emits = defineEmits<{ (e: "update:modelValue", value: number): void }>();
const onInputText = (e: Event) => {
  emits("update:modelValue", Number(e));
};

*/

// e: Event
const onInputText = (e: number) => {
  const route = useRoute();
  const router = useRouter();

  const localePath = useLocalePath();

  const query = JSON.parse(JSON.stringify(route.query));

  query["page[limit]"] = e;
  query["page[offset]"] = 0;

  router.push(
    localePath({
      path: route.path,
      query: query,
    })
  );
};

const route = useRoute();

const modelValue_ = ref(route.query['page[limit]'] ? Number(route.query['page[limit]']) : appConfig.default.defaultPerPage);
</script>
<template>
  <!-- :label="$t('items_per_page')" -->
  <v-select
    rounded
    v-model="modelValue_"
    density="compact"
    variant="outlined"
    hide-details
    outlined
    :items="items"
    dense
    @update:model-value="onInputText"
  ></v-select>
</template>
