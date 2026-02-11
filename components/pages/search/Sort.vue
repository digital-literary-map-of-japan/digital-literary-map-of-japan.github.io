<script setup lang="ts">
import type { SelectItem as Item } from "~/types/search";

interface PropType {
  items?: Item[];
  defaultSort?: string;
}

const props = withDefaults(defineProps<PropType>(), {
  items: () => [],
  defaultSort: () => "",
});

const { t } = useI18n();

const appConfig = useAppConfig();

const fixedItems = computed(() => {

  const sorts = appConfig.default.sorts;

  const items: Item[] = [];
  for (const sort of sorts) {
    if (sort.key === "_score") {
      items.push({
        title: t(sort.title) + " " + t("desc"),
        value: "-" + sort.key,
      });
    } else {
      items.push({
        title: t(sort.title) + " " + t("asc"),
        value: sort.key,
      });
      items.push({
        title: t(sort.title) + " " + t("desc"),
        value: "-" + sort.key,
      });
    }
  }
  return items;
});

const fixedDefaultSort = computed(() => {
  if (props.defaultSort) {
    return props.defaultSort;
  }

  return appConfig.default.defaultSort;
});

// e: Event
const onInputText = (e: string) => {
  const route = useRoute();
  const router = useRouter();

  const localePath = useLocalePath();

  const query = JSON.parse(JSON.stringify(route.query));

  query.sort = e;
  query["page[offset]"] = 0;

  router.push(
    localePath({
      path: route.path,
      query: query,
    })
  );
};

const route = useRoute();
const modelValue_ = ref(
  route.query.sort ? String(route.query.sort) : fixedDefaultSort.value
);

watch(
  () => route.query,
  () => {
    const route = useRoute();
    modelValue_.value = route.query.sort
      ? String(route.query.sort)
      : fixedDefaultSort.value;
  }
);
</script>
<template>
  <v-select
    rounded
    v-model="modelValue_"
    density="compact"
    variant="outlined"
    hide-details
    outlined
    :items="fixedItems"
    dense
    @update:model-value="onInputText"
  ></v-select>
</template>
