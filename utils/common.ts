import { useDisplay } from "vuetify";

const isMobile = () => {
  const { sm, xs } = useDisplay();

  return sm.value || xs.value;
};

const isDisplay = (value: any) => {
  if (Array.isArray(value)) {
    return value.length > 0;
  } else {
    return value !== null && value !== undefined && value !== "";
  }
};

export { isMobile, isDisplay };
