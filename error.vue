<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode: number;
    message: string;
  };
}>();

const { t } = useI18n();
const localePath = useLocalePath();

const statusCode = props.error?.statusCode || 500;
const is404 = statusCode === 404;

const title = is404
  ? t('Page not found')
  : t('An error occurred');

const message = is404
  ? t('The page you are looking for does not exist.')
  : (props.error?.message || t('An unexpected error occurred.'));

useHead({
  title: `${title} - Digital Literary Map of Japan`,
  meta: [
    { name: 'robots', content: 'noindex' },
  ],
});
</script>
<template>
  <NuxtLayout>
    <v-container class="py-16 text-center">
      <h1 class="text-h2 font-weight-bold mb-4">{{ statusCode }}</h1>
      <p class="text-h5 mb-8">{{ title }}</p>
      <p class="text-body-1 mb-8">{{ message }}</p>
      <v-btn
        color="primary"
        variant="flat"
        :to="localePath({ name: 'index' })"
      >
        {{ $t('top') }}
      </v-btn>
    </v-container>
  </NuxtLayout>
</template>
