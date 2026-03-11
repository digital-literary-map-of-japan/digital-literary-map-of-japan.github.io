<script setup lang="ts">
const { t } = useI18n()
</script>
<template>
  <footer>
    <v-sheet color="#2b3e50" dark class="text-center text-white">
      <v-container>
        <!--  py-10 -->
        <small>{{ t('jsps_kakenhi') }}</small>
        <br />
        <small
          >Copyright ©2015-{{ new Date().getFullYear() }} Judit Árokay – Page by
          Satoru Nakamura</small
        >
        <br />

        <small
          >Logos and favicon made with
          <a href="https://www.designevo.com/" style="color: #90CAF9">DesignEvo</a></small
        >
      </v-container>
    </v-sheet>
  </footer>
</template>
