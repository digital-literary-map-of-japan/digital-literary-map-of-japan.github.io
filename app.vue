<script lang="ts" setup>
/*
const route = useRoute();

if (!route.path.endsWith("/")) {
  await navigateTo(route.path + "/");
}
*/

// ハイドレーション前は pre-hydration クラスを付与し、
// v-main の --v-layout-top を CSS で 64px に固定する。
// ハイドレーション完了後にクラスを除去し、Vuetify のレイアウトシステムに委譲する。
const hydrated = ref(false);
onMounted(() => {
  hydrated.value = true;
});
</script>
<template>
  <div :class="{ 'pre-hydration': !hydrated }">
    <NuxtLayout>
      <!-- <NuxtLoadingIndicator color="#E64A19" :height="5" /> -->
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
