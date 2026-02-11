import type { ResourceObject } from "~/types/jsonapi";

const getManifestUrlFromId = (id: string) => {
  return `https://toyobunko-lab.jp/cbc/iiif/2/${id}/manifest`;
};

const hasMedia = (item: ResourceObject) => {
  const data = item.relationships?.field_iiif_images?.data;
  if (Array.isArray(data) && data.length > 0) {
    return true;
  }
  return false;
};

export { getManifestUrlFromId, hasMedia };
