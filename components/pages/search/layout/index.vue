<script setup lang="ts">
interface PropType {
  items: any[];
  to?: {
    name: string;
    params?: any;
    query?: any;
  };
}

const {mode} = useSettings();

withDefaults(defineProps<PropType>(), {
  items: () => [],
  to: () => ({
    name: "item-id",
  }),
});


</script>
<template>
  <div>
    <template v-if="mode === 'grid'">
      <PagesSearchLayoutGrid :items="items" :to="to"></PagesSearchLayoutGrid>
    </template>
    <template v-else-if="mode === 'table'">
      <PagesSearchLayoutTable :items="items" :to="to"></PagesSearchLayoutTable>
    </template>
    <template v-else>
      <PagesSearchLayoutList :items="items" :to="to"></PagesSearchLayoutList>
    </template>
  </div>
</template>
