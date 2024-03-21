export interface ResourceObject {
  id: string;
  type: string;
  attributes?: {
    [key: string]: any;
  };
  relationships?: {
    [key: string]: Relationship;
  };
  links?: Links;
  meta?: Meta;
}

interface Relationship {
  links?: Links;
  data: ResourceObject | ResourceObject[];
  meta?: Meta;
}

interface Link {
  href: string;
  meta?: Meta;
}

interface Links {
  [key: string]: Link;
}

interface Meta {
  [key: string]: any;
}

export interface JsonApiItem {
  data: ResourceObject;
  errors?: ErrorObject[];
  meta?: Meta;
  jsonapi?: {
    version: string;
    meta?: Meta;
  };
  links?: Links;
  included?: ResourceObject[];
}

export interface JsonApiItems {
  data: ResourceObject[];
  errors?: ErrorObject[];
  meta?: Meta;
  jsonapi?: {
    version: string;
    meta?: Meta;
  };
  links?: Links;
  included?: ResourceObject[];
}

export type JsonApiObject = JsonApiItem | JsonApiItems

interface ErrorObject {
  id?: string;
  links?: {
    about: Link;
  };
  status?: string;
  code?: string;
  title?: string;
  detail?: string;
  source?: {
    pointer?: string;
    parameter?: string;
  };
  meta?: Meta;
}

export type JSONAPIErrorResponse = {
  errors: JSONAPIErrorObject[];
};

type JSONAPIErrorObject = {
  status: string;
  source?: {
    pointer: string;
    parameter?: string;
  };
  title: string;
  detail: string;
  meta?: any;
};
