<script setup lang="ts">
const localePath = useLocalePath();

interface PropType {
  items: any[];
  to?: {
    name: string;
    params?: any;
    query?: any;
  };
  md?: number;
  type?: string;
  slug?: string;
}

const props = withDefaults(defineProps<PropType>(), {
  items: () => [],
  to: () => ({
    name: "item-id",
  }),
  md: 2,
  type: "grid",
  slug: "",
});

const query = {};

const param = props.to.params;

const getItemParam = (id: string) => {
  const param_ = { ...param };
  param_.id = id;
  return param_;
};
</script>
<template>
  <v-row>
    <v-col v-for="item in items" :md="md" cols="6">
      <v-card flat>
        <nuxt-link
          :to="
            localePath({
              name: to.name,
              params: getItemParam(item.id),
              query,
            })
          "
        >
          <v-img
            class="bg-sub"
            :src="
              item.attributes['image']
                ? item.attributes['image'][0]
                : 'https://raw.githubusercontent.com/nakamura196/test2021/main/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-comin.webp'
            "
            :alt="item.attributes.label[0]"
            height="200px"
            contain
          ></v-img>
        </nuxt-link>
        <div class="pa-4">
          <b
            ><nuxt-link
              :to="
                localePath({
                  name: to.name,
                  params: getItemParam(item.id),
                  query,
                })
              "
              >{{ item.attributes.label[0] }}</nuxt-link
            ></b
          >
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>
