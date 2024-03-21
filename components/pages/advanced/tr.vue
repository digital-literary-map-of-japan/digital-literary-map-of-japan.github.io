<script setup lang="ts">
import type { ResourceObject as Data, ResourceObject } from "~/types/jsonapi";
import { getManifestUrlFromId, hasMedia } from "~/utils/iiif";

interface PropType {
  item: Data;
  included?: ResourceObject[];
}

const props = withDefaults(defineProps<PropType>(), {
  item: () => ({} as Data),
  included: () => [] as ResourceObject[],
});

const localePath = useLocalePath();

const basic = computed(() => {
  const included = props.included;

  if (!included) {
    return null;
  }

  const b = props.item.relationships?.field_shumingmulu.data as ResourceObject;

  if (!b) {
    return null;
  }

  const id = b.id;

  const item = included.find((item: ResourceObject) => {
    return item.id === id;
  });

  if (!item) {
    return null;
  }

  const title = item.attributes?.title;

  const cn = item.attributes?.field_shuzhiqingbao_qingqiujihao;

  return {
    title,
    // id,
    id: item.attributes?.field_id,
    cn,
  };
});
</script>
<template>
  <tr>
    <td v-if="basic">
      <nuxt-link
        :to="localePath({ name: 'basic-id', params: { id: basic.id } })"
      >
        {{ basic.title }}
      </nuxt-link>
      {{ basic.cn }}
    </td>
    <td>
      {{ item.attributes?.field_zhelushixiang_ceci }}
    </td>
    <td>
      {{ item.attributes?.field_zhelushixiang_zheluneirong }}
    </td>
    <td>
      {{ item.attributes?.field_zhelushixiang_dingshu }}
    </td>
    <td>
      {{ item.attributes?.field_zhelushixiang_beikao_qianz }}
    </td>
    <td>
      <template v-if="hasMedia(item)">
        <common-iiif-icon
          width="30px"
          :url="getManifestUrlFromId(item.id)"
        ></common-iiif-icon>
      </template>
    </td>
  </tr>
</template>
