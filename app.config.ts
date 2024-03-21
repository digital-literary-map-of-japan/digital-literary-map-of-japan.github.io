import { headConfig } from "./meta.config";

interface RouteItem {
  name: string;
  params?: {
    slug?: string;
    resource?: string;
  };
}

interface Menu {
  label: string;
  to?: RouteItem;
  href?: string;
  target?: string;
  header?: boolean;
}

const menus: Menu[] = [];

function createSortItem(label: string, key: string) {
  return {
    title: label,
    key,
  };
}

export default defineAppConfig({
  top_image_url: "/home.webp",
  menus2: [
    {
      key: headConfig.siteName,
      to: {
        name: "index",
      },
      children: [
        {
          label: "about",
          to: {
            name: "page-slug",
            params: {
              slug: "about",
            },
          },
        },
        {
          label: "news",
          to: {
            name: "news",
          },
        },
      ],
    },
    {
      key: "tools",
      children: [
        {
          label: "書名目録",
          to: {
            name: "basic",
          },
        },
        {
          label: "詳細目録",
          to: {
            name: "advanced",
          },
        },
        /*
        {
          label: "現資料一覧",
          to: {
            name: "source",
          },
        },
        {
          label: "指導要領の評価観点",
          to: {
            name: "slug",
            params: {
              slug: '指導要領の評価観点'
            }
          },
        },
        {
          label: "教材作成者",
          to: {
            name: "cooperation",
          },
        },
        */
      ],
    },
    {
      key: "links",
      children: [
        /*
        {
          label: "RDFストア",
          href: "https://sukilam-educational-metadata.github.io/snorql/",
          target: "_blank",
        },
        {
          label: "データセット",
          href: "https://sukilam-educational-metadata.github.io",
          target: "_blank",
        },
        {
          label: "教材アーカイブ",
          href: "https://adeac.jp/adeac-lab/top/SxUKILAM/index.html",
          target: "_blank",
        },
        */
        {
          label: "『大正新脩大蔵経』底本・校本データベース",
          href: "https://static.toyobunko-lab.jp/taishozo/",
          target: "_blank",
        },
      ],
    },
  ],
  menus,
  advanced: {
    fields: [
      "field_zhelushixiang_beikao_qianz",
      "field_zhelushixiang_zheluneirong",
    ],
    perPageItems: [24, 120, 500],
    defaultSort: "field_sort",
    defaultPerPage: 24,
    sorts: [createSortItem("score", "_score"), createSortItem("ID", "field_sort")],
    aggregations: [
      {
        id: "zhelushixiang_ceci",
        label: "冊次",
      },
      {
        id: "facet_zhelushixiang_zheluneirong",
        label: "著録内容",
      },
      {
        id: "has_image",
        label: "画像",
      },
    ],
  },
  default: {
    fields: [
      "field_shuzhiqingbao_shumingjuans",
      "field_shuzhiqingbao_suozangjigua",
      "field_shuzhiqingbao_shuxiechuban",
      "field_shuzhiqingbao_bianzhezhesh",
      //
      "field_xingzhuang",
      "field_suozai",
    ],
    perPageItems: [24, 120, 500],
    defaultSort: "field_sort",
    defaultLayout: "advanced",
    defaultPerPage: 24,
    sorts: [createSortItem("score", "_score"), createSortItem("ID", "field_sort")],
    modes: [],
    aggregations: [
      {
        id: "shuzhiqingbao_shumingjuanshu",
        label: "書誌情報:書名・巻数",
      },
      {
        id: "shuzhiqingbao_bianzhezheshixiang",
        label: "書誌情報:編著者事項",
      },
      {
        id: "shuzhiqingbao_shuxiechubanshixiang",
        label: "書誌情報:書写・出版事項",
      },
      {
        id: "shuzhiqingbao_suozangjiguan",
        label: "書誌情報:所蔵機関",
      },
      {
        id: "shuzhiqingbao_qingqiujihao",
        label: "書誌情報:請求記号",
      },
      {
        id: "xiangxiqingbaoxiangmu2_kontentsu_wenyan",
        label: "詳細情報:文言",
      },
      {
        id: "xiangxiqingbaoxiangmu2_kontentsu_xingzhuang",
        label: "詳細情報:形状",
      },
      {
        id: "xiangxiqingbaoxiangmu2_kontentsu_suozai",
        label: "詳細情報:所在",
      },
      {
        id: "xiangxiqingbaoxiangmu2_kontentsu_has_image",
        label: "画像",
      },
    ],
  },
  search: {
    fuse: {
      options: {
        includeScore: true,
        useExtendedSearch: true,
        threshold: 0.0,
        ignoreLocation: true,
        keys: [
          {
            name: "dcterms:title",
            weight: 100,
          },
          "o:item_set",
          "o:media",
          "抜き取り雑誌記述-雑誌名",
          /*
          "related",
          "説明文",
          "ローマ字",
          "見出し読み",
          "対訳語",
          "時代",
          "出版年",

          "言語",
          "出典",
          "year",
          "著者",
          */
        ],
      },
    },
  },
});
