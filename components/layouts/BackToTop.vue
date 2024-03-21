<script setup lang="ts">
import { ref } from 'vue'
import { mdiChevronUp } from '@mdi/js'

const model = ref(false)

function onScroll () {
  model.value = window.scrollY > 200
}

function onClick () {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
</script>

<template>
    <v-layout-item
      v-scroll="onScroll"
      class="text-end pointer-events-none"
      model-value
      position="bottom"
      size="88"
    >
      <div class="ma-4">
        <v-fab-transition>
          <v-btn
            v-show="model"
            class="mt-auto pointer-events-initial"
            color="error"
            elevation="8"
            :icon="mdiChevronUp"
            @click="onClick"
          />
        </v-fab-transition>
      </div>
    </v-layout-item>
  </template>
  
 
  
  <style scoped>
    .pointer-events-none {
      pointer-events: none;
    }
  
    .pointer-events-initial {
      pointer-events: initial;
    }
  </style>