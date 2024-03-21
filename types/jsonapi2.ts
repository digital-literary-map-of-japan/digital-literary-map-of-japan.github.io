export interface Data {
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
    data: Data | Data[];
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