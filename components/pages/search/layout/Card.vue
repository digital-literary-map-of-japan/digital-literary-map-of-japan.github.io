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
          <v-card variant="outlined">
            <v-card-text>
              <b>
                <nuxt-link
                  :to="
                    localePath({
                      name: to.name,
                      query: {
                        [`filter[${slug}.in]`]: item.meta?.uri,
                      },
                    })
                  "
                  >{{ item.attributes.label[0] }}</nuxt-link
                >
              </b>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
</template>
