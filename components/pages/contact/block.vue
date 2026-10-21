<script setup lang="ts">
// interface
interface PropType {
  attributes: any;
}

const props = withDefaults(defineProps<PropType>(), {
  attributes: () => ({}),
});

// Fix heading order: replace h4/h5/h6 with h3 for proper sequential order
const value = computed(() => {
  const raw = props.attributes.body?.value || '';
  return raw.replace(/<(\/?)h[4-6]([\s>])/gi, '<$1h3$2');
});

//
const id = props.attributes.drupal_internal__nid;
</script>
<template>
  <span v-html="value" style="word-wrap: break-word"></span>
</template>
