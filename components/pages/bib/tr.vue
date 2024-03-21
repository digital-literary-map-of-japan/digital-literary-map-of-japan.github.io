<script setup lang="ts">
import type { ResourceObject as Data } from "~/types/jsonapi";

interface PropType {
  item: Data;
  included: Data[];
  bib?: boolean;
}

interface Link {
  text: string;
  url: string;
}

const props = withDefaults(defineProps<PropType>(), {
  item: () => ({} as Data),
  included: () => [] as Data[],
  bib: () => true,
});

const localePath = useLocalePath();

const links = computed(() => {
  const included = props.included;

  if (!included) {
    return [];
  }
  const relationships = props.item.relationships;

  if (!relationships) {
    return [];
  }

  const data = relationships.field_waibusaitourl.data;

  if (!data) {
    return [];
  }

  if (!Array.isArray(data)) {
    return [];
  }

  const links_: Link[] = [];

  for (let item of data) {
    const id = item.id;

    const included_ = included.find((item) => item.id === id);

    if (!included_) {
      continue;
    }

    const url = included_.attributes?.field_url.uri;

    links_.push({
      text: `外部サイト ${links_.length + 1}`,
      url,
    });
  }

  return links_;
});
</script>
<template>
  <tr>
    <td>
      {{ item.attributes?.field_shuzhiqingbao_shumingjuans }}
    </td>
    <td>
      {{ item.attributes?.field_shuzhiqingbao_bianzhezhesh }}
    </td>

    <td>
      {{ item.attributes?.field_shuzhiqingbao_shuxiechuban }}
    </td>

    <td>
      {{ item.attributes?.field_shuzhiqingbao_ceshu }}
    </td>

    <td>
      {{ item.attributes?.field_shuzhiqingbao_suozangjigua }}
    </td>

    <td>
      {{ item.attributes?.field_shuzhiqingbao_qingqiujihao }}
    </td>

    <td>
      <ul>
        <li v-for="link in links">
          <a :href="link.url" target="_blank">{{ link.text }}</a>
        </li>
      </ul>
    </td>
    <td>
      <ul>
      <li v-if="bib">
        <nuxt-link :to="localePath({ name: 'basic-id', params: { id: item.attributes?.field_id } })">
          詳細目録
        </nuxt-link>
      </li>
      <li>
      <nuxt-link :to="localePath({ name: 'item-id', params: { id: item.attributes?.field_id } })">
        書誌詳細
      </nuxt-link>
    </li>
    </ul>
    </td>
  </tr>
</template>
