import { createVuetify } from "vuetify";
import type { ThemeDefinition } from "vuetify";

import { aliases, mdi } from "vuetify/iconsets/mdi-svg";

const customLightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: "#2196F3",
    error: "#F44336",
    main: "#80CBC4",
    sub: "#EEEEEE",
  },
};

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: "light",
      variations: false,
      themes: {
        light: customLightTheme,
      },
    },
    icons: {
      defaultSet: "mdi",
      aliases,
      sets: {
        mdi,
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
