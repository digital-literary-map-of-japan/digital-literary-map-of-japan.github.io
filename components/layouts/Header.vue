<script setup lang="ts">
import { mdiBook, mdiMenu } from "@mdi/js";

const localePath = useLocalePath();

const { isAdmin, user } = useSettings();

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
];

const i18n = useI18n();
const changeLocale = (locale: string) => {
  i18n.setLocale(locale);
};

onMounted(() => {
  user.value = sessionStorage.getItem("user") || "";
  if (user.value) {
    isAdmin.value = true;
  }
});

const logout = () => {
  sessionStorage.setItem("user", "");
  isAdmin.value = false;
  user.value = "";
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
        >
          <v-icon>{{ mdiBook }}</v-icon>
        </v-btn>

        <v-btn icon @click.stop="drawer = !drawer">
          <v-icon>{{ mdiMenu }}</v-icon>
        </v-btn>
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary location="right">
      <v-list class="text-center">
        <v-list-item>{{ $t("Menu") }}</v-list-item>

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

        <v-list-item @click="changeLocale('ja')" :active="$i18n.locale === 'ja'"
          >日本語</v-list-item
        >
        <v-list-item @click="changeLocale('en')" :active="$i18n.locale === 'en'"
          >English</v-list-item
        >

        <template v-if="true">
          <v-divider class="my-2"></v-divider>

          <template v-if="isAdmin">
            <v-list-item>{{ user }}</v-list-item>
            <v-list-item @click="logout">{{ $t("Logout") }}</v-list-item>
          </template>

          <template v-else>
            <v-list-item :to="localePath({ name: 'login' })">{{
              $t("Login")
            }}</v-list-item>
          </template>
        </template>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>
