export const useSettings = () => {
  const theme = useState("theme", () => "");
  const mode = useState("mode", () => "grid");

  const isAdmin = useState("isAdmin", () => false);

  return {
    mode,
    theme,
    isAdmin,
  };
};
