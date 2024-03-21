<script setup lang="ts">
const localePath = useLocalePath();

interface PropType {
  items: any[];
  to?: {
    name: string;
    params?: any;
    query?: any;
  }
}

const props = withDefaults(defineProps<PropType>(), {
  items: () => [],
  to: () => ({
    name: "item-id",
  })
});

const query = {};

const param = props.to.params;

const getItemParam = (id: string) => {
  const param_ = { ...param };
  param_.id = id;
  return param_;
};

const convert = (values: string[]) => {
    if(!values) return "";
    if(values.length === 0) return "";
    const value = values[0].split(", ")
    return value.map((value) => value.split("/").pop()).join(", ");
}
</script>
<template>
  <div>
    <v-card variant="outlined" v-for="item in items" class="mb-4">
      <v-row>
        <v-col :md="3" cols="12">
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
              :height="150"
              :src="
                item.attributes['image']
                  ? item.attributes['image'][0]
                  : 'https://raw.githubusercontent.com/nakamura196/test2021/main/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-comin.webp'
              "
            ></v-img>
          </nuxt-link>
        </v-col>
        <v-col :md="9" cols="12">
          <v-card-text>
            <b>
              <nuxt-link
                :to="
                  localePath({
                    name: to.name,
                    params: getItemParam(item.id),
                    query,
                  })
                "
                >{{ item.attributes.label[0] }}</nuxt-link
              >
            </b>

            <div class="mt-4">
              <div class="mt-2" v-for="field in ['workshop', 'school', 'creator']">
                {{ $t(field) }}: {{ convert(item.attributes[field]) }}
              </div>
            </div>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>
