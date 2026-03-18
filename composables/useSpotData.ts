export const useSpotData = () => {
  const { results, documents, documentSpotMap, spotTypeCount } = useMap();
  const { fetchSpots, fetchDocuments, fetchApiData } = useLocalData();

  const getSpots = async () => {
    const data = await fetchSpots();
    results.value = data;
  };

  const getDocuments = async () => {
    const data = await fetchDocuments();
    documents.value = data;
  };

  const loadSpotData = async () => {
    getSpots();
    getDocuments();

    const types = ["poems", "sanbuns", "yokyokus"];

    const _documentSpotMap: { [key: string]: string[] } = {};
    const _spotTypeCount: { [key: string]: { [key: string]: number } } = {};

    for (const type_ of types) {
      const data = await fetchApiData(type_);

      if (!data) continue;

      for (const item of data) {
        const spot = item.spot_id;
        const document = item.document_id;
        if (!_documentSpotMap[document]) {
          _documentSpotMap[document] = [];
        }
        if (!_documentSpotMap[document].includes(spot)) {
          _documentSpotMap[document].push(spot);
        }

        if (!_spotTypeCount[spot]) {
          const spotAttributes = results.value?.data.find(
            (spot_: any) => spot_?.attributes?.field_id === spot
          )?.attributes;

          _spotTypeCount[spot] = {};
          for (const type_ of types) {
            _spotTypeCount[spot][type_] = 0;
          }

          if (spotAttributes?.field_no_examples) {
            _spotTypeCount[spot].yokyokus = -1;
          }
        }

        const spotCount = _spotTypeCount[spot];
        if (spotCount && spotCount[type_] !== undefined) {
          spotCount[type_]! += 1;
        }
      }
    }

    documentSpotMap.value = _documentSpotMap;
    spotTypeCount.value = _spotTypeCount;
  };

  return { loadSpotData };
};
