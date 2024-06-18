<script lang="ts" setup>
const route = useRoute();

if (!route.path.endsWith("/")) {
  await navigateTo(route.path + "/");
}
</script>
<template>
  <NuxtLayout>
    <!-- <NuxtLoadingIndicator color="#E64A19" :height="5" /> -->
    <NuxtPage />
  </NuxtLayout>
</template>
