export const useSettings = () => {
  const theme = useState("theme", () => "");
  const mode = useState("mode", () => "grid");

  const isAdmin = useState("isAdmin", () => false);

  const legends = useState<{ [key: string]: { [key2: string]: any } }>(
    "legends",
    () => ({})
  );

  const initEditMode = () => {
    if (import.meta.client) {
      isAdmin.value = sessionStorage.getItem("editMode") === "true";
    }
  };

  const toggleEditMode = () => {
    isAdmin.value = !isAdmin.value;
    if (import.meta.client) {
      sessionStorage.setItem("editMode", String(isAdmin.value));
    }
  };

  return {
    mode,
    theme,
    isAdmin,
    legends,
    initEditMode,
    toggleEditMode,
  };
};
