import UrlParamsConverter from "~/utils/filter";

const getTestItems = () => {
  const limit = 50;

  const data = [];

  for (let i = 0; i < limit; i++) {
    data.push({
      id: String(i),
      type: "test",
      attributes: {
        label: [`Title ${i}`],
      },
    });
  }

  const i = {
    data: data /*[
        {
        id: "aaa",
        attributes: {
            label: ["あああ"],
        },
        },
    ]*/,
    meta: {
      total: limit, //1,
    },
  };

  return i;
};

const getItems = async (route: any) => {
  const queryObject = UrlParamsConverter.fullPathToNestedObject(route.fullPath); // {};

  const keyword = queryObject.filter?.search || "";
  const limit = Number(queryObject.page?.limit) || 24;
  const offset = Number(queryObject.page?.offset) || 0;

  const wherePre = `?edu a <https://w3id.org/sukilam-educational-metadata/data/教育メタデータ> . 
        ?edu rdfs:label ?label .`;

  const where = keyword
    ? `${wherePre} filter contains(?label, "${keyword}")`
    : `${wherePre}`;

  const query = `PREFIX semp: <https://w3id.org/sukilam-educational-metadata/term/property#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        select distinct ?edu ?label where {
        ${where}
        } limit ${limit} offset ${offset}`;

  const queryCount = `PREFIX semp: <https://w3id.org/sukilam-educational-metadata/term/property#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        select distinct (count (distinct ?edu) as ?total) {
        ${where}
        }`;

  const url = `https://dydra.com/ut-digital-archives/oi/sparql?output=json&query=${encodeURIComponent(
    query
  )}`;

  const urlCount = `https://dydra.com/ut-digital-archives/oi/sparql?output=json&query=${encodeURIComponent(
    queryCount
  )}`;

  const result = await fetch(url);
  const json = await result.json();
  const bindings = json.results.bindings;

  const resultCount = await fetch(urlCount);
  const jsonCount = await resultCount.json();
  const bindingsCount = jsonCount.results.bindings;

  const data = {
    data: bindings.map((binding: any) => {
      return {
        id: binding.edu.value.split("/").pop(),
        type: "edu",
        attributes: {
          label: [binding.label.value],
        },
      };
    }),
    meta: {
      total: Number(bindingsCount[0].total.value),
    },
  };

  return data;
};

export { getTestItems, getItems };
