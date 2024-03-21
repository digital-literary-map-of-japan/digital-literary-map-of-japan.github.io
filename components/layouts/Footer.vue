<script setup lang="ts">
import type { Menu } from "~/types";

const appConfig = useAppConfig();
const map: Menu[] = appConfig.menus2;
</script>
<template>
  <v-footer color="#2b3e50" dark>
    <v-col class="text-center" cols="12">
      <!--  py-10 -->
      <small
        >Copyright ©2015-{{ new Date().getFullYear() }} Judit Árokay – Page by
        Leo Born &amp; 21H00506</small
      >
      <br />

      <small
        >Logos and favicon made with
        <a href="https://www.designevo.com/">DesignEvo</a></small
      >
    </v-col>
  </v-footer>
</template>
