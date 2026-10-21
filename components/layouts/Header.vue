<script setup lang="ts">
import { mdiBook, mdiMenu } from "@mdi/js";

const localePath = useLocalePath();

const drawer = ref(false);

const menuList = [
  {
    text: "Home",
    to: {
      name: "index",
    },
  },
  {
    text: "Literary Places",
    to: {
      name: "spots",
    },
  },
  {
    text: "Resources",
    to: {
      name: "resources",
    },
  },
  {
    text: "Contact",
    to: {
      name: "contact",
    },
  },
  {
    text: "dataset",
    to: {
      name: "dataset",
    },
  },
];

const i18n = useI18n();
const changeLocale = (locale: "ja" | "en") => {
  i18n.setLocale(locale);
};
</script>

<template>
  <div>
    <v-app-bar color="#2b3e50" flat :absolute="true">
      <v-toolbar-title style="font-variant: small-caps">
        <nuxt-link
          style="color: inherit; text-decoration: inherit"
          :to="localePath({ name: 'index' })"
        >
          {{ $t("Digital Literary Map of Japan") }}</nuxt-link
        ></v-toolbar-title
      >

      <template v-slot:append>
        <v-btn
          href="https://digital-literary-maps.github.io/userguide/"
          target="_blank"
          icon
          color="success"
          aria-label="User guide"
        >
          <v-icon>{{ mdiBook }}</v-icon>
        </v-btn>

        <v-btn icon @click.stop="drawer = !drawer" aria-label="Menu">
          <v-icon>{{ mdiMenu }}</v-icon>
        </v-btn>
      </template>
    </v-app-bar>

    <client-only>
      <v-navigation-drawer v-model="drawer" temporary location="right">
        <nav class="text-center" aria-label="Navigation menu">
        <v-list>
          <v-list-item>{{ $t("Menu") }}</v-list-item>
        </v-list>

        <v-divider class="my-2"></v-divider>

        <v-list role="menu">
          <v-list-item
            v-for="child in menuList"
            :to="child.to ? localePath(child.to) : ''"
            exact
            link
            role="menuitem"
          >
            {{ $t(child.text) }}
          </v-list-item>
        </v-list>

        <v-divider class="my-2"></v-divider>

        <v-list role="menu">
          <v-list-item @click="changeLocale('ja')" :active="$i18n.locale === 'ja'" role="menuitem"
            >日本語</v-list-item
          >
          <v-list-item @click="changeLocale('en')" :active="$i18n.locale === 'en'" role="menuitem"
            >English</v-list-item
          >
        </v-list>
      </nav>
    </v-navigation-drawer>
  </client-only>
  </div>
</template>
