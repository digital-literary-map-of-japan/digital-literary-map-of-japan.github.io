import type { JsonApiItems } from "~/types/jsonapi";

export const useMap = () => {
  const selectedSpotId = useState<string>("selectedSpotId", () => "");

  const checkedSpotIds = useState<string[]>("checkedSpotIds", () => []);

  const results = useState<JsonApiItems | null>("results", () => null);

  const documents = useState<JsonApiItems | null>("documents", () => null);

  const mode = useState<string>("mode", () => "map");

  const selectedDocumentIds = useState<string[]>(
    "selectedDocumentIds",
    () => []
  );

  const documentSpotMap = useState<{ [key: string]: string[] }>(
    "documentSpotMap",
    () => ({})
  );

  const spotTypeCount = useState<{ [key: string]: { [key: string]: number } }>(
    "spotTypeCount",
    () => ({})
  );

  const selectedSpotsByDocumentIds = computed(() => {
    const spotIds: string[] = [];

    for (const documentId of selectedDocumentIds.value) {
      const spots = documentSpotMap.value[documentId] || [];
      for (const spotId of spots) {
        if (spotIds.includes(spotId)) {
          continue;
        }
        spotIds.push(spotId);
      }
    }

    // 重複を削除
    return spotIds;
  });

  return {
    selectedSpotId,
    checkedSpotIds,
    results,
    documents,
    selectedDocumentIds,
    documentSpotMap,
    spotTypeCount,
    selectedSpotsByDocumentIds,
    mode,
  };
};
