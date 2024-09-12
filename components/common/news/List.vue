<script setup lang="ts">
// const items = await queryContent("/news/").sort({date: -1}).find();

interface PropType {
  size?: number;
}

const props = withDefaults(defineProps<PropType>(), {
  size: () => -1,
});

/*
let url = "https://toyobunko-lab.jp/cbc/jsonapi/node/fodianshuzhidb_ozhirase?sort=-created";

if (props.size > 0) {
 url += `&page[limit]=${props.size}`;
}

const res = await fetch(url)
const json = await res.json()
*/

const localePath = useLocalePath();

const convertDate = (isoDateString: string) => {
  const date = new Date(isoDateString);
  // ユーザーのローカルタイムゾーンに合わせて日時を表示
  const localDateString = date.toLocaleString().split(" ")[0];
  return localDateString;
};
</script>
<template>
  <div class="py-0">
    <template v-for="(item, key) in [] /*json.data*/">
      <!--
      <v-list-item
        :to="localePath({ name: 'news-slug', params: { slug: item.id } })"
      >
        
        <v-list-item-title
          >{{ convertDate(item.attributes.created) }}
          {{ item.attributes.title }}</v-list-item-title
        >
      </v-list-item>
      -->
      <v-divider></v-divider>
    </template>
  </div>
</template>
