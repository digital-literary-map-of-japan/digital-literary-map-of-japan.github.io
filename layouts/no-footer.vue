<script setup lang="ts"></script>
<template>
  <v-app>
    <LayoutsHeader> </LayoutsHeader>

    <v-main class="pb-0">
      <slot />
    </v-main>

    <LayoutsBackToTop></LayoutsBackToTop>
  </v-app>
</template>
