<script setup lang="ts">
import { mdiChevronDown } from "@mdi/js";

/*
interface PropType {
  theme: string;
}

const props = withDefaults(defineProps<PropType>(), {
  theme: () => "",
});
*/

const { theme } = useSettings();

const runtimeConfig = useRuntimeConfig();
const app_name = runtimeConfig.app_baseURL;

const changeTheme = (theme_: string) => {
  theme.value = theme_;
  localStorage.setItem(`${app_name}-theme`, theme_);
};
</script>
<template>
  <v-menu offset-y>
    <template v-slot:activator="{ props }">
      <v-btn variant="text" v-bind="props">
        {{ theme === "dark" ? $t("dark") : $t("light") }}
        <v-icon> {{ mdiChevronDown }} </v-icon>
      </v-btn>
    </template>
    <v-card flat>
      <v-list>
        <v-list-item :active="theme === 'dark'" @click="changeTheme('dark')">{{
          $t("dark")
        }}</v-list-item>
        <v-list-item
          :active="theme === 'light'"
          @click="changeTheme('light')"
          >{{ $t("light") }}</v-list-item
        >
      </v-list>
    </v-card>
  </v-menu>
</template>
