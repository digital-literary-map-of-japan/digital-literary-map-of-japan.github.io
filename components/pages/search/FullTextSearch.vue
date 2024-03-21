<script setup lang="ts">
import { mdiMagnify } from "@mdi/js";
import UrlParamsConverter from "~/utils/filter";

const localePath = useLocalePath();

interface PropType {
  label?: string;
}

withDefaults(defineProps<PropType>(), {
  label: "add_a_search_term"
});

const router = useRouter();

const route = useRoute();

const getKeyword = () => {
  const queryString = route.fullPath.split("?")[1] || "";
  const queryObject: any = UrlParamsConverter.urlParamsToObject(queryString);

  const filter = queryObject.filter;

  let keywords = [];

  if (filter && filter.search) {
    keywords = filter.search.split(",");
  }

  return keywords.join(" ");
};

const keyword = ref(getKeyword() || "");

const isComposing = ref(false);

const trigger = (event: any) => {
  // 日本語入力中のEnterキー操作は無効にする
  if (event.keyCode !== 13) return;
  execSearch();
};

const execSearch = () => {
  const keyword_ = keyword.value;

  const query = JSON.parse(JSON.stringify(route.query));
  if(query["page[offset]"]) delete query["page[offset]"];

  if (keyword_) {
    const keywords = keyword_.split(" ");
    query["filter[search]"] = keywords.join(",");
  } else {
    delete query["filter[search]"];
  }

  const path = localePath({
    path: route.path,
    query,
  });

  router.push(path);
};

watch(
  () => route.query,
  () => {
    keyword.value = getKeyword() || "";
  }
);
</script>

<template>
  <v-text-field
    rounded
    variant="outlined"
    v-model="keyword"
    @compositionstart="isComposing = true"
    @compositionend="isComposing = false"
    @keydown.enter="trigger"
    density="compact"
    single-line
    :label="$t(label)"
    hide-details
    clearable
    :append-inner-icon="mdiMagnify"
  ></v-text-field>
</template>
