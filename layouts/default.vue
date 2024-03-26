<script setup lang="ts">
const { theme, legends } = useSettings();

const runtimeConfig = useRuntimeConfig();
const app_name = runtimeConfig.app_baseURL;

onMounted(() => {
  if (!theme.value) {
    let theme_ = localStorage.getItem(`${app_name}-theme`);
    if (!theme_) {
      theme_ = "light";
    }
    theme.value = theme_;
  }
});

const getLegend = async (id: string) => {
  const url = `https://drupal.aws.ldas.jp/dlm/jsonapi/node/page/${id}`;

  const { data }: { [data: string]: any } = await useFetch(url);

  return data.value;
};

if (Object.keys(legends.value).length === 0) {
  const legends_: { [key: string]: { [key2: string]: any } } = {
    緯度経度: {
      id: "2bd8d311-6024-4dfc-98c2-f9fd0c4a1477",
    },
    歌枕としての意味: {
      id: "03d91050-7593-49b9-b24d-2e1172555b4b",
    },
    歌枕としての特徴: {
      id: "bb6ff42f-443a-4e7f-bc25-8b6b4a168462",
    },
    連想: {
      id: "e68cd44b-ad42-4bb4-96ca-9df04ccd42a3",
    },
    地誌情報: {
      id: "72528a60-1435-4539-9ad1-ed375aafac7a",
    },
    歴史: {
      id: "6f9a7010-4306-4c7e-9702-c1f5d433d374",
    },
    URL: {
      id: "c332309b-603d-4c40-af9f-947931dd5286",
    },
  };

  for (const key in legends_) {
    legends_[key].value = await getLegend(legends_[key].id);
  }

  legends.value = legends_;
}
</script>
<template>
  <v-app :theme="theme" v-show="theme">
    <LayoutsHeader> </LayoutsHeader>

    <v-main class="pb-0">
      <slot />
    </v-main>

    <LayoutsFooter> </LayoutsFooter>

    <LayoutsBackToTop></LayoutsBackToTop>
  </v-app>
</template>
