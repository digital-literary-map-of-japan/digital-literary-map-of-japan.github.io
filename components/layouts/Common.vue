<script setup lang="ts">
interface PropType {
  title: string;
  items?: any[];
  fluid?: boolean;
  sub?: string;
}

withDefaults(defineProps<PropType>(), {
  title: () => "",
  items: () => [],
  fluid: () => false,
  sub: "",
});
</script>
<template>
  <div>
    <ClientOnly>
      <LayoutsBreadCrumbs
        v-if="items.length > 0"
        :items="items"
      ></LayoutsBreadCrumbs>
    </ClientOnly>
    <v-container class="mt-5 mb-10" :fluid="fluid === true">
      <div class="mb-5 text-center">
        <h1 style="color: #990500">{{ title }}</h1>
        <p v-if="sub">{{ sub }}</p>
      </div>
      <slot></slot>
    </v-container>
  </div>
</template>
