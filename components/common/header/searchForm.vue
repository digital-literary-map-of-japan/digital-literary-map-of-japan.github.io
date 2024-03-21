<script setup lang="ts">
import { mdiClose, mdiMagnify } from "@mdi/js";

const { t } = useI18n();

interface PropType {
  placeholder?: string;
  field?: string;
  to?: any;
}

const props = withDefaults(defineProps<PropType>(), {
  placeholder: "add_a_search_term", // "トピックや興味のあるコンテンツを検索"
  field: "filter[search]",
  to: {
    name: "edu",
    params: null,
  },
});

const translatedPlaceholder = t(props.placeholder);

const emits = defineEmits<{ (e: string): void }>();

const close = () => {
  emits("close");
};

const localePath = useLocalePath();
const search = ref("");
const isComposing = ref(false);

const trigger = (event: any) => {
  // 日本語入力中のEnterキー操作は無効にする
  if (event.keyCode !== 13) return;
  execSearch();
  close()
};

const execSearch = () => {
  const router = useRouter();
  router.push(
    localePath({
      name: props.to.name,
      params: props.to.params,
      query: { [props.field]: search.value },
    })
  );
};

watch(
  () => useRoute().fullPath,
  async () => {
    const route = useRoute();
    const query = route.query.query as string;
    if (query) {
      search.value = query;
      // isSearch.value = true;
    }
  },
  { deep: true, immediate: true }
);
</script>
<template>
  <v-text-field
    class="mx-2"
    v-model="search"
    hide-details
    flat
    variant="solo"
    @compositionstart="isComposing = true"
    @compositionend="isComposing = false"
    @keydown.enter="trigger"
    single-line
    density="compact"
    :click:appendInner="execSearch"
    :append-inner-icon="mdiMagnify"
    :placeholder="translatedPlaceholder"
  ></v-text-field>

  <v-btn icon @click="/*isSearch = false*/ close()"
    ><v-icon>{{ mdiClose }}</v-icon></v-btn
  >
</template>
