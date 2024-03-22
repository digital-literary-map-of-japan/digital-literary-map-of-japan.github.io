<script setup lang="ts">
interface PropType {
  id: string | number;
}

withDefaults(defineProps<PropType>(), {
  id: "",
});
</script>
<template>
  <div>
    <div class="text-right">
      <CommonBtnEdit :id="id"></CommonBtnEdit>
    </div>
    <slot></slot>
  </div>
</template>
