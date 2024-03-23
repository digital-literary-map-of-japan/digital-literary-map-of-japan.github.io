import type { JsonApiItems } from "~/types/jsonapi";

export const useMap = () => {
  const selectedSpotId = useState<string>("selectedSpotId", () => "");

  const results = useState<JsonApiItems | null>("results", () => null);

  return {
    selectedSpotId,
    results,
  };
};
