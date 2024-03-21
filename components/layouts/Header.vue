<script setup lang="ts">
import { mdiBook, mdiMenu, mdiOpenInNew } from "@mdi/js";

interface Menu {
  key: string;
  children: {
    to?: any;
    href?: string;
    target?: string;
    label: string;
  }[];
}

const localePath = useLocalePath();

const drawer = ref(false);

const appConfig = useAppConfig();
const menus: Menu[] = appConfig.menus2;

const isSearch = ref(false);

const { t } = useI18n();

const menuList = [
  {
    text: t("Home"),
    to: {
      name: "index",
    },
  },
  {
    text: t("Literary Places"),
    to: {
      name: "spots",
    },
  },
  {
    text: t("Resources"),
    to: {
      name: "resources-documents",
    },
  },
  {
    text: t("Contact"),
    to: {
      name: "contact",
    },
  },
];
</script>

<template>
  <v-navigation-drawer v-model="drawer" temporary location="right">
    <v-list class="text-center">
      <v-list-item>メニュー</v-list-item>

      <v-divider class="my-2"></v-divider>

      <v-list-item
        v-for="child in menuList"
        :to="child.to ? localePath(child.to) : ''"
        exact
        link
      >
        {{ $t(child.text) }}
      </v-list-item>

      <v-divider class="my-2"></v-divider>
    </v-list>
  </v-navigation-drawer>

  <v-app-bar color="#2b3e50" flat :absolute="true">
    <nuxt-link
      v-if="!isMobile"
      :to="localePath({ name: 'index' })"
      class="mr-2"
    >
      <img
        height="55px"
        width="55px"
        style="filter: invert(1)"
        contain
        src="/img/logo.png"
      />
    </nuxt-link>

    <v-toolbar-title style="font-variant: small-caps">
      <nuxt-link
        style="color: inherit; text-decoration: inherit"
        :to="localePath({ name: 'index' })"
      >
        {{ $t("Digital Literary Map of Japan") }}</nuxt-link
      ></v-toolbar-title
    >

    <v-spacer />

    <v-btn
      href="https://digital-literary-maps.github.io/userguide/"
      target="_blank"
      icon
      color="success"
    >
      <v-icon>{{ mdiBook }}</v-icon>
    </v-btn>

    <v-btn icon @click.stop="drawer = !drawer">
      <v-icon>{{ mdiMenu }}</v-icon>
    </v-btn>

    <client-only v-if="false">
      <template v-if="isSearch">
        <CommonHeaderSearchForm
          @close="isSearch = false"
        ></CommonHeaderSearchForm>
      </template>

      <template v-else>
        <v-app-bar-title>
          <nuxt-link
            :to="localePath({ name: 'index' })"
            style="text-decoration: none; color: inherit"
          >
            {{ $config.public.siteName }}
          </nuxt-link>
        </v-app-bar-title>

        <!--

        <CommonHeaderSearch @close="isSearch = true"></CommonHeaderSearch>

        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

        -->
      </template>
    </client-only>
  </v-app-bar>
</template>
