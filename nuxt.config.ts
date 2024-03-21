import { headConfig } from "./meta.config";
import { getIds } from "./utils/routes";

const baseURL = process.env.BASE_URL || "";
const origin = process.env.ORIGIN || "";
const appURL = origin + baseURL;

const publicRuntimeConfig = {
  token: "",
  siteName: headConfig.siteName,
  origin,
  baseURL,
  appURL,
};

const getRoutes = async () => {
  const routes: string[] = [];

  const ids = await getIds();

  for (const id of ids) {
    const path = `/item/${id}`;
    routes.push(path);
    routes.push(`/en/item/${id}`);
    routes.push(`/basic/${id}`);
    routes.push(`/en/basic/${id}`);
  }
  return routes;
};

export default defineNuxtConfig({
  runtimeConfig: {
    // footer: process.env.footer,
    public: publicRuntimeConfig,
  },
  typescript: {
    typeCheck: true,
    strict: true,
  },
  modules: [
    "@nuxtjs/i18n",
    "nuxt-jsonld",
    // "@kgierke/nuxt-basic-auth"
  ],
  /*
  // @ts-ignore
  basicAuth: {
    enabled: true,
    users: [
      {
        username: "admin",
        password: "admin",
      },
    ],
    // Optional: Whitelist routes
    // allowedRoutes: ["/api/.*"],
  },
  */
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
    // baseURL: app_baseURL, // process.env.baseURL, // /<reponame>
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
        // ogp関連
        {
          property: "og:site_name",
          content: headConfig.siteName,
        },
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
        {
          rel: "icon",
          type: "image/x-icon",
          href: `${appURL}${headConfig.favicon}`,
        },
      ],
    },
  },
  css: [
    "vuetify/lib/styles/main.sass",
    // "mdi/css/materialdesignicons.min.css",
    "@/assets/styles/main.css",
  ],

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
      // routes: getRoutes,
      // routes
    },
  },
  hooks: {
    async "nitro:config"(nitroConfig) {
      if (nitroConfig.dev) {
        return;
      }
      // ..Async logic..

      // const routes = await getRoutes();

      // nitroConfig.prerender?.routes?.push(...routes);
    },
  },
});
