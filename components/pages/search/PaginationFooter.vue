<script setup lang="ts">
interface PropType {
  // modelValue: number;
  // length: number;
  total: number;
}

const props = withDefaults(defineProps<PropType>(), {
  // modelValue: () => 0,
  // length: () => 0,
  total: 0,
});

const limit = computed(() => {
  const route = useRoute();
  const query = route.query;
  const appConfig = useAppConfig();
  const csize = Number(query["page[limit]"]) || (appConfig.default.defaultPerPage || 10);
  return csize;
});

const length = computed(() => {
  return Math.ceil(props.total / limit.value);
});

const movePage = (e: number) => {
  // 1より小さい場合は1にする
  if (e < 1) e = 1;
  // lengthより大きい場合にはlengthにする
  if (e > length.value) e = length.value;

  const route = useRoute();
  const router = useRouter();

  const localePath = useLocalePath();

  const query = JSON.parse(JSON.stringify(route.query));

  const noffset = (e - 1) * limit.value;

  query["page[offset]"] = noffset;

  router.push(
    localePath({
      path: route.path,
      query: query,
    })
  );
};

const route = useRoute();

const queryPage =
  Math.ceil(Number(route.query["page[offset]"]) / limit.value) + 1 || 1;

const modelValue_ = ref(queryPage);

watch(modelValue_, () => {
  movePage(modelValue_.value);
});
</script>
<template>
  <div>
    <v-pagination
      size="small"
      v-model="modelValue_"
      :length="length"
      :total-visible="3"
    >
    </v-pagination>
  </div>
</template>
