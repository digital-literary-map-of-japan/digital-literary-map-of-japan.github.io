export const useApiData = () => {
  const theme = useState("theme", () => "");
  const mode = useState("mode", () => "grid");

  return {
    mode,
    theme,
  };
};
