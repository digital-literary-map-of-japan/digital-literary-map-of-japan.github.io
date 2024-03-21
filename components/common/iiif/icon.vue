<script setup lang="ts">
interface PropType {
  url: string;
  width?: string;
}

const props = withDefaults(defineProps<PropType>(), {
  url: () => "",
  width: () => "45px",
});

const getUrl = (url: string) => {
  return `https://mirador.cultural.jp/?manifest=${url}`;
};
</script>
<template>
  <a :href="getUrl(url)" target="_blank">
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/e/e8/International_Image_Interoperability_Framework_logo.png"
      :width="width"
    />
  </a>
</template>
