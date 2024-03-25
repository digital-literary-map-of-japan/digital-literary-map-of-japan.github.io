<script setup lang="ts">
// interface
interface PropType {
  attributes: any;
}

const props = withDefaults(defineProps<PropType>(), {
  attributes: () => ({}),
});

const value = props.attributes.body.value;

//
const id = props.attributes.drupal_internal__nid;
</script>
<template>
  <CommonBlockEdit :id="id">
    <span v-html="value" style="word-wrap: break-word"></span>
  </CommonBlockEdit>
</template>
