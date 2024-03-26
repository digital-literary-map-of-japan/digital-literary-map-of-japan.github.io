<script setup lang="ts">
const { theme } = useSettings();

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
