export const useSettings = () => {
  const theme = useState("theme", () => "");
  const mode = useState("mode", () => "grid");

  return {
    mode,
    theme,
  };
};
