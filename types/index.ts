interface Value {
  type: string;
  value: string
}

interface Attributes {
  "dcterms:title": Value[];
  'o:public': Value[];
  'o:parent'?: Value[];
  'o:level': Value[];
  'o:default_close': Value[];
}

export interface TreeNode {
  id: string;
  attributes: Attributes;
  children?: TreeNode[];
}

export interface Menu {
  key: string;
  children: EachMenu[];
  to?: any;
}

interface EachMenu {
  label: string;
  href?: string;
  target?: string | null;
  to?: any;
}

export interface AggregationConfig {
  id: string;
  label: string;
  sort?: string;
  hide?: boolean;
  list?: string[];
}

export interface Bucket {
  key: string;
  doc_count: number;
}

export interface Aggregation {
  id: string;
  label: string;
  buckets: Bucket[];
}

export interface BhItem {
  title: string;
  disabled?: boolean;
  href?: string;
  to?: any
}
