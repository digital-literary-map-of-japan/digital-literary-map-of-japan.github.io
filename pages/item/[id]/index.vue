<script setup lang="ts">
import type { JsonApiItem, ResourceObject } from "~/types/jsonapi";
import { getManifestUrlFromId, hasMedia } from "~/utils/iiif";

const route = useRoute();
const id = route.params.id;

let json = {
  data: {},
} as JsonApiItem;

try {
  const res = await fetch(
    // `https://toyobunko-lab.jp/cbc/jsonapi/node/bib_1/${id}?include=field_xiangxiqingbaoxiangmu1,field_xiangxiqingbaoxiangmu2`
    `https://toyobunko-lab.jp/cbc/jsonapi/node/bib_1?include=field_xiangxiqingbaoxiangmu1,field_xiangxiqingbaoxiangmu2&filter[field_id]=${id}`
  );
  const json_ = await res.json();
  json = {
    ... json_,
    data: json_.data[0]
  }
} catch (e) {
  console.error(e);
}

const detail1 = computed(() => {
  let res: Record<string, any> = {};

  if (!json.data) return res;

  if (!json.data.relationships) return res;

  const details = json.data.relationships.field_xiangxiqingbaoxiangmu1
    .data as ResourceObject[];
  if (details.length === 0) return {};

  const idDetail1 = details[0].id;

  const included = json.included;

  if (!included) return res;

  const detail1 = included.find((item: ResourceObject) => {
    return item.id === idDetail1;
  });

  if (!detail1) return res;

  return detail1.attributes;
});

const fields2 = [
  {
    text: "文言",
    value: "field_wenyan",
  },
  {
    text: "形状",
    value: "field_xingzhuang",
  },
  {
    text: "所在",
    value: "field_suozai",
  },
  {
    text: "備考",
    value: "field_beikao",
  },
];

const detail2 = computed(() => {
  const items: Record<string, ResourceObject[]> = {
    刊記: [],
    "奥付・識語": [],
  };

  if (!json.data) return items;

  if (!json.data.relationships) return items;

  const value = json.data.relationships.field_xiangxiqingbaoxiangmu2;

  if (!value) return items;

  const details = value.data;

  if (!Array.isArray(details)) return items;

  if (details.length === 0) return items;

  const included = json.included;

  if (!included) return items;

  for (let item of details) {
    const id = item.id;

    const included_ = included.find((item: ResourceObject) => item.id === id);

    if (!included_) {
      continue;
    }

    const type = included_.attributes?.field_zhongbie;

    if (!type) {
      continue;
    }

    if (!items[type]) items[type] = [];

    items[type].push(included_);
  }

  return items;
});

const fields = [
  {
    text: "版式",
    value: [
      {
        text: "匡郭",
        value: "field_banshi_kuangguo",
      },
      {
        text: "匡郭備考",
        value: "field_banshi_kuangguobeikao",
      },
      {
        text: "寸法（横）",
        value: "field_banshi_cunfa_heng_",
      },
      {
        text: "寸法（縦）",
        value: "field_banshi_cunfa_zong_",
      },
      {
        text: "寸法備考",
        value: "field_banshi_cunfabeikao",
      },
      {
        text: "界線",
        value: "field_banshi_jiexian",
      },
      {
        text: "界線備考",
        value: "field_banshi_jiexianbeikao",
      },
      {
        text: "行数",
        value: "field_banshi_xingshu",
      },
      {
        text: "行数備考",
        value: "field_banshi_xingshubeikao",
      },
      {
        text: "字数",
        value: "field_banshi_zishu",
      },
      {
        text: "字数備考",
        value: "field_banshi_zishubeikao",
      },
      {
        text: "注文書式",
        value: "field_banshi_zhuwenshushi",
      },
      {
        text: "注・点・図等",
        value: "field_banshi_zhudiantudeng",
      },
      {
        text: "注・点・図等備考",
        value: "field_banshi_zhudiantudengbeikao",
      },
      {
        text: "魚尾",
        value: "field_banshi_yuwei",
      },
      {
        text: "魚尾備考",
        value: "field_banshi_yuweibeikao_",
      },
      {
        text: "口",
        value: "field_banshi_kou",
      },
      {
        text: "口備考",
        value: "field_banshi_koubeikao",
      },

      {
        text: "版心題",
        value: "field_banshi_banxinti",
      },
      {
        text: "版心備考",
        value: "field_banshi_banxinbeikao",
      },
      {
        text: "封面・見返し",
        value: "field_banshi_fengmianjianfanshi",
      },

      {
        text: "表紙備考（原表紙等）",
        value: "field_banshi_biaozhibeikao_yuanbiaozhideng_",
      },
      {
        text: "題簽",
        value: "field_banshi_tiqian",
      },
      {
        text: "題簽備考",
        value: "field_banshi_tiqianbeikao",
      },
    ],
  },
  {
    text: "刊記",
    value: []
  },
  {
    text: "奥付・識語",
    value: []
  },
  {
    text: "書入",
    value: [
      {
        text: "表紙",
        value: "field_shuru_biaozhi",
      },
      {
        text: "書根",
        value: "field_shuru_shugen",
      },
      {
        text: "書背",
        value: "field_shuru_shubei",
      },
      {
        text: "本文",
        value: "field_shuru_benwen",
      },
    ],
  },
  {
    text: "冊数",

    value: [
      {
        text: "備考",
        value: "field_ceshu_beikao",
      },
    ],
  },
  {
    text: "",
    type: "flat",
    value: [
      {
        text: "印記",
        value: "field_field_yinji",
      },
    ],
  },
  {
    text: "",
    type: "flat",
    value: [
      {
        text: "特記事項",
        value: "field_tejishixiang",
      },
    ],
  },
];

const localePath = useLocalePath();
const { t } = useI18n();

const title = computed(() => {
  if (!json.data) return "";

  return json.data.attributes?.title;
});

const bh = [
  {
    title: t("top"),
    disabled: false,
    to: localePath({ name: "index" }),
  },
  {
    title: t("書名目録"),
    disabled: false,
    to: localePath({ name: "basic" }),
  },
  {
    title: title.value, 
    disabled: false,
  }
];


</script>
<template>
  <LayoutsCommon :title="title" :items="bh">
    <v-table density="compact">
      <tbody>
        <template v-for="group in fields">
          <!-- 「刊記」「奥付・識語」の場合 -->
          <template v-if="Object.keys(detail2).includes(group.text)">
            <template v-for="item in detail2[group.text]">
              <tr v-for="(field, i) in fields2">
                <th
                  :rowspan="fields2.length"
                  v-if="i === 0"
                  style="width: 20%; border: 1px solid"
                >
                  {{ group.text }}
                </th>
                <td style="width: 20%; border: 1px solid">
                  {{ field.text }}
                </td>
                <td style="width: 40%; border: 1px solid">
                  {{ item.attributes?.[field.value] }}
                </td>
                <td
                  style="width: 20%; border: 1px solid"
                  :rowspan="fields2.length"
                  v-if="i === 0"
                  class="text-center"
                >
                  <template v-if="hasMedia(item)">
                    <common-iiif-icon
                      :url="getManifestUrlFromId(item.id)"
                    ></common-iiif-icon>
                  </template>
                </td>
              </tr>
            </template>
          </template>
          <template v-else>
            <tr v-for="(field, i) in group.value">
              <th
                style="width: 20%; border: 1px solid"
                :rowspan="group.value.length"
                v-if="i === 0 && group.type !== 'flat'"
              >
                {{ group.text }}
              </th>
              <th
                :colspan="group.type === 'flat' ? 2 : 1"
                style="width: 20%; border: 1px solid"
              >
                {{ field.text }}
              </th>
              <td style="width: 60%; border: 1px solid" colspan="2">
                <template v-if="detail1?.[field.value]">
                  {{ detail1[field.value] }}
                </template>
              </td>
            </tr>
          </template>
        </template>
      </tbody>
    </v-table>
  </LayoutsCommon>
</template>
<style scoped>
td {
  word-break: break-all;
}
</style>
