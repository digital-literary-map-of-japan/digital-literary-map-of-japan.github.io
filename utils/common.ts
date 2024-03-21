import { useDisplay } from "vuetify";

const isMobile = () => {
  const { sm, xs } = useDisplay();

  return sm.value || xs.value;
};

export { isMobile };
