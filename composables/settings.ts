export const useSettings = () => {
  const theme = useState("theme", () => "");
  const mode = useState("mode", () => "grid");

  const isAdmin = useState("isAdmin", () => false);

  const user = useState("user", () => "");

  const legends = useState<{ [key: string]: { [key2: string]: any } }>(
    "legends",
    () => ({})
  );

  return {
    mode,
    theme,
    isAdmin,
    legends,
    user,
  };
};
