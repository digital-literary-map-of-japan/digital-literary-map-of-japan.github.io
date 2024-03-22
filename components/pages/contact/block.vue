<script setup lang="ts">
// interface
interface PropType {
  item: any;
}

const props = withDefaults(defineProps<PropType>(), {
  item: () => ({}),
});

const value = props.item.data.attributes.body.value;

//
const id = props.item.data.attributes.drupal_internal__nid;
</script>
<template>
  <CommonBlockEdit :id="id">
    <span v-html="value"></span>
  </CommonBlockEdit>
</template>
