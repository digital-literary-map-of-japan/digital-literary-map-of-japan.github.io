import { headConfig } from "./meta.config";
import fixVitePath from "./vite-plugins/fix-vite-path.js";
import fs from "fs";
import path from "path";

import legends from "./assets/js/data.js";

const baseURL = process.env.BASE_URL || "";
const origin = process.env.ORIGIN || "";
const appURL = origin + baseURL;

const publicRuntimeConfig = {
  token: "",
  siteName: headConfig.siteName,
  origin,
  baseURL,
  appURL,
  legends,
};

// ローカルJSONからスポットデータを読み込む
const loadLocalSpots = () => {
  const spotsPath = path.resolve(__dirname, "./public/data/jsonapi/node/spots.json");
  if (fs.existsSync(spotsPath)) {
    return JSON.parse(fs.readFileSync(spotsPath, "utf-8"));
  }
  return { data: [] };
};

const getRoutes: any = async () => {
  const routes: string[] = [];

  const spotsData = loadLocalSpots();

  for (const item of spotsData.data) {
    const id = item.attributes.field_id;
    routes.push(`/spots/${id}`);
    routes.push(`/en/spots/${id}`);
  }

  return routes;
};

export default defineNuxtConfig({
  runtimeConfig: {
    public: publicRuntimeConfig,
  },

  typescript: {
    typeCheck: false,
    strict: true,
  },

  modules: [
    "@nuxtjs/i18n",
    "nuxt-jsonld",
    "@nuxtjs/leaflet",
    "nuxt-gtag",
    "@nuxtjs/sitemap",
  ],

  gtag: {
    id: "G-587Z7D7T5S",
  },

  sitemap: {
    exclude: ["/static/404.html", "/static/500.html"],
    async routes() {
      return await getRoutes();
    },
  },

  i18n: {
    locales: [
      { code: "ja", language: "ja_JP", file: "ja.js" },
      { code: "en", language: "en-US", file: "en.js" },
    ],
    defaultLocale: headConfig.lang,
    // trailingSlash: true,
    detectBrowserLanguage: false,
    bundle: {
      optimizeTranslationDirective: false, // 警告を解消
    },
  },

  app: {
    baseURL,
    head: {
      htmlAttrs: {
        lang: headConfig.lang,
      },
      title: headConfig.siteName,
      meta: [
        { charset: "utf-8" },
        { "http-equiv": "x-ua-compatible", content: "ie=edge" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "format-detection",
          content: "telephone=no, email=no, address=no",
        },
        // SEO関連
        { name: "description", content: headConfig.description },
        { name: "keywords", content: headConfig.keywords },
        { property: "og:type", content: "website" },
        { property: "og:url", content: appURL },
        { property: "og:title", content: headConfig.siteName },
        {
          property: "og:description",
          content: headConfig.description,
        },
        {
          property: "og:image",
          content: `${appURL}${headConfig.image}`,
        },
        {
          property: "og:locale",
          content: "ja_JP",
        },
        { name: "twitter:card", content: "summary" },
      ],
    },
  },

  css: ["vuetify/lib/styles/main.sass", "@/assets/styles/main.css"],

  build: {
    transpile: ["vuetify"],
  },

  vite: {
    define: {
      "process.env.DEBUG": false,
    },
    plugins: [fixVitePath()],
  },

  nitro: {
    prerender: {
      crawlLinks: true,
    },
  },

  site: {
    url: appURL,
    // trailingSlash設定を削除（Viteエラー対策）
  },

  hooks: {
    async "nitro:config"(nitroConfig: any) {
      if (nitroConfig.dev) {
        return;
      }

      const spotsData = loadLocalSpots();

      if (nitroConfig.prerender?.routes === undefined) {
        return;
      }

      spotsData.data.map((mount: any) => {
        nitroConfig.prerender?.routes?.push(
          `/spots/${mount.attributes.field_id}`
        );

        nitroConfig.prerender?.routes?.push(
          `/en/spots/${mount.attributes.field_id}`
        );
      });
    },
  },

  experimental: {
    // trailingSlash設定を削除（Viteエラー対策）
  },

  compatibilityDate: "2024-07-22",
} as any);
