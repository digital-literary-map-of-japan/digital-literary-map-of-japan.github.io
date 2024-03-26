export const useSettings = () => {
  const theme = useState("theme", () => "");
  const mode = useState("mode", () => "grid");

  const isAdmin = useState("isAdmin", () => false);

  const legends = useState<{ [key: string]: { [key2: string]: any } }>(
    "legends",
    () => ({})
  );

  return {
    mode,
    theme,
    isAdmin,
    legends,
  };
};
