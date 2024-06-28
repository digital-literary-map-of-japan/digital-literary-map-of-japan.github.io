import { headConfig } from "./meta.config";
// import { getIds } from "./utils/routes";
import axios from "axios";

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

const getRoutes: any = async () => {
  const routes: string[] = [];

  /*

  const ids = await getIds();

  for (const id of ids) {
    const path = `/item/${id}`;
    routes.push(path);
    routes.push(`/en/item/${id}`);
    routes.push(`/basic/${id}`);
    routes.push(`/en/basic/${id}`);
  }

  */

  const url = "https://drupal.aws.ldas.jp/dlm/";

  const endpoint = `${url}jsonapi/node/spots`;

  const { data }: { [data: string]: any } = await useFetch(endpoint);

  for (const item of data.value.data) {
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
    "nuxt3-leaflet",
    "nuxt-gtag",
    "@nuxtjs/sitemap",
    // "@sidebase/nuxt-auth",
  ],
  sitemap: {
    // path: "/sitemap.xml",
    // hostname: appURL,
    exclude: ["/static/404.html", "/static/500.html"],
    async routes() {
      return await getRoutes();
    },
  },
  i18n: {
    locales: [
      { code: "ja", iso: "ja_JP", file: "ja.js" },
      { code: "en", iso: "en-US", file: "en.js" },
    ],
    langDir: "locales/",
    defaultLocale: headConfig.lang,
    lazy: true,
  },
  app: {
    baseURL,
    head: {
      htmlAttrs: {
        lang: headConfig.lang,
      },
      title: headConfig.siteName,
      script: [
        {
          src: "/js/redirect.js",
          defer: true,
        },
      ],
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
        // ogp関連
        /*
        {
          property: "og:site_name",
          content: headConfig.siteName,
        },
        */
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
      link: [
        /*
        {
          rel: "icon",
          type: "image/x-icon",
          href: `${appURL}${headConfig.favicon}`,
        },
        */
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
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      concurrency: 1,
    },
  },
  site: {
    url: appURL,
    trailingSlash: true,
  },
  hooks: {
    async "nitro:config"(nitroConfig: any) {
      if (nitroConfig.dev) {
        return;
      }

      const res = await axios.get(
        "https://drupal.aws.ldas.jp/dlm/jsonapi/node/spots"
      );

      if (nitroConfig.prerender?.routes === undefined) {
        return;
      }

      res.data.data.map((mount: any) => {
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
    defaults: {
      nuxtLink: {
        trailingSlash: "append",
      },
    },
  },
} as any);
