<script setup lang="ts">
const localePath = useLocalePath();

interface PropType {
  items: any[];
  to?: {
    name: string;
    params?: any;
    query?: any;
  };
}

const props = withDefaults(defineProps<PropType>(), {
  items: () => [],
  to: () => ({
    name: "item-id",
  }),
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
  <v-table density="compact">
    <thead>
      <tr>
        <th width="25%">{{ $t("title") }}</th>
        <th width="25%">{{ $t("workshop") }}</th>
        <th width="25%">{{ $t("school") }}</th>
        <th width="25%">{{ $t("creator") }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items">
        <td>
          <nuxt-link
            :to="
              localePath({
                name: to.name,
                params: getItemParam(item.id),
                query,
              })
            "
          >
            {{ item.attributes.label[0] }}
          </nuxt-link>
        </td>
        <td>
          {{ convert(item.attributes.workshop) }}
        </td>
        <td>
          {{ convert(item.attributes.school) }}
        </td>
        <td>
          {{ convert(item.attributes.creator) }}
        </td>
      </tr>
    </tbody>
  </v-table>
</template>
