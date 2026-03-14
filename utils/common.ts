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

/**
 * Drupalフィールド値を文字列として取得する。
 * 長文フィールドは {value, format, processed} オブジェクトで返されるため、
 * オブジェクトの場合は .value を返す。
 */
const fieldValue = (val: any): string | null => {
  if (val === null || val === undefined) return null;
  if (typeof val === "object" && !Array.isArray(val) && "value" in val) {
    return val.value ?? null;
  }
  return val;
};

export { isMobile, isDisplay, fieldValue };
