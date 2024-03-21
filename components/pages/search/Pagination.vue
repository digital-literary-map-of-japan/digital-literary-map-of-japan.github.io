<script setup lang="ts">
import { mdiChevronRight, mdiChevronLeft } from "@mdi/js";

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
  const csize =
    Number(query["page[limit]"]) || appConfig.default.defaultPerPage || 10;
  return csize;
});

const length = computed(() => {
  return Math.ceil(props.total / limit.value);
});

/*
const emits = defineEmits<{ (e: "update:modelValue", value: number): void }>();
*/

const movePage = (e: number) => {
  // 1より小さい場合は1にする
  if (e < 1) e = 1;
  // lengthより大きい場合にはlengthにする
  if (e > length.value) e = length.value;
  modelValue_.value = e;
  // emits("update:modelValue", e);

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

const queryPage = Number(route.query["page[offset]"]) / limit.value + 1 || 1;

const modelValue_ = ref(queryPage);

watch(
  () => route.query,
  (e) => {
    const route = useRoute();
    const query = JSON.parse(JSON.stringify(route.query));
    const coffset = Number(query["page[offset]"]) || 0;

    const cpage = Math.ceil(coffset / limit.value) + 1;

    modelValue_.value = cpage;
  }
);
</script>
<template>
  <div class="d-flex">
    <div>
      <v-text-field
        v-model="modelValue_"
        @change="movePage(Number(modelValue_))"
        dense
        hide-details
        density="compact"
        variant="outlined"
        single-line
        type="number"
        style="width: 96px"
      >
      </v-text-field>
    </div>
    <div class="ml-2">
      / <span class="mr-2">{{ length.toLocaleString() }}</span>

      <v-btn
        class="ma-1"
        @click="movePage(modelValue_ - 1)"
        :disabled="modelValue_ === 1"
        variant="tonal"
        ><v-icon color="primary">{{ mdiChevronLeft }}</v-icon></v-btn
      >
      <v-btn
        class="ma-1"
        variant="tonal"
        @click="movePage(modelValue_ + 1)"
        :disabled="modelValue_ >= length"
        ><v-icon color="primary">{{ mdiChevronRight }}</v-icon></v-btn
      >
    </div>
  </div>
</template>
<style scoped>
.v-btn--size-default {
  min-width: 0px;
  padding: 0 8px;
}
</style>
