<script setup lang="ts">
import { truncate, translate } from "~/utils/search";
import UrlParamsConverter from "~/utils/filter";

import type { AggregationConfig,FilterInput } from "~/types/search";

export interface PropType {
  aggregationConfig: AggregationConfig[];
}

const props = withDefaults(defineProps<PropType>(), {
  aggregationConfig: () => []
});

const router = useRouter();
const route = useRoute();
const localePath = useLocalePath();

const items = computed(() => {
  const queryObject = UrlParamsConverter.urlParamsToObject(
    route.fullPath.split("?")[1]
  );

  // const filter = queryObject.f;
  const filter = queryObject.filter as FilterInput;

  const filterValues: { [key: string]: any } = {};

  const { t } = useI18n();

  if (filter) {
    if (typeof filter === "object") {
      for (let key in filter) {
        // const origin = key.startsWith("adv-") ? "詳細" : "ファセット";
        let fixedKey = key.replace(".in", "");

        props.aggregationConfig.forEach((item) => {
          if (item.id === fixedKey) {
            fixedKey = item.label;
          }
        });

        const value = filter[key];

        if (key.endsWith(".in") || key.endsWith(".nin")) {
          const vs = value.split(",");
          const values: any[] = [];
          for (let v of vs) {
            const fixedValue = String(fix(v));
            values.push({
              value: v,
              label: `${t(fixedKey)}: ${truncate(
                translate(key, fixedValue, t)
              )}`,
              // color: "bg-brown", // "bg-indigo-darken-4"
              color: "bg-black", // "bg-indigo-darken-4"
            });
          }

          filterValues[key] = {
            // path,
            // operator,
            values,
            // minus: ["nin", "ncontains"].includes(operator),
          };
        }
      }
    }
  }

  return filterValues; // filters;
});

const fix = (value: string) => {
  if (value.startsWith("http")) {
    return value.split("/").pop();
  } else {
    return value;
  }
};

const init = () => {
  const query = JSON.parse(JSON.stringify(route.query));

  for (const key in query) {
    if (key.startsWith("filter[") && !key.startsWith("filter[search]")) {
      delete query[key];
    }
  }

  router.push({query});
};

const faceted = (targetValue: string, key: string) => {
  const queryString = route.fullPath.split("?")[1];
  const queryObject = UrlParamsConverter.urlParamsToObject(queryString);

  const filter = queryObject.filter as FilterInput;

  const values = filter[key].split(",");

  if (values.includes(targetValue)) {
    values.splice(values.indexOf(targetValue), 1);
  } else {
    values.push(targetValue);
  }

  if (Object.keys(values).length === 0) {
    delete filter[key];
  }

  const query = UrlParamsConverter.objectToFlatObject(queryObject);

  delete query[`page[offset]`];

  router.push({
    query
  });
};
</script>
<template>
  <template v-if="Object.keys(items).length > 0">
    <div>
      <template v-for="(filter, key) in items">
        <v-chip
          :key="`${key}-${value}`"
          v-for="value in filter.values"
          class="mr-2 my-1"
          closable
          :class="value.color || (filter.minus ? 'bg-red' : 'bg-blue-grey')"
          @click:close="faceted(value.value, String(key))"
        >
          <!-- 'bg-sub' -->
          <span>{{ value.label }}</span>
        </v-chip>
      </template>

      <v-btn flat variant="text" class="my-1" color="primary" @click="init()">
        {{ $t("clear") }}
      </v-btn>
    </div>
  </template>
</template>
