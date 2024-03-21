import type { ResourceObject } from "~/types/jsonapi";

const getIds = async () => {
  const ids = [];

  while (true) {
    const url = `https://toyobunko-lab.jp/cbc/jsonapi/node/bib_1?page[offset]=${ids.length}`;
    const res = await fetch(url);
    const json = await res.json();
    const data = json.data as ResourceObject[];

    if (data.length === 0) {
      break;
    }

    for (const item of data) {
      // const id = item.id;
      const id = item.attributes?.field_id;
      ids.push(id);
    }
  }

  return ids;
};

export { getIds };
