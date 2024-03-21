<script setup lang="ts">
import UrlParamsConverter from "~/utils/filter";
import type { FilterInput, Facet } from "~/types/search";
import { mdiClose } from "@mdi/js";

const route = useRoute();

interface PropType {
  // buckets: Bucket[];
  label: string;
  id: string;
  value: Facet;
}

const props = withDefaults(defineProps<PropType>(), {
  // buckets: () => [],
  label: "",
  id: "",
  value: () => ({} as Facet),
});

const targetValues = computed(() => {
  return getTargetValues();
});

const getCurrentQuery = () => {
  const queryString = route.fullPath.split("?")[1];
  const queryObject = UrlParamsConverter.urlParamsToObject(queryString);
  return queryObject;
};

let getTargetValues = () => {
  const targetValues = {
    in: [] as string[],
    nin: [] as string[],
  };
  const queryObject = UrlParamsConverter.fullPathToNestedObject(route.fullPath);
  const filter: FilterInput = queryObject.filter as FilterInput;
  if (typeof filter === "object") {
    for (const filterId in filter) {
      const values = filter[filterId].split(",");

      if (filterId === `${props.id}.in`) {
        targetValues.in = values;
      } else if (filterId === `${props.id}.nin`) {
        targetValues.nin = values;
      }

      /*
      if (
        typeof filter[filterId] === "object" &&
        filter[filterId]?.condition?.path === props.id &&
        ["in", "nin"].includes(String(filter[filterId]?.condition?.operator))
      ) {
        const condition = filter[filterId].condition;
        const value = condition?.value;
        const operator = condition?.operator;
        if (typeof value === "object") {
          for (const key in value as object) {
            const v = value[key];
            if (operator === "in") {
              targetValues.in.push(v);
            } else if (operator === "nin") {
              targetValues.nin.push(v);
            }
          }
        }
      }
      */
    }
  }
  return targetValues;
};

const refine = (key: string, operator: "in" | "nin" = "in") => {
  const currentTargetValues = JSON.parse(JSON.stringify(targetValues.value));
  const opValues = currentTargetValues[operator];
  if (opValues.includes(key)) {
    opValues.splice(opValues.indexOf(key), 1);
  } else {
    opValues.push(key);
  }
  const filters: { [key: string]: any } = {};
  for (const operator in currentTargetValues) {
    const values: { [key: number]: string } = {};
    const newValues = currentTargetValues[operator];
    if (newValues.length === 0) {
      continue;
    }
    for (let i = 0; i < newValues.length; i++) {
      values[i] = newValues[i];
    }

    filters[`${props.id}.${operator}`] = newValues.join(",");
  }

  const currentQuery = getCurrentQuery();

  if (currentQuery.filter === undefined) {
    currentQuery.filter = {};
  }

  const filter: FilterInput = currentQuery.filter as FilterInput;

  // 削除
  for (const filterId in filter) {
    if (filterId === `${props.id}.in`) {
      const values = filter[filterId].split(",");
      const newValues = values.filter((v: string) => {
        return v !== key;
      });
      if (newValues.length === 0) {
        delete filter[filterId];
      } else {
        filter[filterId] = newValues.join(",");
      }
    }
  }

  for (const filterId in filters) {
    filter[filterId] = filters[filterId];
  }

  const flatObject = UrlParamsConverter.objectToFlatObject(currentQuery);

  delete flatObject["page[offset]"];

  const router = useRouter();
  const localePath = useLocalePath();
  const route = useRoute();
  router.push(
    localePath({
      path: route.path,
      query: flatObject,
    })
  );
};

const isMinus = ref(false);

const emits = defineEmits<{ (e: string): void }>();

const close = () => {
  emits("close");
};

const {t} = useI18n();

const fixLabel = (label: string) => {
  if (label === "1") {
    return t("yes");
  } else if (label === "0") {
    return t("no");
  }
  return label;
};
</script>
<template>
  <v-card variant="outlined">
    <div class="d-flex bg-sub pa-1">
      <div class="me-auto px-2">
        {{ label }}
      </div>
      <div>
        <v-btn size="small" variant="text" @click="close()">
          <v-icon>{{ mdiClose }}</v-icon>
        </v-btn>
      </div>
    </div>

    <template v-if="!value.terms">
      <div class="text-center pa-4">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>
    </template>

    <template v-else>
      <v-card-text class="d-flex flex-wrap">
        <template v-for="(item, j) in value.terms">
          <div class="mr-4 mb-2" v-if="(targetValues.in.length === 0 || value.terms.length < 20 || item.values.active === true)">
            <div style="cursor: pointer" @click="refine(item.values.value)">
              {{ fixLabel(item.values.label) }}
            </div>

            <v-divider
              :thickness="!item.values.active ? 1 : 2"
              class="border-opacity-100"
              :color="
                !item.values.active ? 'sub' : isMinus ? 'error' : 'primary'
              "
            ></v-divider>

            {{ item.values.count }}
          </div>
        </template>
      </v-card-text>
    </template>
    <template v-if="false">
      <v-divider></v-divider>
      <v-card-actions class="bg-sub py-0" style="min-height: 26px">
        <v-btn variant="text" color="primary">{{
          $t("すべての選択肢を表示")
        }}</v-btn>

        <v-spacer></v-spacer>

        <!-- 
            inset -->

        <v-switch
          style="justify-items: end"
          v-model="isMinus"
          hide-details
          color="error"
          density="compact"
          inset
          :label="`除外条件を指定`"
        ></v-switch>

        <!--

          <v-switch
            style="justify-content: flex-end"
            class="justify-end"
            v-model="model"
            hide-details
            color="red-darken-3"
            density="compact"
            inset
            :label="`除外条件を指定`"
          ></v-switch>
          -->
      </v-card-actions>
    </template>
  </v-card>
</template>
<style scoped>
.v-switch--inset .v-switch__track {
  height: 32px;
}
</style>
